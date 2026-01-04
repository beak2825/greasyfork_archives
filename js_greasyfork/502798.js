// ==UserScript==
// @name         sjtu-visitor
// @namespace    https://qiandao.sjtu.edu.cn
// @version      0.1
// @description  交通大学访客登记助手
// @author       ethan
// @match        https://qiandao.sjtu.edu.cn/visitor/*
// @match        https://qiandao.sjtu.edu.cn/visitor/submit.php
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_getValue
// @grant GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502798/sjtu-visitor.user.js
// @updateURL https://update.greasyfork.org/scripts/502798/sjtu-visitor.meta.js
// ==/UserScript==


const visitor = [
    {"xm": "潘文芬", "zjhm":"420123198204102741", "phone":"13018206688"},
    {"xm": "潘文华", "zjhm":"420116198404082729", "phone":"16621670038"}

]
let monitorTimer = {};
function clearMonitorTimer(name){
    if(monitorTimer[name]) {
        clearInterval(monitorTimer[name]);
        monitorTimer[name] = null;
    }
}
function startMonitorTimer(name, callback, t = 100){
    clearMonitorTimer(name);
    return new Promise((resolve, reject)=>{
        if(callback() == true) {
            resolve();
            return;
        }
        monitorTimer[name] = setInterval(()=>{
            if(callback() == true) {
                clearMonitorTimer(name);
                resolve();
            }
        }, t);
    });
}
function getDate(){
    const today = new Date();//创建日期对象
    const year = today.getFullYear();//获取年份
    const month = today.getMonth()+1;//获取月份
    const day = today.getDate();//获取日期
    return year + "" + month + "" + day;//拼接成yyyymmdd形式字符串
}

function inputInfo(i){
    if(!visitor[i]) return;
    console.log(visitor[i].xm + "=>填写");
    $("[name='xm']").val(visitor[i].xm);
    $("[name='zjhm']").val(visitor[i].zjhm);
    $("[name='phone']").val(visitor[i].phone);
}

function getIndex(param){
    if(param == "") return -1;
    return Number(param);
}

async function load(){
    const param = location.search.substr(1);
    console.log(`can_submit ${can_submit} param:${param}`);
    if(param != "" && location.href != "https://qiandao.sjtu.edu.cn/visitor/submit.php" && !can_submit && GM_getValue("autoRefresh")){
        setTimeout(()=>location.reload(), 2000);
        //return;
    }
    $("[name='iknow']").click();
    const container = $(".container.pb-4");
    const btnList = [];
    const checkBoxList = [];
    const currentDate = getDate();
    for(let i=0;i<visitor.length;i++){
        const checkBox = $(`<input class="form-check-input" type="checkbox" id="${visitor[i].xm}">`);
        const btn = $(`<input type="button" class="btn btn-light" style="height: 42px; width: 120px;" value="${visitor[i].xm}">`);
        checkBox.appendTo(container);
        btn.appendTo(container);
        btn.click(function () {
            inputInfo(i);
            $("[value='登记']").click();
            console.log(visitor[i].xm + "=>提交");
      });
      btnList.push(btn);
      checkBoxList.push(checkBox);
    }
    $(`<span>自动刷新</span>`).appendTo(container);
    const autoRefresh = $(`<input class="form-check-input" type="checkbox" id="autoRefresh">`);
    autoRefresh.attr("checked", GM_getValue("autoRefresh"));
    autoRefresh.appendTo(container);
    autoRefresh.change(function(){
        if($(this).is(":checked")){
            GM_setValue("autoRefresh", true);
            setTimeout(()=>location.reload(), 100);
        } else {
            GM_setValue("autoRefresh", false);
        }
    });
    setInterval(()=>{
        const success = $("body > div.container.pb-4 > div.alert.alert-success.p-3.text-center").length > 0;
        if(success) {
            const name = $("body > div.container.pb-4 > table > tbody > tr:nth-child(3) > td:nth-child(2)").text();
            const result = GM_getValue(currentDate) || {};
            result[name] = 1;
            GM_setValue(currentDate, result);
            console.log(`${currentDate} save success: ${JSON.stringify(result)}`);
            return;
        }
        //console.log(`iknowCheckbox`);
        const iknowCheckbox = $("[name='iknow']");
        if(iknowCheckbox.length >0 && !iknowCheckbox.is(":checked")) {
            //$("[name='iknow']").attr("checked","checked");
            iknowCheckbox.click();
        }
        const iknowBtn = $("#myModal > div > div > div.modal-footer > button");
        if(iknowBtn.length >0){
            iknowBtn.click();
        }
    }, 100);
    const index = getIndex(param);
    if(checkBoxList[index]) checkBoxList[index].attr("checked", true);
    inputInfo(index);
    await startMonitorTimer("submitBtn",()=>{
        console.log(`wait submitbtn ready`);
        if($("#submitbtn").length >0) return true;
        return false;
    });
    if(btnList[index]) btnList[index].click();
//     setInterval(()=>{
//         const result = GM_getValue(currentDate) || {};
//         console.log(`${currentDate} result: ${JSON.stringify(result)}`);
//         for(let i=0;i<visitor.length;i++){
//             const check = $(`#${visitor[i].xm}`);
//             if(checkBoxList[i] && checkBoxList[i].is(":checked") && !result[visitor[i].xm]){
//                 btnList[i].click();
//                 break;
//             }
//         }
//     }, 1000);

}
(function() {
    'use strict';
    window.onload = load();
})();