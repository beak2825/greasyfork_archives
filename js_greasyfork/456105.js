// ==UserScript==
// @name         SWPU绩点计算
// @namespace    http://merept.github.io/
// @version      1.4.4
// @license      MIT
// @description  在jwxt.swpu.edu.cn的“综合查询-全部成绩”以及“本学期成绩”页面显示各个学期的平均学分绩点，加粗并打上“※”号的课程是计算进去的，有“（跳过）”注释的证明是英语四六级或暂时未出成绩的课程，不计算在内（若要不计算选修课，请把源代码最上面的skipElectives变量的值改为false），什么标记都没有的可能是没有计算进去，刷新网页即可。（结果可能有出入，仅供参考）
// @author       MerePT
// @match        jwxt.swpu.edu.cn/loginAction.do
// @match        jwxt-swpu-edu-cn.vpn.swpu.edu.cn:8118/loginAction.do
// @icon         https://pic.imgdb.cn/item/6388c62816f2c2beb1c0909d.png
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/456105/SWPU%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/456105/SWPU%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

const skipElectives = false; //true: 不计算选修课，false: 计算选修课，默认计算选修课

/**
 * 判断是否为 CET 相关的课程
 * @param {string} name 课程名称
 * @returns {boolean} true: 是 CET 相关课程; false: 不是
 */
function isEnglishTest(name) {
    return new RegExp("英语实践+").test(name) || new RegExp("全国英语+").test(name);
}

/**
 * 判断是否为选修课, 若用户设置变量 {skipElectives} 为 false 则直接返回 false
 * @param {string} course 课程号
 * @returns {boolean} true: 是选修课; false: 不是或者用户设置不跳过选修课
 */
function isElectives(course) {
    return skipElectives && course.substring(0, 2) === '00';
}

/**
 * 判断字符串是否为空
 * @param {string} str 输入字符串
 * @returns {boolean} true: 字符串为空; false: 不为空
 */
function isNullOrEmpty(str) {
    return !str || new RegExp("^[\s　]*$").test(str);
}

/**
 * 判断课程是否缓考
 * @param {HTMLCollection} datas 课程各项数据组成的数组
 * @returns {boolean} true: 该课程缓考; false: 正常状态未缓考
 */
function isDeferrd(datas) {
    return datas.length === 13 && !isNullOrEmpty(datas[11].innerText)
}

/**
 * 判断该课程是否计入绩点
 * @param {HTMLCollection} datas 课程各项数据组成的数组
 * @param {number} p 成绩所在位置
 * @returns {boolean} true: 不计入该课程成绩; false: 计入
 */
function isNotCount(datas, p) {
    return isEnglishTest(datas[2].innerText) || isElectives(datas[0].innerText) ||
        isNullOrEmpty(datas[p].innerText) || isDeferrd(datas);
}

/**
 * 将挂科的课程标红
 * @param {HTMLCollection} datas 挂科的课程
 */
function turnToRed(datas) {
    for (let [i, d] of datas.entries()) {
        if (i === 2) {
            d.style = "font-weight:bolder;color:red"
        } else {
            d.style = "color:red"
        }
    }
}

/**
 * 计算单个学期的平均学分绩点
 * @param {HTMLCollection} obj 该学期的 HTML 集合
 * @param {object} d 存有总学分、总成绩、已通过学分、挂科数的对象
 * @param {number} scoreIndex 成绩所在的位置
 * @returns {object} 存有总学分、总成绩、已通过学分、挂科数的对象
 */
function calSingleGpa(obj, d, scoreIndex, imgIndex) {
    for (let o of obj) {
        let datas = o.querySelectorAll('td');
        var img = datas[imgIndex].firstElementChild;
        if (img != null) {
            img.attributes.onclick.value = img.attributes.onclick.value.replace('cjmx', 'window.open');
        }
        if (isNotCount(datas, scoreIndex)) {
            datas[2].innerText += ' (跳过)';
            continue;
        }

        // console.log(datas[2].innerText + ' - 学分：' + datas[4].innerText + ' - 成绩：' + datas[scoreIndex].children[0].innerText);

        let p = Number(datas[4].innerText);
        d.totalPoints += p

        let score = Number(datas[scoreIndex].innerText);
        let gradePoint = 0;
        if (score >= 60) {
            gradePoint = (score - 60) / 10 + 1;
            d.totalNotFailedPoints += p;
            datas[2].style = "font-weight:bolder";
        } else {
            d.fails++;
            turnToRed(datas);
        }
        d.totalScores += gradePoint * p;

        datas[2].innerText += ' ※';

        // var img = datas[imgIndex].firstElementChild;
        // img.attributes.onclick.value = img.attributes.onclick.value.replace('cjmx', 'window.open');
    }
    return d;
}

/**
 * 计算平均学分绩点
 * @param {HTMLIFrameElement} frame 记录了课程信息的网页框架
 * @param {number} scoreIndex 成绩所在的位置
 * @param imgIndex
 * @returns {object[]} 返回包含总学分、总成绩、已通过学分、挂科数的对象的数组
 */
function calGpa(frame, scoreIndex, imgIndex) {
    let data = {
        totalPoints: 0,
        totalScores: 0,
        totalNotFailedPoints: 0,
        fails: 0
    };
    let datas = [];
    let scores = frame.document.querySelectorAll('.titleTop2');

    for (let s of scores) {
        let even = s.querySelectorAll('.even');
        data = calSingleGpa(even, data, scoreIndex, imgIndex);

        let ef = s.querySelectorAll('.evenfocus');
        data = calSingleGpa(ef, data, scoreIndex, imgIndex);

        let odd = s.querySelectorAll('.odd');
        data = calSingleGpa(odd, data, scoreIndex, imgIndex);

        datas.push(data);

        data = {
            totalPoints: 0,
            totalScores: 0,
            totalNotFailedPoints: 0,
            fails: 0
        };
    }

    return datas;
    // console.log('totalPoints:' + totalPoints);
    // console.log('totalScores:' + totalScores);
}


function main() {
    // “综合查询 - 全部成绩”页面的 GPA 显示
    setInterval(function() {
        if (document.querySelector("frame[name='bottomFrame']").contentWindow.document.querySelector("#mainF").contentWindow.document.querySelector("iframe[name='lnqbIfra']") != null) {
            if (document.querySelector("frame[name='bottomFrame']").contentWindow.document.querySelector("#mainF").contentWindow.document.querySelector("iframe[name='lnqbIfra']").contentWindow == undefined) {
                return;
            }

            /**
             * main 框架
             */ 
            let mainF = document.querySelector("frame[name='bottomFrame']").contentWindow
                        .document.querySelector("#mainF").contentWindow;
            /**
             * 全部成绩页面内的 lnqbIfra 框架
             */
            let scoreF = mainF.document.querySelector("iframe[name='lnqbIfra']").contentWindow;

            if (scoreF.document.body != null && scoreF.document.body.getAttribute('is-calculated') == undefined && scoreF.document.querySelectorAll('.title').length != 0) {
                // clearInterval(timer);
                scoreF.document.body.setAttribute("is-calculated", "true"); // 设置属性避免延时时持续对框架内容进行操作

                // 延时等待框架加载完成
                setTimeout(function() {
                    let results = calGpa(scoreF, 6, 7);

                    /**
                     * 每学期的标题位置
                     */
                    let titles = scoreF.document.querySelectorAll('.title');
                    /**
                     * 每学期底部的汇总信息位置
                     */
                    let pa = scoreF.document.querySelectorAll('.pageAlign'); 
                    /**
                     * “历年成绩”标题位置
                     */
                    let headTitle = mainF.document.querySelector('#tblHead'); 
                    /**
                     * 侧边栏各学期跳转链接位置
                     */
                    let slide = mainF.document.querySelector('.table_k')
                                                .querySelectorAll('table')[7]
                                                .querySelectorAll('a'); 
                    /**
                     * 全部成绩
                     */
                    let total = {
                        /**
                         * 学分
                         */
                        points: 0,
                        /**
                         * 绩点
                         */
                        scores: 0
                    };

                    for (let i = 0; i < titles.length; i++) {
                        // console.log(titles[i]);
                        let b = document.createElement('b');
                        let r = results[i].totalScores / results[i].totalPoints
                        let gpa = isNaN(r) ? '0.00' : r.toFixed(2);

                        b.innerText = '\xa0本学期平均学分绩点: ' + gpa;
                        titles[i].getElementsByTagName('td')[2].appendChild(b);

                        pa[i].querySelectorAll('table')[1]
                            .querySelector('td').innerText += '\xa0\xa0平均学分绩点:\xa0\xa0' + gpa;

                        slide[i].innerText += slide[i].getAttribute('is-add')==undefined ? ("\xa0\xa0GPA: " + gpa) : '';
                        slide[i].setAttribute('is-add', 'true');

                        total.points += results[i].totalPoints;
                        total.scores += results[i].totalScores;
                    }

                    let s = "\xa0\xa0GPA: " + (total.scores / total.points).toFixed(2);
                    headTitle.querySelectorAll('td')[2]
                                .querySelector('b').innerText += headTitle.getAttribute('is-add')==undefined ? s : '';
                    headTitle.setAttribute('is-add', 'true');
                }, 1500);
            }
        }
    },30);

    // “综合查询 - 本学期成绩”页面的 GPA 显示
    setInterval(function() {
        if (document.querySelector("frame[name='bottomFrame']").contentWindow
                .document.querySelector("#mainF").contentWindow != undefined) 
        {
            /**
             * main 框架
             */
            let mainF = document.querySelector("frame[name='bottomFrame']").contentWindow
                        .document.querySelector("#mainF").contentWindow;
            /**
             * 各页面 mainF 框架中的标题位置
             */
            let titles = mainF.document.querySelectorAll('.title');

            // 当标题位置的 innerText 为“本学期成绩”时执行
            if (mainF.document.body != null && mainF.document.body.getAttribute('is-calculated') == undefined && titles.length != 0 && titles[0].getElementsByTagName('td')[2].innerText.trim() == '本学期成绩查询列表') {
                // clearInterval(timer);
                mainF.document.body.setAttribute("is-calculated", "true"); // 设置属性避免延时时持续对框架内容进行操作

                setTimeout(function() {
                    let results = calGpa(mainF, 9, 12);

                    /**
                     * “本学期成绩”标题位置
                     */
                    let title = mainF.document.querySelector('.title');
                    let r = results[0].totalScores / results[0].totalPoints;
                    let gpa = isNaN(r) ? '0.00' : r.toFixed(2);

                    // console.log(titles[i]);
                    let b = document.createElement('b');
                    b.innerText = '\xa0平均学分绩点: ' + gpa;
                    title.getElementsByTagName('td')[2].appendChild(b);

                    let resultText = '总修读学分:\xa0' + results[0].totalPoints
                                    + '\xa0\xa0已通过学分:\xa0' + results[0].totalNotFailedPoints
                                    + '\xa0\xa0挂科数:\xa0' + results[0].fails
                                    + '\xa0\xa0平均学分绩点: \xa0' + gpa;

                    let bottomHTML = `<table width="100%" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <td height="21">`+ resultText +`</td>
                                        </tr>
                                    </tbody>
                                </table>`;

                    mainF.document.querySelectorAll('td')[8].innerHTML += bottomHTML;
                }, 1500);
            }
        }
    },30);
}

(function() {
    let timer = setInterval(function() {
        if (document.querySelector("frame[name='bottomFrame']").contentWindow
                .document.querySelector("#mainF").contentWindow
                .document.querySelectorAll("title")[0].innerText === '成绩查询') {
            clearInterval(timer);
            main();
        }
    },30);
})();