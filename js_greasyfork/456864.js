// ==UserScript==
// @name         CityU Course Adder and Droper
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Course Registration Helper
// @author       You
// @match        http://localhost/cityuReg/Add%20or%20Drop%20Classes.html
// @match        http://localhost/cityuReg/WaitList%20Page/Add%20or%20Drop%20Classes.html
// @match        https://banweb.cityu.edu.hk/pls/PROD/bwskfreg.P_AltPin
// @match        https://banweb.cityu.edu.hk/pls/PROD/bwckcoms.P_Regs
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/456864/CityU%20Course%20Adder%20and%20Droper.user.js
// @updateURL https://update.greasyfork.org/scripts/456864/CityU%20Course%20Adder%20and%20Droper.meta.js
// ==/UserScript==

(function() {

    const extraSettings = {
        autoAddWaitlist: true
    }


    const refreshTime = {
        // 設置成undefined表示現在，如year: undefined代表今年。
        // year, month, day 爲可選項， hour, minute 爲必填項
        autoRefresh: true,
        year: undefined,
        month: 12,
        day: 31,
        hour: 8,
        minute: 45
    }

    const modifications = {
        add: [15550],
        drop: []
    }
































    // 成功添加時，返回true。無需或無法添加時返回false
    function addToWaitListAndSubmitSuccess() {
        function getWaitObjById(waitId) {
            return document.getElementById(`waitaction_id${waitId}`);
        }
        if (extraSettings.autoAddWaitlist == false) return false;
        if (getWaitObjById(1) == void 0) {
            console.log("No Waitlist Object!");
            return false;
        }
        var iter=1;
        while (getWaitObjById(iter) != void 0) {
            getWaitObjById(iter++).value = "WL"
        }
        submitChanges();
        return true;
    }

    function inputCRNs(mods) {
        const allCrnInputs = document.querySelectorAll("input[name='CRN_IN'][type='text'][id*='crn_id']");
        for (var i=0; i<mods.add.length; i++) {
            allCrnInputs[i].value = mods.add[i];
        }
    }

    function delByCRNs(mods) {
        function dropByCRN(val) {
            try {
                const ele = document.querySelector(`input[type='hidden'][name='CRN_IN'][value='${val}']`);
                ele.parentNode.parentNode.childNodes[3].childNodes[3].value = "DW";
            } catch (error) {
                console.log(`Can't drop ${val}!`);
            }
        }

        for (var CRN of mods.drop) {
            dropByCRN(CRN);
        }
    }

    function submitChanges() {
        document.querySelector("input[type='submit'][name='REG_BTN'][value='Submit Changes']").click();
    }

    function isExecutable() {
        const flag = sessionStorage.getItem("scriptExecuted");
        if (flag == void 0) return false;
        if (flag == "false") return true;
        console.log("Execution Blocked!");
        return false;
    }

    function blockExecution() {
        sessionStorage.setItem("scriptExecuted", "true");
    }

    function allowExecution() {
        sessionStorage.setItem("scriptExecuted", "false");
    }

    function initBtns() {
        function showStart() {
            let startMenu = GM_registerMenuCommand("Start the Script", function() {
                GM_unregisterMenuCommand(startMenu);
                allowExecution();
                showEnd();
                location.reload()
            })
        }

        function showEnd() {
            let stopMenu = GM_registerMenuCommand("End the Script", function() {
                GM_unregisterMenuCommand(stopMenu);
                blockExecution();
                showStart();
            })
        }

        if (isExecutable()) {
            showEnd();
        } else {
            showStart();
        }

    }

    function autoReg() {
        setTimeout(function() {
            inputCRNs(modifications);
            delByCRNs(modifications);
            submitChanges();
            console.log("Emulated Submission");
            blockExecution();
        }, 500)
    }

    function keepLogin() {
        setTimeout(() => {
            location.reload();
        }, 1000*60*5 ); // 5分鐘
    }

    class refreshTimeObj {
        constructor(hour, minute, month=void 0, day=void 0, year=void 0) {
            let now = new Date();
            if (month == void 0) month = now.getMonth();
            else month = month - 1;
            if (day == void 0) day = now.getDate();
            if (year == void 0) year = now.getFullYear();
            this.writtenTimeObj = new Date(year, month, day, hour, minute);
        }

        get timeDiff() {
            return Date.now() - this.writtenTimeObj;
        }
    }

    function refreshTimeReachedAndIsRegable() {
        function refreshPage() {
            location.reload();
        }
        function isAutoRefreshOn() {
            return refreshTime.autoRefresh;
        }
        function autoRefreshTimePassed(timeObj) {
            if (timeObj.timeDiff >= 0) return true;
            return false;
        }

        return new Promise(resolve => {
            // 如果autorefresh是false的話，就馬上放行
            if (!isAutoRefreshOn()){
                resolve(true);
                return;
            }

            const autoRefreshTime = new refreshTimeObj(refreshTime.hour, refreshTime.minute, refreshTime.month, refreshTime.day, refreshTime.year);

            // 如果刷新完發現是過了autorefreshtime, 就放行
            if (autoRefreshTimePassed(autoRefreshTime)) {
                resolve(true);
                return;
            }

            // 在autorefreshtime之前進入網頁就執行下面
            keepLogin();
            var checkIntv = setInterval(() => {
                console.log(`${parseInt(-autoRefreshTime.timeDiff/1000/60)} Minutes ${parseInt(-autoRefreshTime.timeDiff/1000)%60} Seconds left to refresh`);
                if (autoRefreshTimePassed(autoRefreshTime)) {
                    clearInterval(checkIntv);
                    refreshPage();
                    resolve(false);
                }
            }, 250);
        });
    }

    window.onload = async function() {
        initBtns();
        if (addToWaitListAndSubmitSuccess()) return;
        if (!isExecutable()) return;
        if (await refreshTimeReachedAndIsRegable()) autoReg();
    }
})();