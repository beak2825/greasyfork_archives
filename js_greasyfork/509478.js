// ==UserScript==
// @name         福建师范大学协和学院学生互评
// @namespace    宋卜宁
// @version      1.1
// @description  福建师范大学协和学院学生工作信息管理系统中的学生互评自动评分
// @icon         https://image.mooncloud.top/i/2025/03/18/qhwy4a.jpg
// @author       宋卜宁
// @match        https://cucxg.fjnu.edu.cn/mainStu.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509478/%E7%A6%8F%E5%BB%BA%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E5%8D%8F%E5%92%8C%E5%AD%A6%E9%99%A2%E5%AD%A6%E7%94%9F%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/509478/%E7%A6%8F%E5%BB%BA%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E5%8D%8F%E5%92%8C%E5%AD%A6%E9%99%A2%E5%AD%A6%E7%94%9F%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

async function getSchoolYearId() { // 执行互评流程前先获取学年ID
    const url = 'https://cucxg.fjnu.edu.cn/dictStu/queryComboboxSchoolYear.do';
    console.log("[*] 正在获取学年列表，请耐心等待……");
    return fetch(url, { method: 'POST' })
    .then(response => response.text())
    .then(text => {
        const resp = JSON.parse(text);
        let num = 1;
        let schoolYearInfo = "";
        console.log("学年列表：");
        schoolYearInfo += "学年列表：\n";
        for (const schoolYear of resp.slice(0, 8)) { // 取前8个学年，排除无用学年
            const schoolYearId = schoolYear.schoolYearId;
            const schoolYearName = schoolYear.schoolYearName;
            console.log(`\t\t${num}: ${schoolYearName}`); // 不显示学年ID
            schoolYearInfo += `\t\t${num}: ${schoolYearName}\n` // 不显示学年ID
            num += 1;
        }
        return new Promise((resolve, reject) => {
            const select = prompt(`${schoolYearInfo}请输入您要进行互评的学年序号(例如输入1就是选择${resp[0].schoolYearName}):`);
            if (select === null) {
                console.error("您取消了输入，脚本已退出运行");
                alert("您取消了输入，脚本已退出运行");
            } else {
                const selectedIndex = parseInt(select, 10) - 1; // 获取用户输入并减1以匹配数组索引
                if (selectedIndex >= 0 && selectedIndex < resp.length) {
                    resolve([resp[selectedIndex].schoolYearName,resp[selectedIndex].schoolYearId]);
                } else {
                    console.error("您输入的学年序号不正确！");
                    console.error(`已为您设置互评学年为最新学年：${resp[0].schoolYearName}`);
                    alert(`您输入的学年序号不正确！\n已为您设置互评学年为最新学年：${resp[0].schoolYearName}`);
                    resolve([resp[0].schoolYearName,resp[0].schoolYearId]);
                }
            }
        });
    })
    .catch(error => {
        return [null,null];
    });
}

async function startEvaluation() { // 互评流程
    const [schoolYearName,schoolYearId] = await getSchoolYearId(); // 在获取学年ID后，继续执行互评流程
    if (schoolYearId === null){
        return; // 如果用户取消输入，则退出脚本
    }
    console.log(`[+] 您选择了${schoolYearName}`);
    // 第一部分：获取需要互评学生的名单
    const url = 'https://cucxg.fjnu.edu.cn/studentComprehensiveEvaluation/queryByStuNoRowsStu2StuComprehensiveEvaluation.do';
    const data = {
        "comprehensiveEvaluationPlan.schoolYear.schoolYearId": schoolYearId,
        "isEvaluation"                                       : 0
    };
    const formData = new FormData(); // 创建FormData对象
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }
    console.log("[*] 正在获取需要互评的学生名单，请耐心等待……");
    alert("点击'确定'后，脚本将开始获取需要互评的学生名单，请耐心等待执行结果……");
    fetch(url, {
        method: 'POST',
        body: formData // 使用FormData对象作为请求体
    })
    .then(response => response.text())
    .then(text => {
        const resp = JSON.parse(text);
        let paramStr = "";
        if(resp.rows.length === 0) {
            console.error("[-] 没有需要互评的学生，脚本已自动退出运行");
            alert("[-] 没有需要互评的学生，脚本已自动退出运行")
            return; // 如果没有需要互评的学生，则退出脚本
        }
        console.log("[+] 开始互评");
        let Score = null; //统一分数
        Score = prompt(`请输入您希望互评的分数（0至80分）：\n- 例如：您输入80，脚本将自动为所有学生评80分。\n- 注意：此脚本旨在简化您的互评过程，节省时间。如果您需要为个别学生设置不同的分数，可在脚本自动评分完成后，手动进行修改。`);
        if (Score === null) {
            console.error("您取消了输入，脚本已退出运行");
            alert("您取消了输入，脚本已退出运行");
            return; // 如果用户取消输入，则退出脚本
        } else {
            if (Score < 0 || Score > 80) { // 判断该学生是否有互评分数
                Score = 80;
                console.error("您输入的分数不正确！");
                console.error(`已为您设置互评分数为${Score}分`);
                alert(`您输入的分数不正确！\n已为您设置互评分数为${Score}分`);
            }
        }
        console.log(`[+] 您设置了互评分数为${Score}分`);
        resp.rows.forEach(Stu => {
            const StuName = Stu.studentName;
            const StuID = Stu.stu2StuComprehensiveEvaluationId;
            const score = Stu.score; // 政治思想道德测评分数
            const sportsScore = Stu.sportsScore; // 文体测评分数
            if(score === undefined || sportsScore === undefined) {
                paramStr += `${StuID},${Score},${Score}^`;
                console.log(`[*] ${StuName} 思政分:${Score} 文体分:${Score}`); // 不显示学生ID
            }else{
                console.log(`[-] ${StuName} 已评分,思政分:${score} 文体分:${sportsScore}`);
            }
        });
        if(paramStr === ""){ // 判断是否有互评数据
            console.log("[-] 互评已完成,请勿重复操作！");
            alert("该学年互评您已完成，请勿重复操作！");
            return; // 如果互评已完成，则退出脚本
        }
        console.log("[*] 正在提交互评数据，请耐心等待……");
        alert("点击'确定'后，脚本将开始获取提交互评数据，请耐心等待执行结果……");
        // 第二部分：提交互评数据
        const scoreUrl = 'https://cucxg.fjnu.edu.cn/studentComprehensiveEvaluation/saveByStuStu2StuComprehensiveEvaluation.do';
        const scoreData = {
            paramStr: paramStr,
            _: new Date().getTime()
        };
        const searchParams = new URLSearchParams(scoreData).toString(); // 使用URLSearchParams来构建查询参数
        const saveScoreUrl = `${scoreUrl}?${searchParams}`; // 将查询参数附加到URL
        return fetch(saveScoreUrl, {
            method: 'GET',
        });
    })
    .then(response => response.json())
    .then(resp => {
        if(resp.isSuccess) {
            console.log("[+] 互评完成");
            alert("互评完成！！！");
        } else {
            console.log(`[-] 互评失败, ${resp.message}`);
            alert(`互评失败！ ${resp.message}`);
        }
    })
    .catch(error => {
        return null;
    });
}

console.log('%c%s', 'color:#5B86E5;font-size:20px', '福建师范大学协和学院学生互评脚本 v2023-2024学年')
console.log('%c%s', 'color:#36D1DC;font-size:18px', 'By 繁星');
console.log("福建师范大学协和学院学生全自动互评脚本！解放您的双手！");
startEvaluation(); // 开始互评