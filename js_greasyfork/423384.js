// ==UserScript==
// @name         千牛-药师审方
// @namespace    qn-sf1
// @version      0.46
// @description  千牛审方:主页面;0.46：匹配商家编码，如果不存在返回空
// @author       fidcz
// @match        *trade.taobao.com/trade/itemlist/list_sold_items.htm*
// @match        *trade.taobao.com/trade/audit_order.htm?bizOrderId=*
// @connect      192.168.101.122
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        window.close
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/423384/%E5%8D%83%E7%89%9B-%E8%8D%AF%E5%B8%88%E5%AE%A1%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/423384/%E5%8D%83%E7%89%9B-%E8%8D%AF%E5%B8%88%E5%AE%A1%E6%96%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    var ip_port = '127.0.0.1:5005';

    var tc1 = ["零盒装", "一盒", "二盒", "三盒", "四盒", "五盒", "六盒", "七盒", "八盒", "九盒", "十盒"];
    var tc2 = ["0盒装", "1盒装", "2盒装", "3盒装", "4盒装", "5盒装", "6盒装", "7盒装", "8盒装", "9盒装", "10盒装", "11盒装", "12盒装", "13盒装", "14盒装", "15盒装", "16盒装", "17盒装", "18盒装", "19盒装", "20盒装"];
    var tc3 = ["套餐零", "套餐一", "套餐二", "套餐三", "套餐四", "套餐五", "套餐六", "套餐七", "套餐八", "套餐九", "套餐十", "套餐十一", "套餐十二", "套餐十三", "套餐十四", "套餐十五"];
    var str_ddList = []
    var temp_dd;
    var jso;

    /////////// sleep /////////////////
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function autoReload(reloadTime) {
        // 定时刷新
        console.log("开始刷新倒计时");
        await sleep(reloadTime * 60 * 1000);
        console.log("开始定时刷新");
        location.reload();
        //document.querySelector("div[data-reactid='.0.4.0.$drugPending']").click();
        autoReload(reloadTime);
    }


    /* 等待天猫加载框框 await fun(); */

    function slide() {
        var slider = document.getElementById("baxia-dialog-content").contentWindow.document.getElementById('nc_1_n1z'),
            container = slider.parentNode;

        var rect = slider.getBoundingClientRect(),
            x0 = rect.x || rect.left,
            y0 = rect.y || rect.top,
            w = container.getBoundingClientRect().width,
            x1 = x0 + w,
            y1 = y0;

        var mousedown = document.createEvent("MouseEvents");
        mousedown.initMouseEvent("mousedown", true, true, document.getElementById("baxia-dialog-content").contentWindow, 0,
            x0, y0, x0, y0, false, false, false, false, 0, null);
        slider.dispatchEvent(mousedown);

        var mousemove = document.createEvent("MouseEvents");
        mousemove.initMouseEvent("mousemove", true, true, document.getElementById("baxia-dialog-content").contentWindow, 0,
            x1, y1, x1, y1, false, false, false, false, 0, null);
        slider.dispatchEvent(mousemove);
    }

    async function waitAlert(){
        console.log('开始判断小框框');
        var yzTip = true;
        while ($("div[data-reactid='.0.9']").attr("class").indexOf("hidden") == -1 || $("iframe#baxia-dialog-content").length > 0) {
            await sleep(1000);
            if($("iframe#baxia-dialog-content").length > 0 && yzTip){
                // 改为发送消息提醒
                yzTip = false;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://" + ip_port + "/send/dx/天猫审方需要验证|||需要用你可爱的小手滑一下才能起来",
                    timeout: 2000,
                    onload: (response) => {
                        console.log(response.status)
                    }
                });
            }
            // if($("iframe#baxia-dialog-content").length > 0){
            //     try{
            //         if(document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").innerHTML.indexOf('出错了') != -1){
            //             // 刷新
            //             if(document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").children.length > 0){
            //                 document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").children[0].click();
            //             }

            //         }else{
            //             // 哎呀，出错了，点击<a href="javascript:noCaptcha.reset(1)">刷新</a>再来一次
            //             // console.log(document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").innerHTML);
            //             console.log('出现滑块，开始滑动');
            //             await sleep(5000);
            //             slide();

            //         }
            //         continue;

            //     }catch(err){
            //         console.log('自动滑块失败');
            //         console.log(err);
            //         continue;
            //     }

            // }
            if ($("div[data-reactid='.0.9']").attr("class").indexOf("hidden") != -1) {
                //console.log("小框框藏起来了")
                break;
            }
        }
        console.log('小框框通过');
    }

    async function passTip(){
        /* 通过天猫滑块验证 */
        await sleep(1500);
        console.log('开始判断滑块-')
        console.log($("div#baxia-dialog-content"))
        if($("div#baxia-dialog-content").length > 0){
            console.log('出现滑块，开始滑动');
            var event = document.createEvent('MouseEvents');
            event.initEvent('mousedown', true, false);
            var obj=document.getElementById("baxia-dialog-content").contentWindow;
            obj.document.getElementById("nc_1_n1z").dispatchEvent(event);
            event = document.createEvent('MouseEvents');
            event.initEvent('mousemove', true, false);
            Object.defineProperty(event,'clientX',{get(){return 260;}})
            obj.document.getElementById("nc_1_n1z").dispatchEvent(event);
        }

    }

    ////////////// 根据套餐类型获取数字/////////////////
    var getTc = function (tc) {
        //根据传入的套餐文本 返回套餐数量
        if (tc == "标准装" || tc == "一盒装" || tc == "1盒装") {
            return "1";
        } else if (/\d{1,3}盒/.exec(tc) != null) {
            return /\d{1,3}/.exec(/\d{1,3}盒/.exec(tc)[0])[0];
        } else if (tc2.indexOf(tc) != -1) {
            return String(tc2.indexOf(tc));
        } else if (tc1.indexOf(tc) != -1) {
            return String(tc1.indexOf(tc));
        } else if (tc3.indexOf(tc) != -1) {
            return String(tc1.indexOf(tc));
        } else {
            return "0";
        }
    }
    //////////////////////////////////

    //////////// 根据编码获取编码和数量 ////////////////////
    var getBm = function (bm) {
        //处理编码返回数量和编码
        var bmList = bm.split("*");
        if (bmList.length == 1) {
            // 如果为1
            return [bmList[0], "1"];
        } else {
            return [bmList[0], bmList[1]];
        }
    }
    ///////////////////////////////////////////////


    async function main_sf() {
        // 主运行

        // 判断是否点击待处理处方药
        if($("div[data-reactid='.0.6.0.$drugPending']").attr('class').indexOf('selected') == -1){
            // 没有选中
            $("div[data-reactid='.0.6.0.$drugPending']").click();
        }

        // 点击 下拉框
        $("span[data-reactid='.0.8.0.1.0.6.0.$selection']").click();
        // 点击 已有处方待审核
        $("li[data-reactid='.1.1.0.1.$10/=1$10']").click();


        // 可能会出现滑块验证
        await passTip();
        //console.log(document.querySelector("div[data-reactid='.0.7']").getAttribute("class"));

        await waitAlert();
                //console.log(document.querySelector("div[data-reactid='.0.7']").getAttribute("class"));
        console.log("小框框藏起来了");


        // 第二次滑块验证
        await passTip();

        // 如果提示订单多 刷新
        if ($("span[data-reactid='.0.7.0.2']").length > 0) {
            // 存在
            if ($("span[data-reactid='.0.7.0.2']").text().indexOf('由于订单量太大, 导致查询订单超时, 无法返回结果') != -1) {
                // 内容 刷新
                location.reload();
            }
        }

        // 订单加载完毕 开始获取订单号列表
        //div .0.6
        var ddList = document.querySelector("div[data-reactid='.0.8']");
        // trade-order-main
        var allList = ddList.querySelectorAll(".trade-order-main");
        //alert(allList.length);
        //console.log("获取订单DIV")
        /*try{*/
        if (allList.length <= 0) {
            if(document.querySelector("button[data-reactid='.0.8.0.2.0.1']").disabled && document.querySelector("button[data-reactid='.0.8.0.2.0.0']").disabled){
                // 如果上下页都是不可点击(全部为空)
                console.log("没有订单了！！！准备发送空列表");
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + ip_port + "/id3",
                    data: JSON.stringify({}),
                    timeout: 30000,
                    onload: (response) => {
                        console.log(response.status)
                        //console.log(response.responseText)
                        jso = eval('(' + response.responseText + ')');
                        console.log("处理完的内容: ");
                        console.log(jso);
                    },
                    ontimeout: () =>{
                        console.log('获取处理结果超时');
                        jso = {'1': []};
                    },
                    onerror: () =>{
                        console.log('获取处理结果出错了');
                        jso = {'1': []};
                    }
                });
                return;
            }else{
                // 可以点击
            // 刷新
            location.reload();
            }

        }
        for (var i = 0; i < allList.length; i++) {
            //console.log(allList[i].getAttribute("data-reactid"));
            var temp = allList[i].getAttribute("data-reactid").split("$")[1];
            str_ddList.push(temp)
        }

        console.log(str_ddList)

        // 开始获取订单

        var ddDict = {}

        //console.log("获取每个订单")

        for (var id = 0; id < str_ddList.length; id++) {
            // 开始遍历每个订单
            // 判断订单是否标记
            temp_dd = str_ddList[id]


            // 获取该笔订单物品数量
            var ypList = document.querySelector("tbody[data-reactid='.0.8.3:$" + str_ddList[id] + ".1.1']").querySelectorAll("tr");
            for (var yp = 0; yp < ypList.length; yp++) {
                // console.log("YP"+ String(yp))
                // 遍历药品列表
                // 获取列表当前的id
                //console.log("药品ID")
                var ypId = ypList[yp].getAttribute("data-reactid");
                // 获取数量
                var num = document.querySelector("p[data-reactid='" + ypId + ".$2.0.0']").innerText;

                try{
                    // 获取套餐类型
                    var tcl = document.querySelector("span[data-reactid='" + ypId + ".$0.0.1.1.$0.2']").innerText;
                }catch{
                    console.log('获取套餐类型出错');
                    var tcl = '';
                }

                try{
                    // 获取编码
                    if (document.querySelector("span[data-reactid='" + ypId + ".$0.0.1.3:$0.0']").innerText.match(/商家编码/)){
                        var bm = document.querySelector("span[data-reactid='" + ypId + ".$0.0.1.3:$0.1']").innerText;
                    }else{
                        var bm = '';
                    }
                }catch{
                    console.log('获取编码出错');
                    var bm = '';
                }

                try{
                    // 旺旺id
                    var userid = document.querySelector("a[data-reactid='.0.8.3:$" + temp_dd + ".1.1.$0.$4.0.0.0']").innerText;
                }catch{
                    console.log('获取旺旺id出错');
                    var userid = '';
                }


                if (temp_dd in ddDict) {
                    // 如果已经存在里面
                    var temp_array = ddDict[temp_dd]
                    var temp_array2 = [bm, tcl, num]
                    temp_array.push(temp_array2)
                    ddDict[temp_dd] = temp_array
                } else {
                    // 还没有存在里面
                    var temp_array3 = [bm, tcl, num]
                    ddDict[temp_dd] = [userid, temp_array3]
                }

            }


        }
        console.log("发送的内容: ")
        console.log(ddDict)

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://" + ip_port + "/id3",
            data: JSON.stringify(ddDict),
            timeout: 30000,
            onload: (response) => {
                console.log(response.status)
                //console.log(response.responseText)
                jso = eval('(' + response.responseText + ')');
                console.log("处理完的内容: ");
                console.log(jso);
            },
            ontimeout: () =>{
                console.log('获取处理结果超时');
                jso = {'1': []};
            },
            onerror: () =>{
                console.log('获取处理结果出错了');
                jso = {'1': []};
            }
        });

        // 开始检测结果
        console.log("开始检测结果");
        while (jso == undefined) {
            await sleep(1000);
            if (jso != undefined) {
                //console.log("小框框藏起来了")
                break;
            }
        }
        console.log("有结果辣:");
        console.log(jso);

        // 开始删除多余的
        /*for (var key in jso) {
            // 循环处理
            //console.log()
            if (jso[key] != "1") {
                delete jso[key];
                continue;
            }
        }*/
        //console.log("删除完的内容:")
        //console.log(jso)
        var jsoA = jso['1']
        console.log(jsoA)

        for (var ii=0; ii<jsoA.length; ii++) {
            // 开始点击
            var url = "https://trade.taobao.com/trade/audit_order.htm?bizOrderId=" + jsoA[ii] + "&bizType=200&rx2=true&operateType=30&from=listSoldItems";
            GM_openInTab(url);
            await sleep(2000);

        }

        await sleep(5000);
        if ($("button[data-reactid='.0.8.0.2.0.1']").length > 0) {
            // 如果存在 下一页按钮
            if (!document.querySelector("button[data-reactid='.0.8.0.2.0.1']").disabled) {
                // 如果
                $("button[data-reactid='.0.8.0.2.0.1']").click();
                await sleep(1000);
                str_ddList = [];
                jso = undefined;
                temp_dd = undefined;

                main_sf();
            }
        }

        // 主运行}
    }

    async function main_sf_tg(){
        console.log("开始判断");

        await sleep(3000);
        //J_cancelOrder_error
        console.log($("#cancelOrder-msg"));
        if($("#cancelOrder-msg").length <= 0){
            window.close();
        }

        if($("#J_cancelOrder_error").children("p").text().indexOf('该处方状态已变更，请刷新页面') != -1){
            // 刷新
            window.close();
        }
//cancelOrder-msg   确定审核通过本处方药需求单？
        console.log($("#cancelOrder-msg").children("p").text());
        if($("#cancelOrder-msg").children("p").text().indexOf('确定审核通过本处方药需求单') == -1){
            // 没有
            window.close();

        }else{
            $(".cancelOrder-actions").children("button").eq(0).click();
            console.log("点击了")
        }
        //console.log(document.querySelector(".cancelOrder-actions"));

        await sleep(1000);
        location.reload();
    }

    // 等待网页加载完毕 //
    window.onload = function () {
        // 当网页加载完毕

        var d = new Date();
        console.log(d);

        if(/trade\.taobao\.com\/trade\/itemlist\/list_sold_items\.htm/.test(window.location.href)){
            // 如果是处方列表页
            console.log('当前是处方列表页');
            main_sf();
            autoReload(5);
        }else if(/trade\.taobao\.com\/trade\/audit_order\.htm\?bizOrderId/.test(window.location.href)){
            // 如果是处方通过页
            console.log('当前是处方通过页');
            main_sf_tg();
        }

        // 网页加载完毕}
    }


})();