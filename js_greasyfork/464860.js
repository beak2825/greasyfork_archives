// ==UserScript==
// @name         快麦助手Local链接集合
// @namespace    lezizi
// @version      0.1.2
// @description  常用链接合集
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erp.superboss.cc/favicon.ico
// @require      https://greasyfork.org/scripts/463102-kmerp-details/code/KMERP_DETAILS.js?version=1181558
// @require      https://greasyfork.org/scripts/454860-%E5%BF%AB%E9%BA%A6%E7%AD%9B%E9%80%89%E5%9C%B0%E5%9D%80%E8%BE%85%E5%8A%A9/code/%E5%BF%AB%E9%BA%A6%E7%AD%9B%E9%80%89%E5%9C%B0%E5%9D%80%E8%BE%85%E5%8A%A9.js?version=1117242
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/464860/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E9%93%BE%E6%8E%A5%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464860/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E9%93%BE%E6%8E%A5%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linkMissonId = 0;
    var tryErrCount = 0;
    linkMissonId = setInterval(()=>{
        addURLToHeader();
    },3000);
    function addURLToHeader(){
        let headerInfo = document.querySelector("div.header-user-info");
        if (headerInfo === null) {
            tryErrCount++;
            console.log("无法定位：div.header-user-info，尝试第"+tryErrCount+"次");
            if (tryErrCount > 10){
                clearInterval(linkMissonId);
            }
            return;
        }
        if (document.querySelector("#link888")!==null){
            console.log("常用链接已添加");
            clearInterval(linkMissonId);
            return;
        }
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.id = "link888";
            sp.innerHTML=`
                <em><a href="https://www.guoguo-app.com" target="_blank">快递查询</a></em>
                <ul class="user-opr-list">
                <li> <a href="https://www.ickd.cn" target="_blank">爱查快递</a> </li>
                <li> <a href="https://www.kuaidi100.com" target="_blank">快递100</a> </li>
                <li> <a href="https://www.sf-express.com" target="_blank">顺丰快递</a> </li>
                <li> <a href="https://www.jdl.com" target="_blank">京东快递</a> </li>
                <li> <a href="https://www.ems.com.cn/qps/yjcx" target="_blank">邮政快递</a> </li>
                <li> <a href="https://www.zto.com" target="_blank">中通快递</a> </li>
                <li> <a href="https://www.jtexpress.com" target="_blank">极兔速递</a> </li>
                <li> <a href="https://www.sto.cn" target="_blank">申通快递</a> </li>
                <li> <a href="http://www.yundaex.com/cn/index.php" target="_blank">韵达快递</a> </li>
                </ul>
            `;
            return sp;
        }());
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.innerHTML=`
                <em><a href="https://www.kdocs.cn/team/1559424731/99667619378" target="_blank">资料共享</a></em>
                <ul class="user-opr-list">
                <li> <a href="https://www.kdocs.cn/l/cbcVObH4m8dU" target="_blank">退货登记表</a> </li>
                <li> <a href="https://www.kdocs.cn/l/cnAiQo82LRpE" target="_blank">快递停发区</a> </li>
                <li> <a href="https://alidocs.dingtalk.com/i/nodes/3QD5Ea7xAo4VERggPP5DJG1YBwgnNKb0" target="_blank">快递理赔登记</a> </li>
                <li> <a href="https://www.kdocs.cn/l/ci2xNQo14FE5" target="_blank">鸟语花香售后</a> </li>
                </ul>
            `;
            return sp;
        }());
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.innerHTML=`
                <em><a href="#/trade/process/" target="_blank">快麦链接</a></em>
                <ul class="user-opr-list">
                <li> <a href="#/trade/exception/" target="_blank">异常订单</a> </li>
                <li> <a href="#/trade/print/?queryId=25" target="_blank">未分配快递</a> </li>
                <li> <a href="#/trade/print/?queryId=26" target="_blank">订单未打印</a> </li>
                <li> <a href="#/trade/print/?queryId=28" target="_blank">打印发货</a> </li>
                <li> <a href="#/trade/print/?queryId=27" target="_blank">打印记录</a> </li>
                <li> <a href="#/trade/electron_surface/" target="_blank">电子面单回收</a> </li>
                <li> <a href="#/trade/sentdone/" target="_blank">订单跟踪</a> </li>
                <li> <a href="#/aftersale/reg_supple_next/" target="_blank">售后补款</a> </li>
                <li> <a href="#/aftersale/sale_handle_next/" target="_blank">售后工单</a> </li>
                <li> <a href="#/smart/tag/" target="_blank">自动标记</a> </li>
                <li> <a href="#/index/download_center/" target="_blank">下载中心</a> </li>
                </ul>
            `;
            return sp;
        }());
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.innerHTML=`
                <em>快麦辅助</em>
                <ul class="user-opr-list">
                <li> <a href="javascript:void(0);" id="kmgj99901">停发区设置</a> </li>
                <li> <a href="javascript:void(0);" id="kmgj99902">复制补款工单</a> </li>
                <li> <a href="javascript:void(0);" id="kmgj99903">复制订单</a> </li>
                <li> <a href="javascript:void(0);" id="kmgj99904">复制订单(JD)</a> </li>
                <li> <a href="javascript:void(0);" id="kmgj99905">复制订单(留言)</a> </li>
                <li> <a href="javascript:void(0);" id="kmgj99911">复制商品资料</a> </li>
                </ul>
            `;
            return sp;
        }());
        document.querySelector("#kmgj99901").onclick=()=>{
            selectPauseCity();
        }
        document.querySelector("#kmgj99902").onclick=()=>{
            getAfsList();
        }
        document.querySelector("#kmgj99903").onclick=()=>{
            let details = getKMDetails();
            if (details === undefined) {
                return;
            }
            let results = ``;
            for (let d of details) {
                let goods = function (arr) {
                    let v = ``;
                    for (let g of arr) {
                        if (!g.Name.includes("优惠")){
                            v += `[${g.Name}]x${g.Count};`
                        }
                    }
                    return v;
                }(d.GoodsArray);
                results += `${d.Name}，${d.ExpNumber}${d.ExpName}，${goods}\n`;
            }
            results += "\n";
            results = results.replace("\n\n", "");
            GM_setClipboard(results);
            showToast("订单快捷信息复制成功");
        }
        document.querySelector("#kmgj99904").onclick=()=>{
            let details = getKMDetails();
            if (details === undefined) {
                return;
            }
            let results = `快捷信息\t快递单号\t京东订单号\t拼接公式\n`;
            for (let d of details) {
                let goods = function (arr) {
                    let v = ``;
                    for (let g of arr) {
                        if (!g.Name.includes("优惠")){
                            v += `[${g.Name}]x${g.Count};`
                        }
                    }
                    return v;
                }(d.GoodsArray);
                results += `${d.Name}，${d.ExpNumber}${d.ExpName}，${goods}\t${d.ExpNumber}\t\t=INDIRECT("A"&ROW())&"，"&INDIRECT("C"&ROW())\n`;
            }
            results += "\n";
            results = results.replace("\n\n", "");
            GM_setClipboard(results);
            showToast("订单快捷信息复制成功");
        }
        document.querySelector("#kmgj99905").onclick=()=>{
            let details = getKMDetails();
            if (details === undefined) {
                return;
            }
            let results = ``;
            for (let d of details) {
                let goods = function (arr) {
                    let v = ``;
                    for (let g of arr) {
                        v += `[${g.Name}]x${g.Count};`
                    }
                    return v;
                }(d.GoodsArray);
                results += `${d.Name}，${d.ExpNumber}${d.ExpName}，${d.Msg.split("-")[1]}\n`;
            }
            results += "\n";
            results = results.replace("\n\n", "");
            GM_setClipboard(results);
            showToast("订单快捷信息复制成功");
        }
        document.querySelector("#kmgj99911").onclick=()=>{
            copyGoods();
        }
    }

    /**
    * 页面交互相关的事件绑定
    */
    function getAfsList(){
        let afsmsg = ``;
        let eurl = document.domain;
        fetch(`https://${eurl}/as/order/rep/list`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "bx-v": "2.2.3",
                "companyid": "13798",
                "content-type": "application/json",
                "module-path": "/aftersale/reg_supple_next/",
                "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "referrer": `https://${eurl}/index.html`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"repType\":2,\"status\":2,\"isAll\":true,\"blurWorkOrder\":1,\"queryType\":\"id\",\"timeType\":\"0\",\"pageSize\":50,\"pageNo\":1,\"api_name\":\"as_order_rep_list\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(function(res) {
            return res.json();
        }).then(function(data){
            for(let afs of data.data.list){
                afsmsg += `${afs.applyTime}\t${afs.shopName}\t${afs.id}\t${afs.tid}\t${afs.reason}\t${afs.refundMoney/100}\n`;
            }
            console.log(afsmsg);
            GM_setClipboard(afsmsg);
            showToast("补款工单数据已复制");
            //return afsmsg;
        })
    }

    //复制商品编码名称图片
    function copyGoods(){
        if (!(document.URL.includes("#/prod/prod_mgr_next/")) ){
            showToast("请在 商品档案 页面使用！");
            return;
        }
        let area = document.querySelector("#pane-sku");
        if (area===null){
            showToast("点击商品->点击[规格信息]，将SKU列表显示出来");
            return;
        }
        let title = area.querySelectorAll("thead tr th");
        console.log("[TITLE]:"+title.innerHTML);
        let classCode = "";
        let className = "";
        let classImage = "";
        for (let c of title){
            if (c.innerText === "规格别名" || c.innerText === "规格名称"){
                className = c.classList[0];
            }
            if (c.innerText==="规格商家编码"){
                classCode = c.classList[0];
            }
            if (c.innerText.includes("规格图片")){
                classImage = c.classList[0];
            }
        }
        console.log("[CLASS_LIST]:\t"+classCode+"\t"+className);

        let skus = area.querySelectorAll("table tr.el-table__row");
        console.log("[SKUS]:\t"+skus.length);
        let results = ``;
        for (let sku of skus) {
            let code = sku.querySelector("td." + classCode).innerText;
            let name = sku.querySelector("td." + className).innerText;
            let pic = sku.querySelector("td." + classImage + " img").src;
            console.log(pic);
            if (pic.includes("?")){
                pic = pic.split("?")[0];
            }
            console.log(pic);
            results += `${code}\t${name}\t${pic}\n`;
        }
        results += "\n";
        results = results.replace("\n\n","");
        console.log(results);
        GM_setClipboard(results);
        showToast("商品信息复制成功");
    }

    //勾选停发区辅助
    function selectPauseCity(){
        function addButtons() {
            if (document.getElementById("pausecity1115")!=null){
                alert("按钮已添加");
                return;
            }
            // 要添加按钮的区域
            let btArea = document.getElementsByClassName('J-import-addr')[0].parentElement;
            while(btArea.getElementsByTagName("a")[0]!==undefined){
                btArea.getElementsByTagName("a")[0].remove();
            }
            while(btArea.getElementsByTagName("span")[0]!==undefined){
                btArea.getElementsByTagName("span")[0].remove();
            }
            let btNext = btArea.appendChild(function () {
                let bt = document.createElement('a');
                bt.innerText = "下一个地址";
                bt.classList = "btn";
                bt.id = "pausecity1115";
                return bt;
            }());
            let btBefore = btArea.appendChild(function () {
                let bt = document.createElement('a');
                bt.innerText = "上一个地址";
                bt.classList = "btn";
                return bt;
            }());
            let btCity = btArea.appendChild(function () {
                let bt = document.createElement('a');
                bt.innerText = "粘贴市区";
                bt.classList = "btn";
                return bt;
            }());
            let labelStatus = btArea.appendChild(function () {
                let bt = document.createElement('a');
                bt.innerText = "先粘贴城市，再点击下一个";
                bt.fontSize = "large";
                return bt;
            }());
            var city = [];
            var i = 0;
            // 该按钮添加城市
            btCity.onclick = () => {
                city = [];
                i = 0;
                let s = prompt("粘贴停发城市");
                if (s.length < 3) {
                    alert("未输入城市信息，结束");
                    labelStatus.innerText = "先粘贴城市，再点击下一个";
                    return;
                }
                let symbols = [" ", "，", "。", "（", "）", "【", "】", "、", "停止收寄"];
                for (let sb of symbols) {
                    s = s.replaceAll(sb, ",").replaceAll(",,", ",");
                }
                for (let c of s.split(",")) {
                    if (c.length > 0) {
                        city.push(c);
                    }
                }
                labelStatus.text = "已粘贴城市";
            }
            // 按钮检测下一个城市
            function clickNext() {
                if (city.length < 1) {
                    alert("请先导入城市数据");
                    return;
                }
                marklabel(i);
                i++;
            }
            btNext.onclick = clickNext;
            // body快捷点击设置为下一个城市，函数体小，不提取到函数
            document.getElementsByClassName("rc-address_select-body")[0].oncontextmenu = () => { return false };
            document.getElementsByClassName("rc-address_select-body")[0].onmouseup = (e) => {
                if (e.button !== 2) {
                    return;
                }
                clickNext();
            };
            // 按钮检测上一个城市
            btBefore.onclick = () => {
                if (city.length < 1) {
                    alert("请先导入城市数据");
                    return;
                }
                i--;
                if (i < 0) {
                    i = 0;
                    alert("已经是第1个了");
                    return;
                }
                marklabel(i);
            }
            // 显示区点击显示所有区域
            labelStatus.onclick = () => {
                alert(city);
            }
            function marklabel(index) {
                if (index >= city.length) {
                    alert("数据结束");
                    return;
                }
                let text = city[i];
                console.log("log:", text);
                getEm(text);
                index++;
            }
            function getEm(text) {
                let s = text.substring(0, 2);
                let els = document.getElementsByClassName("province-detail-wrap")[0].getElementsByClassName("addressWrap");
                let med = false;
                for (let el of els) {
                    if (el.innerText.includes(s)) {
                        med = true;
                        el.style.color = "red";
                        setTimeout(() => {
                            el.style.color = "";
                        }, 2000);
                    }
                }
                if (med){
                    labelStatus.innerText = `已标记：${text}`;
                    labelStatus.style.color = "blue";
                }else{
                    labelStatus.innerText = `未匹配：${text}`;
                    labelStatus.style.color = "red";
                }
            }
        }
        function selectSheng(){
            let city = (function () {
                let input = prompt("请输入省份").replaceAll("\r","").split("\n");
                let result = [];
                for (const c of input) {
                    if (c.length > 1) {
                        result.push(c);
                    }
                }
                return result;
            }());
            // console.log(city);
            function isInclude(addr) {
                for (const c of city) {
                    if (addr.includes(c)) {
                        return true;
                    }
                }
                return false;
            }
            let area = document.getElementsByClassName("province-list");
            let shengs = area[0].getElementsByTagName("input");
            for (let s of shengs) {
                if (isInclude(s.dataset.alias)){
                    // 包含就直接点击一下，如果点击过个别区，就直接取消选择了
                    s.click()
                    // 如果是取消选择，则直接点击，全选
                    if (!s.checked){
                        s.click();
                    }
                }
            }
        }
        document.getElementsByClassName("trade-add-filter")[0].click();
        setTimeout(()=>{
            document.getElementsByClassName('filter-operation-area')[0].appendChild(function(){
                let bt=document.createElement("a");
                bt.innerText="添加辅助勾选"
                bt.classList="btn";
                bt.onclick = addButtons;
                return bt;
            }());
            document.getElementsByClassName('filter-operation-area')[0].appendChild(function(){
                let bt=document.createElement("a");
                bt.innerText="所有城市"
                bt.classList="btn";
                bt.onclick = getAllCity;
                return bt;
            }());
            document.getElementsByClassName('filter-operation-area')[0].appendChild(function(){
                let bt=document.createElement("a");
                bt.innerText="已选城市"
                bt.classList="btn";
                bt.onclick = getSelectCity;
                return bt;
            }());
            document.getElementsByClassName('filter-operation-area')[0].appendChild(function(){
                let bt=document.createElement("a");
                bt.innerText="未选城市"
                bt.classList="btn";
                bt.onclick = getNotSelectCity;
                return bt;
            }());
            document.getElementsByClassName('filter-operation-area')[0].appendChild(function(){
                let bt=document.createElement("a");
                bt.innerText="勾选城市"
                bt.classList="btn";
                bt.onclick = selectCity;
                return bt;
            }());
            document.getElementsByClassName('filter-operation-area')[0].appendChild(function(){
                let bt=document.createElement("a");
                bt.innerText="勾选省"
                bt.classList="btn";
                bt.onclick = selectSheng;
                return bt;
            }());
        },2000);
    }

})();