// ==UserScript==
// @name         wenjuan::问卷网储存答案
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  问卷网储存答案
// @author       Cosil.C
// @match        http*://www.wenjuan.com/s/*
// @icon         https://www.wenjuan.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446129/wenjuan%3A%3A%E9%97%AE%E5%8D%B7%E7%BD%91%E5%82%A8%E5%AD%98%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/446129/wenjuan%3A%3A%E9%97%AE%E5%8D%B7%E7%BD%91%E5%82%A8%E5%AD%98%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==


//跳过重新答题和继续答题页面
localStorage.clear();
sessionStorage.clear();
//问卷id
let questionnaire = /(?<=\/s\/)[^\/]+/.exec(location.pathname)[0];
//答案保存
unsafeWindow.saveAnswers = () => {
    if (!Object.keys(unsafeWindow.total_answers).length || confirm('确认是否覆写问卷${questionnaire}的答案？')) {
        GM_setValue(questionnaire, unsafeWindow.total_answers);
        alert(`成功保存问卷${questionnaire}的答案`);
    }
}
//答案重置
unsafeWindow.resetAnswers = () => {
    GM_deleteValue(questionnaire);
    if (confirm('确认是否清除问卷${questionnaire}的答案？')) {
        alert(`成功清除问卷${questionnaire}的答案`);
    }
}
//重复次数修改
unsafeWindow.countDown = () => {
    let setCountDown = Number($('#countDown').val());
    console.log(setCountDown);
    if(!Number.isInteger(setCountDown)){
        alert('请输入非负整数');
    }else if (setCountDown >= 0 && confirm(`确定重复提交${setCountDown}次`)) {
        GM_setValue(questionnaire + '_countDown', setCountDown);
        countDown = setCountDown;
    } else {
        $('#countDown').val(countDown);
    }
}
//保存的答案
let answers = GM_getValue(questionnaire, {}),
    //重复的次数
    countDown = GM_getValue(questionnaire + '_countDown', 0),
    //这次重复是否已经文笔
    countFlag = false;
//回写保存的答案
for (let queId in answers) {
    for (let valueId of answers[queId]) {
        let valueEle = //document.querySelector(`[value='${valueId}']`);
            document.querySelector(`input[value='${valueId}'],.w-selection-option[value='${valueId}']`)
        console.group();
        console.log('queId', queId);
        console.log('valueId', valueId);
        console.log('selector', `[value='${valueId}']`);
        console.log('valueEle', valueEle);
        console.groupEnd();
        valueEle?.click();
    }
}

//监听器
setInterval(() => {
    //不是填写页面
    if (!document.querySelector('.content_box')) {
        countFlag = true;
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    } else if (!countFlag && countDown > 0) {
        //填写页面，校验提交和提交次数
        document.querySelector('#next_button').click();
        GM_setValue(questionnaire + '_countDown', countDown - 1);
    }
}, 1000);

//三个input
$('body').prepend(`<div style="float: left;
    position: fixed;
    width: 55px;
    height: 29px;
    line-height: 30px;
    background: #2e82ff;
    color: #ffffff;
    margin: 13px 0 0 13px;
    border-radius: 6px;
    text-align: center;
    "
    onclick='saveAnswers()'>
    <span>保存</span>
</div>
<div style="float: left;
    width: 55px;
    height: 29px;
    line-height: 30px;
    background: #cccccc;
    color: #5f5f5f;
    border: #2e82ff;
    margin: 55px 0 0 13px;
    border-radius: 6px;
    text-align: center;
    position: fixed;
    "
    onclick='resetAnswers()'>
    <span>重置</span>
</div>
<input style="
    float: left;
    width: 51px;
    height: 28px;
    line-height: 30px;
    background: #7100a0;
    color: #ffffff;
    border: #2e82ff;
    margin: 96px 0 0 13px;
    border-radius: 6px;
    text-align: center;
    position: fixed;
    "
    id='countDown'
    palceholder='重复次数'
    onchange='countDown()'
    />`);
$('#countDown').val(countDown);