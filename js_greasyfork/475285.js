// ==UserScript==
// @name               Box Invite Collaborator
// @name:zh-CN         Box 邀请协作者
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        Remove Box's collaboration limit, send invitation to specified email via API
// @description:zh-CN  解除Box网盘的协作限制, 通过API向指定邮箱发送邀请
// @author             0xYYP
// @match              https://app.box.com/*
// @icon               data:image/jpeg;base64,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
// @grant              GM_xmlhttpRequest
// @license            GPL
// @downloadURL https://update.greasyfork.org/scripts/475285/Box%20Invite%20Collaborator.user.js
// @updateURL https://update.greasyfork.org/scripts/475285/Box%20Invite%20Collaborator.meta.js
// ==/UserScript==

let requestToken = '';
let xRequestToken = '';

// 监视特定的HTTP请求以获取令牌
function monitorRequestAndGetTokens() {
  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4 && this.responseURL.endsWith('/onboarding/tracking')) {
        requestToken = this._headers['Request-Token'] || '';
        xRequestToken = this._headers['X-Request-Token'] || '';
      }
    });
    originalOpen.apply(this, arguments);
  };

  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    this._headers = this._headers || {};
    this._headers[header] = value;
    originalSetRequestHeader.apply(this, arguments);
  };
}

// 在页面上创建UI元素
function createUI() {
  const config = { childList: true, subtree: true };
  let hasInserted = false;
  
  const observer = new MutationObserver((mutations) => {
    if (hasInserted) return;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node.getElementsByClassName('sharing-sidebar-section')[0];
            if (element) {
              const html = `
              <button id="inviteButton" class="btn-plain CollabInfo" type="submit">
                <div class="sharing-item">
                  <span class="sidebar-icon-container">
                    <svg width="16" height="16" viewBox="0 0 16 16" class="icon" focusable="false" aria-hidden="true"
                      role="presentation">
                      <path fill="#222" fill-rule="evenodd"
                        d="M8 9.5a6.497 6.497 0 015.63 3.251.5.5 0 01-.865.5A5.497 5.497 0 008 10.5a5.497 5.497 0 00-4.767 2.754.5.5 0 11-.866-.5A6.497 6.497 0 018 9.5zM8 2a3 3 0 110 6 3 3 0 010-6zm0 1a2 2 0 100 4 2 2 0 000-4z">
                      </path>
                    </svg>
                  </span>
                  <div class="description-wrapper">
                    <div class="txt-ellipsis"><span>协作者</span></div>
                    <p class="item-subtext txt-ellipsis">
                      <span id="inviteSpan">邀请人员</span>
                      <input id="inviteInput" type="text" style="
                          display: none;
                          width: 190px;
                          height: 20px;
                          border-radius: 2px;
                          text-align: center;
                          font-size: 14px;
                          line-height: 20px;
                          margin: 2px 0 0 0;
                        " placeholder="输入被邀请人邮箱, 回车发送" />
                    </p>
                  </div>
                </div>
              </button>
              `;
              element.insertAdjacentHTML('afterbegin', html);
              hasInserted = true;
              observer.disconnect();
              attachUIEvents();
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, config);
}

// 附加事件到UI元素
function attachUIEvents() {
  const inviteSpan = document.getElementById("inviteSpan");
  const inviteInput = document.getElementById("inviteInput");
  const inviteButton = document.getElementById("inviteButton");

  inviteButton.addEventListener("click", function() {
    inviteSpan.style.display = "none";
    inviteInput.style.display = "block";
    inviteInput.focus();
  });

  inviteInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const email = inviteInput.value;
      inviteSpan.style.display = "block";
      inviteInput.style.display = "none";
      const dir = window.location.pathname.split("/").pop();
      inviteUser(email, dir);
    }
  });
}

// 向指定邮箱和目录发送邀请
function inviteUser(email, dir) {
  GM_xmlhttpRequest({
    method: "POST",
    url: `https://app.box.com/app-api/enduserapp/item/d_${dir}/invite-collaborators`,
    headers: {
      "authority": "app.box.com",
      "accept": "application/json",
      "content-type": "application/json",
      "cookie": document.cookie,
      "origin": "https://app.box.com",
      "referer": `https://app.box.com/folder/${dir}`,
      "request-token": requestToken,
      "x-request-token": xRequestToken
    },
    data: JSON.stringify({
      "emails": email,
      "groupIDs": "",
      "emailMessage": "",
      "permission": "Editor",
      "numsOfInvitees": 1,
      "numOfInviteeGroups": 0
    }),
    onload: function (response) {
      alert(`向 ${email} 的协作请求已发送!`);
    }
  });
}

(function() {
  monitorRequestAndGetTokens();
  createUI();
})();
