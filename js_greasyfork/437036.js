// ==UserScript==
// @name         IgnoreSeerTicket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Batch ignore seer ticket
// @author       LittleDuckLiu
// @match        https://seer.mws.sankuai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437036/IgnoreSeerTicket.user.js
// @updateURL https://update.greasyfork.org/scripts/437036/IgnoreSeerTicket.meta.js
// ==/UserScript==

function XhrInterceptor() {
  this.handlers = [];
  this.add = function(prefix, handler) {
    this.handlers.push({prefix, handler})
  }
  var handlers = this.handlers;

  if (!window.__xhr_interceptor__) {
    (function(send) {
      XMLHttpRequest.prototype.send = function() {
        this.addEventListener('readystatechange', function() {
          if(this.readyState !== 4) return;
          handlers.forEach(item => {
            if(this.url.startsWith(item.prefix)) item.handler(this);
          });
        }, false);
        send.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.send);
  }
}

(function() {
  var tickets = [];
  var button = document.createElement('button');
  button.style = 'height: 25px; line-height: 25px; width: 150px; color: white; background-color: #f56c6c; font-size: 14px; text-align: center; cursor: pointer; border: 1px solid #f56c6c; border-radius: 4px; margin-left: 15px;';

  var interceptor = new XhrInterceptor();
  interceptor.add('/api/ui/risk/get_pending_events', xhr => {
    tickets = xhr.response.result.data;
    button.innerText = '批量忽略' + tickets.length + '个工单';
  });

  unsafeWindow.onload = function() {
    button.innerText = '批量忽略' + tickets.length + '个工单';
    document.getElementsByTagName('h2')[0].appendChild(button);
    document.getElementsByTagName('h2')[0].append('(请在页面下方将每页的条数调到最大，无需全选，直接点击左侧红色按钮即可)');
  }

  button.onclick = function() {
    if(tickets.length === 0) return alert('无工单');

    var reason = unsafeWindow.prompt('请输入长期静默的理由：', '业务需要此部分数据');
    var shouldContinue = unsafeWindow.confirm('确认批量处理'+tickets.length+'条工单吗? (理由：'+reason+')');
    if(!shouldContinue) return;

    tickets.forEach(ticket => {
      unsafeWindow.fetch('https://seer.mws.sankuai.com/api/risk/trackers/' + ticket.id + '/comment', {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          "repair_action": "permanent_silent",
          "inaccurate_reason": "",
          "risk_reason": "",
          "assignee": ticket.tracker_owners.split(',')[0],
          "norepair_reason": reason,
          "expect_handle_done_time": null,
          "audit_expect_handle_done_time_reason": "",
          "silent_due_days": "20",
          "announcement_title": "",
          "send_tt_action": "twoDaysAgoNotify",
          "accurate": true,
          "need_audit_expect_handle_done_time": false,
          "tt_send_time": null,
          "silent_due_time": Date.now() + 1e6
        }),
        method: "PUT",
      });
    });
  };
})();