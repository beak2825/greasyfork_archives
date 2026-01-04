// ==UserScript==
// @name        云创任务时间显示
// @namespace   Violentmonkey Scripts
// @match       https://yk.myunedu.com/#/task
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @require      https://cdn.staticfile.org/dayjs/1.11.7/dayjs.min.js
// @grant       none
// @version     1.0
// @license     MIT
// @author      young
// @grant        GM_xmlhttpRequest
// @description  2023/5/15
// @downloadURL https://update.greasyfork.org/scripts/466356/%E4%BA%91%E5%88%9B%E4%BB%BB%E5%8A%A1%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466356/%E4%BA%91%E5%88%9B%E4%BB%BB%E5%8A%A1%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


// 浏览器ajax请求拦截
function addXMLRequestCallback(callback) {
    let oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            try {
                oldSend.apply(this, arguments);
            } catch (e) {
                console.log(e);
            }
        }
    }
}
const $x = (xpath, context) => {
    const nodes = [];
    try {
        const doc = (context && context.ownerDocument) || window.document;
        const results = doc.evaluate(xpath, context || doc, null, XPathResult.ANY_TYPE, null);
        let node;
        while (node = results.iterateNext()) {
            nodes.push(node);
        }
    } catch (e) {
        throw e;
    }
    return nodes;
};

let url = (xhr, url) => {
    return xhr.readyState === 4
        && xhr.status === 200
        && xhr.responseURL === url
}

(function () {
    // 'use strict';
    addXMLRequestCallback(xhr => {
        xhr.addEventListener("load", () => {
            // 任务列表
            if (url(xhr, 'https://yk.myunedu.com/yunkai/web/student/task/incomplete/count')) {
                setTimeout(()=>{
                  let parse = JSON.parse(xhr.responseText);
                  let works = parse.data.studentTaskList
                  // 标题
                  let workTitleList = document.querySelectorAll("div.item-desc-title")

                  let btnList = document.querySelectorAll("div.btn-detail-unfinish.base-btn1")
                  works.forEach((work, idx) => {
                    // debugger
                      // 完善文本信息
                      let eTime = dayjs(work.endTime, "YYYY-MM-DD HH:mm:ss");
                      if (eTime.isBefore(new Date())) {
                          workTitleList[idx].innerText = work.taskName + " - " + work.endTime + " 已过期"
                          workTitleList[idx].style.background = '#908d90'
                          btnList[idx].innerText = "已过期"
                          btnList[idx].style.background = '#908d90'
                      } else {
                          workTitleList[idx].innerText = work.taskName + " - " + work.endTime
                      }
                  })
                },500)
            }
        });
    });
})();