// ==UserScript==
// @name         学习公社自动学习
// @namespace    http://tampermonkey.net/
// @version      2025-06-05
// @description  全自动学习学习公社的视频，没有倍速功能
// @author       Whaleplane
// @match        https://www.ttcdw.cn/p/*
// @icon         https://www.ttcdw.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538382/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/538382/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

async function main() {
    await sleep(5000); // 页面加载延时
    console.log("等待页面加载完毕");
    const currentUrl = window.location.href;
    if (currentUrl.includes('p/uc/myClassroom')) {
        // 列表页
        console.log('当前页面为列表页');
        await listPage();
    } else if (currentUrl.includes('p/course/v')) {
        // 视频页
        console.log('当前网址为视频页。');
        await videoPage();
    } else {
        console.log('未定义页面')
    }
}

// 列表页脚本
async function listPage() {
    for (const courseSet of document.querySelectorAll('div.item-one')) {
        courseSet.click();
        console.log('检查', courseSet.textContent, '...')
        await sleep(1000);

        // 找到要学的课程
        let lessonListSpan = Array.from(document.querySelectorAll('.total')).find(span => span.textContent.trim() === '学习中');
        console.log('检查“学习中”列表...');
        lessonListSpan.click();
        await sleep(1000); // 选项卡切换延时
        let firstRow = document.querySelector('tbody > tr.el-table__row');
        // “学习中”为空
        if (firstRow === null) {
            lessonListSpan = Array.from(document.querySelectorAll('.total')).find(span => span.textContent.trim() === '未学习');
            console.log('检查“未学习”列表...');
            lessonListSpan.click();
            await sleep(1000);
            firstRow = document.querySelector('tbody > tr.el-table__row')
        }
        // “未学习”为空
        if (firstRow === null) {
            continue;
        }

        // 开始学习课程
        console.log(`即将学习：《${firstRow.querySelector('span.course-name').textContent}》`);
        firstRow.querySelector('a.btn.study-btn').click();
        const time = firstRow.querySelector('td:nth-child(2) > div.cell > div').textContent.trim().split(':');
        const playedRatio = firstRow.querySelector('div.el-progress__text').textContent.replace('%', '') / 100;
        const totalSeconds = (time[0] * 3600 + time[1] * 60 + +time[2]) * (1 - playedRatio);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds % 3600 / 60);
        const seconds = Math.floor(totalSeconds % 60);
        console.log('等待播放时间：', `${hours}:${minutes}:${seconds}`);
        await sleep(totalSeconds*1000);
        // 预计播放完成
        console.log('页面将在45秒后刷新...');
        await sleep(45000);
        location.reload();
    }
    console.log('已经学习完成');
}

// 视频页脚本
async function videoPage() {
    // 查找第一个未播放完的子视频
    const contents = Array.from(document.querySelector('.nano-content').querySelectorAll('.four'));
    for (let completmentRatio of contents) {
        if (completmentRatio.innerText != '100%') {
            completmentRatio.click();
            break;
        }
    }

    // 播放
    await sleep(2000); // 加载视频延时
    let mainVid = document.querySelector('video');
    mainVid.muted = true;
    mainVid.play();

    // 检查播放进度
    setInterval(checkStatus, 10000);
}

function checkStatus() {
    // 检查多页面告警，如果有，关闭当前页面
    let multiPageAlartClose = document.querySelector('div.layui-layer-page > div.layui-layer-btn > a.layui-layer-btn0');
    if (multiPageAlartClose !== null) {
        multiPageAlartClose.click();
    }

    // 检查播放进度，如果播放完毕，关闭页面
    const mainVid=document.querySelector("video");
    if (!document.querySelector('.nano-content').lastElementChild.querySelector('.video-title').classList.contains('on')) {
        console.log('还未播放到最后一个子视频')
    }else if (mainVid.currentTime === mainVid.duration) {
        console.log('视频已经学完，即将关闭当前窗口');
        window.close();
    } else {
        console.log('已经播放了', mainVid.currentTime.toFixed(2), '秒,还剩', (mainVid.duration-mainVid.currentTime).toFixed(2), '秒');
    }

    // 防止视频暂停
    mainVid.muted = true;
    mainVid.play()
}

// 脚本入口
main();

// 保持原有的 sleep 函数不变
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}