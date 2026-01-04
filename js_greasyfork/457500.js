// ==UserScript==
// @name         国家中小学智慧教育平台::zxx.edu.cn
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  莞易学东莞慕课教师培训平台
// @author       CosilC; panda8z; Lynn
// @match        https://www.zxx.edu.cn/*
// @icon         https://www.zxx.edu.cn/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/457500/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%3A%3Azxxeducn.user.js
// @updateURL https://update.greasyfork.org/scripts/457500/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%3A%3Azxxeducn.meta.js
// ==/UserScript==




console.log('script loaded');
let hrefCache = location.href;
let curHrefIntervalList = [];
let firstrefresh = true;
let hrefChangeWatcher = setInterval(() => {
    if (location.href != hrefCache) {
        console.log('href had changed!');
        hrefCache = location.href;
        init();
    }
}, 100);

init();

function init() {
    if (location.href.includes('/train/trainee/courseStudyMain.action')) {
        //课程内容章节目录页
        console.log('进入章节目录');
        //getSectionUnfinishedList()[0]?.click();
        nodeLoadingWatcher('.tier3').then(() => {
            let sectionUnfinishedList = getSectionUnfinishedList();
            console.log(sectionUnfinishedList)
            if (sectionUnfinishedList.length > 0) {
                sectionUnfinishedList[0].click();
            }
        })
    } else if (location.href.includes('/train/trainee/courseware.action')) {
        //课程学习页
        console.log('进入课程学习');
        nodeLoadingWatcher('div.video-wrap').then(() => {
            handleCourseContent();
        })
    }
}

/**
 * 课程学习页
 */
function handleCourseContent() {
    let curSectionTitle = document.querySelector(`h1`).innerText;
    //继续学习弹窗监测
/*     setCurHrefInterval(() => {//未处理
        let continueBtn = getNodeByText('继续学习', '[aria-label=提示] button', false);
        if (continueBtn && continueBtn.offsetParent) {
            console.log('检测到 继续学习弹框');
            continueBtn.click();
        }
    }) */
    //学习进度提示弹窗监测
/*     setCurHrefInterval(() => {
        let confirmBtn = document.querySelector(`[id=panelWindow_confirm] a.abtn-blue.submit`);
        if (confirmBtn) {
            console.log('检测到 学习完成提示弹框');
            confirmBtn.click();
        }
    }) */
    setCurHrefInterval(() => {
        let confirmNode = document.querySelector(`#panelWindow_confirm`);
        //let t =  confirmNode.querySelector(`.abtn-blue.submit`);
        if (confirmNode.style.display != "none") {
            console.log('检测到 学习完成提示弹框');
            confirmNode.querySelector(`.abtn-blue.submit`).click();
        }
    })
/*     //禁止多个视频一起观看弹窗监测
    setCurHrefInterval(() => {//未处理
        let confirmBtn = getNodeByText('确定', '[aria-label=提示] button', false);
        if (confirmBtn && confirmBtn.offsetParent) {
            console.log('检测到 禁止多个视频一起观看弹窗监测');
            location.reload();
        }
    }) */
    // //章节全部完成监测
    // setCurHrefInterval(() => {
    //     if (getNodeByText('课程内容', '[role=menuitem]', false).querySelector('.el-icon-success')) {
    //         console.log('该课程已经全部完成');
    //         clearCurHrefInterval();
    //         getNodeByText('课程内容', '[role=menuitem]', false).querySelector('.el-icon-success').click();
    //     }
    // })
    // 小节完成监测
/*     setCurHrefInterval(() => {//未处理
        if (getSectionFinished()) {
            console.log(`${curSectionTitle}  小节已完成，正在跳转回课程主页`);
            let indexBtn = getNodeByText('课程内容', '[role=menuitem]', false);
            if(indexBtn){
                indexBtn.click();
            }
        }
        else if (getTabFinished())
        {
           
            console.log(`${curSectionTitle}  标签页已完成，正在跳到下一标签页`);
            let TabUnfinishedList = getTabUnfinishedList();
            console.log(TabUnfinishedList)
            if (TabUnfinishedList.length > 0) {
                TabUnfinishedList[0].click();
            }
        }
        else
        {
            firstrefresh = true;
        }
    }); */
    //视频播放监测
    setCurHrefInterval(() => {
        let videoNode = document.querySelector(`video`);
        let tempNode = document.getElementById(`videoPlayer`).childNodes[0].childNodes[3];
        if (videoNode || !tempNode) {
            if(!videoNode.onended){
                videoNode.onended = () =>{
                    let indexBtn = getNodeByText('返回课程学习', '*', false);
                    if(indexBtn){
                        indexBtn.click();
                    }
                }
            }
            if (videoNode.paused) {
                console.log('继续播放');
                tempNode.click();;
            }
            if (!videoNode.muted || videoNode.volume) {
                videoNode.muted = true;
                videoNode.volume = 0;
            }
        } else {
            console.log('开始播放');
            tempNode.click();
        }
    })
    //题目弹框监测
/*     setCurHrefInterval(() => {
        let queBreakDialog = document.querySelector('[aria-label="节点做题"]');
        if (queBreakDialog && queBreakDialog.offsetParent) {
            console.log('检测到 题目弹框');
            let btnArr = document.querySelectorAll(`[aria-label=节点做题] button span`);
            btnArr[0].click();
            btnArr[1].click();
        }
    }) */
}


/**
 * 获取当前课程列表中未完成的小节列表
 * 
 * @returns {array} 小节未完成列表
 */
function getSectionUnfinishedList() {
        let temp = Array.from(document.querySelectorAll(`.tier-tree-two:not([style='border-bottom: 0px;']) .tier3`));
        let temp2 = temp.filter(v => ((v.innerText.search("未完成")) != -1) );
        let temp3 = temp2.map(v => v.querySelector(`a`));
        return temp3;
}

/**
 * 获取当前课程列表中未完成的小节列表
 *
 * @returns {array} 小节未完成列表
 */
/* function getTabUnfinishedList() {
    // Array.from(document.querySelectorAll(`.courseList .el-row`)).filter(v => v.querySelector(`.el-tag--info`)).innerText == '未完成').map(v => v.querySelector('.flR'))
    return Array.from(document.querySelectorAll(`.el-tabs .el-tag--info`));
    / *.filter(v => {
        let tag = null;
        return (tag = v.querySelector(`.el-tag--info`)) ? tag.innerText == '未完成' : false
    }).map(v => v.querySelector('.flR'));* /
}
 */


/**
 * 获取当前小节完成状态
 * 
 * @returns {boolean} 小节完成状态
 */
/* function getSectionFinished() {
    return document.querySelector(`[role=tablist] [role=tab].is-top .el-tag--info`) ? false : true;
    //return document.querySelector(`[role=tablist] [role=tab].is-active .el-tag--success`) ? true : false;
} */

/**
 * 获取当前顶部标签页完成状态
 *
 * @returns {boolean} 顶部标签页完成状态
 */
/* function getTabFinished() {
    //return document.querySelector(`[role=tablist] [role=tab].is-top .el-tag--info`) ? false : true;
    return document.querySelector(`.abtn-blue .submit`) ? true : false;
} */

/**
 * 跳转下一节
 */
/* function nextSection() {
    getNodeByText('下一节', 'button').click();
    setCurHrefInterval(() => {
        let confirmBtn = getNodeByText('确定', '[aria-label=章节切换] button')
        if (confirmBtn && confirmBtn.offsetParent != null) {
            confirmBtn.click();
        }
    }, 100);
} */

/**
 * 获取给定文本和选择器对应的首个节点
 * 
 * @param {string} text 目标文本
 * @param {string} cssSelector css选择器
 * @param {boolean} allEqual 全等
 * @return {domNode}文本和选择器对应的首个节点
 */
function getNodeByText(text, cssSelector = '*', allEqual = true) {
    let targetNodeList = [];
    return (targetNodeList = getNodeListByText(text, cssSelector, allEqual)) ? targetNodeList[0] : null;
}

/**
 * 获取给定文本和选择器对应的节点列表
 * 
 * @param {string} text 目标文本
 * @param {string} cssSelector css选择器
 * @param {boolean} allEqual 全等
 * @return {array(domNode)} 文本和选择器对应的节点列表 没有时返回null
 */
function getNodeListByText(text, cssSelector = '*', allEqual = true) {
    let targetNodeList = [];
    return (targetNodeList = Array.from(document.querySelectorAll(cssSelector)).filter(v => allEqual ? v.innerText == text : v.innerText.includes(text))).length > 0 ? targetNodeList : null;
}

/**
 * 设置一个只在当前href生效的定时器
 * @param {function} fn 
 * @param {integer} interval
 */
function setCurHrefInterval(fn, interval = 1000) {
    let intervalNum = setInterval(() => {
        if (location.href != hrefCache) {
            clearCurHrefInterval();
        } else {
            fn();
        }
    }, interval);
    curHrefIntervalList.push(intervalNum);
    return intervalNum;
}

/**
 * 清空curHrefIntervalList内所有定时器
 */
function clearCurHrefInterval() {
    while (curHrefIntervalList.length) {
        clearInterval(curHrefIntervalList.pop());
    }
}



/**
 * 等待目标节点加载
 * @param {string} cssSelector css选择器
 * @return {Promise} resolve:目标节点
 */
function nodeLoadingWatcher(cssSelector) {
    return new Promise((resolve) => {
        let targetNode = null;
        let intervalObj = setInterval(() => {
            if (targetNode = document.querySelector(cssSelector)) {
                clearInterval(intervalObj);
                resolve(targetNode);
            }
        })
    })
}