// ==UserScript==
// @name         我的常用js代码库
// @namespace    http://tampermonkey.net/
// @version      0.64
// @description  我常用的js代码库
// @author       zyb
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

class MyJSCodeLibrary {
    constructor() {

    }
    /**
     * 创建css样式
     * @param {string} styleStr css样式
     */
    createStyleFuc(styleStr = "") {
        // 创建style节点
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(styleStr));
        document.head.appendChild(style);
    }

    /**
     * 异步获取dom节点
     * @param {string} selector dom节点的选择器文本
     * @param {number} time 间隔时间
     * @returns
     */
    getDomByIntervalAsyncFuc(selector, time = 100) {
        let dom = document.querySelectorAll(selector)[0];
        let timeId = null;
        let times = 0;
        return new Promise((res) => {
            timeId = setInterval(() => {
                times++;
                if (dom || times > 10) {
                    res(dom);
                    clearInterval(timeId);
                } else {
                    dom = document.querySelectorAll(selector)[0];
                }
            }, time)
        })
    }

    /**
     * 异步获取dom节点
     * @param {string} selector dom节点的选择器文本
     * @param {number} time 间隔时间
     * @returns
     */
    getDomListByIntervalAsyncFuc(selector, time = 100) {
        let dom = document.querySelectorAll(selector)[0];
        let timeId = null;
        let times = 0;
        return new Promise((res) => {
            timeId = setInterval(() => {
                times++;
                if (dom.length || times > 10) {
                    res(dom);
                    clearInterval(timeId);
                } else {
                    dom = document.querySelectorAll(selector);
                }
            }, time)
        })
    }

    /**
     * 异步获取dom节点
     * @param {string} selector dom节点的选择器文本
     * @param {number} time 间隔时间
     * @returns
     */
    getDomByTimeoutAsyncFuc(selector = "", time = 2000) {
        return new Promise((res) => {
            setTimeout(() => {
                let dom = document.querySelectorAll(selector)[0];
                res(dom);
            }, time)
        })
    }

    /**
     * 异步获取dom节点
     * @param {string} selector dom节点的选择器文本
     * @param {number} time 间隔时间
     * @returns
     */
    getDomListByTimeoutAsyncFuc(selector = "", time = 2000) {
        return new Promise((res) => {
            setTimeout(() => {
                let dom = document.querySelectorAll(selector);
                res(dom);
            }, time)
        })
    }

    /**
     * 针对返回值为html时的解析函数
     * @param {Object} obj 请求头参数
     * 
     * {
     *      "charset": "gbk",
     *      "url": "https://www.88yydstxt426.com/s.php",
     *      "headers": {
     *          "content-type": "application/x-www-form-urlencoded",
     *      },
     *      "body": "objectType=2&type=articlename&s=%C3%C3%C3%C3",
     *      "method": "POST",
     * }
     */
    decodeHtmlAsyncFuc(obj = {}) {
        const url = obj.url || '';
        const headers = obj.headers || obj.header || {
            "content-type": "application/x-www-form-urlencoded",
        };
        const body = obj.body;
        const method = obj.method || 'GET';
        const charset = obj.charset || 'utf-8';
        let domArr = [];

        const decoder = new TextDecoder(charset);
        return fetch(url, {
            headers,
            body,
            method,
        }).then(response => {
            const reader = response.body.getReader();

            return reader.read().then(function process({ done, value }) {
                if (done) {
                    console.log('Stream finished');
                    return new Promise((res) => {
                        res(domArr);
                    });
                }

                // 解码数据
                const text = decoder.decode(value);
                const dom = document.createElement('div');
                dom.innerHTML = text;
                domArr.push(dom);

                return reader.read().then(process);
            });
        });
    }

    /**
     * 将值复制到剪贴板
     * @param {string} value 复制到剪贴板的值
     */
    copy(value = '') {
        if (!value) {
            return
        }
        navigator.clipboard.writeText(value);
    }

    /**
     * 监听函数，监听传入的对象的第一层字段值的变化
     */
    watch(dataObj, fuc) {
        const obj = { ...dataObj };

        //汇总对象中所有的属性形成一个数组
        const keys = Object.keys(dataObj);
        //遍历
        keys.forEach((k) => {
            Object.defineProperty(dataObj, k, {
                get() {
                    return obj[k];
                },
                set(val) {
                    console.log(`${k}被修改了，值为`, val);
                    fuc && fuc();
                    obj[k] = val;
                }
            })
        })
    }
}

if(!window.MyJSCodeLibrary){
    window.MyJSCodeLibrary = MyJSCodeLibrary;
}
