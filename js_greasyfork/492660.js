// ==UserScript==
// @name         AB站网页背景更改
// @namespace    SakuraBackgroundScript
// @description  AB站背景更改油猴脚本，支持交互式背景选择和存储。
// @icon         http://github.smiku.site/sakura.png
// @license      MIT
// @version      1.0.0.8
// @author       SakuraMikku
// @copyright    2023-2099, SakuraMikku
// @QQgroup      793513923
// @QQgroup      https://jq.qq.com/?_wv=1027&k=0ewDiWw1
// @grant        GM_xmlhttpRequest
// @bilibili     https://space.bilibili.com/29058270
// @github       https://github.com/wuxintlh/
// @githubBoke   https://wuxintlh.github.io
// @acfun        https://www.acfun.cn/u/57391284
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        *www.bilibili.com/*
// @match        *://*.bilibili.com/*
// @match        *message.bilibili.com/*
// @match        *t.bilibili.com/*
// @match        *manga.bilibili.com/*
// @match        *live.bilibili.com/blackboard/*
// @match        *www.bilibili.com/page-proxy/*
// @match        *www.acfun.cn/*
// @match        *.acfun.cn/*
// @exclude      *live.bilibili.com/p/html/live-lottery/*
// @exclude      *message.bilibili.com/pages/nav/index_new_pc_sync*
// @exclude      *t.bilibili.com/pages/nav/index_new*
// @exclude      *member.bilibili.com/x2/creative/*
// @exclude      *member.bilibili.com/video/*
// @exclude      *ink.bilibili.com/p/center/course/index.html*
// @exclude      *www.bilibili.com/v/pay/charge*
// @exclude      *message.acfun.cn/*
// @exclude      *www.bilibili.com/bangumi*
// @exclude      *account.bilibili.com/account/*
// @exclude      *cm.bilibili.com/quests/*
// @exclude      *member.bilibili.com/platform*
// @exclude      *pay.bilibili.com/pay-v2-web*
// @downloadURL https://update.greasyfork.org/scripts/492660/AB%E7%AB%99%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/492660/AB%E7%AB%99%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9.meta.js
// ==/UserScript==

"use strict";

//#region 全局数据存储
//默认背景地址
var defaultBackgroundURLS = [
    "https://img2.imgtp.com/2024/04/19/36tGMJgW.png",
    "https://img2.imgtp.com/2024/04/19/1lWtTop9.png",
    "https://img2.imgtp.com/2024/04/19/JffVHaEc.png",
    "https://img2.imgtp.com/2024/04/19/BipHyk4y.png"
];
//#region 用于动态获取背景地址 待完成
/**
 * @name getDefaultBackgroundURLS
 * @description 获取默认背景地址
 */
async function getDefaultBackgroundURLS(url = "") {
    try {
        let res = await fetchJSON(url);
        if (res) {
            return res.data.list;
        }
    } catch (err) {
        logSakuraBackgroundInfo("error", `在获取默认背景地址时出错:${err}`);
        return null;
    }
}
/**
 * @name fetchJSON
 * @description 发送请求获取JSON数据
 * @param {*} url
 * @param {*} method
 * @returns
 */
async function fetchJSON(url, method = 'GET') {
    try {
        const res = await fetch(url, { method });
        return res.ok ? await res.json() : null;
    } catch (err) {
        logSakuraBackgroundInfo("error", `在发送请求时出错:${err}`);
        return null;
    }
}
//#endregion
//#endregion

window.onload = () => {
    try {
        //初始化脚本
        firstTimeInfoAlert();
        //设置延时
        setTimeout(() => {
            //初始化
            init();
        }, 5);
        logSakuraBackgroundInfo("info", "脚本加载完成");
    } catch (e) {
        logSakuraBackgroundInfo("info", "脚本加载失败");
        logSakuraBackgroundInfo("error", e);
        logSakuraBackgroundInfo("info", "对上方报错信息截图反馈作者");
    }
}
//#region 封装方法
/**
 * @name init
 * @description 脚本一些内容的初始化
 *
 */
function init() {
    //对ab站检测
    let isAB = window.location.host.includes("bilibili.com") ? 'bili' : 'acfun';
    //初始化脚本更改盒子
    let backgroundMainElement, rootBody = $('body');
    //获取ab站的初始化节点
    if (isAB == 'bili') {
        if ($('#app').length > 0) {
            backgroundMainElement = $('#app');
        } else if ($('#main').length > 0) {
            backgroundMainElement = $('#main');
        } else {
            backgroundMainElement = $('body');
        }
    } else if (isAB == 'acfun') {
        backgroundMainElement = $('body');
    }
    //对盒子进行初始化
    // let sakuraBackgroundBox = document.createElement('div');
    // let showSakuraBackgroundBox = document.createElement('div');
    let rootDiv = document.createElement('div');
    //初始化盒子的样式
    // showSakuraBackgroundBox.id = 'showSakuraBackgroundBox';
    // sakuraBackgroundBox.id = 'sakuraBackgroundBox';
    rootBody.append(rootDiv);
    rootDiv.innerHTML = `
    <div id="showSakuraBackgroundBox" alt="点击弹出修改背景的窗口">
        背景更改
    </div>
    <div id="sakuraBackgroundBox">
        <div class="defaultImg">
            <ul>
                <li><img src="" alt="默认背景"></li>
                <li><img src="" alt="默认背景"></li>
                <li><img src="" alt="默认背景"></li>
                <li><img src="" alt="默认背景"></li>
            </ul>
        </div>
        <div class="imgUrl">
            <input type="text" class="bcgUrl" placeholder="请输入背景图片地址">
            <button class="bcgUrlChange">点击修改背景</button>
        </div>
        <div class="imgLocal">
            <input type="file" name="" id="" class="bcgImgLocal" accept="image/*">
            <button class="bcgLocalChange">点击修改背景</button>
        </div>
        <div class="infoHandle">
            <button class="handleInfoBtn">手动提示信息</button>
            <button class="handleInfoBtn">手动删除背景存储</button>
        </div>
    </div>
    `
    let sakuraBackgroundCssStyles = `
    #showSakuraBackgroundBox {
        display: block;
        position: fixed;
        max-width: 10vw;
        min-width: 9vw;
        height: 24px;
        background-color: rgb(137, 204, 231);
        bottom: 0;
        left: 0;
        z-index:999;
        font-size: 1.75rem;
        font-weight: bold;
        padding-left: 6px;
        border-top-right-radius: 14PX;
        color: #333;
        user-select: none;
        line-height:24px;
        padding-left:24px;
    }

    #sakuraBackgroundBox {
        width: 480px;
        height: auto;
        min-height: 480px;
        max-height: 600px;
        position: fixed;
        bottom: 24px;
        z-index:999;
        display: none;
        background-color: aquamarine;
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
    }

    #sakuraBackgroundBox .defaultImg ul {
        margin-top: 24px;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(2, 2fr);
        align-items: center;
        justify-content: center;
    }

    #sakuraBackgroundBox .defaultImg ul li {
        width: 180px;
        height: 120px;
        background-color: #ccc;
        margin-top: 12px;
        margin-left: 16px;
        border-radius: 24px;
    }

    #sakuraBackgroundBox .defaultImg ul li img {
        width: 100%;
        height: 100%;
        border-radius: 24px;
    }

    #sakuraBackgroundBox .imgUrl {
        margin-top: 24px;
        width: 100%;
        height: 60px;
        display: flexbox;
    }

    #sakuraBackgroundBox .imgUrl input {
        width: 60%;
        height: 24px;
        margin-left: 12px;
        font-size: 18px;
        border-radius: 12px;
    }

    #sakuraBackgroundBox .imgUrl button {
        width: 28%;
        height: 48px;
        font-size: 18px;
        border-radius: 12px;
    }

    #sakuraBackgroundBox .imgLocal {
        width: 100%;
        height: 60px;
        margin-top: 24px;
        display: flexbox;
    }

    #sakuraBackgroundBox .imgLocal input {
        width: 60%;
        height: 36px;
        font-size: 18px;
        margin-left: 12px;
    }

    #sakuraBackgroundBox .imgLocal button {
        width: 28%;
        height: 48px;
        font-size: 18px;
        border-radius: 12px;
    }

    #sakuraBackgroundBox .infoHandle {
        width: 100%;
        height: auto;
    }

    #sakuraBackgroundBox .infoHandle .handleInfoBtn {
        width: 120px;
        height: 18px;
        font-size: 1rem;
        font-weight: bold;
    }
    `;
    //对每个img下的src赋值
    let imgList = document.querySelectorAll('.defaultImg ul li img');
    for (let i = 0; i < imgList.length; i++) {
        imgList[i].src = defaultBackgroundURLS[i];
        //对每个img添加onclick事件
        imgList[i].addEventListener('click', function () {
            defaultChangeBackground(imgList[i].src)
        });
    }

    //将样式导入到页面中
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(sakuraBackgroundCssStyles);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(sakuraBackgroundCssStyles));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
    //初始化盒子中的脚本
    //显示或隐藏按钮
    let showSakuraBackgroundBoxNode = $('#showSakuraBackgroundBox')[0];
    showSakuraBackgroundBoxNode.addEventListener('click', showSakuraBackgroundBox);
    //以url修改背景按钮
    let bcgUrlChangeNode = $('.bcgUrlChange')[0];
    bcgUrlChangeNode.addEventListener('click', changeBackgroundByUrl);
    //以base64修改背景按钮
    let bcgLocalChangeNode = $('.bcgLocalChange')[0];
    bcgLocalChangeNode.addEventListener('click', changeBackgroundByBase64);
    //handleInfoBtn两个按钮
    let handleInfoBtnNodes = document.querySelectorAll('.handleInfoBtn');
    handleInfoBtnNodes[0].addEventListener('click', alertInfoByHandle);
    handleInfoBtnNodes[1].addEventListener('click', delBackgroundByHandle);

    //#region 盒子中需要的脚本的封装方法
    /**
     * @name showSakuraBackgroundBox
     * @description 显示或隐藏背景更改盒子
     */
    function showSakuraBackgroundBox() {
        //获取sakuraBackgroundBox
        let sakuraBackgroundBox = $('#sakuraBackgroundBox');
        //获取sakuraBackgroundBox当前display
        let display = sakuraBackgroundBox.css('display');
        if (display == 'block') {
            sakuraBackgroundBox.css('display', 'none');
        } else {
            sakuraBackgroundBox.css('display', 'block');
        }
    }
    /**
     * @name defaultChangeBackground
     * @description 默认背景切换
     * @param {String} src
     */
    function defaultChangeBackground(src) {
        //调用setSakuraBackground修改背景
        setSakuraBackground(src, isAB);
        //调用logSakuraBackgroundInfo
        logSakuraBackgroundInfo("info", "背景修改成功");
        //调用storageAPI存储图片地址
        storageAPI(src, "add");
    }
    /**
     * @name changeBackgroundByUrl
     * @description url修改背景
     */
    function changeBackgroundByUrl() {
        let url = $('.bcgUrl').val();
        if (!url) {
            alert("请输入一张图片地址")
        } else {
            setSakuraBackground(url, isAB);
            //调用logSakuraBackgroundInfo
            logSakuraBackgroundInfo("info", "背景修改成功");
            //调用storageAPI存储图片地址
            storageAPI(url, "add");
        }
    }
    /**
     * @name changeBackgroundByBase64
     * @description 修改背景为base64格式的图片
     */
    function changeBackgroundByBase64() {
        //获取input中图片
        let file = $('.bcgImgLocal')[0].files[0];
        //将图片数据转换为base64
        let render = new FileReader();
        if (file) {
            //读取图片数据
            render.readAsDataURL(file);
            render.onloadend = function () {
                //设置背景
                setSakuraBackground(render.result, isAB);
                //调用logSakuraBackgroundInfo
                logSakuraBackgroundInfo("info", "背景修改成功");
                //调用storageAPI存储图片
                storageAPI(render.result, "add")
            }
        } else {
            alert("请上传一张图片");
        }
    }
    /**
     * @name alertInfoByHandle
     * @description 手动触发信息提示框
     */
    function alertInfoByHandle() {
        firstTimeInfoAlert(true)
    }
    /**
     * @name delBackgroundByHandle
     * @description 手动触发删除背景
     *
     */
    function delBackgroundByHandle() {
        storageAPI("", "del");
        alert("删除成功");
    }

    //#endregion

    //初始化背景
    let stAPI = storageAPI("", "get")
    stAPI.then(res => {
        if (res) {
            setSakuraBackground(res, isAB);
        } else {
            setSakuraBackground(defaultBackgroundURLS[0], isAB);
        }
        logSakuraBackgroundInfo("info", "初始化背景完成");
    });

}



/**
 * @name firstTimeInfoAlert
 * @description 第一次进入提示
 */
function firstTimeInfoAlert(manualOperation = false) {
    if (manualOperation == false) {
        let firstTime = localStorage.getItem("SakuraBackgroundScriptFirstTimeInfo");
        //脚本自动提示
        if (!firstTime) {
            //未提示过,则提示使用
            localStorage.setItem("SakuraBackgroundScriptFirstTimeInfo", true);
            alert(`欢迎使用SakuraBackground脚本\n这是第一次使用脚本的提示\n以后不会再提醒\n出现问题截图控制台报错信息然后联系作者\n可以在油猴脚本下评论和反馈问题\n或者加群,b站私信等`);
        }
        //已经提示过,则不会再提示
    } else {
        //手动提示
        alert(`欢迎使用SakuraBackground脚本\n这是第一次使用脚本的提示\n以后不会再提醒\n出现问题截图控制台报错信息然后联系作者\n可以在油猴脚本下评论和反馈问题\n或者加群,b站私信等`);
    }

}

/**
 * @name localStorageAPI
 * @description 用于本地存储(localStorage)的的API
 * @returns JSON
 */
function localStorageAPI() {
    const dbName = 'backgroundURL';
    const storeName = 'SakuraBCUrl';
    //不支持indexedDB使用localStorage
    /**
     * @name addBackgroundURL
     * @description 用于存储背景url或base64
     * @param {string} url
     * @returns JSON数据
     */
    const addBackgroundURL = function (url) {
        try {
            //获取url长度
            let urlLength = url.length;
            //如果长度大于剩余空间则直接返回空间不足
            let remainingSpace = 5 * 1024 * 1024 - new Blob([JSON.stringify(localStorage)]).size
            if (url.length > remainingSpace) {
                throw new Error('localStorage剩余容量不够使其保存图片base64格式或图片地址');
            }
            //如果可以存下,则直接存储
            if (localStorage.setItem(storeName, url)) {
                return {
                    "status": true,
                    "message": "保存成功"
                };
            } else {
                throw new Error('存储时存在错误,原因可能为剩余容量不够');
            }

        } catch (error) {
            logSakuraBackgroundInfo("error", error);
            return {
                "status": false,
                "message": "存储失败"
            };
        }
    }
    /**
     * @name getBackgroundURL
     * @description 获取背景url或base64
     * @returns 背景url或base64
     */
    const getBackgroundURL = function () {
        //获取url
        let url = localStorage.getItem(storeName);
        return url;
    }
    /**
     * @name deleteBackgroundURL
     * @description 删除背景url或base64
     * @returns JSON数据
     */
    const deleteBackgroundURL = function () {
        //删除url
        if (localStorage.removeItem(storeName)) {
            return {
                "status": true,
                "message": "删除成功"
            }
        } else {
            return {
                "status": false,
                "message": "删除失败"
            }
        }
    }
    return {
        addBackgroundURL: addBackgroundURL,
        getBackgroundURL: getBackgroundURL,
        deleteBackgroundURL: deleteBackgroundURL
    }
}

//#region indexedDB数据API及其异步调用的封装
/**
 * @name dbopen
 * @description 用indexedDB存储数据API
 * @returns
 */
async function dbopen() {
    const dbName = 'backgroundURL';
    const storeName = 'SakuraBCUrl';

    try {
        // 使用 async/await 替代事件监听
        const dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onerror = function (event) {
                reject(new Error("indexedDB打开失败: " + event.target.error));
            };

            request.onblocked = function (event) {
                reject(new Error("indexedDB打开被阻止"));
            };

            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "id" });
                }
            };

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });

        const db = await dbPromise;

        // 定义数据库操作方法
        function addBackgroundURL(url) {
            //设置一个5MB大小的分片
            let chunkSize = 5 * 1024 * 1024;
            let chunks = [];
            //对chunks赋值
            for (let i = 0; i < url.length; i += chunkSize) {
                chunks.push(url.slice(i, i + chunkSize));
            }
            //调用deleteBackgroundURL删除所有分片
            this.deleteBackgroundURL();

            //创建事务
            let transaction = db.transaction([storeName], "readwrite");
            //获取objectStore
            let objectStore = transaction.objectStore(storeName);
            //遍历chunks,存入indexedDB中
            chunks.forEach(function (chunk, index) {
                objectStore.add({ id: index, data: chunk });
            });
            return {
                "status": true,
                "message": "保存成功"
            };

        }

        function getBackgroundURL() {
            return new Promise((resolve, reject) => {
                // 获取所有分片
                let transaction = db.transaction([storeName], "readonly");
                // 获取objectStore
                let objectStore = transaction.objectStore(storeName);
                // 获取所有分片
                let request = objectStore.getAll();

                // 监听成功事件
                request.onsuccess = function (event) {
                    // 获取结果
                    let result = event.target.result;
                    let url = "";
                    // 遍历result, 拼接url
                    result.forEach(function (chunk) {
                        url += chunk.data;
                    });
                    // 解析Promise并返回url
                    resolve(url);
                };

                // 监听错误事件
                request.onerror = function (event) {
                    logSakuraBackgroundInfo("error", "获取背景url或base64失败");
                    reject(new Error("获取背景url或base64失败"));
                };
            });
        }

        function deleteBackgroundURL() {
            return new Promise((resolve, reject) => {
                // 创建事务
                let transaction = db.transaction([storeName], "readwrite");
                // 获取objectStore
                let objectStore = transaction.objectStore(storeName);

                // 监听事务完成事件
                transaction.oncomplete = function () {
                    // 当事务完成时，解析Promise并返回成功消息
                    resolve({
                        "status": true,
                        "message": "删除成功"
                    });
                };

                // 监听事务错误事件
                transaction.onerror = function (event) {
                    // 当事务出错时，拒绝Promise并返回错误信息
                    reject(new Error("删除背景URL失败: " + event.target.error.message));
                };

                // 删除所有分片
                objectStore.clear();
            });
        }

        function closeIndexedDB() {
            // 关闭数据库连接
            if (db) {
                db.close();
            }
        }

        // 返回包含数据库操作方法的对象
        return {
            addBackgroundURL,
            getBackgroundURL,
            deleteBackgroundURL,
            closeIndexedDB
        };
    } catch (error) {
        logSakuraBackgroundInfo("error", error.message);
        throw error; // 抛出异常，以便调用者知道发生了错误
    }
}
async function addBCGURL(url) {
    const dbMethods = await dbopen();
    try {
        // 调用 addBackgroundURL 方法添加背景URL
        let res = await dbMethods.addBackgroundURL(url);
        logSakuraBackgroundInfo("info", res.message);
    } catch (e) {
        logSakuraBackgroundInfo("error", e)
    } finally {
        dbMethods.closeIndexedDB();
    }
}
async function getBCGURL() {
    const dbMethods = await dbopen();
    try {
        let res = await dbMethods.getBackgroundURL();
        return res;
    } catch (e) {
        logSakuraBackgroundInfo("error", e)
    } finally {
        dbMethods.closeIndexedDB();
    }
}
async function delBCGURL() {
    const dbMethods = await dbopen();
    try {
        let res = await dbMethods.deleteBackgroundURL();
        logSakuraBackgroundInfo("info", res.message)
    } catch (e) {
        logSakuraBackgroundInfo("error", e)
    } finally {
        dbMethods.closeIndexedDB();
    }
}

//#endregion

/**
 * @name storageAPI
 * @description 封装存储API
 * @param {String} url 
 * @param {String} method 
 * @example
 * storageAPI("testurl","add")=>res
 * storageAPI("testurl","get")=>res
 * storageAPI("testurl","del")=>res
 */
function storageAPI(url, method) {
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!indexedDB) {
        //不支持indexedDB,则调用localStorageAPI存储背景图片
        let localst = localStorageAPI();
        if (method == 'add') {
            let res = localst.addBackgroundURL(url);
            logSakuraBackgroundInfo("info", res.message)
        } else if (method == 'get') {
            return localst.getBackgroundURL();
        } else if (method == 'del') {
            return localst.deleteBackgroundURL();
        }

    } else {
        //支持则使用indexedDB存储背景图片
        if (method == 'add') {
            addBCGURL(url);
        } else if (method == "get") {
            return getBCGURL();
        } else if (method == "del") {
            delBCGURL();
        }
    }
}


/**
 * @name getBackgroundURL
 * @description 更改背景图片主脚本
 * @param {String} url 
 * @param {String} isAB 
 */
function setSakuraBackground(url, isAB) {
    let rootNode, sakuraBackgroundNode;
    if (isAB == "bili") {
        if ($('#app').length > 0) {
            //视频,个人页面等
            //将节点设定为#app
            rootNode = $('#app');
            //将节点css修改为指定样式
        } else if ($('#i_cecream').length > 0) {
            //网站主页
            rootNode = $('#i_cecream');
        } else if ($('.p-relative main').length > 0) {
            //评论区
            rootNode = $('.p-relative main');
            //评论区卡片透明
            let nodes = document.querySelectorAll('.feed-card>.content>div');
            if (nodes) {
                for (let i = 0; i < nodes.length; i++) {
                    let childNode = nodes[i].children[0];
                    childNode.style.setProperty('background-color', 'rgba(255, 255, 255, 0.2)', 'important');
                }
            }
        } else {
            if ($('#sakuraBackground').length > 0) {
                //如果已经创建节点,则获取节点
                sakuraBackgroundNode = $('#sakuraBackground');
            } else {
                //未创建节点,则创建节点
                sakuraBackgroundNode = document.createElement('div');
                document.querySelector('body').appendChild(sakuraBackgroundNode);
                sakuraBackgroundNode.id = "sakuraBackground";
            }
            //将节点css修改为指定样式
            sakuraBackgroundNode = $('#sakuraBackgroundNode');
            console.log("sakuraBackgroundNode", sakuraBackgroundNode)
            sakuraBackgroundNode.css({
                "background": "url(" + url + ") no-repeat center center / 100% 100%",
                'zIndex': '-1',
                'webkitBackgroundSize': 'cover',
                'backgroundAttachment': 'fixed',
                "width": "100%",
                "height": "100%",
                "top": "0",
                "left": "0",
            })
            sakuraBackgroundNode.style.backgroundSize = "100% 100%";
        }
        rootNode.css({
            "background": "url(" + url + ") no-repeat center center / 100% 100%",
            'webkitBackgroundSize': 'cover',
            'backgroundAttachment': 'fixed',
        })
        rootNode[0].style.backgroundSize = "100% 100%";
    } else if (isAB == "acfun") {
        if ($('.home-main-content').length > 0) {
            //网站主页
            //将节点设定为.home-main-content
            rootNode = $('.home-main-content');
            //将节点css修改为指定样式
        } else if ($('.search__main').length > 0) {
            //搜索
            rootNode = $('.search__main');
        } else if ($('div.list-container').length > 0) {
            //直播
            rootNode = $('div.list-container');
        } else if ($('#main').length > 0) {
            //视频页面
            rootNode = $('#main');
        } else if ($('#app .layout').length > 0) {
            //个人页面
            rootNode = $('#app .layout');
        } else if ($('#ac-space').length > 0) {
            //他人页面
            rootNode = $('#ac-space');
        } else {
            if ($('#sakuraBackground').length > 0) {
                //如果已经创建节点,则获取节点
                sakuraBackgroundNode = $('#sakuraBackground')
            } else {
                //未创建节点,则创建节点
                sakuraBackgroundNode = document.createElement('div');
                document.querySelector('body').appendChild(sakuraBackgroundNode);
                sakuraBackgroundNode.id = "sakuraBackground";
            }
            sakuraBackgroundNode = $('#sakuraBackgroundNode');
            sakuraBackgroundNode.css({
                "background": "url(" + url + ") no-repeat center center / 100% 100%",
                "backgroundAttachment": 'fixed',
                "zoom": '1',
                "width": '100%',
                "height": '100%',
                "top": '0',
                "left": '0',
                "webkitBackgroundSize": 'cover',
                "zIndex": '-1'
            })
            sakuraBackgroundNode.style.backgroundSize = "100% 100%";
        }
        //将节点css修改为指定样式
        rootNode.css({
            "background": "url(" + url + ") no-repeat center center / 100% 100%",
            'webkitBackgroundSize': 'cover',
            'backgroundAttachment': 'fixed',
        })
        //由于jq无法修改backgroundSize，所以使用原生js设置BackgroundSize
        rootNode[0].style.backgroundSize = "100% 100%";
    }
}
/**
 * @name logSakuraBackgroundInfo
 * @description 输出日志
 * @param {string} type
 * @param  {...string} obj
 * @return noreturn
 */
function logSakuraBackgroundInfo(type, ...objs) {
    //设置日志信息
    let date = new Date();
    let strs = `[SakuraBackgroundScript] ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    //输出日志
    console[type](strs, objs);
}

/**
 * @name newScriptInfoHttpGet
 * @description 用于获取脚本更新信息
 */
async function newScriptInfoHttpGet() {
    //localstorage获取时间戳
    let localTime = localStorage.getItem('SakuraBackgroundScriptInfoTime');

    try {
        //发送http请求获取data数据
        let response = await fetchJSON('https://example.com/script-info');

        //对比时间戳
        if (response.data.serverTime > localTime) {
            //如果服务器的时间戳大于本地时间戳，则alert一个脚本更新信息
            alert('脚本更新信息：\n' + response.data.message);

            //更新本地时间戳
            localStorage.setItem('SakuraBackgroundScriptInfoTime', response.timestamp);
        }
    } catch (error) {
        //如果在发送请求时发生错误，我们使用try-catch语句捕获错误，并使用logSakuraBackgroundInfo函数记录错误信息。
        logSakuraBackgroundInfo('Error', error);
    }
}



//#endregion