// ==UserScript==
// @name        长毛象实例测速
// @namespace   https://blog.bgme.me
// @match       https://instances.social/list/old
// @grant       GM.xmlHttpRequest
// @connect     *
// @run-at      document-end
// @version     1.0.3
// @author      bgme
// @description 打开 instances.social Legacy列表后，点击右上角图标开始测试。为了结果的准确性，请至少进行三轮测试。
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @icon        https://raw.githubusercontent.com/tootsuite/mastodon/master/public/favicon.ico
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/400528/%E9%95%BF%E6%AF%9B%E8%B1%A1%E5%AE%9E%E4%BE%8B%E6%B5%8B%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/400528/%E9%95%BF%E6%AF%9B%E8%B1%A1%E5%AE%9E%E4%BE%8B%E6%B5%8B%E9%80%9F.meta.js
// ==/UserScript==

window.addEventListener("load", function () {
  addButton();
});

function addButton() {
  let img = document.createElement("img");
  img.src =
    "data:image/png;base64,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";
  img.style.cssText = "height: 50px;	width: 43px;";

  let button = document.createElement("button");
  button.className = "icon_pc";
  button.style.cssText = `position: fixed;
                          top: 15%;
                          right: 5%;
                          z-index: 99;
                          border-style: none;
                          text-align:center;
                          vertical-align:baseline;
                          background-color: #fafafa;
                          border-radius: 50%;`;
  button.onclick = function () {
    addTh();
    startTest();
  };
  button.appendChild(img);
  document.body.appendChild(button);
}

let fetchCount = 0;
const Maxthread = 25;
const Timeout = 10000;

function startTest() {
  let nodes = document.querySelectorAll('td[scope="row"]');

  let j = 0;
  let timerId = setInterval(function () {
    for (; j < nodes.length; j++) {
      if (fetchCount <= Maxthread) {
        domainTest(nodes[j]);
        if (j === nodes.length - 1) {
          clearInterval(timerId);
          alert("测试完成！");
        }
        fetchCount++;
      } else {
        break;
      }
    }
  }, 1000);
}

function addTh() {
  if (document.querySelector("thead > tr").childElementCount === 13) {
    return;
  }

  // 添加表头
  let th = document.createElement("th");
  th.setAttribute("class", "nosort");
  th.setAttribute("data-sortcolumn", "3");
  th.setAttribute("data-sortkey", "3-0");
  th.innerText = "Connecting Time";
  document.querySelector('th[data-sortcolumn="2"]').after(th);

  // 修改相应数值
  let next = th.nextElementSibling;
  for (let i = 4; next; i++) {
    next.setAttribute("data-sortcolumn", `${i}`);
    next.setAttribute("data-sortkey", `${i}-0`);
    next = next.nextElementSibling;
  }
}

function domainTest(node) {
  let domain = node.getAttribute("data-value");
  let url = `https://${domain}/api/v1/instance?timestamp=${Date.now()}`;

  // 初始化
  let message;
  if (node.parentElement.childElementCount !== 13) {
    message = document.createElement("td");
    message.setAttribute("data-value", "");
    node.after(message);
  } else {
    message = node.nextElementSibling;
    message.setAttribute("data-value", "");
    message.innerText = "";
  }

  // 开始测试
  let startTime;
  let endTime;
  startTime = new Date().getTime();
  GM.xmlHttpRequest({
    method: "GET",
    url: url,
    onload(response) {
      endTime = new Date().getTime();
      if (response.status === 200) {
        let duration = endTime - startTime;
        message.setAttribute("data-value", duration);
        message.innerText = `${duration}`;
      } else {
        message.setAttribute("data-value", 9999999);
        message.innerHTML = '<span title="response.status != 200">❌</span>';
      }
      fetchCount--;
    },
    onerror(response) {
      message.setAttribute("data-value", 9999999);
      message.innerHTML = '<span title="error">❌</span>';
      fetchCount--;
    },
    ontimeout(response) {
      message.setAttribute("data-value", 9999999);
      message.innerHTML = '<span title="timeout">❌</span>';
      fetchCount--;
    },
    timeout: Timeout,
    synchronous: false,
  });
}
