// ==UserScript==
// @name         快麦助手-一键分快递
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  快麦分快递助手
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erp.superboss.cc/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/514627/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8B-%E4%B8%80%E9%94%AE%E5%88%86%E5%BF%AB%E9%80%92.user.js
// @updateURL https://update.greasyfork.org/scripts/514627/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8B-%E4%B8%80%E9%94%AE%E5%88%86%E5%BF%AB%E9%80%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_registerMenuCommand("激活一键分配", function () {
        if ((/trade\/print\/.*queryId=25/.test(document.URL) || /trade\/process\//.test(document.URL))) {
            RC.showNewFail("请在全部订单/未分配快递界面使用！");
            return;
        }
        assignExpressDelivery();
    });

    class ToolBar {
        constructor() {
            // 容器
            const container = document.createElement('div');
            container.style.width = "100%";
            document.body.appendChild(container);
            this.dom = document.createElement('div');
            container.appendChild(this.dom);
            this.dom.className = "ltoolbar1"
            this.addCSS();
        }
        /**
             * 添加css
             */
        addCSS() {
            const css = document.createElement('style');
            document.head.appendChild(css);
            css.innerHTML = `
            .ltoolbar1{
              bottom: 80px;
              margin:0 auto;
              position: fixed;
              left: 0px;
              right: 0px;
              max-height: 30px;
              border-radius: 5px;
              align-items: center;
              justify-content: center;
              display: flex;
              z-index: 9999999;
              font-size: 16px;
              color: white;
              background-color: cornflowerblue;
            }
            .lbutton{
                user-select: none;
                text-align: center;
            }
            .lbutton:hover{
                background: #6464df;
                border-radius: 5px;
                cursor:pointer;
            }
            `
        }
        /**
             * 添加按钮到工具条
             * @param {string} name
             * @param {Function} onclick
             */
        addButton(name, onclick) {
            const bt = document.createElement('span');
            bt.className = 'lbutton';
            bt.setAttribute('name', name);
            bt.innerText = name;
            bt.onclick = onclick;
            this.dom.appendChild(bt)
        }

        autofit() {
            let w = 0;
            for (const el of this.dom.querySelectorAll("span")) {
                if (el.style.display != "none") {
                    let name = el.getAttribute("name")
                    let el_width = name.length * 16 - (name.match(/\d/g) || []).length * 7 + 10;
                    el.setAttribute("style", `width:${el_width}px`)
                    w += el_width;
                }
            }
            this.dom.setAttribute("style", `width:${w}px`)
        }
    }

    assignExpressDelivery();
    function assignExpressDelivery() {
        const bar = new ToolBar();
        bar.addButton("邮政小包", () => setSelectedLogistics("邮政"))
        bar.addButton("电商标快", () => setSelectedLogistics("电商标快"))
        bar.addButton("EMS泡", () => setSelectedLogistics("EMS"))
        bar.addButton("极兔", () => setSelectedLogistics("极兔"))
        bar.addButton("中通", () => setSelectedLogistics("中通"))
        bar.addButton("中通3区", () => setSelectedLogistics("中通3区"))
        bar.autofit()


        function checkUrlToShow() {
            // 仅指定页面显示
            if (/trade\/print\/.*queryId=25/.test(document.URL) || /trade\/process\//.test(document.URL)) {
                document.querySelector("div.ltoolbar").style.display = "";
                console.log("工具条已显示")
            } else {
                document.querySelector("div.ltoolbar").style.display = "none";
                console.log("工具条已隐藏")
                return;
            }
        }
        window.addEventListener('hashchange', checkUrlToShow)
        checkUrlToShow()
    }


    function getTemplateId(type) {
        // 邮政小包
        if (type == '菜鸟邮政') {
            // 菜鸟：邮政小包	133335
            return '133335';
        }
        if (type == '多多邮政') {
            // 拼多多：邮政小包	133337
            return '133337';
        }
        if (type == '抖音邮政') {
            // 抖店：邮政小包	133338
            return '133338';
        }
        if (type == '小红书邮政') {
            // 小红书：邮政小包	138724
            return '138724';
        }
        // EMS
        if (type == '菜鸟EMS') {
            // EMS	菜鸟：EMS泡	115693
            return '115693';
        }
        if (type == '多多EMS') {
            // EMS	拼多多：EMS泡	115694
            return '115694'
        }
        if (type == '抖音EMS') {
            // EMS	抖店：EMS泡	131779
            return '131779'
        }
        if (type == '京东EMS') {
            // EMSBZ	京东：EMS泡	119704
            return '119704'
        }
        // 电商标快
        if (type == '菜鸟电商标快') {
            // EYB	菜鸟：邮政电商标快	128745
            return '128745'
        }
        if (type == '多多电商标快') {
            // EYB	拼多多：邮政电商标快	129019
            return '129019'
        }
        if (type == '抖音电商标快') {
            // EYB	抖店：邮政电商标快	129021
            return '129021'
        }
        if (type == '京东电商标快') {
            // EYB	京东：邮政电商标快	129025
            return '129025'
        }
        // 极兔
        if (type == '菜鸟极兔') {
            // HTKY	菜鸟：极兔一联	131166
            return '131166'
        }
        if (type == '抖音极兔') {
            // JTSD	抖店：极兔一联单	121810
            return '121810'
        }
        if (type == '多多极兔') {
            // JTSD	拼多多：极兔一联单	121815
            return '121815'
        }
        if (type == '京东极兔') {
            // JTSD	京东:极兔一联单	127087
            return '127087'
        }
        if (type == '小红书极兔') {
            // JTSD	小红书：极兔	144186
            return '144186'
        }
        // 中通
        if (type == '菜鸟中通') {
            // ZTO	菜鸟：中通宿豫(一二区)	145233
            return '145233'
        }
        if (type == '菜鸟中通3区') {
            // ZTO	菜鸟：中通洋河(三区)	145234
            return '145234'
        }
        // if (type == ''){
        //     //
        //     return ''
        // }
        throw `【快递分配】类型指定错误，"${type}"没有对应的快递模板`
    }

    async function setSelectedLogistics(express) {
        let trades = document.querySelectorAll("div.keepalive-dom-container:not([style*='display: none;']) div.module-trade-list-item-selected");
        let sids = []
        for (let trade of trades) {
            sids.push(trade.getAttribute("sid"))
        }
        if (sids.length > 0) {
            if (confirm(`已选中${sids.length}个订单，确认分配到${express}?`)) {
                try {
                    setLogistics(sids, express)
                } catch (e) {
                    RC.showNewFail(e)
                }
            }
        } else {
            RC.showNewFail("未选择订单")
        }
    }

    function checkZTO(express, trades) {
        let zto3 = ['辽宁', '重庆', '广西', '四川', '吉林', '贵州', '云南', '黑龙', '山西', '陕西']
        const showNewFail = (e) => {
            RC.showNewFail(e)
            throw e
        }
        if (express == '中通') {
            for (let t of trades) {
                if (zto3.includes(t.receiverState.substring(0, 2))) {
                    showNewFail(`订单${t.sid}${t.receiverState}属于中通3区！请修改为中通3区模板！`)
                }
            }
        } else if (express == '中通3区') {
            for (let t of trades) {
                if (!zto3.includes(t.receiverState.substring(0, 2))) {
                    showNewFail(`订单${t.sid}${t.receiverState}不属于中通3区！请修改为中通一二区模板！`)
                }
            }
        }
    }

    async function setLogistics(sids, express) {
        if (sids.length < 1) { return; }
        if (!['邮政', '电商标快', 'EMS', '极兔', '中通', '中通3区'].includes(express)) {
            throw `暂不支持的快递：${express}`
        }
        let trades = await queryBySid(sids);
        checkZTO(express, trades)
        let cainiao = []
        let pindodo = []
        let douyin = []
        let xiaohongshu = []
        let jingdong = []
        for (let t of trades) {
            if (["抖店(放心购)"].includes(t.shopSourceName) || t.tagName.includes('1688抖音分销订单')) {
                douyin.push(t.sid)
                continue
            }
            if (["拼多多"].includes(t.shopSourceName) || t.tagName.includes('1688拼多多分销订单')) {
                pindodo.push(t.sid)
                continue
            }
            if (["京东"].includes(t.shopSourceName) || t.tagName.includes('1688京东分销订单')) {
                jingdong.push(t.sid)
                continue
            }
            if (["小红书"].includes(t.shopSourceName) || t.tagName.includes('1688小红书分销订单')) {
                xiaohongshu.push(t.sid)
                continue
            }
            if (["天猫", "淘宝", "阿里巴巴", "淘工厂"].includes(t.shopSourceName)) {
                cainiao.push(t.sid)
                continue
            }
        }
        await logisticsAPI(cainiao, `菜鸟${express}`)
        await logisticsAPI(pindodo, `多多${express}`)
        await logisticsAPI(douyin, `抖音${express}`)
        await logisticsAPI(xiaohongshu, `小红书${express}`)
        await logisticsAPI(jingdong, `京东${express}`)
        // 分配完后，自动点击查询按钮
        document.querySelector("div.keepalive-dom-container:not([style*='display: none;']) button[trackname='Trade_Query_ChaXun']")?.click()
    }

    /**
     *
     * @param {string[]} sids
     * @param {string} type
     * @returns
     */
    async function logisticsAPI(sids, type) {
        if (sids.length < 1) { return }
        let templateId = getTemplateId(type);
        let resp = await fetch(`https://${location.host}/trade/logistics/wlb/save`, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "bx-v": "2.5.11",
                "companyid": "13798",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "module-path": "/trade/print/",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Microsoft Edge\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://${location.host}/index.html`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `api_name=trade_logistics_wlb_save&templateId=${templateId}&sids=${sids}&warehouseId=16556&queryId=&expressCode=&checkPdd=1`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        let data = await resp.json();
        let res = {
            success: data.data.addressReachable ?? [],
            fail: data.data.errorResults ?? []
        }
        let msg = `一键设置快递[${type}]：成功：${res.success.length}个|失败：${res.fail.length}个`
        console.log(msg)
        RC.showNewSuccess(msg)
    }

    async function queryBySid(sids) {
        let resp = await fetch(`https://${location.host}/trade/search/sids`, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "bx-v": "2.5.11",
                "companyid": "13798",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "module-path": "/trade/process/",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Microsoft Edge\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://${location.host}/index.html`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `api_name=trade_search_sids&useHasNext=1&order=desc&_t=${new Date().getTime()}&pageNo=1&pageSize=1&sids=${sids}&withStock=true&orderFields=id%2Coid%2Ctitle%2CsysTitle%2CshortTitle%2CskuPropertiesName%2CsysSkuPropertiesAlias%2CsysOuterId%2CsysRemark%2CouterId%2CplatSkuPropertiesName%2CpicPath%2CsysPicPath%2Cnum%2CrefundStatus%2CmainOuterId%2CgiftNum%2Csource%2CplatOuterId&field=pay_time&minutesAfterPaidOrderAreNotDisplayed=0`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        let data = await resp.json();
        let res = []
        if (data.data.list) {
            for (let v of data.data.list) {
                if (v.tagName == void 0) {
                    v.tagName = ''
                }
                res.push(v);
            }
        }
        return res
    }
})();