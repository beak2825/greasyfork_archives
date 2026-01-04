// ==UserScript==
// @name         网易云歌单逆序器
// @description  将源歌单的歌曲以逆序加入目标歌单。打开源歌单页面，点击“逆序”按钮，选择目标歌单。
// @version      0.2.0
// @author       hiroi-sora
// @namespace    https://github.com/hiroi-sora
// @match        *://music.163.com/playlist?id=*
// @match        *://music.163.com/my/*
// @icon         http://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg
// @supportURL   https://github.com/hiroi-sora/NeteaseCloudMusic-SongList-Reverse
// @homepageURL  https://github.com/hiroi-sora/NeteaseCloudMusic-SongList-Reverse
// @downloadURL https://update.greasyfork.org/scripts/448475/%E7%BD%91%E6%98%93%E4%BA%91%E6%AD%8C%E5%8D%95%E9%80%86%E5%BA%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448475/%E7%BD%91%E6%98%93%E4%BA%91%E6%AD%8C%E5%8D%95%E9%80%86%E5%BA%8F%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("逆序器初始化1：脚本加载");

    // 等待元素加载 探测间隔
    const waitLoadInterval = 50;
    // 等待元素加载 探测次数
    const waitLoadTimes = 200;

    // 添加歌曲间隔时间，毫秒
    var defaultIntervalTime = 100;
    // 添加失败重试 延时初始值
    const defaultErrWaitTime = 30000;
    // 添加失败重试 延时增幅
    const defaultErrWaitTimeAdd = 5000;

    // 探测网易云返回的消息
    const msgSuccess = "收藏成功";
    const msgExist = "歌曲已存在！";

    // 主iframe，动态获取
    var contentFrame;


    // 通过xpath获取节点
    const getNodeXpath = (xpath, document, contextNode = null) => {
        if (contextNode == null) contextNode = document;
        let xresult = document.evaluate(xpath, contextNode, null, XPathResult.ANY_TYPE, null);
        let xnodes = [], xres;
        while (xres = xresult.iterateNext()) { xnodes.push(xres); }
        return xnodes;
    }

    // 反复执行getFunc直到返回非false，然后执行workFunc
    const tryFunc = (getFunc, workFunc) => {
        // 执行第一次
        const data = getFunc();
        if (data) { // 空数组是true，因此workFunc内要先将空数组转布尔
            workFunc(data);
            return;
        }
        // 反复尝试执行
        let nowTimes = 1; // 尝试次数
        let timer = setInterval(() => {
            const data = getFunc();
            if (data) {
                // console.log("    try"+nowTimes)
                clearInterval(timer);
                workFunc(data);
            }
            else if (++nowTimes > waitLoadTimes) { // 超过次数
                console.log("    try fail" + getFunc)
                clearInterval(timer);
            }
        }, waitLoadInterval);
    }

    // 等待xpath元素加载，成功则执行func
    const waitLoadXpath = (xpath, document, func, contextNode = null) => {
        const getNode = () => {
            const node = getNodeXpath(xpath, document, contextNode);
            return node.length == 0 ? false : node; // 空数组转布尔
        }
        tryFunc(getNode, func);
    }


    // 前期准备
    const readyReverseSongList = () => {
        // 1.获取并按下第一首歌的收藏按钮
        const btnsWorkFunc = (node) => {
            console.log("逆序器准备1：获取第一首歌按钮");
            node[0].click();
            // 1.1.删除“+新歌单”栏，修改标题
            const newListNode = getNodeXpath('//div[@class="zcnt"]/div/div[@class="tit j-flag"]', contentFrame)
            if (newListNode.length) {
                newListNode[0].remove();
            }
            const titleNode = getNodeXpath('//div[@class="zttl f-thide"]', contentFrame)
            if (titleNode.length) {
                titleNode[0].innerHTML = "逆序添加到歌单";
            }
            // 2.为每个歌单栏添加点击监听
            const addSongListClickListener = (songListNode) => {
                console.log("逆序器准备2：为每个歌单栏添加点击监听");
                const songListOnClick = () => { }
                for (let i = 0, len = songListNode.length; i < len; i++) {
                    songListNode[i].addEventListener("click", startReverseSongList.bind(this, i));
                }
            }
            waitLoadXpath('//div[@class="zcnt"]/div/div[@class="j-flag"]/ul/li', contentFrame, addSongListClickListener)
        }
        waitLoadXpath("//tbody/tr[1]/td[3]/div/span[1]", contentFrame, btnsWorkFunc)
    }

    // 开始任务。传入要添加到的歌单的序号(0开始)
    const startReverseSongList = (listIndex) => {
        const songNodes = getNodeXpath("//tbody/tr/td[3]/div/span[1]", contentFrame);
        const songLen = songNodes.length;
        console.log("逆序器任务1：开始将" + songLen + "首歌逆序添加到第" + (listIndex + 1) + "个歌单")

        var errWaitTime = defaultErrWaitTime; // 每失败一次，等待时间增加

        const addSong = (songIndex) => {
            if (songIndex > songLen - 1) {
                alert("歌单逆序任务完成。");
                return;
            }
            // 点击添加，点击目标歌单
            songNodes[songIndex].click();
            const goSongListNodes = getNodeXpath('//div[@class="zcnt"]/div/div[@class="j-flag"]/ul/li', contentFrame);
            if (goSongListNodes.length == 0) { // 版权限制无法转歌单。跳过本首
                console.log("第" + (songIndex + 1) + "/" + songLen + "版权限制无法添加歌单")
                setTimeout(() => { addSong(songIndex + 1) }, defaultIntervalTime); // 下一首
                return;
            }
            goSongListNodes[listIndex].click();
            // 探测成功与否
            const checkAddSuccess = (msgNode) => {
                const msg = msgNode[0].data
                switch (msg) {
                    case msgSuccess: // 成功
                        console.log("第" + (songIndex + 1) + "/" + songLen + "添加成功")
                        errWaitTime = defaultErrWaitTime;
                        setTimeout(() => { addSong(songIndex + 1) }, defaultIntervalTime); // 下一首
                        break;
                    case msgExist: // 已存在（成功）
                        console.log("第" + (songIndex + 1) + "/" + songLen + "已存在")
                        errWaitTime = defaultErrWaitTime;
                        setTimeout(() => { addSong(songIndex + 1) }, defaultIntervalTime); // 下一首
                        break;
                    default:
                        console.log("  添加失败，将在" + errWaitTime + "毫秒后重试")
                        setTimeout(() => { addSong(songIndex) }, errWaitTime); // 本首
                        errWaitTime += defaultErrWaitTimeAdd;
                        return;
                }
            }
            waitLoadXpath('//div[@class="sysmsg"]/span/text()', contentFrame, checkAddSuccess)
        }
        addSong(0); // 第0首歌也重复添加一次，防止第一次漏
    }

    // 初始化
    const init = () => {
        // 1.尝试获取contentFrame
        const getContentFrame = () => {
            try {
                // contentFrame=window.frames.contentFrame.document;
                // 脚本本身已在contentFrame的层级里？
                contentFrame = document;
                // 获取到contentFrame且body加载成功，则返回true
                return getNodeXpath('/html/body/div[1]', contentFrame).length > 0;
            }
            catch (err) {
                console.log(err)
                return false
            }
        }
        const workFunc = () => {
            console.log("逆序器初始化2：获取contentFrame");

            // 2.尝试获取按钮板
            const btnsWorkFunc = (node) => {
                console.log("逆序器初始化3：获取按钮板");
                // 3.添加按钮和监听按钮被移除
                const btnsNode = node[0];
                const addMyBtn = () => {
                    if (getNodeXpath('//*[@id="flag_reverse"]', contentFrame).length != 0) {
                        return; // 检查按钮是否已存在，是则不再添加
                    }
                    console.log("逆序器初始化4：添加按钮")
                    let btn = document.createElement("div");
                    btn.innerHTML = '<a id="flag_reverse" class="u-btni u-btni-fav u-btni-fav-dis1"><i>逆序</i></a>';
                    btn.onclick = readyReverseSongList;
                    btnsNode.appendChild(btn);
                }
                addMyBtn(); // 添加一次
                // 配置监听按钮板变化，若按钮被移除则再次添加
                btnsNode.addEventListener('DOMSubtreeModified', () => addMyBtn(), false);
            }
            waitLoadXpath('//*[@class="btns f-cb"]', contentFrame, btnsWorkFunc)
        }
        tryFunc(getContentFrame, workFunc);
    }
    init()

})();