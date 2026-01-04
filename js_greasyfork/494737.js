// ==UserScript==
// @name         快递打印V2核对
// @namespace    http://erp.superboss.cc/
// @version      2024-05-22
// @description  快麦ERP打印V2停发区辅助
// @author       You
// @match        *://*.superboss.cc/*
// @icon         http://superboss.cc/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494737/%E5%BF%AB%E9%80%92%E6%89%93%E5%8D%B0V2%E6%A0%B8%E5%AF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/494737/%E5%BF%AB%E9%80%92%E6%89%93%E5%8D%B0V2%E6%A0%B8%E5%AF%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POST_PAUSE_CITY = ["北京", "云南", "贵州", "黑龙", "海南", "青海", "新疆", "西藏"]

    // Your code here...
    // 小工具
    function ttsplay(text) {
        setTimeout(() => {
            const utterThis = new window.SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterThis)
        }, 100);
        return text
    }

    function toast(msg) {
        RC.showNewInfo(msg)
        return msg
    }

    print_helper();
    /**
 * 打印助手
 */
    function print_helper() {
        /**
         * 工具条
         */
        class ToolBar {
            constructor() {
                // 容器
                const container = document.createElement('div');
                container.style.width = "100%";
                document.body.appendChild(container);
                this.dom = document.createElement('div');
                container.appendChild(this.dom);
                this.dom.className = "xztoolbar"
                this.addCSS();
            }
            /**
             * 添加css
             */
            addCSS() {
                const css = document.createElement('style');
                document.head.appendChild(css);
                css.innerHTML = `
                .xztoolbar{
                  bottom: 50px;
                  margin:0 auto;
                  position: fixed;
                  left: 70px;
                  top: 500px;
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

        /**
         * 订单信息
         */
        class Trade {
            constructor(dom) {
                this.online_id = '';
                this.system_id = '';
                this.platform_id = '';
                this.warehouse_id = '';
                this.out_id = '';
                this.express = '';
                this.name = '';
                this.dom = dom;
                this.getBasicInfo();
            }

            /**
             * 载入基础信息
             */
            getBasicInfo() {
                this.system_id = this.dom.getAttribute("sid");
                this.online_id = this.dom.getAttribute("tids");
                this.platform_id = this.dom.getAttribute("source");
                this.warehouse_id = this.dom.getAttribute("warehouseid");
                let copy_companyname_outsid = this.dom.querySelector("a[data-name=copy_companyname_outsid]");
                this.out_id = copy_companyname_outsid === null ? "" : copy_companyname_outsid.getAttribute("data-outsid");
                this.express = copy_companyname_outsid === null ? "" : copy_companyname_outsid.getAttribute("data-compname");
                this.state = this.dom.querySelectorAll("span.value")[2].firstChild.nodeValue.split(" ")[0];
                this.name = this.dom.querySelector("span[data-key=receiverName]").innerText;
            }

            select(sub = false) {
                if ((this.isSelected && sub) || (!this.isSelected && !sub)) {
                    const check = this.dom.querySelector("span.check input");
                    check.click();
                }
            }

            /**
             * 订单已选择
             */
            get isSelected() {
                const check = this.dom.querySelector("span.check input");
                return check.checked;
            }

            /**
             * 获取商品信息
             * @returns {string}
             */
            getProducts() {
                let result = "";
                for (let p of this.dom.querySelectorAll("div.prod-detail-cell")) {
                    let text = p.innerText.replaceAll("\n\n", "\n").replaceAll(" ", "");
                    text = text.replace("【平台赠品】\n", "");
                    let [name, count] = text.split("\n")
                    result += `[${name}]x${count};`
                }
                return result;
            }

            /**
             * 获取订单平台简称
             */
            getPlatform() {
                switch (this.platform_id) {
                    case "tm":
                        return "天猫";
                    case "tb":
                        return "淘宝";
                    case "1688":
                        return "阿里";
                    case "fxg":
                        return "抖音";
                    case "pdd":
                        return "拼多多";
                    case "jd":
                        return "京东";
                    case "sys":
                        return "线下";
                    default:
                        return this.platform_id;
                }
            }

            /**
             * 获取订单仓库名称
             */
            getWarehouse() {
                switch (this.warehouse_id) {
                    case "16556":
                        return "默认仓库";
                    case "16995":
                        return "夏振代发仓";
                    case "205540":
                        return "喵仙儿代发仓";
                    case "295691":
                        return "它集代发仓";
                    default:
                        return this.platform_id;
                }
            }

            /**
             * 标记订单为红色
             */
            mark() {
                this.dom.querySelector("div.module-trade-list-item-row1").setAttribute("style", "background-color: red;")
            }
        }

        /**
         * 订单列表信息
         */
        class Trades {
            constructor(selected = true) {
                this.trades = [];
                const selectors = selected ? "div.module-trade-list-item-selected" : "div.module-trade-list-item";
                const page = function () {
                    for (let page of document.querySelectorAll("div.keepalive-dom-container")) {
                        if (page.style.display !== 'none') { return page; }
                    }
                }();
                const trades = page.querySelectorAll(selectors);
                if (trades.length < 1) {
                    toast("未选中订单", true)
                }
                for (let trade of trades) {
                    const temp = new Trade(trade);
                    this.trades.push(temp);
                }
            }

            select(count = 1000, platforms = '', sub = false) {
                let i = 0;
                for (let t of this.trades) {
                    if (i >= count) {
                        if (t.isSelected) {
                            t.select(true)
                        }
                        continue;
                    }
                    // 排除非默认仓库
                    if (t.getWarehouse() !== "默认仓库") { continue; }
                    // console.log(platforms, '：', t.getPlatform())
                    if (platforms === '') {
                        t.select(sub);
                    } else if (platforms.includes(t.getPlatform())) {
                        t.select(sub);
                    } else if (t.isSelected) {
                        t.select(true)
                    }
                    if (t.isSelected) {
                        i++;
                    }
                }
                RC.showNewInfo(`已选择${i}个订单`)
            }
        }

        // 实例化工具条，所有按钮都方这上面
        const bar = new ToolBar()
        // bar.addButton("订单检查", checkOrders)
        bar.addButton("添加监听", add_observer)
        // 调整工具条宽度
        bar.autofit();

        async function checkOrders() {
            const trades = new Trades(false)
            let arr = [];
            for (const item of trades.trades) {
                if (!["邮政国内小包", "中国邮政"].includes(item.express)) {
                    console.log(`订单${item.system_id}${item.state}${item.express}非邮政，跳过`)
                    continue
                }
                if (POST_PAUSE_CITY.includes(item.state.substring(0, 2))) {
                    console.log(item.state + "属于邮政停发区，请修改")
                    arr.push(`${item.state}${item.system_id}`);
                    item.mark();
                } else {
                    console.log(`订单${item.system_id}${item.state}${item.express}正常`)
                }
            }
            if (arr.length > 0) {
                let sids = "";
                for (const id of arr) {
                    sids += `<p>${id}</p>`
                }
                RC.showFail(`<p>邮政停发区订单</p>${sids}<p>修改后，点击查询刷新</p>`)
                ttsplay("注意邮政停发订单");
                setTimeout(async () => await logging("停发统计", `已语音+弹窗提示，邮政停发区订单：${arr}`), 100);
            } else {
                RC.showSuccess("订单检查完成")
            }
        }

        function checkUrlToShow() {
            // 仅指定页面显示
            if (/trade\/printv2\/.*queryId=77/.test(document.URL)) {
                document.querySelector("div.xztoolbar").style.display = "";
                console.log("工具条已显示")
                setTimeout(() => {
                    add_observer();
                }, 5000);
            } else {
                document.querySelector("div.xztoolbar").style.display = "none";
                console.log("工具条已隐藏")
                return;
            }
            bar.autofit();
        }
        window.addEventListener('hashchange', checkUrlToShow)
        checkUrlToShow()

        async function logging(type, message) {
            await fetch("https://express.cpolar.top/xzlog", {
                method: "post", body: JSON.stringify({
                    "time": new Date().toJSON(),
                    "type": type,
                    "message": message
                })
            })
        }

        function add_observer() {
            const page = function () {
                for (let page of document.querySelectorAll("div.keepalive-dom-container")) {
                    if (page.style.display !== 'none') { return page; }
                }
            }();
            if (page.getAttribute("mywatch666") != null) {
                RC.showSuccess("检查器已存在")
                return
            }
            setTimeout(checkOrders, 3000);
            page.setAttribute("mywatch666", "11")
            const node = page.querySelector('div.J_TradeList_Body')
            const observer = new MutationObserver(async () => {
                console.log("订单列表变化，开始订单检查");
                checkOrders();
            });
            // 启动监听器，传入要监视的节点和配置对象
            // observer.observe(node, { attributes: true, childList: true, subtree: true });
            observer.observe(node, { childList: true });
            RC.showSuccess("订单检查器已添加!")
        }
    }

})();