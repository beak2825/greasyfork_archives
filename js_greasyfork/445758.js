// ==UserScript==
// @name         百度指数
// @version      1.1
// @description  百度指数一键导出
// @match        https://index.baidu.com/v2/main/index.html
// @grant        none
// @namespace https://greasyfork.org/users/752648
// @downloadURL https://update.greasyfork.org/scripts/445758/%E7%99%BE%E5%BA%A6%E6%8C%87%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/445758/%E7%99%BE%E5%BA%A6%E6%8C%87%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    const dataList = [];
    let dateGlobal = [];
    let key = "";
    const fatherNode = document.getElementsByClassName("keyword-group")[0];
    if (!fatherNode) {
        return;
    }

    const childNode = document.getElementsByClassName("keyword-group__ok")[0];
    const addNode = childNode.cloneNode(true);
    addNode.innerText = "导出每月和";
    addNode.style = "margin-left:10px";
    fatherNode.appendChild(addNode);
    addNode.addEventListener("click", () => decryptData(), false);
    (function (open, send) {
        XMLHttpRequest.prototype.open = function () {
            open.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function () {
            this.addEventListener(
                "readystatechange",
                function (data) {
                    if (this.readyState === 4) {
                        if (
                            this.responseURL.indexOf("/api/SearchApi/index") !==
                            -1
                        ) {
                            handleData(
                                JSON.parse(this.responseText).data.userIndexes
                            );
                        } else if (
                            this.responseURL.indexOf("/Interface/ptbk") !== -1
                        ) {
                            key = JSON.parse(this.responseText).data;
                        }
                    }
                },
                false
            );

            send.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

    function decrypt(t, e) {
        for (
            var a = t.split(""), i = e.split(""), n = {}, s = [], o = 0;
            o < a.length / 2;
            o++
        )
            n[a[o]] = a[a.length / 2 + o];
        for (var r = 0; r < e.length; r++) s.push(n[i[r]]);
        return s
            .join("")
            .split(",")
            .map((res) => +res);
    }
    function handleData(list) {
        dataList.length = 0;
        for (const l of list) {
            dataList.push({
                startDate: l.all.startDate,
                endDate: l.all.endDate,
                data: l.all.data,
                name: l.word[0].name,
            });
        }
    }
    function getDate(start, end) {
        const date = [];
        const startTime = new Date(start);
        const endTime = new Date(end);
        let count = 1;
        for (
            let time = startTime.getTime();
            time <= endTime.getTime();
            time = time + 24 * 3600 * 1000
        ) {
            const todayMonth = new Date(time).getMonth();
            const tomorrowMonth = new Date(
                new Date(time).getTime() + 24 * 3600 * 1000
            ).getMonth();
            if (todayMonth === tomorrowMonth) {
                if (time === endTime.getTime()) {
                    date.push(count);
                }
                count++;
            } else {
                date.push(count);
                count = 1;
            }
        }
        return date;
    }
    function getMonthData(list, startDate, endDate) {
        const date = (dateGlobal = getDate(startDate, endDate));
        console.log("ylog:107-68eef1-date", date);
        let start = 0;
        let end = 0;
        const res = [];
        for (let i = 0; i < date.length; i++) {
            end = start + date[i];
            res.push(list.slice(start, end).reduce((p, c) => p + c, 0));
            start = end;
        }
        return res;
    }
    function decryptData() {
        if (!key) {
            alert("未获得解密的key");
            return;
        }
        for (let item of dataList) {
            item.data = decrypt(key, item.data);
            item.monthData = getMonthData(
                item.data,
                item.startDate,
                item.endDate
            );
        }
        const fatherNode = document.getElementsByClassName(
            "index-trend-content"
        )[0];
        if (!fatherNode) {
            return;
        }
        if (fatherNode.children[1]) {
            fatherNode.removeChild(fatherNode.children[1]);
          }
        const divDom = document.createElement("div");
        let innerHTML = `<div style="margin-bottom:10px">月数组：${dateGlobal.join(",")}</div>`;
        for (let i = 0; i < dataList.length; i++) {
            innerHTML += `<div style="margin-bottom:10px">${
                dataList[i].name
            }:</div><div style="margin-bottom:10px">每天数据：${dataList[i].data.join(
                ","
            )}</div><div style="margin-bottom:10px">每月累计和：${dataList[i].monthData.join(",")}</div>`;
        }
        divDom.innerHTML = innerHTML;

        fatherNode.appendChild(divDom);
        console.log(dataList);
    }
})();
