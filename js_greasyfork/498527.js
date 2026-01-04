// ==UserScript==
// @name         show meeting emp name
// @namespace    http://tampermonkey.net/
// @version      0.0.5-beta
// @description  显示会议参与人
// @author       junliang.li
// @match        http://ssoportal.idc1.fn/mission/meeting/order*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/498527/show%20meeting%20emp%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/498527/show%20meeting%20emp%20name.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const url = "http://fnauth-portal.idc1.fn/secRoleUser/getList";
    const empTempKey = "empTemp";
    const dateTempKey = "dateTemp";
    //浏览器内存中的temp
    let empTempInRAM = {};
    //localStorage中的temp
    let empTempInLocalStorage = null;
    //localStorage中的时间 毫秒
    let dateInLocalStorage = localStorage.getItem(dateTempKey);


    expireLocalStorage();
    getEmpTemp();

    //每天刷新缓存
    function expireLocalStorage() {
        let now = new Date();
        let cacheDate = new Date(parseInt(dateInLocalStorage ?? 0));
        if (cacheDate.getDate() !== now.getDate() || cacheDate.getMonth() !== now.getMonth() || cacheDate.getFullYear() !== now.getFullYear()) {
            localStorage.removeItem(empTempKey);
            localStorage.setItem(dateTempKey, now.getTime());
        }
    }

    function setCache() {
        if (empTempInRAM) {
            localStorage.setItem(empTempKey, JSON.stringify(empTempInRAM));
            refreshData();
        }
    }

    function getEmpTemp() {
        let empTempStr = localStorage.getItem(empTempKey);
        if (empTempStr) {
            try {
                empTempInRAM = JSON.parse(empTempStr);
                empTempInLocalStorage = JSON.parse(empTempStr);
            } catch (err) {
                console.log(err);
            }
        }
    }

    function refreshData() {
        let ele = document.querySelector("body > div.main-layout > div.meeting-order > div.scheduler-wrapper > form > div > div.define-left > p");
        if (!ele) {
            return;
        }
        ele.click();
    }

    function queryEmpName(workId) {
        return new Promise((resolve, reject) => {
            if (!workId?.trim()) {
                resolve("");
            }
            let workId1 = workId.slice(2);
            workId1 = removeLeadingZeros(workId1);
            GM_xmlhttpRequest({
                method: "post", url: url, data: "workId=" + workId1 + "&page=1&limit=10&empName=&phone=&deptId=&roleId=", headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }, onload: function (res) {
                    if (res.readyState === 4 && res.status === 200 && res?.response) {
                        let obj = JSON.parse(res?.response);
                        let result = obj?.data?.[0]?.empName ?? workId;
                        empTempInRAM[workId] = result;
                        debounceAction();
                        resolve(result);
                    } else {
                        empTempInRAM[workId] = workId;
                        debounceAction();
                        resolve(workId);
                    }
                }, onerror: function (err) {
                    console.log("error");
                    resolve(workId);
                },
            });
        });
    }

    //参考https://zhuanlan.zhihu.com/p/557532887
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url === "http://ssoportal.idc1.fn/api/meeting/meet_queryall") {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const obj = JSON.parse(this.responseText);
                    // 当前 xhr 对象上定义 responseText
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    if (obj?.res_data?.data?.length) {
                        for (let item of obj.res_data.data) {
                            if (item.owner && item.owner_name) {
                                empTempInRAM[item.owner] = item.owner_name;
                            }
                            if (!item?.participant?.length) {
                                continue;
                            }
                            for (let emp of item.participant) {
                                if (emp === item.owner) {
                                    continue;
                                }
                                if (!empTempInRAM[emp]) {
                                    let empName = queryEmpName(emp);
                                } else {
                                    if (!item.owner_name.includes("与会人")) {
                                        item.owner_name = item.owner_name + " 与会人:";
                                    }
                                    item.owner_name = item.owner_name + " " + empTempInRAM[emp];
                                }
                            }
                        }
                    }
                    this.responseText = JSON.stringify(obj);
                }
            });
        }
        originOpen.apply(this, arguments);
    };

    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    }


    function removeLeadingZeros(str) {
        if (str.startsWith('0')) {
            return removeLeadingZeros(str.substring(1));
        } else {
            return str;
        }
    }

    let debounceAction = debounce(setCache, 2 * 1000);
})();
