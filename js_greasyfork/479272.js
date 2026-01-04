// ==UserScript==
// @name         aiyoumi米盾云
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  爱又米系统导出信息
// @author       Bor1s
// @license      MIT
// @match        https://mi.aiyoumi.com/*
// @icon         https://mi.aiyoumi.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479272/aiyoumi%E7%B1%B3%E7%9B%BE%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/479272/aiyoumi%E7%B1%B3%E7%9B%BE%E4%BA%91.meta.js
// ==/UserScript==

//导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);
//导入jsencrypt
let script1 = document.createElement('script');
script1.setAttribute('type', 'text/javascript');
script1.src = "https://cdn.bootcdn.net/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js";
document.documentElement.appendChild(script1);

var arr = [];
var array = [];
var total;
var key = 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAI4cdoTxDdOjxTWhs2umZ5w+hpCyPV9o/RW/f1+7arUgkzO8XWxMLzVbZmvWGFbPJG3kD96XJQ/0YgMBNTHlYwcJebUbmFC39HiWBO/nz0S6VWPmpKJZsh3sX1ZRd4DN2NDDr373cfnJxhRUdxkVZrQ5j+zA8O/hSQJsyY+qN+fbAgMBAAECgYAdCPe2JcIbcaSDVqxf3DnjFGtN+PzNF5hN7zhJCPO+Wg95TI0R6Wbj0e7VLYL/iYb55NTRN7Rc1COKVZ7WuPVIVtNxarcynql2vn9DE+7yySgm81WuZq6O5ON3SKJ0oiM0b8adfsCa3/hkRety+Zhye1pg8VM+e17ngV1yQJF/EQJBAMMMh+qjTa/xJQUBHmrTYvwzWUzwbOemC8HyfDYBtvEZp/KI35/eXtOm08yoU3D5GtGD1IObrFXJPulEt7qkiuUCQQC6hQg2ac1FpnV73pVHkM2W6+7tIEXhc+6djSjMUEDYlPj2kLUI648FM6DEr+W0HdWYl6fnS44ibybjSR+1E7u/AkEAhvsjDGRbHQl7Hw15KWCEvhgjErXICD/HHz9aal2hZxTkP1otuAtCAKMRLC7JIAOkZZ4f8bxH9U5CNViS9Z1taQJBALighoiWIkMXiqOaqFm21ErYMCE5GPMaNtBtsjzME+RPUkF+7DRwN5oGiNUo6E9qWMw7ElC5UXB0ZiIFeAVeCzECQQCbxTfhJPTMr5cc3KvSUdVThyoz+6Pk+m5l1PICyxItSoXYyp5g+AOSuDVbWK4geyiQMv1MckNKrqTK30lZ/I0L';

// 创建页面按钮
window.onload = function(){
    console.log('页面加载完成，油猴开始加载...')
    var targetElement = document.querySelector("#app > div > header > div > div.r");
    if (targetElement) {
        const buttonHTML = '<span class="top__span none" id="exportEXCEL"><i class="el-icon-printer"></i>导出信息</span>';
        targetElement.insertAdjacentHTML('afterbegin', buttonHTML);
        const button = document.querySelector("#exportEXCEL");
        button.addEventListener("click", function() {
            fetchData();
        });
        button.oncontextmenu = function(e){
            return false
        }
        button.onmouseup = function(e){
            if(e.button == 2){
                key=prompt("请输入私钥key",key);
                if(listNum==""||listNum==0){
                    key='MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAI4cdoTxDdOjxTWhs2umZ5w+hpCyPV9o/RW/f1+7arUgkzO8XWxMLzVbZmvWGFbPJG3kD96XJQ/0YgMBNTHlYwcJebUbmFC39HiWBO/nz0S6VWPmpKJZsh3sX1ZRd4DN2NDDr373cfnJxhRUdxkVZrQ5j+zA8O/hSQJsyY+qN+fbAgMBAAECgYAdCPe2JcIbcaSDVqxf3DnjFGtN+PzNF5hN7zhJCPO+Wg95TI0R6Wbj0e7VLYL/iYb55NTRN7Rc1COKVZ7WuPVIVtNxarcynql2vn9DE+7yySgm81WuZq6O5ON3SKJ0oiM0b8adfsCa3/hkRety+Zhye1pg8VM+e17ngV1yQJF/EQJBAMMMh+qjTa/xJQUBHmrTYvwzWUzwbOemC8HyfDYBtvEZp/KI35/eXtOm08yoU3D5GtGD1IObrFXJPulEt7qkiuUCQQC6hQg2ac1FpnV73pVHkM2W6+7tIEXhc+6djSjMUEDYlPj2kLUI648FM6DEr+W0HdWYl6fnS44ibybjSR+1E7u/AkEAhvsjDGRbHQl7Hw15KWCEvhgjErXICD/HHz9aal2hZxTkP1otuAtCAKMRLC7JIAOkZZ4f8bxH9U5CNViS9Z1taQJBALighoiWIkMXiqOaqFm21ErYMCE5GPMaNtBtsjzME+RPUkF+7DRwN5oGiNUo6E9qWMw7ElC5UXB0ZiIFeAVeCzECQQCbxTfhJPTMr5cc3KvSUdVThyoz+6Pk+m5l1PICyxItSoXYyp5g+AOSuDVbWK4geyiQMv1MckNKrqTK30lZ/I0L';
                }
                console.log("设置成功！刷新后失效")
            }
        }
    }
}

async function fetchData() {
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>获取total..`;
    // 获取任务列表长度 total
    await fetch("https://mi.aiyoumi.com/collectionWebBackend/workPlatform/queryMyTask", {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "x-requested-with": "XMLHttpRequest"
        },
        body: JSON.stringify({
            "page": 1,
            "rows": 10
        }),
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
        total = data.data.total;
        document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>获取列表..`;
        // 获取任务id列表
        return fetch("https://mi.aiyoumi.com/collectionWebBackend/workPlatform/queryMyTask", {
            method: "POST",
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "x-requested-with": "XMLHttpRequest"
            },
            body: JSON.stringify({
                "page": 1,
                "rows": total
            }),
            credentials: "include"
        });
    })
        .then(response => response.json())
        .then(data => {
        arr = data.data.data.map(item => ({
            taskId: item.taskId,//任务id
            curUnpayTotalFee:(item.curUnpayTotalFee/1000).toFixed(2),//当前未还
            curOverdueTotalFee:(item.curOverdueTotalFee/1000).toFixed(2),//当前逾期
            curOverdueCapitalFee:(item.curOverdueCapitalFee/1000).toFixed(2),//逾期本金
            curOverdueFee:(item.curOverdueFee/1000).toFixed(2),//逾期费
            curOverdueServiceFee:(item.curOverdueServiceFee/1000).toFixed(2)//逾期服务费
        }));
    })
        .catch(error => console.error(error));
    await fetchDataByTaskId();
    await fetchDataByBaseInfo();
    await fetchDataByUserContacts();
    await decrypt();
    await exportXlsx();
}

// 获取密文信息
async function fetchDataByTaskId() {
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>获取身份..`;
    for (let i = 0; i < arr.length; i++) {
        try {
            const response = await fetch("https://mi.aiyoumi.com/collectionWebBackend/data/infTaskDetail/getDataByTaskId", {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-requested-with": "XMLHttpRequest"
                },
                body: `taskId=${arr[i].taskId}`,
                credentials: "include"
            });
            const data = await response.json();
            if (data && data.data) {
                arr[i].userName = data.data.userName;//姓名
                arr[i].idCard = decodeURIComponent(data.data.identityCard).replace('RSA_', '');//身份证
                arr[i].phoneNum = decodeURIComponent(data.data.userPhone).replace('RSA_', '');//手机号
                arr[i].sTime = data.data.assignTime;//委案日期
                //arr[i].eTime = data.data.task
            }
            // debugger
        } catch (error) {
            console.error(error);
        }
    }
}

// 获取带*信息
async function fetchDataByBaseInfo() {
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>获取地址..`;
    for (let i = 0; i < arr.length; i++) {
        try {
            const response = await fetch("https://mi.aiyoumi.com/collectionWebBackend/workPlatform/getBasicUserInfo", {
                method: "POST",
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                body: JSON.stringify({
                    "taskId":`${arr[i].taskId}`
                }),
                credentials: "include"
            });
            const data = await response.json();
            // debugger
            if (data && data.result) {
                arr[i].workplace = data.result.workplace;//单位名
                arr[i].idcardAddr = data.result.idcardAddr;//身份证地址
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// 获取三方手机密文
async function fetchDataByUserContacts() {
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>获取三方..`;
    for (let i = 0; i < arr.length; i++) {
        try {
            const response = await fetch("https://mi.aiyoumi.com/collectionWebBackend/userContact/queryUserContacts", {
                method: "POST",
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                body: JSON.stringify({
                    "taskId":`${arr[i].taskId}`
                }),
                credentials: "include"
            });
            const data = await response.json();
            // debugger
            if (data && data.data) {
                for(let j=0;j<5;j++){
                    arr[i][`phoneRel${j+1}`]=data.data[j].name+'-'+data.data[j].relationship;//姓名+关系
                    arr[i][`phoneNum${j+1}`]=decodeURIComponent(data.data[j].phone).replace('RSA_', '');//手机号密文
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
//decrypt
async function decrypt(){
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>解密中...`;
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(key);
    array = arr.map(obj => {
        const decryptIdCard = decrypt.decrypt(obj.idCard);
        const decryptPhoneNum = decrypt.decrypt(obj.phoneNum);
        const decryptPhoneNum1 = decrypt.decrypt(obj.phoneNum1);
        const decryptPhoneNum2 = decrypt.decrypt(obj.phoneNum2);
        const decryptPhoneNum3 = decrypt.decrypt(obj.phoneNum3);
        const decryptPhoneNum4 = decrypt.decrypt(obj.phoneNum4);
        const decryptPhoneNum5 = decrypt.decrypt(obj.phoneNum5);
        return { ...obj, idCard: decryptIdCard, phoneNum: decryptPhoneNum,phoneNum1:decryptPhoneNum1,phoneNum2:decryptPhoneNum2,phoneNum3:decryptPhoneNum3,phoneNum4:decryptPhoneNum4,phoneNum5:decryptPhoneNum5};
    });
}
//导出
async function exportXlsx(){
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>导出中...`;
    const customHeader = ["姓名", "手机号", "身份证号","户籍地址","单位名","委案时间","当前未还","当前逾期","逾期本金","逾期费","逾期息费","联系人1","手机号1","联系人2","手机号2","联系人3","手机号3","联系人4","手机号4","联系人5","手机号5"];
    const formattedData = array.map(item => ({
        "姓名": item.userName,
        "手机号": item.phoneNum,
        "身份证号": item.idCard,
        "户籍地址": item.idcardAddr,
        "单位名": item.workplace,
        "委案时间": item.sTime,
        "当前未还": item.curUnpayTotalFee,
        "当前逾期": item.curOverdueTotalFee,
        "逾期本金": item.curOverdueCapitalFee,
        "逾期费": item.curOverdueFee,
        "逾期息费": item.curOverdueServiceFee,
        "联系人1": item.phoneRel1,
        "手机号1": item.phoneNum1,
        "联系人2": item.phoneRel2,
        "手机号2": item.phoneNum2,
        "联系人3": item.phoneRel3,
        "手机号3": item.phoneNum3,
        "联系人4": item.phoneRel4,
        "手机号4": item.phoneNum4,
        "联系人5": item.phoneRel5,
        "手机号5": item.phoneNum5,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: customHeader });
    worksheet['!cols'] = [
        { wch: 10 }, // 姓名
        { wch: 12 }, // 手机号
        { wch: 20 }, // 身份证号
        { wch: 20 }, // 单位名
        { wch: 20 }, // 单位名
        { wch: 20 }, // 委案时间
        { wch: 10 }, // 当前未还
        { wch: 10 }, // 当前逾期
        { wch: 10 }, // 逾期本金
        { wch: 10 }, // 逾期费
        { wch: 10 }, // 逾期息费
        { wch: 10 }, // 联系人1
        { wch: 12 }, // 手机号1
        { wch: 10 }, // 联系人2
        { wch: 12 }, // 手机号2
        { wch: 10 }, // 联系人3
        { wch: 12 }, // 手机号3
        { wch: 10 }, // 联系人4
        { wch: 12 }, // 手机号4
        { wch: 10 }, // 联系人5
        { wch: 12 }, // 手机号5
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_爱又米-导出数据.xlsx`);
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-success"></i> 导出成功 `;
    setTimeout(function(){
        document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-printer"></i>导出信息`;
    },5000)
}