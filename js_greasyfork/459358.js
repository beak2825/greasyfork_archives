// ==UserScript==
// @name         快麦助手Local仓储版
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  快麦助手Local仓储版辅助
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erp.superboss.cc/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/459358/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E4%BB%93%E5%82%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/459358/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E4%BB%93%E5%82%A8%E7%89%88.meta.js
// ==/UserScript==

(function () {
    // 有需求需要变量逃逸到顶层
    //'use strict';

    // 扫描声音
    const scanRing = new Audio("https://erpb.superboss.cc/resources/media/scan.mp3");

    // 小工具
    function ttsplay(text) {
        RC.util.ttsplay(text);
        return text
    }

    function toast(msg) {
        RC.showNewInfo(msg)
        return msg
    }

    async function findElement(selector, count = 10, ms = 500) {
        let found = false
        for (let i = 0; i < count; i++) {
            console.log('find ' + selector + i)
            found = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(document.querySelector(selector) !== null);
                }, ms);
            })
            if (found) {
                console.log('got it ' + selector)
                break
            }
        }
        return found;
    }

    // 打包辅助
    function packHelper() {
        class ElementK {
            #selector = '';
            #dom = null;
            constructor(selector) {
                this.#selector = selector;
            }
            #reload() {
                this.#dom = this.#selector === '' ? null : document.querySelector(this.#selector);
            }

            get isNull() {
                this.#reload()
                return this.#dom === null;
            }
            get value() {
                this.#reload()
                return this.isNull ? "" : (['INPUT'].includes(this.#dom.nodeName) ? this.#dom.value : this.#dom.innerText);
            }
            get dom() {
                this.#reload()
                return this.#dom;
            }
        }
        // 9854923781765
        const input_express = new ElementK("input.outsid-no-input");
        const input_product = new ElementK("input.codeno-input");
        const span_out_id = new ElementK("div.pack-detail-outSid span.pack-express-value");
        const span_express = new ElementK("div.pack-express span.pack-express-value");
        const area_prodcuts = new ElementK("div.pack-prod-body");
        // 检查元素获取成功
        if (input_express.isNull || input_product.isNull || span_out_id.isNull || span_express.isNull || area_prodcuts.isNull) {
            RC.showFail("组件获取失败，刷新重试，一直提示请反馈");
            return;
        }
        //商品编码名称
        const products = {};
        // 快递单扫描后
        document.querySelector("input.outsid-no-input").onblur = async () => {
            console.log("onblur")
            if (input_express.value === "") {
                return;
            }
            // 查找订单信息更新
            const k = await new Promise((resolve) => {
                let id = setInterval(mission, 200);
                let count = 0;
                console.log("mission id =", id);
                function mission() {
                    console.log("find express", input_express.value, span_out_id.value)
                    if (span_out_id.value.includes(input_express.value)) {
                        clearInterval(id);
                        resolve(0);
                    }
                    if (count++ > 5) {
                        console.log("超时结束检测");
                        RC.showWarn("订单信息未加载");
                        clearInterval(id);
                        resolve(1);
                    }
                }
            })
            if (k > 0 && span_out_id.value === "") {
                return;
            }
            // 清空缓存包裹商品
            for (let key in products) {
                delete products[key];
            }
            // 获取快递名称
            const express_name = function () {
                const name = span_express.value;
                const exps = ['邮政', 'EMS', '申通', '德邦', '韵达', '极兔', '顺丰', '京广','中通'];
                for (let e of exps) {
                    if (name.includes(e)) {
                        return e;
                    }
                }
                return "其它"
            }();
            ttsplay(express_name + "包裹");

            // 获取商品
            const products_list = await new Promise((resolve) => {
                let id = setInterval(mission, 300);
                let count = 0;
                function mission() {
                    if (count++ > 5) {
                        clearInterval(id)
                        resolve(null)
                    }
                    const results = area_prodcuts.dom.querySelectorAll("div.pack-prod-item");
                    console.log(results)
                    if (results.length > 0) {
                        clearInterval(id)
                        resolve(results)
                    }
                }
            })
            if (products_list === null) {
                ttsplay("商品列表获取失败/无商品")
                return;
            }
            // 遍历提取商品编码名称
            for (let p of products_list) {
                let code = p.querySelector("span.prod-outsid");
                let name = p.querySelector("div.pack-prod-skus");
                if (!code || !name) { continue }
                code = code.innerText.split(' ', 1)[0];
                name = function (e) {
                    const li = e.indexOf("（");
                    const ri = e.lastIndexOf("）");
                    if (li < 0 || ri < 0) {
                        return e;
                    }
                    return e.substring(li + 1, ri);
                }(name.innerText);
                products[code.toUpperCase()] = name;
            }
            console.log(products);
        }

        document.querySelector("input.codeno-input").onchange = (evt) => {
            console.log(evt.target.value)
            const name = products[evt.target.value];
            if (name !== void 0) {
                // ttsplay(name);
                // console.log(name);
                scanRing.play();
            }
        }

        // 商品编码选择框
        const select_code = document.querySelector("div.ui-select-scanType");
        if (select_code !== null) {
            document.querySelector("div.ui-select-scanType").style.backgroundColor = "rgb(39,149,250)";
            document.querySelector("div.ui-select-scanType").style.color = "white";
        }
        ttsplay("包装辅助已加载");
    }

    GM_registerMenuCommand("包装验货", function () {
        if (!document.URL.includes("#/trade/package/")) {
            toast("请在包装验货界面使用！");
            return;
        }
        packHelper();
    });

})();