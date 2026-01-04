// ==UserScript==
// @name         GUET自动评教(Alpha)
// @namespace    https://www.guet.edu.cn/
// @version      0.1.2
// @description  用于桂林电子科技大学教务系统自动评教
// @author       匿名
// @match        *://172.16.13.22/*
// @match        *://bkjw.guet.edu.cn/*
// @match        *://v.guet.edu.cn/http/77726476706e69737468656265737421f2fc4b8b69377d556a468ca88d1b203b/*
// @match        *://v.guet.edu.cn/http/77726476706e69737468656265737421a1a013d2766626012d46dbfe/*
// @icon         https://s2.loli.net/2021/12/08/2j1hkxNpoDcrGvi.png
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436780/GUET%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%28Alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436780/GUET%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%28Alpha%29.meta.js
// ==/UserScript==

const version = 'v0.1.2'

// 给老师的评语
let evaluations = {
    prefix: [
        '认真负责',
        '很好',
        '太可爱了',
        '非常好',
        '非常和蔼',
        '很和蔼',
        '和蔼可亲',
        '非常喜欢笑',
        '总是微笑着',
        '让人感到非常的温暖',
        '非常可爱',
        '很善良',
        '很和善也非常可爱',
        '讲课很有水平',
        '的讲课很有水平',
        '很亲和',
        '非常温柔',
        '非常有爱心',
        '很亲近学生',
        '平时兢兢业业',
        '平时勤勤恳恳',
        '教导有方',
        '循循善诱',
        '教学一丝不苟',
        '是我们的良师益友',
        '对待教学良工心苦',
        '会因材施教',
        '为我们的教育呕心沥血',
        '比较严格',
        '教学过程中尊重学生',
        '教学内容丰富有效',
        '授课的方式非常适合我们',
        '治学严谨，要求严格',
        '对待教学认真负责',
        '教学认真',
        '治学严谨',
        '传道授业解惑',
        '教学经验丰富',
        '认真细致',
        '对工作认真负责',
        '对学生因材施教',
        '严于律己',
        '富有经验，工作认真负责',
    ],
    suffix: [
        '能深入了解学生的学习和生活状况',
        '授课有条理，有重点',
        '批改作业认真及时并注意讲解学生易犯错误',
        '教学过程中尊重学生，有时还有些幽默，很受同学欢迎',
        '授课内容详细，我们学生大部分都能跟着老师思路学习',
        '理论联系实际，课上穿插实际问题，使同学们对自己所学专业有初步了解，为今后学习打下基础',
        '从不迟到早退，给学生起到模范表率作用',
        '常常对学生进行政治教育，开导学生，劝告我们努力学习，刻苦奋进，珍惜今天的时光',
        '上课气氛活跃，老师和学生的互动性得到了充分的体现',
        '对学生课堂作业的批改总结认真，能及时，准确的发现同学们存在的问题并认真讲解，解决问题。',
        '采用多媒体辅助教学，制作的电子教案详略得当，重点与难点区分的非常清楚',
        '从学生实际出发，适当缓和课堂气氛',
        '授课时生动形象，极具幽默感',
        '授课时重点突出，合理使用各种教学形式',
        '上课诙谐有趣，非常能调动课堂气氛',
        '善于用凝练的语言将复杂难于理解的过程公式清晰、明确的表达出来',
        '讲课内容紧凑、丰富，并附有大量例题和练习题',
        '我们学生大部分都能跟着老师思路学习，气氛活跃，整节课学下来有收获',
        '上课例题丰富，不厌其烦，细心讲解，使学生有所收获',
        '理论和实际相结合，通过例题使知识更条理化',
        '上课深入浅出，易于理解',
        '上课不迟到、不早退',
        '与同学们相处融洽',
        '上课很认真也很负责',
        '上课幽默风趣，让学生听了很容易把知识吸收',
        '讲课由浅入深，一步一步引导学生思考',
        '精彩的教学让我对这门课程有了浓厚的兴趣',
        '在课间休息时间，老师会与大家一起讨论问题，会耐心解答同学们的问题',
        '对于每一个人都非常好，非常照顾',
        '我也非常希望能够成为老师那样的人',
        '上课认真，从不迟到',
        '让我非常的亲切，非常喜欢他',
        '从简单到深刻，他引导学生一步一步思考，让我对这门课产生了兴趣',
        '从简单到深刻，他会引导学生一步一步思考',
        '对每个人都很好，很有爱心',
        '上课条理清晰，很容易理解',
        '讲课通俗易懂，条理清晰',
        '上课认真又幽默风趣',
        '课间，老师会和大家讨论问题，耐心回答学生的问题',
        '讲课时会一步一步引导学生思考',
        '上课时会引导学生循序渐进地思考',
        '常让人感到如沐春风',
        '讲课非常认真，对于每一个同学都非常好',
        '会耐心回答学生的问题',
        '对每一个学生都非常好',
        '非常爱护学生，教育学生的方法也非常正确',
        '对每一个学生都非常关爱，对每一个人也非常友善',
        '讲课非常认真，让人感到如沐春风',
    ],
};

/**
 * 范围随机数
 * @param {int} maxNum 随机范围终点（不包含）
 * @param {int} minNum （可选）随机范围起点（包含）
 * @returns 从范围中随机抽取的一个整数
 */
function randomNum(maxNum, minNum = 0) {
    if (maxNum < minNum) {
        let tmp = maxNum;
        maxNum = minNum;
        minNum = tmp;
    }
    return parseInt(Math.random() * (maxNum - minNum) + minNum, 10);
}

/**
 * 加权随机数
 * @param {[int]} weightList 一个由整数组成的数组，每一个整数代表一个元素，整数之和必须为 10
 * @returns {int} 按照加权随机返回 weightList 数组中某一个元素的 index
 */
function weightedRandom(weightList) {
    if (weightList.reduce((preVal, curVal) => preVal + curVal) != 10) {
        throw Error("权重之和必须为 10");
    }
    let array = []
    for (let j = 0; j < weightList.length; j++) {
        let num = weightList[j];
        for (let i = 0; i < num; i++) {
            array.push(j);
        }
    }
    return array[randomNum(array.length)];
}

/**
 * 显示一个弹出提示框
 * @param {string} msg 提示框内容
 * @param {string} title （可选）提示框标题
 */
function showMessage(msg, title = "提示") {
    Ext.MessageBox.show({
        title: title,
        msg: msg,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
    })
}

/**
 * 检测 HTML 元素是否显示于当前页面中
 * @param {HTMLElement} el 被检测的 HTML 元素
 * @returns {boolean} 检测结果（true/false）
 */
function isElementInPage(el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return !(rect.top <= 0 && rect.left <= 0 && rect.bottom <= 0 && rect.right <= 0);
}

/**
 * 异步等待函数
 * @param {int} ms 等待时长（毫秒
 * @returns {Promise<null>} null
 */
async function sleep(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

function bookEvaluateSolve() { }

function bookEvaluateEntry() {
    console.log("一键教材评价启动...");
}

/**
 * 在评教页面自动点击评教，以及完成评语
 */
async function subjectEvaluateSolve() {
    /**
     * 自动填写评语
     */
    function fillEvaluationBox() {
        let teacherName = document.querySelector(".x-container.x-border-item.x-box-item.x-container-default.x-column-layout-ct")
            ? /教师：\s*(.*)/g.exec(document.querySelector(".x-container.x-border-item.x-box-item.x-container-default.x-column-layout-ct").innerText)[1]
            : "";
        let text_area = document.getElementsByName('bz');
        if (text_area.length <= 0) {
            text_area = document.getElementsByClassName('x-form-text-area');
        }
        if (text_area.length > 0) {
            // 自动填写评语
            text_area[0].value = `${teacherName}老师${evaluations.prefix[randomNum(0, evaluations.prefix.length - 1)]}，${evaluations.suffix[randomNum(0, evaluations.suffix.length - 1)]}。`;
            text_area[0].dispatchEvent(new Event("change")); // 触发文本框的'change'事件来激活提交按钮
        } else {
            console.log('text_area not found');
        }
    }

    /**
     * 自动点击选择评教选项
     */
    async function checkEvaluation() {
        // “评价结果”栏
        let grid_result_list = Array.from(document.querySelectorAll('.x-grid-cell.x-grid-td.x-grid-cell-last'))
            .filter((item) => item.innerHTML.match(/&nbsp;|完全同意|部分同意|大部分同意|好|比较好|一般/))
            .filter((item) => isElementInPage(item));
        for (item of grid_result_list) {
            // 点击“评价结果”格子
            console.log(isElementInPage(item));
            item.click();
            console.log('clicked:', item);
            let drop_btns = Array.from(document.querySelectorAll('.x-form-trigger')).filter((elem) => isElementInPage(elem));
            while (!document.getElementsByTagName("li")[0] || !isElementInPage(document.getElementsByTagName("li")[0])) {
                if (drop_btns.length > 0) {
                    drop_btns[0].click();
                }
                await sleep(10);
            }
            // 选中下拉列表中前三项的随机（加权随机）一项
            if (document.getElementsByTagName("li").length > 0) {
                // 随机权重分别为：
                // 完全同意：7/10
                // 大部分同意：2/10
                // 部分同意：1/10
                document.getElementsByTagName("li")[weightedRandom([7, 2, 1])].click();
                console.log('clicked:', document.getElementsByTagName("li")[0]);
            }
            item.click();
        }
    }

    /**
     * 点击提交和返回按钮
     */
    function clickBtns() {
        let save_btn;
        let commit_btn;
        let return_btn;
        let btns = Array.from(document.querySelectorAll(".x-btn-button"))
            .filter((elem) => elem.innerText.match(/保存|提交|返回列表/g));
        if (btns.length > 0) {
            for (let btn of btns) {
                if (btn.innerText.includes("保存"))
                    save_btn = btn;
                if (btn.innerText.includes("提交"))
                    commit_btn = btn;
                if (btn.innerText.includes("返回列表"))
                    return_btn = btn;
            }
        }

        commit_btn.click(); // 提交
        return_btn.click(); // 返回列表
    }

    /**
     * 等待并关闭操作成功弹窗
     * @returns {Promise<null>} null
     */
    async function waitForPopup() {
        return new Promise(async function (resolve, reject) {
            for (let i = 0; i < 4; i++) {
                if (document.getElementById('button-1005-btnEl')) {
                    document.getElementById('button-1005-btnEl').click();
                    resolve();
                }
                await sleep(500);
            }
            // 超时（2秒）后则认为没有弹窗需要处理
            resolve();
        });
    }

    await checkEvaluation()
    fillEvaluationBox();
    await sleep(100);
    clickBtns()
    await waitForPopup();
    await sleep(500);
    subjectEvaluateEntry();
}

/**
 * 在科目列表中选择未评教的科目并点击进入
 */
function subjectEvaluateEntry() {
    // 在待评教科目列表中找寻未评教的科目进入
    console.log("一键评教启动...");
    console.log('window.subjectEvaluateEntryList', window.subjectEvaluateEntryList);
    if (window.subjectEvaluateEntryList.length > 0 && window.subjectEvaluateEntryIndex < window.subjectEvaluateEntryList.length) {
        console.log('entry:', window.subjectEvaluateEntryList[window.subjectEvaluateEntryIndex]);
        window.subjectEvaluateEntryList[window.subjectEvaluateEntryIndex].querySelector("a").click();
        window.subjectEvaluateEntryIndex++;
        setTimeout(subjectEvaluateSolve, 500);
    } else {
        showMessage("一键评教完成！")
    }
}

function onSubjectEvaluateBtnClicked() {
    subjectEvaluateEntryList = Array.from(document.querySelectorAll('.x-grid-cell-inner'))
        .filter((item) => item.innerText.includes("评教")
            && !item.innerText.includes("已提交")
            && !item.className.includes("treecolumn"));
    subjectEvaluateEntryIndex = 0;
    subjectEvaluateEntry();
}

function main() {
    console.log('✅GUET自动评教脚本已加载，版本' + version);

    isEvaluateBtnInjected = false;
    isBookEvaluateBtnInjected = false;
    setInterval(function () {
        if (document.querySelector(".x-active").innerText === "评教" && !isEvaluateBtnInjected) {
            // 匹配评教页面
            let startBtnElem = `
            <a class="oneClickEvaluate x-btn x-unselectable x-column x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon" style="margin:0px 3px 0px 3px;" role="button" hidefocus="on" unselectable="on" tabindex="0">
                <span class="x-btn-wrap" unselectable="on">
                    <span class="x-btn-button">
                        <span class="x-btn-inner x-btn-inner-center" unselectable="on">一键评教</span>
                    </span>
                </span>
            </a>`;
            document.querySelectorAll("div.x-fieldset-body.x-column-layout-ct>span>div").forEach((elem) => {
                elem.insertAdjacentHTML("beforeend", startBtnElem);
                isEvaluateBtnInjected = true;
            })
            document.querySelectorAll(".oneClickEvaluate").forEach((elem) => {
                elem.addEventListener("click", onSubjectEvaluateBtnClicked);
            })
        } else if (document.querySelector(".x-active").innerText !== "评教") {
            document.querySelectorAll(".oneClickEvaluate").forEach((elem) => {
                elem.remove();
                isEvaluateBtnInjected = false;
            })
        }

        if (document.querySelector(".x-active").innerText === "教材评价" && !isBookEvaluateBtnInjected) {
            // 匹配教材评价页面
            let startBtnElem = `
            <a class="oneClickBookEvaluate x-btn x-unselectable x-column x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon" style="margin:0px 3px 0px 3px;" role="button" hidefocus="on" unselectable="on" tabindex="0">
                <span class="x-btn-wrap" unselectable="on">
                    <span class="x-btn-button">
                        <span class="x-btn-inner x-btn-inner-center" unselectable="on">一键教材评价</span>
                    </span>
                </span>
            </a>`;
            document.querySelectorAll("div.x-fieldset-body.x-column-layout-ct>span>div").forEach((elem) => {
                elem.insertAdjacentHTML("beforeend", startBtnElem);
                isBookEvaluateBtnInjected = true;
            })
            document.querySelectorAll(".oneClickBookEvaluate").forEach((elem) => {
                elem.addEventListener("click", subjectEvaluateEntry);
            })
        } else if (document.querySelector(".x-active").innerText !== "教材评价") {
            document.querySelectorAll(".oneClickBookEvaluate").forEach((elem) => {
                elem.remove();
                isBookEvaluateBtnInjected = false;
            })
        }
    }, 200);
}

(async function () {
    'use strict';
    window.onload = main;
})();
