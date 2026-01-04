// ==UserScript==
// @name         哔哩哔哩工具[快捷键|视频时长]
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  快捷键【c】打开关闭弹幕，跳过充电鸣谢，自动下一个，视频时长统计
// @author       maple
// @match        https://www.bilibili.com/*
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @require      https://unpkg.com/maple-lib@1.0.2/log.js
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431734/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B7%A5%E5%85%B7%5B%E5%BF%AB%E6%8D%B7%E9%94%AE%7C%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/431734/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B7%A5%E5%85%B7%5B%E5%BF%AB%E6%8D%B7%E9%94%AE%7C%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%5D.meta.js
// ==/UserScript==
"use strict";

let logger = Logger.log("debug")

class Handler {

    constructor(videoList) {
        this.videoList = videoList;
    }

    execute() {
        let curLookInx = this.getCurrentLookVideoIndex();

        // 获取所有时间以及未观看时间 的 二维数组表示形式
        let allVideoTimeArr = this.getVideoListTimeArr(0);
        let unLookVideoTimeArr = this.getVideoListTimeArr(curLookInx);

        // 格式化视频总时间数组 [小时,分钟]
        let videoSumTimeArr = this.listTimeArrFormat(allVideoTimeArr);
        // 格式化未看视频时间数组 [小时,分钟]
        let unLookVideoSumTimeArr = this.listTimeArrFormat(unLookVideoTimeArr);

        // 渲染标签
        Handler.renderTimeTag(videoSumTimeArr, unLookVideoSumTimeArr, this.getUnLookVideoCount(curLookInx));
    }

    /**
     * 获取当前正在观看视频索引
     */
    getCurrentLookVideoIndex() {
    }

    /**
     * 获取未观看视频个数
     * @param curIndex 当前观看视频索引
     * @returns {number} 未观看视频个数
     */
    getUnLookVideoCount(curIndex) {
        return this.videoList.length - curIndex;
    }

    /**
     * 获取视频列表时间的二维数组
     * @param index 从索引位置开始获取
     * 格式如下：
     * [
     * 视频1：[小时, 分钟，秒]
     * 视频2：[小时, 分钟，秒]
     * ]
     */
    getVideoListTimeArr(index) {
    }

    /**
     * 视频列表获取到的二维数组时间格式化汇总
     * @param timeTwoArray
     * @returns {(number|number|string)[]} 格式：[小时, 分钟]
     */
    listTimeArrFormat(timeTwoArray) {

        //如果为0没有数据，就出错了
        logger.debug("视频列表长度：" + timeTwoArray.length);

        let h = 0, m = 0, s = 0;
        for (let i = 0; i < timeTwoArray.length; i++) {
            h += Number(timeTwoArray[i][0]);
            m += Number(timeTwoArray[i][1]);
            s += Number(timeTwoArray[i][2]);
        }

        //将秒转换为分钟
        let m1 = Math.floor(s / 60);
        m += m1;

        //分钟转换为小时
        let temp = m / 60;
        let h1 = Math.floor(temp);

        //小于一小时的转换为分钟
        let m2 = ('0.' + String(temp).split('.')[1]) * 60;


        //最终结果
        h += h1;
        m = Math.floor(m2);

        //分钟出现NaN,原因是因为没有分钟，全是小时，直接赋值
        if (isNaN(m)) {
            m = "00";
        }

        logger.debug("小时：" + h);
        logger.debug("分钟：" + m);
        return [h, m];
    }

    /**
     * 渲染时间标签
     * @param all 所有时间一维数组 格式：[小时,分]
     * @param undone 未完成时间一维数组 格式：[小时,分]
     * @param unLookCount 为观看视频个数
     */
    static renderTimeTag(all, undone, unLookCount) {
        //找到显示面板
        let plain = document.getElementsByClassName("video-info-detail")[0];
        try {
            plain.removeChild()
        } catch (e) {
            logger.debug("移除异常")
        }

        let data_tag = document.getElementById("data_tag");

        let isNull = data_tag === null;

        //没有创建过这个标签就创建
        if (isNull) {
            //创建
            data_tag = document.createElement("span");
            logger.debug("创建标签：", data_tag)
            //id赋值，用于下次更新查找
            data_tag.setAttribute("id", "data_tag");
            data_tag.style = '\n' +
                '    background-color: #24c7b4;\n' +
                '    color: white;\n' +
                '    font-size: -0.9rem;\n' +
                '    text-align: center;\n' +
                '    margin-top: 100rem;\n' +
                '    margin-bottom: 100rem;\n' +
                '    padding:0.5rem;\n' +
                '    cursor: pointer;\n' +
                '    border-radius: 1rem;\n' +
                '    ';
        }

        //写入html
        data_tag.innerHTML = show_Str();

        //数据添加到面板
        if (isNull) {
            plain.appendChild(data_tag);
        }


        function show_Str() {
            let all_time = "总时长：" + all.join(' : ');
            let undone_time = "  未观看：" + undone.join(' : ');
            let num = "  未看个数：" + unLookCount;

            return all_time + undone_time + num;
        }
    }
}


/**
 * 合集视频
 */
class HeJiHandler extends Handler {
    getCurrentLookVideoIndex() {
        for (let i = 0; i < this.videoList.length; i++) {
            let videoEle = this.videoList[i];
            if (videoEle.querySelector(".video-episode-card__info-playing")) {
                return i;
            }
        }

        logger.error("未获取到索引")
    }

    getVideoListTimeArr(index) {
        let resultTwoArr = []
        for (let i = index; i < this.videoList.length; i++) {
            let videoEle = this.videoList[i];
            let videoTimeStr = videoEle.querySelector(".video-episode-card__info-duration").innerHTML;

            let child_array = videoTimeStr.split(":");
            if (child_array.length < 3) {
                //数组首部添加0
                child_array.unshift('0');
            }
            resultTwoArr.push(child_array);
        }

        return resultTwoArr;
    }
}

/**
 * 分批视频
 */
class FenPHandler extends Handler {
    getCurrentLookVideoIndex() {
        let index = 0;
        logger.debug("视频列表：", this.videoList)
        for (let i = 0; i < this.videoList.length; i++) {
            //当前观看的视频
            let current = this.videoList[i];
            //延迟之后获取class值

            let class_name = current.className;

            //当前观看
            if (class_name === 'watched on' || class_name === 'on') {
                logger.debug("当前视频索引：" + index)
                return i;
            }
        }
        logger.error("未查询到索引")
        return index;
    }

    getVideoListTimeArr(index) {
        //如果没有这个参数(用于统计总时长)
        if (index === undefined) {
            index = 0;
        }
        let parent_array = [];
        for (let i = index; i < this.videoList.length; i++) {
            let durationDivTag = this.videoList[i].querySelector(".duration");
            logger.debug("单个视频时长标签:", durationDivTag)
            //每个视频的时长
            let duration = durationDivTag.innerHTML;

            //添加到数组
            let child_array = duration.split(":");
            if (child_array.length < 3) {
                //数组首部添加0
                child_array.unshift('0');
            }
            parent_array.push(child_array);

        }
        return parent_array;
    }
}

class HandlerFactor {

    static getHandler(videoType, videoList) {
        if (videoType === 1) {
            return new FenPHandler(videoList);
        } else if (videoType === 2) {
            return new HeJiHandler(videoList);
        }

        throw "视频类型异常";
    }
}

window.onload = function () {
    logger.info("B-Tools运行中")
    // 第一次延迟两秒执行，等待视频列表渲染
    setTimeout(main, 2000)
    // 后续10秒执行，更新时间
    setInterval(main, 10000)
}


function main() {
    let videoType = isLoadedGetVideoType();
    logger.debug("视频类型：" + (videoType === 1 ? "分批视频" : "合集视频"))
    if (!videoType) {
        logger.info("bTools-不是视频列表;结束")
        return;
    }
    let videoList = getVideoList();

    sleepCallbackExecute(200).then(() => {
        HandlerFactor.getHandler(videoType, videoList).execute();
    })
}

function getVideoList() {
    let nodeList = document.querySelector('.list-box');

    // 合集视频
    let nodeList1 = document.querySelector('.video-section-list');

    if (nodeList) {
        return nodeList.childNodes;
    }
    if (nodeList1) {
        return nodeList1.childNodes;
    }
}

function isLoadedGetVideoType() {
    // 分p视频
    if (document.querySelector('.list-box')) {
        return 1;
    }
    // 合集视频
    if (document.querySelector('.video-section-list')) {
        return 2;
    }
}

function sleepCallbackExecute(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


////////////////////////////////快捷键///////////////////////////////////////
//注册【c】按钮监听
window.onkeydown = function(ev){
    //ev表示onkeydown事件对象，63为字母 c
    if(ev.keyCode===67){
        let input = document.querySelector(".bui-danmaku-switch-input");
        input.click();
    }
}