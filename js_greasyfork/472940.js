// ==UserScript==
// @name         北理工培养方案显示已获得学分
// @namespace    https://blog.csdn.net/c20180630
// @version      1.0.5
// @description  用户在北理工本硕博一体化系统—我的培养方案中可以查看到系统内的已获得学分，查询结果仅供参考。
// @author       XiaoZheng2003
// @match        https://jxzxehallapp.bit.edu.cn/jwapp/sys/xsfacx/*default/index.do
// @match        https://jxzxehallapp.bit.edu.cn/jwapp/sys/xsfacx/*default/index.do?*
// @match        https://webvpn.bit.edu.cn/https/77726476706e69737468656265737421faef5b842238695c720999bcd6572a216b231105adc27d/jwapp/sys/xsfacx/*default/index.do
// @match        https://webvpn.bit.edu.cn/https/77726476706e69737468656265737421faef5b842238695c720999bcd6572a216b231105adc27d/jwapp/sys/xsfacx/*default/index.do?*
// @icon         https://www.bit.edu.cn/images/gb20190805/logo_01.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472940/%E5%8C%97%E7%90%86%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%96%B9%E6%A1%88%E6%98%BE%E7%A4%BA%E5%B7%B2%E8%8E%B7%E5%BE%97%E5%AD%A6%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/472940/%E5%8C%97%E7%90%86%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%96%B9%E6%A1%88%E6%98%BE%E7%A4%BA%E5%B7%B2%E8%8E%B7%E5%BE%97%E5%AD%A6%E5%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        var web = "https://jxzxehallapp.bit.edu.cn/jwapp/sys/xsfacx/modules/pyfacxepg/grpyfacx.do";
        var webvpn = "https://webvpn.bit.edu.cn/https/77726476706e69737468656265737421faef5b842238695c720999bcd6572a216b231105adc27d/jwapp/sys/xsfacx/modules/pyfacxepg/grpyfacx.do";
        fetch(window.location.host.includes("webvpn") ? webvpn : web)
            .then((response) => response.json())
            .then((data) => {
                // 获取已获得学分的数值
                const creditSum = data.datas.grpyfacx.rows[0].YWCXF;
                console.log("已获得学分：" + creditSum);
                
                //弹窗提示
                alert("已获得学分：" + creditSum);
                
                //显示在页面上
                let retryCnt = 0, maxRetry = 20;
                var timer = setInterval(function () {
                    try {
                        document.querySelector("#mainPage > div > div > div:nth-child(2)").innerHTML += "<br>系统内查询到的已获得学分：" + creditSum;
                        clearInterval(timer);
                    }
                    catch {
                        retryCnt++;
                        console.log("当前重试次数：" + retryCnt);
                        if (retryCnt > maxRetry) {
                            clearInterval(timer);
                        }
                    }
                }, 1000);
            })
            .catch((error) => {
                //发生错误重新加载页面
                location.reload();
            });
    });
}());