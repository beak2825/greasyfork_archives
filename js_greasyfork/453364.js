// ==UserScript==
// @name         快麦快捷方式
// @namespace    https://erpa.superboss.cc
// @version      0.7.17
// @description  快麦订单页面添加快捷链接
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erpa.superboss.cc/favicon.ico
// @require      https://greasyfork.org/scripts/454860-%E5%BF%AB%E9%BA%A6%E7%AD%9B%E9%80%89%E5%9C%B0%E5%9D%80%E8%BE%85%E5%8A%A9/code/%E5%BF%AB%E9%BA%A6%E7%AD%9B%E9%80%89%E5%9C%B0%E5%9D%80%E8%BE%85%E5%8A%A9.js?version=1117242
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453364/%E5%BF%AB%E9%BA%A6%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453364/%E5%BF%AB%E9%BA%A6%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 菜单项的css样式
    (function () {
        GM_addStyle(`
        .show-menu {
            position: relative;
            display: inline-block;
        }

        .menu-list {
            display: none;
            position: absolute;
            width:80px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            padding: 5px 15px;
            background-color: dodgerblue;
        }

        .show-menu:hover .menu-list {
            display: block;
        }
    `);
    }());

    // 用于向parent添加菜单项
    class Menu {
        constructor(parent, title) {
            let sp = document.createElement("span");
            sp.className = "show-menu";
            sp.innerHTML = `
                <div>
                    <span style="cursor:pointer;">${title}</span>
                    <div class="menu-list">
                    </div>
                </div>
            `;
            parent.appendChild(sp);
            this.menu = sp.getElementsByClassName("menu-list")[0];
        }
        addHref(name, url) {
            let p = document.createElement("p");
            p.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
            this.menu.appendChild(p);
            return p;
        }
        addButton(name, func) {
            let p = document.createElement("p");
            p.innerText = name;
            p.style = "cursor:pointer;"
            p.onclick = function () {
                func();
            };
            this.menu.appendChild(p);
            return p;
        }
        addLine() {
            let p = document.createElement("p");
            p.style = `height: 1px; background-color: white;`;
            this.menu.appendChild(p);
            return p;
        }
    }

    // 快麦标题用户信息区添加快捷链接
    // #快捷链接
    function addLinkToHeaderUserInfo() {
        // #菜单项添加
        let title = document.getElementsByClassName("header-user-info")[0];
        // 用户判断
        let user = title.getElementsByClassName("user-name")[0].innerText;
        let level = function () {
            let l10 = ["王新浩"]; // 全部加载
            let l8 = [];//社保银行等
            let l7 = ["闫莹"];//采购货单
            let l6 = [];//分销客户
            let l5 = ["王漫"];//代发表格
            let l3 = ["超级管理员", "刘倩", "叶鑫鑫"];//订单工具
            return function () {
                if (l10.includes(user)) {
                    return 10;
                }
                if (l8.includes(user)) {
                    return 9;
                }
                if (l7.includes(user)) {
                    return 7;
                }
                if (l6.includes(user)) {
                    return 6;
                }
                if (l5.includes(user)) {
                    return 5;
                }
                if (l3.includes(user)) {
                    return 3;
                }
                return 1;
            }();

        }();
        console.log(user, level);
        // 获取模块
        let sp = title.getElementsByTagName("span");
        while (sp[2] !== undefined) { sp[2].remove(); }
        // 从配置中添加数据
        // todo:后续从GM_getValue获取数据
        // #常用链接
        // #订单快捷工具
        if (level >= 3) {
            let menu = new Menu(title, "订单工具");
            // #全选淘系订单
            menu.addButton("全选淘系订单", selectTaoDetails);
            menu.addButton("复制快递商品", copyDetailsExpress);
            menu.addLine();
            // 复制店铺名称线上单号省份，停发订单申诉专用
            menu.addButton("停发订单复制", copyDetailsToPause);
            // 筛选中的地区勾选辅助
            menu.addButton("停发区域设置", selectPauseCity);
            // menu.addLine();
            // writeExpressByHand
            // menu.addButton("直接发货", sendPackage);
        }

        // #快麦自带链接
        (function () {
            let menu = new Menu(title, "快麦链接");
            menu.addHref("全部订单", "#/trade/process/");
            menu.addHref("异常订单", "#/trade/exception/");
            menu.addHref("未分配快递", "#/trade/print/?queryId=25");
            menu.addHref("订单未打印", "#/trade/print/?queryId=26");
            menu.addHref("打印发货", "#/trade/print/?queryId=28");
            menu.addHref("打印记录", "#/trade/print/?queryId=27");
            menu.addHref("订单跟踪", "#/trade/sentdone/");
            menu.addHref("上传异常", "#/trade/uploadstatus/");
            menu.addHref("电子面单回收", "#/trade/electron_surface/");
            menu.addLine();
            menu.addHref("下载中心", "#/index/download_center/");
            menu.addHref("自动标记", "#/smart/tag/");
            menu.addLine();
            menu.addHref("商品档案", "#/prod/prod_mgr_next/");
            menu.addHref("商品对应表", "#/prod/prod_correspondence_next/");
            menu.addLine();
            menu.addHref("收货单", "#/purchase/receipt/");
            menu.addHref("库存状态", "#/stock/newstatu/");
            menu.addHref("库存盘点", "#/stock/check_next/");
            menu.addLine();
            menu.addHref("售后补款", "#/aftersale/reg_supple_next/");
            menu.addHref("售后工单", "#/aftersale/sale_handle_next/");
            menu.addLine();
            menu.addHref("订单查询", "#/trade/searchlist/");
            //menu.addHref("","");

        }());

        // #代发订单辅助
        if (level >= 5) {
            let menu = new Menu(title, "代发工具");
            // 单号回传整理
            menu.addButton("单号回传处理",outidImportMod);
            menu.addLine();
            // #解密订单
            menu.addButton("解密订单地址", dcryptDetails);
            // #复制订单线下代发
            menu.addButton("线下代发复制", copyDetailsToFactory);
            // #复制订单菜鸟代发
            menu.addButton("菜鸟代发复制", copyDetailsToCainiao);
            // 旺店通订单审核页模板
            menu.addButton("旺店通建单",copyDetailsToWangdiantong);
            menu.addLine()
            // 复制到指尖联盟
            menu.addButton("指尖联盟复制", copyDetailsToZhijian);
            menu.addLine()
            // 冠悦代发模板
            menu.addButton("冠悦代发模板", copyDetailsToGuanyue);
            // 宠梦代发模板
            menu.addButton("宠梦代发模板", copyDetailsToChongmeng);
        };

        // #代发工厂
        if (level >= 5) {
            let menu = new Menu(title, "代发工厂");
            menu.addHref("在线文件夹", "https://www.kdocs.cn/team/1559424731/99655353897");
            menu.addHref("代发导图", "https://www.kdocs.cn/view/p/104315297561");
            menu.addHref("胖虎2023", "https://www.kdocs.cn/l/cpvkHrVa7WZ6")
            menu.addHref("浙宠2023", "https://www.kdocs.cn/l/cd41YGCla8ZF")
            menu.addHref("宠聚2023", "https://www.kdocs.cn/l/cukOJrM0OYXh")
            menu.addHref("喵仙2023", "https://www.kdocs.cn/l/ca5HJ19S8HFv")
            menu.addHref("连云港2023", "https://www.kdocs.cn/l/coVHFeKCPDvp")
            menu.addHref("冠悦2023", "https://www.kdocs.cn/l/cf6f7Z0LmpnD")
            menu.addHref("美芙2023", "https://www.kdocs.cn/l/cums7ZIorkBd")
            menu.addHref("曼声2023", "https://www.kdocs.cn/l/csOv8dG2OOWg")
            menu.addHref("小谭猫窝2023", "https://www.kdocs.cn/l/cqMG5ITD4i4P")
            menu.addHref("俊材猫窝2023", "https://www.kdocs.cn/l/ckMm2yenGSPA")
            menu.addHref("向宏军2023", "https://www.kdocs.cn/l/cs5STGPh3S8j")
            menu.addHref("乐吱吱抓板2023", "https://www.kdocs.cn/l/cjaxFTemwKLD")
            menu.addHref("摇摆乒乓球2023", "https://www.kdocs.cn/l/caPAYwYD9pae")
            menu.addHref("宠梦2023", "https://www.kdocs.cn/l/cnFxSbvk002j")
            menu.addHref("欧一吸2023", "https://www.kdocs.cn/l/cdQ4kF7nUd0s")
            //menu.addHref("","");

        };

        // #分销客户
        if (level >= 6) {
            let menu = new Menu(title, "分销客户");
            menu.addHref("快递价格表","https://www.kdocs.cn/l/cl49XYM73c2b");
            menu.addLine();
            menu.addHref("在线文件夹", "https://www.kdocs.cn/team/1559424731/99655877177");
            menu.addHref("代发导图", "https://www.kdocs.cn/view/p/104315297561");
            menu.addHref("向宏军2023", "https://www.kdocs.cn/l/cqX32yNX7CfJ")
            menu.addHref("张振峰2023", "https://www.kdocs.cn/l/cjTW6xHvJiLA")
            menu.addHref("王林2023", "https://www.kdocs.cn/l/cmvZxIXMv6C1")
            menu.addHref("小谭2023", "https://www.kdocs.cn/l/crBassx21Vko")
            menu.addHref("宏晔2023", "https://www.kdocs.cn/l/cn7vDOQ3L48f")
            menu.addHref("迪曼2023", "https://www.kdocs.cn/l/ceBGS36fE9zg")
            menu.addHref("曼声2023", "https://www.kdocs.cn/l/chjdxwQgQHzM")
            menu.addHref("闫莹2023", "https://www.kdocs.cn/l/coAtiGnG0ZJX")
            menu.addHref("张杰2023", "https://www.kdocs.cn/l/cbsY7K3FcAsa")
            menu.addHref("俊材2023", "https://www.kdocs.cn/l/cqtxtm7zypXn")
            menu.addHref("杨林2023", "https://www.kdocs.cn/l/cb3Bmm9OAiml")
            menu.addHref("JH2023", "https://www.kdocs.cn/l/cvsBGWb568nb")
            //menu.addHref("","");
        };

        // #常用资料
        if (level >= 1) {
            let menu = new Menu(title, "资料共享");
            menu.addHref("在线文件夹", "https://www.kdocs.cn/team/1559424731/99667619378");
            menu.addHref("退货登记表", "https://www.kdocs.cn/l/cbcVObH4m8dU");
            menu.addHref("快递停发区", "https://www.kdocs.cn/l/cnAiQo82LRpE");
            menu.addLine();
            menu.addHref("快递理赔登记", "https://alidocs.dingtalk.com/i/nodes/3QD5Ea7xAo4VERggPP5DJG1YBwgnNKb0");
            menu.addHref("鸟语花香售后", "https://www.kdocs.cn/l/ci2xNQo14FE5");
            //menu.addHref("","");

        };

        // #快递链接
        (function () {
            let menu4 = new Menu(title, "快递链接");
            menu4.addHref("菜鸟裹裹", "https://www.guoguo-app.com/");
            menu4.addHref("爱查快递", "https://www.ickd.cn/");
            menu4.addHref("快递100", "https://www.kuaidi100.com/");
            menu4.addHref("顺丰快递", "https://www.sf-express.com/");
            menu4.addHref("京东快递", "https://www.jdl.com/");
            menu4.addHref("邮政快递", "https://www.ems.com.cn/qps/yjcx/");
            menu4.addHref("中通快递", "https://www.zto.com/");
            menu4.addHref("极兔速递", "https://www.jtexpress.com/");
            menu4.addHref("申通快递", "https://www.sto.cn/")
            menu4.addHref("韵达快递", "http://www.yundaex.com/cn/index.php")
            //menu4.addHref("","");
        }());

    }

    // 订单信息提取
    const kmDetails = {
        /**获取订单地址
        * @return {Elements} 获取订单列表
        */
        getDetails: function () {
            return document.getElementsByClassName("module-trade-list-item");
        },
        /**获取订单地址
        * @param {Element} detail 订单Element
        * @return {string} 地址信息的字符串
        */
        getAddress: function (detail) {
            let shippingAddress = detail.getElementsByClassName('J_Shipping_Address')[0];
            let dcryptShow = shippingAddress.getElementsByClassName('js-dcrypt-show');
            let name = dcryptShow[0].innerText.replace(/ /g, "_").replace(/，/g, ",");
            let phone = dcryptShow[1].innerText
            let addon = (function () {
                let rel = phone.match(/-[0-9]{4}$/);
                if (rel !== null) {
                    //phone = phone.replace(rel[0], '');
                    rel = rel[0].replace('-', '');
                    return rel;
                }
                return ''
            }());
            if (!name.endsWith(`[${addon}]`) && addon!=''){
                name += `[${addon}]`;
            }
            if (name.length === 1) {
                name += "_";
            }
            let info = `${name}，${phone}，`;
            let detailedAddress = detail.getElementsByClassName('detailed-address')[0].innerText;
            detailedAddress = detailedAddress.substring(5).replace(/，/g, ',').replace(/,[0-9]{6}$|,[0-9]{6},$|,$/g, "");
            let sss = detailedAddress.split(' ');
            for (let i = 0; i < sss.length; i++) {
                info += sss[i];
                if (i < 2) {
                    info += ' ';
                } else if (i === 2) {
                    info += '，';
                }
            }
            if (addon !== '') {
                let re = new RegExp(`${addon}】$`);
                if (!re.test(info) && !info.endsWith(`[${addon}]`)) {
                    info += `[${addon}]`;
                }
            }
            return info;
        },
        /**获取订单商品
        * @param {Element} detail 订单Element
        * @return {Array} 商品信息的数组
        */
        getGoods: function (detail) {
            let results = [];
            let goods = detail.getElementsByClassName("item-snapshot-itemname special-item-snapshot-itemname");
            for (let good of goods) {
                let code = good.getElementsByClassName("seller-code");
                code = code[0].innerText.split("：")[1];
                let name = good.getElementsByClassName("prod-properties");
                if (name.length > 1) {
                    name = name[1].innerHTML;
                } else {
                    name = name[0].innerHTML;
                }
                let count = good.getElementsByClassName("needNum")[0].innerText;
                let si = name.indexOf("<span>（") + 7;
                if (si < 7) {
                    si = name.indexOf("</span>") + 7;
                }
                name = name.substring(si).replace('）</span>', '');
                name = name.replaceAll(" ","").replaceAll("\n","");
                name = name.replaceAll("<em>","").replaceAll("</em>","");
                results.push([code, name, count]);
            }
            return results;
        },
        /**获取订单平台单号
        * @param {Element} detail 订单Element
        * @return {string} 订单的平台订单号
        */
        getOlId: function (detail) {
            return detail.getAttribute("tids");
        },
        /**获取订单系统订单号
        * @param {Element} detail 订单Element
        * @return {string} 订单的系统订单号
        */
        getSysId: function (detail) {
            return detail.getAttribute("sid");
        },
        /**获取订单快递单号
        * @param {Element} detail 订单Element
        * @return {string} 订单的快递单号
        */
        getOutsid: function (detail) {
            return detail.getAttribute("outsid");
        },
        /**获取订单旺旺号
        * @param {Element} detail 订单Element
        * @return {string} 订单的旺旺号
        */
        getWang: function (detail) {
            return detail.getElementsByClassName("operate-menu-for-wangwang")[0].innerText.replaceAll(" ", "");
        }
    }

    /**判断快递公司
    * @param {string} number 订单快递单号
    * @param {boolean} isMod 获取快递模板
    * @return {string} 快递名称/模板名称
    */
    function getExpressName(number, isMod) {
        number = number.replaceAll("'","");
        let short = isMod !== true;
        let len = number.length;
        if (number.startsWith("75") && len == 12) {
            return short ? "安能" : "安能快递";
        }
        if (number.startsWith("DPK")) {
            return short ? "德邦" : "德邦快运";
        }
        if ((number.startsWith("11") || number.startsWith("12")) && len == 13) {
            return short ? "EMS" : "EMS标准快递";
        }
        if (number.startsWith("JDKA") || number.startsWith("KK")) {
            return short ? "京东" : "京广速递226";
        }
        if (number.startsWith("JT")) {
            return short ? "极兔" : "极兔速递";
        }
        if (number.startsWith("JT")) {
            return short ? "极兔" : "极兔速递";
        }
        if ((number.startsWith("75") || number.startsWith("78")) && len == 14) {
            return short ? "中通" : "中通快递";
        }
        if (number.startsWith("9") && len == 13) {
            return short ? "邮政" : "邮政国内小包";
        }
        if (number.startsWith("YT")) {
            return short ? "圆通" : "圆通速递";
        }
        if (number.startsWith("SF")) {
            return short ? "顺丰" : "顺丰速运";
        }
        if ((number.startsWith("32") || number.startsWith("18")) && len == 12) {
            return short ? "顺丰" : "顺丰速运";
        }
        if (number.startsWith("99") && len == 15) {
            return short ? "顺丰" : "顺丰速运";
        }
        if (number.startsWith("4") && len == 15) {
            return short ? "韵达" : "韵达快递";
        }
        return ""
    }

    // 添加遮罩
    function MaskCustomizedBody(className) {
        let pw = document.createElement("div");
        pw.style.cssText = "background-color:blue;opacity:0.3;position:absolute;width:100%;height:100%;left:0px;top:0px;"
        pw.innerHTML = `<div style="margin-top: 300px; font-size: 150px; margin-left: 300px; color: red;">请稍等。。。</div>`;
        return document.getElementsByClassName("customized-body")[0].appendChild(pw);
    }

    // 解密信息
    function dcryptDetails() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        if (GM_getValue("dcryptDetails") > 0) {
            alert("请等待当前任务完成！\n如未运行解密任务，请刷新页面重试");
            return;
        }
        if (!confirm("解密订单信息？会消耗店铺解密额度，误触点取消")) {
            return;
        }
        GM_setValue("dcryptDetails", 1);
        let mask = MaskCustomizedBody();
        new Promise((resolve, reject) => {
            let details = kmDetails.getDetails();
            let i = 0;
            let clickTime = 0;
            let misson = setInterval(clickWatchIcon, function () {
                let delay = Math.random() * 2000;
                if (delay < 1000) {
                    delay += 1000;
                }
                return delay;
            }());
            function clickWatchIcon() {
                if (i === details.length) {
                    clearInterval(misson);
                    resolve(`解密完成，共${i}个订单！`);
                } else {
                    let addr = details[i].getElementsByClassName('J_Shipping_Address')[0];
                    let icon = addr.getElementsByClassName('watch-icon');
                    let shop = details[i].getAttribute("shopsource");
                    if (icon[0] != undefined && shop !== "sys" && clickTime < 3) {
                        icon[0].click();
                        clickTime++;
                        console.log(`解密第${i + 1}个订单`);
                    } else {
                        let z = details[i].getElementsByClassName("trade-icon-more")[0];
                        if (z !== undefined) {
                            z.click();
                        }
                        clickTime = 0;
                        i++;
                    }
                }
            }
        }).then(msg => {
            if (confirm("订单解密完成，是否用于代发？\n确定->复制订单信息成代发格式\n取消->不复制订单信息")) {
                copyDetailsToFactory();
            }
            GM_setValue("dcryptDetails", 0);
            mask.remove();
        });
    }

    // 直接发货
    function sendPackage(){
        if (!(document.URL.includes("#/trade/print/") && document.URL.includes("queryId=28"))) {
            alert("请在 订单处理 -> 打印发货 页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        if (details.length<1){
            alert("没有可处理订单");
            return;
        }
        let sysids = ``;
        for (let detail of details) {
            let num = kmDetails.getSysId(detail);
            console.log(`添加订单${num}`);
            sysids += `${num}%2C`;
        }
        sysids+="%2C";
        sysids = sysids.replaceAll("%2C%2C","");
        console.log(sysids);
        let eurl = document.domain;
        fetch(`https://${eurl}/trade/consign/audited`, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,und;q=0.5",
                "companyid": "13798",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "module-path": "/tradeNew/manage/",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://${eurl}/index.html`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `api_name=trade_consign_audited&sids=${sysids}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(function(res) {
            console.log(res);
            alert("命令已执行");
        })
    }

    // 复制订单线下代发
    function copyDetailsToFactory() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let details_list = ``;
        let default_count = 0;
        for (let i = 0; i < details.length; i++) {
            let detail = details[i];
            // 订单信息，加订单号
            let sysId = kmDetails.getSysId(detail);
            let addr = kmDetails.getAddress(detail);
            let goods = kmDetails.getGoods(detail);
            if (goods.length === 0) {
                default_count++;
                details_list += `'${sysId}\t${addr}\t\t\n`;
            } else {
                for (let g of goods) {
                    details_list += `'${sysId}\t${addr}\t${g[1]}\t${g[2]}\n`;
                }
            }
        }
        if (default_count > 0) {
            alert(`有${default_count}笔订单的商品未全部加载，商品信息缺失`);
        }
        details_list = `订单号\t收货信息\t商品名称\t商品数量\t备注信息\t快递单号\n${details_list}`;
        GM_setClipboard(details_list);
        alert("信息已复制到剪贴板，直接粘贴即可");
    }

    // 复制到菜鸟代发
    function copyDetailsToCainiao() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let results = ``;
        let id = 1;
        for (let detail of details) {
            let addr = kmDetails.getAddress(detail).split("，");
            let phone = addr[1].includes("-") ? addr[1].split("-")[0]:`${addr[1]}`;
            let goods = kmDetails.getGoods(detail);
            let goodsOneLine = ``;
            for (let g of goods) {
                goodsOneLine += `[${g[1]}]x${g[2]};`;
            }
            results += `${id++}\t${addr[0]}\t'${phone}\t${addr[2]}${addr[3]}\t其他\t${goodsOneLine}\t'${kmDetails.getSysId(detail)}\n`;
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        alert("复制成功");
    }


    // 复制到旺店通订单审核
    function copyDetailsToWangdiantong(){
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let results = `店铺名称\t原始单号\t收件人\t手机\t地址\t发货条件\t应收合计\t邮费\t优惠金额\t商家编码\t货品数量\t货品总价\n`;
        for (let detail of details) {
            let addr = kmDetails.getAddress(detail).split("，");
            let goods = kmDetails.getGoods(detail);
            let goodsOneLine = ``;
            let phone = addr[1].includes("-") ? addr[1]:`'${addr[1]}`;
            let count = 0;
            if (goods.length<1){
                GM_setClipboard(kmDetails.getSysId(detail));
                alert(`订单${kmDetails.getSysId(detail)}商品未加载\n\n订单号已复制，可直接粘贴查询`);
                return;
            }
            for (let g of goods) {
                if(!g[0].includes("LD9105")){
                    GM_setClipboard(kmDetails.getSysId(detail));
                    alert(`订单${kmDetails.getSysId(detail)}未满足条件：\n\n包含非新品混合猫砂\n\n订单号已复制，可直接粘贴查询`);
                    return;
                }
                count += Number(g[2]);
                if(g[0]!=="LD910511"){
                    GM_setClipboard(kmDetails.getSysId(detail));
                    alert(`订单${kmDetails.getSysId(detail)}未满足条件：\n\n请将套件转单品\n\n订单号已复制，可直接粘贴查询`);
                    return;
                }
                if(count > 2){
                    GM_setClipboard(kmDetails.getSysId(detail));
                    alert(`订单${kmDetails.getSysId(detail)}未满足条件：\n\n每单最多2包，请先拆分订单\n\n订单号已复制，可直接粘贴查询`);
                    return;
                }
                results += `lezizi乐吱吱旗舰店\t'${kmDetails.getSysId(detail)}\t${addr[0]}\t${phone}\t${addr[2]}${addr[3]}\t款到发货\t0\t0\t0\t${g[0]}\t${g[2]}\t0\n`;
            }
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        alert("复制成功");
    }

    // 复制到冠悦代发
    function copyDetailsToGuanyue() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let results = ``;
        for (let detail of details) {
            let addr = kmDetails.getAddress(detail).split("，");
            let goods = kmDetails.getGoods(detail);
            let goodsOneLine = ``;
            for (let g of goods) {
                goodsOneLine += `[${g[1]}]x${g[2]};`;
            }
            let phone = addr[1].includes("-") ? addr[1]:`'${addr[1]}`;
            results += `'${kmDetails.getSysId(detail)}\t${addr[0]}\t\t${phone}\t${addr[2]}${addr[3]}\t${goodsOneLine}\n`;
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        alert("复制成功");
    }

    // 复制到宠梦代发
    function copyDetailsToChongmeng() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let results = ``;
        for (let detail of details) {
            let addr = kmDetails.getAddress(detail).split("，");
            let goods = kmDetails.getGoods(detail);
            let phone = addr[1].includes("-") ? addr[1]:`'${addr[1]}`;
            let text = `'${kmDetails.getSysId(detail)}\t${addr[0]}\t\t${phone}\t${addr[2]}${addr[3]}`;
            for (let g of goods) {
                results += `${text}\t${g[1]}\t${g[2]}\n`;
            }
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        alert("复制成功");
    }

    // 复制到指尖联盟代发
    function copyDetailsToZhijian() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let results = ``;
        for (let detail of details) {
            let addr = kmDetails.getAddress(detail).split("，");
            results += `${addr[2]}${addr[3]}\t${addr[0]}\t${addr[1]}\t${kmDetails.getOlId(detail)}\n`;
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        alert("复制成功");
    }

    // 全选淘宝订单
    function selectTaoDetails() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let shopType = ["tm", "tb", "1688", "sys"];
        for (let i = 0; i < details.length; i++) {
            let dId = details[i].getAttribute("shopsource");
            if (shopType.includes(dId)) {
                if (!details[i].getElementsByClassName("J_Checkbox")[0].checked) {
                    details[i].getElementsByClassName("J_Checkbox")[0].click();
                }
            }
        }
    }

    // 复制停发订单信息去申诉
    function copyDetailsToPause() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let shopFlag = [["shopFlag-tm", "天猫"],
                        ["shopFlag-1688", "阿里"],
                        ["shopFlag-pdd", "拼多多"],
                        ["shopFlag-tb", "淘宝"],
                        ["shopFlag-fxg", "抖店"],
                        ["shopFlag-sys", "线下"],
                        ["shopFlag-dangkou", "档口"]];
        let shopName = {
            "天猫1": "TM登堡斯",
            "天猫3": "TM乐吱吱",
            "淘宝1": "TB宏溢",
            "线下1": "代发",
            "抖店1": "DY乐吱吱",
            "拼多多1": "PddMUSIKER",
            "拼多多2": "Pdd通顺",
            "阿里1": "Ali哆啦咪",
            "阿里2": "Ali乐吱吱"
        };
        let getShop = (obj) => {
            let shop = "";
            for (let f of shopFlag) {
                if (obj.className.includes(f[0])) {
                    shop = `${f[1]}${obj.innerText}`;
                }
            }
            return shopName[shop];
        }
        let details = document.getElementsByClassName("module-trade-list-item");
        let results = `店铺\t旺旺号\t订单号\t省\t市\t区\n`;
        for (let detail of details) {
            let flag = detail.getElementsByClassName("stoppropagation")[0];
            let wangwang = kmDetails.getWang(detail);
            let addr = detail.getElementsByClassName("detailed-address")[0].innerText.replaceAll("详细地址：", "").split(" ");
            results += `${getShop(flag)}\t${wangwang}\t'${detail.getAttribute("tids")}\t`;
            results += `${addr[0]}\t${addr[1]}\t${addr[2]}\n`;
        }
        GM_setClipboard(results);
        alert("复制成功");
    }

    // 复制订单快递单号
    function copyDetailsExpress() {
        if (!document.URL.includes("#/trade/")) {
            alert("请在订单页面使用！");
            return;
        }
        let details = kmDetails.getDetails();
        let results = ``;
        let noGoods = 0;
        for (let detail of details) {
            let addr = kmDetails.getAddress(detail).split("，");
            let goods = kmDetails.getGoods(detail);
            let outsid = kmDetails.getOutsid(detail);
            let outname = getExpressName(outsid);
            let goodsOneLine = ``;
            for (let g of goods) {
                goodsOneLine += `[${g[1]}]x${g[2]};`;
            }
            if (goodsOneLine == ``){
                noGoods++;
            }
            results += `${addr[0]}，${outsid}${outname}，${goodsOneLine}\n`;
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        if (noGoods>0){
            alert(`信息已复制，${noGoods}个订单未加载商品`);
        }else{
            alert("复制成功");
        }
    }

    // 单号回传处理
    function outidImportMod() {
        let details = prompt("从表格中复制系统单号和快递单号2列\n左侧系统单号，右侧快递单号").replaceAll("\r","");
        let results = '序号\t系统订单号\t平台订单号\t快递模板\t运单号（必填）\n';
        let reCn = /[\u4e00-\u9fa5]/; // 判断中文
        let reEn = /[A-z]+/; // 判断字母
        for (let detail of details.split("\n")){
            let temp = detail.split("\t");
            let sysid = reEn.test(temp[0]) ? temp[0]:`'${temp[0]}`;
            let outid = reEn.test(temp[1]) ? temp[1]:`'${temp[1]}`;
            let name = getExpressName(outid,true);
            if (!"'".includes(outid) && !reCn.test(outid)){
                results += `\t${sysid}\t\t${name}\t${outid}\n`;
            }
        }
        GM_setClipboard(results);
        alert("转换完成，粘贴到表格即可");
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

    // 植入按钮
    setTimeout(function () {
        console.log("油猴-添加链接");
        addLinkToHeaderUserInfo();
        // 解密置0
        GM_setValue("dcryptDetails", 0);
    }, 5000);
})();