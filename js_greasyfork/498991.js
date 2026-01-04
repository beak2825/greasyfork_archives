// ==UserScript==
// @name         gbtGame_Tool
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  GBT网站资源获取查询
// @author       byhgz
// @license      GNU GPLv3
// @match        http://gbtgame.ysepan.com/
// @require      https://greasyfork.org/scripts/462234-message/code/Message.js?version=1170653
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanzouw.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/498991/gbtGame_Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/498991/gbtGame_Tool.meta.js
// ==/UserScript==

//对Qmsg工具进行二次封装
const Tip = {
    success(text, config) {
        Qmsg.success(text, config);
    },
    info(text, config) {
        Qmsg.info(text, config);
    },
    error(text, config) {
        Qmsg.error(text, config);
    },
    loading(text, config) {
        return Qmsg.loading(text, config);
    },
    close(loading) {
        try {
            loading.close();
        } catch (e) {
            console.error(e);
            this.error("loading关闭失败！");
        }
    }
};


const Util = {
    /**
     * @returns {string} url
     */
    getWindowUrl() {
        return window.location.href;
    },
    /**
     * 导出文件
     * @param {String}content 内容
     * @param {String}fileName 文件名
     */
    fileDownload(content, fileName) {
        // 获取导出文件内容
        // 创建隐藏的下载文件链接
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        // 手动触发下载
        element.click();
        // 清理dom
        document.body.removeChild(element);
    },
    /**
     *注册一个菜单并返回菜单id，可在插件中点击油猴时看到对应脚本的菜单
     * @param {string}text 显示文本
     * @param {function}func 事件
     * @param {string}shortcutKey 快捷键
     * @return menu 菜单id
     */
    addGMMenu(text, func, shortcutKey = null) {
        return GM_registerMenuCommand(text, func, shortcutKey);
    },
    /**
     * 返回当前时间
     * @returns {String}
     */
    toTimeString() {
        return new Date().toLocaleString();
    },
};


const GBTGame = {
    data: {
        tempDataList: []
    },
    //验证数据
    verifyData() {
        if (this.data.tempDataList.length === 0) {
            const info = "请先获取页面所有游戏资源先！";
            Tip.error(info);
            alert(info);
            throw Error(info);
        }
    },
    init() {//初始化页面资源信息，用于获取资源操作
        if (!Util.getWindowUrl().includes("http://gbtgame.ysepan.com")) {
            alert("当前网站不是GBT乐赏游戏空间");
            return;
        }
        const loading = Tip.loading("正在获取中，请不要对当前网页进行其他操作！");
        const arrList = document.querySelectorAll("#menuList>*");
        let chickTempIndex = 0;
        this.data.tempDataList = [];
        const interval = setInterval(() => {
            if (arrList.length <= chickTempIndex) {
                loading.close();
                clearInterval(interval);
                alert("已点击完成！现在可以对资源进行获取和查找从操作了。ps：每次访问当前页面都需要初始化！");
                return;
            }
            const tempE = arrList[chickTempIndex++];
            const a = tempE.querySelector("a");
            const filesTime = a.text;
            a.click();
            const info = `已点击${filesTime}`;
            Tip.success(info);
            const p = new Promise((resolve) => {
                const interval01 = setInterval(() => {
                    let menuItem = tempE.querySelectorAll(".menu>*:not(.lxts)");
                    if (menuItem.length <= 1) {
                        return;
                    }
                    clearInterval(interval01);
                    resolve(menuItem);
                }, 15);
            });
            p.then((data) => {
                data.forEach((value) => {
                    const tempE = value.querySelector("a");
                    const data = {};
                    let tempTitle = tempE.text.trim();
                    data["title"] = tempTitle.substring(0, tempTitle.lastIndexOf("."));
                    data["url"] = tempE.getAttribute("href");
                    data["text"] = value.querySelector("b").textContent.trim();
                    this.data.tempDataList.push(data);
                });
            });
        }, 1000);
    },
    find(key) {
        const dataList = this.data.tempDataList;
        const findDataList = [];
        dataList.forEach(value => {
            if (!value.title.includes(key)) return;
            findDataList.push(value);
        });
        return findDataList;
    },
    getData() {
        this.verifyData();
        return this.data.tempDataList;
    },
    outPutFile() {
        const data = this.getData();
        const info = `已获取到${data.length}个资源，并将其打印在控制台和输出面板上！`;
        alert(info);
        Tip.success(info);
        Util.fileDownload(JSON.stringify(data, null, 3), `GBT乐赏游戏空间游戏磁力地址${data.length}个资源(${Util.toTimeString()}).json`);
    },
    outPutConsole() {
        const data = this.getData();
        console.log("===============================================")
        const info = `已获取到${data.length}个资源，并将其打印在控制台和输出面板上！`;
        console.log(info);
        alert(info);
        console.log(data);
        console.log("===============================================")
    },
    /**
     * 查找输入框，如有结果，则返回结果，否则返回null
     */
    findInput() {
        this.verifyData();
        const val = prompt("搜索关键词");
        if (val === null || val.trim() === "") {
            return null;
        }
        const findDataList = this.find(val);
        if (findDataList.length === 0) {
            alert(`未查到到关键词${val}的资源！`)
            return null;
        }
        return {key: val, data: findDataList};
    },
    findInputAndOutPut() {
        const data = this.findInput();
        if (data === null) return;
        const size = data.data.length;
        alert(`已获取到${size}个资源，准备导出到文件！`)
        console.log("===============================================")
        Util.fileDownload(JSON.stringify(data.data, null, 3), `GBT乐赏游戏空间游戏磁力地址${data.key}关键词(${Util.toTimeString()}).json`);
        console.log("===============================================")
    },
    findInputAndOutPutConsole() {
        const data = this.findInput();
        if (data === null) return;
        const size = data.data.length;
        alert(`已获取到${size}个资源，并将其打印在控制台和输出面板上！`)
        console.log("===============================================")
        console.log(`关键词${data.key}\t资源数量${size}`);
        console.log(data.data);
        console.log("===============================================")
    }
};


(function () {
    'use strict';
    Util.addGMMenu("初始化页面数据", () => GBTGame.init());
    Util.addGMMenu("导出页面数据到文件", () => GBTGame.outPutFile());
    Util.addGMMenu("导出页面数据到控制台", () => GBTGame.outPutConsole());
    Util.addGMMenu("查找资源并导出资源到文件", () => GBTGame.findInputAndOutPut());
    Util.addGMMenu("查找资源并导出资源到控制台", () => GBTGame.findInputAndOutPutConsole());
})();
