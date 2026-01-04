// ==UserScript==
// @name         拼多多审方
// @namespace    pdd-sf
// @version      1.93
// @description  审方、通过、掉线提醒全部合并，1.93:适配拼多多审方通过页面更新,添加审方页超时自动关闭
// @author       fidcz
// @match        *mms.pinduoduo.com/orders/medicine
// @match        *mms.pinduoduo.com/orders/medicine/detail?orderSn*
// @match        https://mms.pinduoduo.com/login*
// @grant        GM_openInTab
// @grant        window.focus
// @grant        GM_xmlhttpRequest
// @connect      192.168.101.122
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/423387/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AE%A1%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/423387/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AE%A1%E6%96%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var dp = '拼多多菠萝'; // 店铺全名: 拼多多菠萝
    var ip_port = '192.168.101.122:5005';
    //var reloadTime = 2; // 自动刷新时间(分钟)

    // 延迟
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    // 定时刷新
    async function autoReload(reloadTime) {
        // 定时刷新
        console.log("开始刷新倒计时");
        await sleep(reloadTime * 60 * 1000);
        console.log("开始定时刷新");
        location.reload();

        autoReload(reloadTime);
    }

    // 拼多多处方列表页
    async function main_sf() {
        window.focus();
        //等待页面加载完毕
        while ($("input[data-testid='beast-core-select-htmlInput']").length <= 0) {
            await sleep(1000);
            if ($("input[data-testid='beast-core-select-htmlInput']").length > 0) {
                break;
            }
        }

        // 点击待审核并点击搜索
        $("input[data-testid='beast-core-select-htmlInput']").eq(1).click();
        await sleep(500);
        $("ul[class^='ST_dropdownPanel']").children("li").eq(1).click();
        await sleep(200);
        var selectButton = $("button[class^='BTN_outerWrapper']");
        for (let buttonIndex = 0; buttonIndex < selectButton.length; buttonIndex++) {
            if (selectButton.eq(buttonIndex).find('span').eq(0).text().indexOf('查询') != -1) {
                // 通过
                selectButton.eq(buttonIndex).click();
            }
        }

        // 等待加载中消失
        while ($("div[class^='TB_loadingInner']").length > 0) {
            await sleep(1000);
            if ($("div[class^='TB_loadingInner']").length <= 0) {
                //console.log("小框框藏起来了")
                break;
            }
        }

        var list = $("tbody[data-testid='beast-core-table-middle-tbody']").children("tr");
        console.log('共有' + list.length + '个待审核订单');
        await sleep(1500);
        for (var i = 0; i < list.length; i++) {
            // 遍历打开
            console.log(list.eq(i).find("a[data-testid='beast-core-button-link']"));
            list.eq(i).find("a[data-testid='beast-core-button-link']").eq(0).children("span").click();
            console.log(list.eq(i).find("a[data-testid='beast-core-button-link']").eq(0).children("span"));

            await sleep(500);
        }

        // 等待刷新
        if (list.length > 0) {
            autoReload(1);
        } else {
            autoReload(2);
        }


    }

    // 审方处方详细页
    async function main_sf_tg() {
        //window.focus();
        // 等待网页加载完毕
        try{
            let waitLimit = 0;
            while ($("svg[data-testid='beast-core-icon-time-circle_filled']").length <= 0) {
                await sleep(1000);
                if ($("svg[data-testid='beast-core-icon-time-circle_filled']").length > 0) {
                    console.log("小框框藏起来了")
                    break;
                }
                if(++waitLimit > 15){
                    // 超过等待时限,直接关闭网页
                    window.close();
                }
            }

            console.log('开始寻找待审核');
    
            if ($("div#mf-mms-orders-container").find("svg[class^='ICN_outerWrapper']").siblings("span").text() == "待审核") {
                // 待审核
                console.log("已找到待审核");
                while ($("button[class^='BTN_outerWrapper']").length <= 0) {
                    await sleep(1000);
                    if ($("button[class^='BTN_outerWrapper']").length > 0) {
                        //console.log("小框框藏起来了")
                        break;
                    }
                }
                var passButton = $("button[class^='BTN_outerWrapper']");
                for (let buttonIndex = 0; buttonIndex < passButton.length; buttonIndex++) {
                    if (passButton.eq(buttonIndex).find('span').eq(0).text().indexOf('通过') != -1) {
                        // 通过
                        passButton.eq(buttonIndex).click();
                    }
                }
    
                await sleep(800);
    
    
            }
        }catch(error){
            console.log(error.message);
        }

        await sleep(500);
        window.close();
    }

    function sendMessage(title, content) {

        GM_xmlhttpRequest({
            method: "GET",
            url: "http://" + ip_port + "/send?title=" + dp + title + "&content=" + content + "&wxchannel=dx&wxmsgtype=textcard&sendtosocket=0",
            timeout: 3000,
            onload: (response) => {
                console.log(response.status)
            },
            onerror: () => {
                console.log("发送消息失败");
            },
            ontimeout: () => {
                console.log("发送消息超时");
            }
        });

    }

    // 登录页面掉线提醒
    async function main_dxTip() {
        window.focus();

        // 循环判断账户登录按钮是否可点击
        for (let i = 0; i <= 10; i++) {

            try {
                if ($("div.last-item")[0] == undefined) {
                    // console.log("第" + i + "次查找失败");
                    await sleep(1000);
                    continue;
                } else {
                    //  console.log("已找到元素");
                    break;
                }
            } catch {
                // console.log("第" + i + "次查找失败");
                await sleep(1000);
                continue;
            }

        }
        if ($("div.last-item")[0] == undefined) {
            console.log("查找元素失败，发送提醒");
            sendMessage("审方掉线了,需要手动登录", "自动登录失败了,can't find Last-item");

        } else {
            console.log("开始自动登录");
            $("div.last-item")[0].focus();
            $("div.last-item")[0].click();
            await sleep(8000);
            $(".info-content").children("button").focus();
            $(".info-content").children("button").click();

            await sleep(1000);
            console.log("开始判断是否登录失败");

            if ($("span.info-error-text") != undefined || $("span.info-error-text").length > 0) {
                console.log("登录出错,提醒内容为:" + $("span.info-error-text").text());
                sendMessage("审方掉线了,需要手动登录", "自动登录失败了," + $("span.info-error-text").text());
            }else{
                sendMessage("审方已经自动重新登录", "提醒一下而已");
            }
        }
    }

    autoReload(5);
    !async function documentStart(){
        await sleep(100);
        console.log('脚本开始运行');
        var d = new Date();
        console.log(d);
        //window.focus();



        if (/mms.pinduoduo.com\/orders\/medicine$/.test(window.location.href)) {
            // 如果是处方列表页
            console.log('当前是处方列表页');
            await sleep(1000);
            main_sf();
        } else if (/mms.pinduoduo.com\/orders\/medicine\/detail\?orderSn/.test(window.location.href)) {
            // 如果是处方详细页
            console.log('当前是处方详情页');
            await sleep(500);
            main_sf_tg();
        } else if (/mms\.pinduoduo\.com\/login/.test(window.location.href)) {
            // 如果是登录页
            console.log('拼多多登录页');
            main_dxTip();
        }
    }();

    // Your code here...
    //run();

})();