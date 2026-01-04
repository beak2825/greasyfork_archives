// ==UserScript==
// @name         快麦助手Local代发版
// @namespace    lezizi
// @homepage     https://erp.superboss.cc
// @version      3.1.6
// @description  快麦助手Local代发版辅助
// @author       Via
// @match        https://*.superboss.cc/*
// @match        https://cart.1688.com/*
// @icon         https://erp.superboss.cc/favicon.ico
// @require https://greasyfork.org/scripts/463102-kmerp-details/code/KMERP_DETAILS.js?version=1268857
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/459504/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E4%BB%A3%E5%8F%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/459504/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E4%BB%A3%E5%8F%91%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // tts引擎
    function ttsplay(text) {
        // RC.util.ttsplay(name);
        var utterThis = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterThis);
    }
    /**************************************
    * 右键菜单绑定
    ***************************************/
    if (document.URL.includes("superboss.cc")) {
        GM_registerMenuCommand("代发工具", function () {
            KMerpHelper();
        });
    } else if (document.URL.includes("1688.com")) {
        GM_registerMenuCommand("商品确认", function () {
            AlibabaBatchCheck();
        });
    }

    // 页面加载完成后5秒执行，解决刷新页面未执行
    setTimeout(() => {
        if (document.URL.includes("superboss.cc")) {
            KMerpHelper();
        } else if (document.URL.includes("1688.com")) {
            AlibabaBatchCheck();
        }
    }, 6000);


    function KMerpHelper() {
        /**************************************
        * 插入代发工具，ERP端
        ***************************************/
        let missonCount = 0;
        let id = setInterval(func, 1000);
        function func() {
            missonCount++;
            if (missonCount > 10) {
                console.log("已尝试10次插入代发工具未成功，停止插入");
                clearInterval(id);
                return;
            }
            if (document.URL.includes("login")) {
                console.log("登陆界面，无需添加");
                clearInterval(id);
                return;
            }
            if (document.querySelector("#dfspanlink")) {
                console.log("代发链接已添加，停止检测任务");
                clearInterval(id);
            }
            addLink();
        }

        addTools();
        addOpenDcrypt();

        /**************************************
        * 插入代发和解密按钮
        ***************************************/
        // URL改变延迟1秒执行
        window.onhashchange = function () {
            console.log("URL改变事件");
            setTimeout(() => {
                addTools();
                addOpenDcrypt();
            }, 1000);
        }

        /**************************************
        * 插入代发链接到顶部，ERP端
        ***************************************/
        function addLink() {
            if (document.querySelector("#dfspanlink")) {
                console.log("代发链接模块已存在");
                return;
            }
            let headerInfo = document.querySelector("div.header-user-info");
            if (headerInfo === null) {
                // alert("页面框架已更新，请重新配置组件插入位置");
                console.log("无法定位：div.header-user-info");
                return;
            }
            headerInfo.prepend(function () {
                let sp = document.createElement("span");
                sp.id = "dfspanlink";
                sp.classList = "user-name";
                sp.innerHTML = `
                    <em><a href="https://www.kdocs.cn/team/1559424731/99655353897" target="_blank" style="font-size: small">代发表格</a></em>
                    <ul class="user-opr-list" style="overflow: auto;height: 400px">
                        <li> <a href="https://www.kdocs.cn/view/p/104315297561" target="_blank">代发导图</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cpvkHrVa7WZ6" target="_blank">胖虎2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cd41YGCla8ZF" target="_blank">浙宠2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cukOJrM0OYXh" target="_blank">宠聚2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/ca5HJ19S8HFv" target="_blank">喵仙2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cpZ5CC3ND8Qt" target="_blank">帐篷2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/coY3Hz5EltmS" target="_blank">宿迁仿藤窝2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/coVHFeKCPDvp" target="_blank">连云港仿藤窝2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cf6f7Z0LmpnD" target="_blank">冠悦2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cums7ZIorkBd" target="_blank">美芙2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/csOv8dG2OOWg" target="_blank">曼声2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cqMG5ITD4i4P" target="_blank">小谭猫窝2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/ckMm2yenGSPA" target="_blank">俊材猫窝2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cjpl6iPG2deP" target="_blank">小布丁2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cnFxSbvk002j" target="_blank">鑫诚抓板2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cs5STGPh3S8j" target="_blank">向宏军2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cjaxFTemwKLD" target="_blank">乐吱吱抓板2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/caPAYwYD9pae" target="_blank">摇摆乒乓球2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cnFxSbvk002j" target="_blank">宠梦胡萝卜2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cdQ4kF7nUd0s" target="_blank">欧一吸2023</a> </li>
                        <li> <a href="https://www.kdocs.cn/l/cmuXPVGTpdvM" target="_blank">双贸2023</a> </li>
                    </ul>
                `;
                return sp;
            }());
            if (document.querySelector("#dfspanlink")) {
                console.log("代发链接模块已添加");
            }
        }

        /**************************************
        * 解密展开辅助，ERP端
        ***************************************/
        async function addOpenDcrypt() {
            await open();
            await dcrypt();
            setTimeout(deleteButtomMl5, 3000);
            GM_setValue("open_dcrypt", false);
            async function dcrypt() {
                if (document.querySelector("#btdcrypttrade666")) {
                    console.log("订单解密辅助添加完成，无需重复执行");
                    return;
                }
                const area = document.querySelector("span.trade-inline-block");
                if (area === null) {
                    console.log("底栏不存在");
                    return;
                }
                area.append(" / ");
                let bt = document.createElement("button");
                bt.id = "btdcrypttrade666";
                bt.innerText = "解密已选订单";
                area.appendChild(bt);
                bt.onclick = async () => {
                    if (GM_getValue("open_dcrypt", false)) {
                        return msgBox("已有展开/解密任务");
                    }
                    const details = document.querySelectorAll("div.module-trade-list-item-selected");
                    if (details.length < 1) {
                        return msgBox("未选择订单");
                    }
                    if (!confirm("确定执行解密任务？\n将消耗解密额度")) {
                        return msgBox("取消执行解密任务");
                    }
                    GM_setValue("open_dcrypt", true);
                    msgBox("开始订单解密任务");
                    const address_list = [];
                    let dcrypt_count = 0;
                    for (let detail of details) {
                        const address = detail.querySelector("span.J_Shipping_Address");
                        const platform = detail.getAttribute("shopsource");
                        const address_dict = {};
                        address_dict.sid = detail.getAttribute("sid");
                        const result = await new Promise((resolve) => {
                            // 线下订单无需解密
                            if (["sys"].includes(platform)) {
                                resolve("线下订单无需解密，跳过...");
                                return;
                            }
                            let count = 0;
                            let eye = address.querySelector("i.watch-icon");
                            if (eye !== null) {
                                const misson_id = setInterval(openeye, 1000);
                                function openeye() {
                                    eye = address.querySelector("i.watch-icon");
                                    if (count > 3) {
                                        clearInterval(misson_id);
                                        msgBox(`${address_dict.sid}已等待解密${count}秒，超时进入下一订单`);
                                        resolve(`已等待解密${count}秒，超时进入下一订单`);
                                    }
                                    if (eye === null) {
                                        clearInterval(misson_id);
                                        dcrypt_count++;
                                        msgBox(`${address_dict.sid}解密完成`);
                                        resolve("解密完成");
                                    } else if (count < 1) {
                                        eye.click();
                                    } else if (["pdd"].includes(platform)) {
                                        eye.click();
                                    }
                                    count++;
                                }
                            } else {
                                resolve("无需解密");
                                // ttsplay("无需解密")
                            }
                        });
                        console.log(`${address_dict.sid}=>${result}`);
                        const address_show = address.querySelectorAll("span.js-dcrypt-show");
                        address_dict["name"] = address_show[0].innerText.replaceAll(" ", "_");
                        address_dict["mobile"] = address_show[1].innerText;
                        address_dict["area"] = address_show[2].innerText;
                        const ssq = address.querySelectorAll("span.value")[2].firstChild.textContent;
                        [address_dict["sheng"], address_dict["shi"], address_dict["qu"]] = ssq.split(" ");
                        // 格式化处理
                        if (address_dict.name.length < 2) {
                            address_dict.name = `${address_dict.name}_`;
                        }
                        for (let k of Object.keys(address_dict)) {
                            for (let s of [" ", "，"]) {
                                address_dict[k] = address_dict[k].replaceAll(s, "");
                            }
                        }
                        address_list.push(address_dict);
                    }
                    console.log(address_list);
                    let result = "";
                    for (let address of address_list) {
                        result += `${address.sid}\t${address.name},${address.mobile},${address.sheng} ${address.shi} ${address.qu} ${address.area}\n`
                    }
                    result += "\n";
                    result = result.replace("\n\n", "");
                    console.log(result);
                    GM_setClipboard(result);
                    GM_setValue("open_dcrypt", false);
                    if (dcrypt_count > 0) {
                        ttsplay(`已解密${dcrypt_count}个订单`)
                        return msgBox(`已解密${dcrypt_count}个订单`);
                    }
                    return msgBox("没有需要解密的订单");
                };
                return "解密按钮已添加";
            }

            async function open() {
                if (document.querySelector("#btopentrade666")) {
                    console.log("订单展开辅助添加完成，无需重复执行");
                    return;
                }
                const area = document.querySelector("span.trade-inline-block");
                if (area === null) {
                    console.log("底栏不存在");
                    return;
                }
                area.append(" / ");
                let bt = document.createElement("button");
                bt.id = "btopentrade666";
                bt.innerText = "展开已选订单";
                area.appendChild(bt);
                bt.onclick = async () => {
                    if (GM_getValue("open_dcrypt", false)) {
                        return msgBox("已有展开/解密任务");
                    }
                    const details = document.querySelectorAll("div.module-trade-list-item-selected");
                    if (details.length < 1) {
                        return msgBox("未选择订单");
                    }
                    msgBox("开始订单展开任务")
                    GM_setValue("open_dcrypt", true);
                    for (let detail of details) {
                        // 展开订单(未展开的进项展开操作)
                        if (!detail.className.includes("module-trade-list-item-open")) {
                            const rel = await new Promise((resolve) => {
                                detail.querySelector("div.J_Tbody").click();
                                let try_count = 0;
                                const misson_id = setInterval(checkOrdersList, 500);
                                function checkOrdersList() {
                                    if (detail.querySelector("table.J_Orders_List").childElementCount > 0) {
                                        clearInterval(misson_id);
                                        resolve("商品已加载");
                                    }
                                    if (try_count++ > 5) {
                                        clearInterval(misson_id);
                                        resolve(`已等待商品加载${try_count * 500 / 1000}秒，超时进入下一订单`)
                                    }
                                }
                            });
                            console.log(msgBox(`${detail.getAttribute("sid")}=>${rel}`));
                        }
                    }
                    ttsplay("所选订单展开完成")
                    GM_setValue("open_dcrypt", false);
                    return msgBox("所选订单处理完成");
                };
                return "展开按钮已添加";
            }

            async function deleteButtomMl5() {
                const buttom = document.querySelector("div.module-trade-footer-container");
                if (buttom === null) {
                    console.log("底栏不存在");
                    return;
                }
                const summary_item = buttom.querySelector("span.summary_item");
                if (summary_item !== null) { summary_item.remove(); }
                const ml5 = buttom.querySelectorAll(".ml_5");
                if (ml5.length > 0) {
                    for (let ml of ml5) {
                        ml.remove();
                    }
                }
                return "底部状态栏净化完成";
            }
        }

        /**************************************
        * 引用外部脚本，函数名包装，ERP端
        ***************************************/
        function getDetails() {
            return getKMDetails();
        }
        function msgBox(msg) {
            RC.showSuccess(msg);
            return msg;
        }

        /**************************************
        * 各代发模板具体处理，ERP端
        ***************************************/
        function addTools() {
            if (document.querySelector("#dfspantools")) {
                console.log("代发工具模块已存在");
                return;
            }
            if (!(document.URL.includes("#/trade/process") || document.URL.includes("#/trade/exception"))) {
                console.log("非 订单处理-全部订单/异常订单 界面");
                return;
            }
            // 添加代发工具
            let tradeToolbar = document.querySelector("div.trade-toolbar_list");
            if (tradeToolbar === null) {
                //alert("addTools：页面框架已更新，请重新配置组件插入位置");
                console.log("无法定位：div.trade-toolbar_list");
                return;
            }
            tradeToolbar.prepend(function () {
                let sp = document.createElement("span");
                sp.classList = "toolbar-list-item";
                sp.id = "dfspantools";
                sp.innerHTML = `
                <a class="toolbar-menu_item">
                    <em class="iconfont menu-icon"></em>
                    代发工具
                    <em class="iconfont menu-down"></em>
                </a>
                <span class="toolbar-sub_list">
                    <a class="toolbar-sub_menu_item" id="df_lezizi">乐吱吱模板</a>
                    <a class="toolbar-sub_menu_item" id="df_lezizi2">乐吱吱模板2</a>
                    <a class="toolbar-sub_menu_item" id="df_cainiao">菜鸟模板</a>
                    <a class="toolbar-sub_menu_item" id="df_chongju">宠聚模板</a>
                    <a class="toolbar-sub_menu_item" id="df_kuaidizhushou">快递助手模板</a>
                    <a class="toolbar-sub_menu_item" id="df_fenghuodi">风火递模板</a>
                    <!-- <a class="toolbar-sub_menu_item" id="df_guanyue">冠悦模板</a> -->
                    <a class="toolbar-sub_menu_item" id="df_wangdiantong">旺店通模板</a>
                    <a class="toolbar-sub_menu_item" id="df_json">json格式</a>
               </span>
            `;
                return sp;
            }());
            if (document.querySelector("#dfspantools")) {
                console.log("代发工具模块已添加");
            }
            // 事件绑定
            // 乐吱吱模板
            const df_lezizi = document.querySelector("#df_lezizi");
            if (df_lezizi !== null) {
                df_lezizi.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = `订单号\t收货信息\t商品名称\t商品数量\t备注信息\t快递单号\n`;
                    for (let d of details) {
                        for (let g of d.GoodsArray) {
                            results += `="${d.SysId}"\t${d.Name},${d.Number},${d.Sheng} ${d.Shi} ${d.Qu} ${d.Other}\t${g.Name}\t${g.Count}\t\t\n`;
                        }
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("乐吱吱模板复制成功");
                }
                console.log("乐吱吱模板事件已绑定");
            }

            // 乐吱吱模板2
            const df_lezizi2 = document.querySelector("#df_lezizi2");
            if (df_lezizi2 !== null) {
                df_lezizi2.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = `订单号\t收货信息\t商品信息\t备注信息\t快递单号\n`;
                    for (let d of details) {
                        results += `="${d.SysId}"\t${d.Name},${d.Number},${d.Sheng} ${d.Shi} ${d.Qu} ${d.Other}\t${d.GoodsString}\t\t\n`;
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("乐吱吱模板复制成功");
                }
                console.log("乐吱吱模板事件已绑定");
            }

            // 菜鸟模板
            const df_cainiao = document.querySelector("#df_cainiao");
            if (df_cainiao !== null) {
                df_cainiao.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = ``;
                    let id = 1;
                    for (let d of details) {
                        results += `${id++}\t${d.Name}\t="${d.Number}"\t${d.Sheng} ${d.Shi} ${d.Qu} ${d.Other}\t其他\t${d.GoodsString}\t="${d.SysId}"\n`;
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("菜鸟模板复制成功");
                }
                console.log("菜鸟模板事件已绑定");
            }

            // 宠聚模板
            const df_chongju = document.querySelector("#df_chongju");
            if (df_chongju !== null) {
                df_chongju.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = `线上订单号\t下单时间\t付款时间（不填写订单导入后为待支付状态）\t买家帐号（必填）\t卖家备注\t买家留言\t收货人姓名（必填）\t手机（必填）\t省份（必填）\t城市（必填）\t区县（必填）\t地址（必填）\t商品编码（必填）\t数量（必填）\t商品单价（必填）\n`;
                    const t = new Date();
                    for (let d of details) {
                        const t0 = t.toLocaleString();
                        for (let g of d.GoodsArray) {
                            results += `="${d.SysId}"\t${t0}\t${t0}\t乐吱吱\t${d.Memo}\t${d.Msg}\t${d.Name}\t="${d.Number}"\t${d.Sheng}\t${d.Shi}\t${d.Qu}\t${d.Other}\t${g.Name}\t${g.Count}\t0\n`;
                        }
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("宠聚模板复制成功");
                }
                console.log("宠聚模板事件已绑定");
            }

            // 旺店通模板
            const df_wangdiantong = document.querySelector("#df_wangdiantong");
            if (df_wangdiantong !== null) {
                df_wangdiantong.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = `店铺名称\t原始单号\t收件人\t手机\t地址\t发货条件\t应收合计\t邮费\t优惠金额\t商家编码\t货品数量\t货品总价\n`;
                    for (let d of details) {
                        for (let g of d.GoodsArray) {
                            if (g.Code.includes("LTX")) {
                                continue;
                            }
                            if (g.Code !== "LD910511") {
                                msgBox(`订单${d.SysId}商品不正确\n1.商品不是新品猫砂LD910511\n2.商品是套装，先转成单品\n\n系统订单号已复制`);
                                GM_setClipboard(d.SysId);
                                return;
                            }
                            if (Number(g.Count) > 2) {
                                msgBox(`订单${d.SysId}猫砂数量大于2\n请先拆单，每单最多2包\n\n系统订单号已复制`);
                                GM_setClipboard(d.SysId);
                                return;
                            }
                            results += `lezizi乐吱吱旗舰店\t="${d.SysId}"\t${d.Name}\t="${d.Number}"\t${d.Sheng} ${d.Shi} ${d.Qu} ${d.Other}\t款到发货\t0\t0\t0\t${g.Code}\t${g.Count}\t0\n`;
                        }
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("旺店通模板复制成功");
                }
                console.log("旺店通模板事件已绑定");
            }

            // 快递助手
            const df_kuaidizhushou = document.querySelector("#df_kuaidizhushou");
            if (df_kuaidizhushou!==null){
                df_kuaidizhushou.onclick = ()=>{
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = `订单编号\t收件人\t固话\t手机\t地址\t发货信息\t备注\t快递单号\n`;
                    for (let d of details) {
                        results += `'${d.SysId}\t${d.Name}\t\t'${d.Mobile}\t${d.Sheng} ${d.Shi} ${d.Qu} ${d.Other}\t${d.GoodsString}\t[乐吱吱]${d.Memo}\t\n`;
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("快递助手模板复制成功", 2000);
                }
                console.log("快递助手模板事件已绑定");
            }

            // 冠悦模板
            const df_guanyue = document.querySelector("#df_guanyue");
            if (df_guanyue !== null) {
                df_guanyue.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = ``;
                    for (let d of details) {
                        results += `="${d.SysId}"\t${d.Name}\t\t="${d.Number}"\t${d.Sheng} ${d.Shi} ${d.Qu} ${d.Other}\t${d.GoodsString}\n`;
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("冠悦模板复制成功", 2000);
                }
                console.log("冠悦模板事件已绑定");
            }

            // 风火递
            const df_fenghuodi = document.querySelector("#df_fenghuodi");
            if (df_fenghuodi !== null) {
                df_fenghuodi.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    let results = `姓名\t手机\t电话\t省\t市\t区\t详细地址\t订单编号\t商品信息\t买家留言\t卖家备注\n`;
                    for (let d of details) {
                        results += `${d.Name}\t="${d.Number}"\t\t${d.Sheng}\t${d.Shi}\t${d.Qu}\t${d.Other}\t="${d.SysId}"\t${d.GoodsString}\t${d.Msg}\t${d.Memo}\n`;
                    }
                    results += "\n";
                    results = results.replace("\n\n", "");
                    GM_setClipboard(results);
                    msgBox("风火递模板复制成功", 2000);
                }
                console.log("风火递模板事件已绑定");
            }

            // Json格式
            const df_json = document.querySelector("#df_json");
            if (df_json !== null) {
                df_json.onclick = () => {
                    let details = getDetails();
                    if (details === undefined) {
                        return;
                    }
                    if (details.length > 1) {
                        alert("json限制每次只复制1个，多选只取第一个");
                    }
                    let results = JSON.stringify(details[0]);
                    GM_setClipboard(results);
                    msgBox("Json模板复制成功");
                }
                console.log("Json模板事件已绑定");
            }
        }
    }

    function AlibabaBatchCheck() {
        const COLOR = {
            "OK": "#46bc1569",
            "NO": "#ff300066"
        }
        class Order {
            #dom = null;
            #source_sku = null;
            #source_count = null;
            #connect_size = null;
            #connect_color = null;
            #connect_count = null;
            constructor(dom) {
                this.#dom = dom
            }
            #trimStr(s) {
                return s.replace(/(^\s*)|(\s*$)/g, "");
            }
            get id() {
                let text = this.#dom.querySelector("div.order-title span.col").innerText;
                text = text.replace("订单号：", "");
                return this.#trimStr(text);
            }
            get #sourceSKU() {
                let text = this.#source_sku.innerText;
                return this.#trimStr(text);
            }
            get #sourceCount() {
                let text = this.#source_count.innerText;
                return this.#trimStr(text);
            }
            get #connectSKU() {
                function removeTag(param) {
                    let temp = param.split("：");
                    console.log("temp:",temp)
                    param = param.replace(`${temp[0]}：`,"");
                    console.log("param:",param)
                    return param.replace(/(^\s*)|(\s*$)/g, "");
                }
                let text_size = this.#connect_size === void 0 ? "" : this.#connect_size.innerText;
                text_size = removeTag(text_size);
                let text_color = this.#connect_color === void 0 ? "" : this.#connect_color.innerText;
                text_color = removeTag(text_color);
                return text_size === "" ? text_color : (text_color === "" ? text_size : `${text_color},${text_size}`);
            }
            get #connectCount() {
                let text = this.#connect_count.value;
                return `数量：${text}`;
            }
            check() {
                const offer_list = this.#dom.querySelectorAll("tr.offer-list");
                let result = true;
                for (let offer of offer_list) {
                    [this.#source_sku, this.#source_count] = offer.querySelectorAll("td.source-offer  p.offer-sku span.spec");
                    [this.#connect_color, this.#connect_size] = offer.querySelectorAll("td.connect-offer p.offer-sku span.spec");
                    this.#connect_count = offer.querySelector("td.quantity input");
                    result = (this.#sourceSKU === this.#connectSKU) && (this.#sourceCount === this.#connectCount);
                    if (!result) { break; }
                }
                if (result) {
                    this.#dom.querySelector("div.order-title").style.backgroundColor = COLOR.OK;
                } else {
                    this.#dom.querySelector("div.order-title").style.backgroundColor = COLOR.NO;
                }
                return result;
            }
        }
        class Orders {
            #select = "div.zone-order";
            #list = [];
            constructor() {
                this.#list = document.querySelectorAll("div.zone-order");
            }
            check() {
                let result = true;
                for (let od of this.#list) {
                    const temp = new Order(od);
                    console.log(temp)
                    if (!temp.check()) {
                        console.log(`${temp.id}商品/数量匹配不一致`);
                        result = false;
                    }
                }
                return result;
            }
        }
        const check = function () {
            let bt = document.querySelector("#check-product-666");
            if (bt !== null) {
                return bt;
            }
            bt = document.createElement("span");
            bt.id = "check-product-666";
            bt.className = "sub-logo-v5";
            bt.style.backgroundColor = "yellow";
            bt.style.position = "fixed"
            bt.style.top = "30px";
            bt.style.right = "0px";
            bt.style.zIndex = 9999;
            bt.style.fontSize = "x-large";
            bt.innerText = "订单商品检查";
            document.body.appendChild(bt);
            console.log("商品按钮检查已添加");
            return bt;
        }();
        check.onclick = () => {
            const ods = new Orders();
            if (ods.check()) {
                check.style.backgroundColor = COLOR.OK;
            } else {
                check.style.backgroundColor = COLOR.NO;
                setTimeout(() => {
                    // ttsplay("存在商品信息不一致的订单，请确认");
                    alert("确认标题标红的订单");
                }, 500)
            }
        }
    }
})();