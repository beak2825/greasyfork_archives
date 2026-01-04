// ==UserScript==
// @name         黑猫云按键统计当月网络用量
// @namespace    http://shenhaisu.cc/
// @version      1.1
// @description  增加一个按键统计当月流量使用量
// @author       ShenHaiSu_Kim
// @match        https://yun.hmvps.cn/servicedetail?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hmvps.cn
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473750/%E9%BB%91%E7%8C%AB%E4%BA%91%E6%8C%89%E9%94%AE%E7%BB%9F%E8%AE%A1%E5%BD%93%E6%9C%88%E7%BD%91%E7%BB%9C%E7%94%A8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473750/%E9%BB%91%E7%8C%AB%E4%BA%91%E6%8C%89%E9%94%AE%E7%BB%9F%E8%AE%A1%E5%BD%93%E6%9C%88%E7%BD%91%E7%BB%9C%E7%94%A8%E9%87%8F.meta.js
// ==/UserScript==

(function () {
    let getStartTime = () => document.querySelectorAll("#startingTime")[0].value.substring(0, 8) + "01";
    let getEndTime = () => document.querySelector("input#endTime").value;
    let machineID = location.href.match(/id=(\d+)/)[1];
    let baseURL = "https://yun.hmvps.cn/host/trafficusage?id="

    let targetParentNode = document.querySelector("#dosage > .row.d-flex.align-items-center");
    let buttonNode = Object.assign(document.createElement("button"), {
        innerText: "查询当月流量",
        type: "button",
        className: "btn btn-success btn-sm col-md-2",
        style: "font-size: 14px;"
    });
    let infoSpan = Object.assign(document.createElement("span"), {
        innerText: "等待查询...",
        className: "col-md-2",
        style: "font-size: 14px;line-height: 29.7px;"
    });


    buttonNode.addEventListener("click", function (event) {
        infoSpan.innerText = "请求已发送...";
        fetch(baseURL + machineID + "&start=" + getStartTime() + "&end=" + getEndTime())
            .then(res => res.json())
            .then(data => {
                let totalCount = 0;
                data.data.forEach(item => { totalCount += item.in + item.out });
                infoSpan.innerText = totalCount.toFixed(2).toString() + "GB";
            })
    })
    document.querySelector("#usedLi").addEventListener("click", function (event) {
        if (targetParentNode.querySelectorAll("button").length == 1) return;
        targetParentNode.appendChild(buttonNode);
        targetParentNode.appendChild(infoSpan);
    })
})();