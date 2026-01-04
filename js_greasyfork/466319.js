// ==UserScript==
// @name         天猫申诉中心-赔付统计
// @namespace    https://appeal.taobao.com/appeal3/portal/appealable
// @version      2.0.1
// @description  赔付统计
// @author       You
// @match        https://appeal.taobao.com/appeal3/*
// @icon         https://icons.duckduckgo.com/ip2/taobao.com.ico
// @grant    GM_registerMenuCommand
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/466319/%E5%A4%A9%E7%8C%AB%E7%94%B3%E8%AF%89%E4%B8%AD%E5%BF%83-%E8%B5%94%E4%BB%98%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/466319/%E5%A4%A9%E7%8C%AB%E7%94%B3%E8%AF%89%E4%B8%AD%E5%BF%83-%E8%B5%94%E4%BB%98%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    function ttsplay(text) {
        var utterThis = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterThis);
    }
    /**
     * 页面确认
     */
    class PageCheck {
        /**
         * 工单列表页面
         * @returns {boolean}
         */
        static isListPage() {
            return document.URL.includes("appeal.taobao.com/appeal3/portal/appealable");
        }
        /**
         * 工单详情页面
         * @returns {boolean}
         */
        static isDetailPage() {
            return document.URL.includes("appeal.taobao.com/appeal3/single_details");
        }
    }

    /**
     * 页面的操作，切换第几页
     */
    class Pages {
        #selector = "button.next-pagination-item";
        #list = [];
        constructor() {
            this.#list = document.querySelectorAll(this.#selector);
        }
        /**
         * 检测页面按钮是否存在
         * @returns {boolean}
         */
        check() {
            return this.#list.length > 0;
        }

        /**
         * 切换页面
         * @param {number} pg_id 
         * @returns {Promise<number>} 0是正常的，其他都是异常
         */
        async switch(pg_id) {
            let catched = false;
            // console.log("#list:", this.#list)
            for (let bt of this.#list) {
                if (bt.getAttribute("aria-label").includes(`第${pg_id}页`)) {
                    catched = true;
                    console.log(`点击第${pg_id}页`)
                    bt.click();
                    break;
                }
            }
            if (!catched) {
                console.log(`不存在第${pg_id}页`);
                return -1;
            }
            await new Promise((resolve) => {
                const m_id = setInterval(() => {
                    func(this)
                }, 500);
                let m_count = 0;
                function func(t) {
                    console.log("确认页面序号...");
                    // console.log(t.current, ",", pg_id)
                    if (t.current === pg_id) {
                        console.log(`已切换到第${pg_id}页`);
                        clearInterval(m_id);
                        resolve(0);
                    }
                    if (m_count++ > 5) {
                        console.log(`超时退出序号检测`);
                        clearInterval(m_id);
                        resolve(-2);
                    }
                }
            })
            return 0;
        }

        /**
         * 获取当前所在页面的序号
         * @returns {number} 序号
         */
        get current() {
            for (let bt of this.#list) {
                if (bt.className.includes("next-current")) {
                    return Number(bt.querySelector("span.next-btn-helper").innerText);
                }
            }
            return -1;
        }
    }

    /**
     * 工单列表中的一行
     */
    class AfsLine {
        #dom_type = null;
        #dom_id = null;
        #dom_date = null;
        #dom_dos = null;
        /**
         * 
         * @param {HTMLElement} dom 
         */
        constructor(dom) {
            const list = dom.querySelectorAll("td.next-table-cell");
            this.#dom_type = list[0];
            this.#dom_id = list[1];
            this.#dom_date = list[3];
            this.#dom_dos = list[4];
        }
        /**
         * @returns {string} 订单编号
         */
        get id() {
            const text = this.#dom_id.innerText;
            return text.startsWith("订单:") ? text.replace("订单:", '') : '';
        }
        /**
         * @returns {string} 工单类型
         */
        get type() {
            const text = this.#dom_type.innerText;
            return text;
        }
        /**
         * @returns {string} 工单日期
         */
        get date() {
            const text = this.#dom_id.innerText;
            return text;
        }
        /**
         * 点击查看详情
         */
        click() {
            const bts = this.#dom_dos.querySelectorAll("button");
            for (let bt of bts) {
                if (bt.innerText.includes("查看详情")) {
                    console.log("进入" + this.id + "详情")
                    bt.click();
                    break;
                }
            }
        }
    }

    /**
     * 工单列表
     */
    class AfsList {
        #selector = "tbody.next-table-body tr.next-table-row";
        #list = [];
        constructor() {
            this.#list = document.querySelectorAll(this.#selector);
        }
        /**
         * 检查工单列表获取是否成功
         * @returns {boolean} 
         */
        check() {
            return this.#list.length > 0;
        }
        /**
         * 根据订单号进入工单详情
         * @param {string} id 订单号
         */
        switch(id) {
            for (let afs of this.#list) {
                const temp = new AfsLine(afs);
                if (temp.id === id) {
                    temp.click();
                    break;
                }
            }
        }
        /**
         * 订单号的列表
         * @returns {Array<string>}
         */
        get list() {
            const result = [];
            for (let afs of this.#list) {
                const temp = new AfsLine(afs);
                if (temp.id !== '') {
                    result.push(temp.id);
                }
            }
            return result;
        }
    }

    // 读取工单信息
    async function loadAfs(copy_this = false) {
        // 确认在工单详情页面
        if (!PageCheck.isDetailPage()) { return; }
        // 读取页面信息
        let box = document.querySelector("#microapp-container");
        let temp = {};
        let divs = box.querySelectorAll("div");
        for (let d of divs) {
            if (d.className.includes("productInfo_text")) {
                temp.topText = d.firstChild.innerText;
                temp.descText = d.lastChild.innerText;
            } else if (d.className.includes("detail_column")) {
                let label = d.firstChild.innerText.replace("：", "");
                let value = d.lastChild.innerText.replace("复制", "");
                temp[label] = value;
            }
        }
        console.log(temp);
        if (temp.赔付类型 != undefined) {
            let result = `${temp.赔付时间}\t${temp.赔付类型}\t="${temp.订单编号}"\t${temp.赔付金额.replace("元", "")}\t${temp.descText}\t${temp.topText}\t${temp.赔付原因}\n`;
            GM_setValue(temp.订单编号, result);
            if (copy_this) {
                GM_setClipboard(result);
                console.log("已复制：" + result);
            }
        } else {
            console.log("非自动赔付，已跳过");
        }
        // 返回
        document.querySelectorAll("div.next-box button")[1].click();
        console.log("返回列表...");
        await new Promise((resolve) => {
            const id = setInterval(func, 1000);
            let count = 0;
            function func() {
                const ps = new Pages();
                if (PageCheck.isListPage()) {
                    console.log("已返回到列表页");
                    clearInterval(id);
                    resolve(0);
                }
                if (count++ > 5) {
                    console.log("已尝试5次，退出");
                    clearInterval(id);
                    resolve(-1);
                }
            }
        });
    }

    // 进行页面判断，进入指定详情
    async function clickTrade(page, trade) {
        // 确认在订单列表页面
        if (!PageCheck.isListPage()) { return; }
        // 检查页面，不对进行翻页
        const pgs = new Pages();
        if (pgs.current !== page) {
            pgs.switch(page);
        }
        // 检查翻页结果
        const r0 = await new Promise((resolve) => {
            const id = setInterval(func, 1000);
            let count = 0;
            function func() {
                const ps = new Pages();
                if (ps.current === page) {
                    console.log("已进入第" + page + "页")
                    clearInterval(id);
                    resolve(0);
                }
                if (count++ > 5) {
                    console.log("已尝试5次，退出")
                    clearInterval(id);
                    resolve(-1);
                }
            }
        });
        // 翻页失败，退出
        if (r0 !== 0) { return; }
        // 读取订单列表，进入指定详情
        const trades = new AfsList();
        trades.switch(trade);
        // 检查详情进入成功
        const r1 = await new Promise((resolve) => {
            const id = setInterval(func, 1000);
            let count = 0;
            function func() {
                if (PageCheck.isDetailPage()) {
                    console.log("已进入" + page + "详情")
                    clearInterval(id);
                    resolve(0);
                }
                if (count++ > 5) {
                    console.log("已尝试5次，退出")
                    clearInterval(id);
                    resolve(-1);
                }
            }
        })
        if (r1 !== 0) { return; }
        await loadAfs();
    }

    async function main() {
        if (!PageCheck.isListPage()) {
            console.log("不是订单列表界面");
            return;
        }
        const page_id = Number(prompt("输入页码", 1));
        if (isNaN(page_id)) {
            console.log("页码不合法");
            return;
        }
        const trades = function () {
            const afs = new AfsList();
            return afs.list;
        }();
        if (trades.length < 1) {
            console.log("没有可复制的订单");
            return;
        }
        console.log("共" + trades.length + "个赔付订单")
        console.log(trades);
        // 遍历需要提取的订单
        let result = "";
        for (let trade of trades) {
            await clickTrade(page_id, trade);
            result += `${GM_getValue(trade, "")}`;
        }
        console.log(result);
        // navigator.clipboard.writeText(result);
        GM_setClipboard(result);
        ttsplay("复制任务结束");
        console.log("复制任务结束");
    }

    class ButtonCopy {
        #id = "";
        #name = "";
        #func = null;
        constructor(id, name, func) {
            this.#id = id;
            this.#name = name;
            this.#func = func;
        }
        #check() {
            return document.querySelector("#" + this.#id) !== null;
        }
        add() {
            console.log("添加按钮:" + this.#name)
            if (this.#check()) {
                console.log("按钮已存在:" + this.#name)
                return;
            }
            const bt = document.createElement("span");
            bt.id = this.#id;
            bt.style.paddingRight = "15px";
            bt.style.cursor = "pointer";
            bt.innerText = this.#name;
            bt.onclick = this.#func;
            document.querySelector("div.top_bar").appendChild(bt);
            console.log("已添加按钮:" + this.#name)
        }
        remove() {
            console.log("移除按钮:" + this.#name)
            if (!this.#check()) {
                console.log("按钮不存在:" + this.#name)
                return;
            }
            document.querySelector("#" + this.#id).remove();
            console.log("已移除按钮:" + this.#name)
        }
    }

    let bt_single = new ButtonCopy("copy_single_1", "复制单个数据", () => {
        if (!PageCheck.isDetailPage()) {
            alert("只能在工单详情使用");
        }
        loadAfs(true);
    })

    let bt_list = new ButtonCopy("copy_single_2", "复制列表数据", () => {
        if (!PageCheck.isListPage()) {
            alert("只能在工单列表使用");
        }
        main();
    })

    function addButton() {
        bt_list.add();
        bt_single.add();
    }

    GM_registerMenuCommand("添加按钮", addButton);
    GM_registerMenuCommand("移除按钮", () => {
        bt_list.remove();
        bt_single.remove();
    });


    setTimeout(addButton, 5000);

})();