// ==UserScript==
// @name         浙里心晴学生调查
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  用于浙里心晴学生心理测评
// @author       You
// @match        https://shengwj.aipsybot.com/lianxin-botsupport-server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aipsybot.com
// @license      Apache-2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521945/%E6%B5%99%E9%87%8C%E5%BF%83%E6%99%B4%E5%AD%A6%E7%94%9F%E8%B0%83%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/521945/%E6%B5%99%E9%87%8C%E5%BF%83%E6%99%B4%E5%AD%A6%E7%94%9F%E8%B0%83%E6%9F%A5.meta.js
// ==/UserScript==


//bj：存储各学校班级选项
let bj=["小学四年级","小学五年级","小学六年级","初一","初二","初三","职高一年级","职高二年级","职高三年级","高一","高二","高三","大一","大二","大三","大四"];
//school:调查学生名称
let school=["临海小学","哲商现代实验小学","临海市第五中学","台州学院附属中学","浙江省临海市大田中学","临海市第六中学","临海市中等职业学校","临海市高级职业中学"];

//随机生成数字字符串函数
function randomNum(n){
    var res = "";
    for(var i=0;i<n;i++){
        res += Math.floor(Math.random()*10);
    }
    return res;
}

//生成n位数字字母混合字符串
function generateMixed(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9',
                 'A','B','C','D','E','F','G','H','I','J','K','L','M',
                 'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < n ; i++) {
        var id = Math.floor(Math.random()*36);
        res += chars[id];
    }
    return res;
}

//生成[n,m]间的随机数字符患
function fullClose(n,m) {
    var res = "";
    var r;
    r= Math.floor(Math.random()*(m+1-n)+n);
    while(r>m) {
        r = Math.floor(Math.random()*(m+1-n)+n);
    }
    res+=r;
    return res;
}

//生成N,M的随机数字
function fulldata(n,m) {
    var r;
    r= Math.floor(Math.random()*(m+1-n)+n);
    while(r>m) {
        r = Math.floor(Math.random()*(m+1-n)+n);
    }
    return r;
}

//随机生成学校班级组合
function departmentExtend(){
    var i=fullClose(0,7);
    var j;
    var res = "";
    if (i<2){
        j=fullClose(0,2)
    }else if(i<4){
        j=fullClose(3,5)
    }else if(i<6){
        j=fullClose(9,11)
    }else{
        j=fullClose(6,8)
    }
    return school[i]+","+bj[j];
}

let userId;
let token;
let tokenV2;
let correlationID;
let browserRecordId;
let idCard;
let departmentLink=["2058-2139-2147-3367","2058-2139-2147-3368","2058-2139-2147-3369","2058-2139-2147-3370","2058-2139-2147-3371"]


//登记学生并获取userId,token,correlationID,browserRecordId.
// name:姓名，gender:性别，idCard：1731655038560，departmentExtend：学校班级，departmentLink：街道，古城街道是2058-2139-2147-3367  大洋街道2058-2139-2147-3368
//ext53:学号1－45，ext52:班级1－20，
//dj("江菀婷","女","临海市哲商现代实验小学,小学五年级","2058-2139-2147-3367","5","27")
async function dj(name,gender){
    idCard=randomNum(13);
    var ext53=fullClose(1,45);
    var ext52=fullClose(1,20);
    var requestData={
        "crowd": "01",
        "departmentExtend": departmentExtend(),
        "departmentLink":departmentLink[fulldata(0,4)],
        "ext50": "",
        "ext51": "",
        "ext52": ext52,
        "ext53": ext53,
        "gender": gender,
        "idCard":idCard,
        "name": name,
        "occupation": "学生",
        "phone": "",
        "studentExtensionModel": {
            "liveSchool": "0",
            "liveSchoolName": "否",
            "psychological": "0",
            "psychologicalName": "无",
            "schoolActivity": "0",
            "schoolActivityName": "否"
        }
    }
    fetch("https://shengwj.aipsybot.com/lianxin-botsupport-server/scale/package/save", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://shengwj.aipsybot.com/lianxin-botsupport-server/support/index.html",
        "body":JSON.stringify(requestData),
        "method": "POST",
        "mode": "cors"
    }).then(response=>response.json()).then(data=>{
        var data2=data.appdata;
        userId=data2.userId;
        // localStorage.setItem("userId11",userId);
        token=data2.token;
        correlationID=data.correlationID;
        console.log(data);
        console.log('userId:',userId);
        console.log('token:',token);
        console.log('correlationID:',correlationID);
        getbrowserRecordID(token);
    })
}

//获取browserRecordId
async function getbrowserRecordID(token){
    var brid={
        "activityId": "",
        "chnlCode": "SWJBOT",
        "examId": "2019060400000001",
        "partId": "521",
        "token": token
    }
    fetch("https://shengwj.aipsybot.com/scale-h5server/module/submitBrowserRecord", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://shengwj.aipsybot.com/scale-h5server/examV3/index.html?dd_enable_replace=true",
        "body":JSON.stringify(brid),
        "method": "POST",
        "mode": "cors"
    }).then(response=>response.json()).then(data=>{
        var data2=data.appdata;
        browserRecordId=data2.browserRecordId;
        console.log('browserRecordId:',browserRecordId);
        gettokenv2();
    });
}


async function gettokenv2(){
    fetch("https://shengwj.aipsybot.com/scale-h5server/examV3/index.html?dd_enable_replace=true#/V2.9/plate/plateDetail?channel=SWJBOT&plateId=521&token="+token+"&packageId=202311070035940&evaluationType=2&userId="+userId+"&useTokenV3=true", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1"
        },
        "referrer": "https://shengwj.aipsybot.com/lianxin-botsupport-server/support/index.html",
        "method": "GET",
        "mode": "cors"
    }).then(res => {
        tokenV2=document.cookie.slice(92,168);
        console.log(document.cookie);
        submitBrowserRecord();
    })
}

async function submitBrowserRecord(){
    var subbr={
        "activityId": "",
        "chnlCode": "SWJBOT",
        "examId": "2019060400000001",
        "partId": "521",
        "token": token
    }
    fetch("https://shengwj.aipsybot.com/scale-h5server/module/submitBrowserRecord", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://shengwj.aipsybot.com/scale-h5server/examV3/index.html?dd_enable_replace=true",
        "body": JSON.stringify(subbr),
        "method": "POST",
        "mode": "cors"
    }).then(res => {
        config();
    });
}

//config
async function config(){
    var configdata= {
        "channel": "SWJBOT",
        "chnlCode": "SWJBOT",
        "examId": "2019060400000001",
        "userId": userId
    }
    fetch("https://shengwj.aipsybot.com/scale-h5server/proxy/lianxin-botserver/assess/config", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://shengwj.aipsybot.com/scale-h5server/examV3/index.html?dd_enable_replace=true",
        "body": JSON.stringify(configdata),
        "method": "POST",
        "mode": "cors"
    }).then(res => {
       submit1();
    });
}



async function submit1(){
    var da={
        "browserRecordId":browserRecordId,
        "chnlCode": "SWJBOT",
        "costTime": fullClose(62,500),
        "examId": "2019060400000001",
        "exerciseOptList": [
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442060",
                "optionId": "2023101734442061",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442065",
                "optionId": "2023101734442066",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442070",
                "optionId": "2023101734442071",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442075",
                "optionId": "2023101734442076",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442080",
                "optionId": "2023101734442081",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442085",
                "optionId": "2023101734442086",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442090",
                "optionId": "2023101734442091",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442095",
                "optionId": "2023101734442096",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442100",
                "optionId": "2023101734442101",
                "optionSort": 1,
                "optionTitle": "没有",
                "optionType": "01",
                "score": 0,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442105",
                "optionId": "2023101734442107",
                "optionSort": 2,
                "optionTitle": "错",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442108",
                "optionId": "2023101734442109",
                "optionSort": 1,
                "optionTitle": "对",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442111",
                "optionId": "2023101734442113",
                "optionSort": 2,
                "optionTitle": "错",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442114",
                "optionId": "2023101734442115",
                "optionSort": 1,
                "optionTitle": "对",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442117",
                "optionId": "2023101734442118",
                "optionSort": 1,
                "optionTitle": "对",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442120",
                "optionId": "2023101734442122",
                "optionSort": 2,
                "optionTitle": "错",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442123",
                "optionId": "2023101734442125",
                "optionSort": 2,
                "optionTitle": "错",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442126",
                "optionId": "2023101734442127",
                "optionSort": 1,
                "optionTitle": "对",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442129",
                "optionId": "2023101734442130",
                "optionSort": 1,
                "optionTitle": "对",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            },
            {
                "examId": "2019060400000001",
                "exerciseId": "2023101734442132",
                "optionId": "2023101734442133",
                "optionSort": 1,
                "optionTitle": "对",
                "optionType": "01",
                "score": 1,
                "selected": true,
                "status": "1",
                "voiceUrl": ""
            }
        ],
        "moduleId": "2023101734442058",
        "stageStatus": false,
        "token": tokenV2.slice(92,168)
    }
    fetch("https://shengwj.aipsybot.com/scale-h5server/module/submitModuleResult", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://shengwj.aipsybot.com/scale-h5server/examV3/index.html?dd_enable_replace=true",
        "body":JSON.stringify(da),
        "method": "POST",
        "mode": "cors"
    }).then(response=>response.json()).then(data=>{
        console.log('data',data);
    }).then(res => {
       submit2();
    });
}

async function submit2(){
    var submit= {
        "chnlCode": "SWJBOT",
        "evaluationType": "2",
        "examId": "2019060400000001",
        "packageId": "202311070035940",
        "userId": userId
    }

    fetch("https://shengwj.aipsybot.com/scale-h5server/proxy/lianxin-botsupport-server/scale/package/submit", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://shengwj.aipsybot.com/scale-h5server/examV3/index.html?dd_enable_replace=true",
        "body":JSON.stringify(submit),
        "method": "POST",
        "mode": "cors"
    }).then(response=>response.json()).then(data=>{
        console.log('data',data);
    });
}



    let name=["包星航","陈静妤","程圣惟","洪靖嘉","黄泓涵","黄子桐","金渝霏","李欣妍","梁嘉宏","梁语汐","柳谢可","沈庭驹","汪梓桐","王谨程","王璟琦","王俊棋","王俊雅","王李国","王诗涵","王馨怡","王一洛","王以沫","王翊铭","王喻非","邬亦恬","项皈鑫","徐博文","徐佳皓","徐孙诺","徐甜夏","徐张韬","徐子舒","杨瑾瑜","叶子墨","虞锦宸","张浚豪","张露","张暘","张语童","赵奕晗","郑梓航","郑梓彤","周景坤","朱珈逸"];
    let gender=["男","女","男","女","男","女","女","女","男","女","女","男","女","男","男","男","女","男","女","女","男","女","男","男","女","男","男","男","女","女","男","女","女","男","男","男","女","男","女","女","男","女","男","女"];
    var c=0
    function xnxgbkgx(){
               if(c<name.length-1 ){
                 dj(name[c],gender[c]);
                   c=c+1;
                   console.log(name[c]);
               }else{
                   clearInterval(gx);
               }
    }
    let gx=setInterval("xnxgbkgx()","5000");


(function() {
    'use strict';

   // let name=[];
   // let gender=[];
  //  dj(name[0],gender[0]);




     // 创建姓名和性别提交区域
  const container = document.createElement('div');
  container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 80px;
      z-index: 9999;
      background-color: #f0f0f0;
      border-radius: 2px;
      padding: 2px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      cursor: move;
  `;

  const nameBox = document.createElement('input');
  nameBox.type = 'text';
  nameBox.placeholder = '请输入学生姓名';
    nameBox.id='name';
  nameBox.style.cssText = `
      width: 200px;
      padding: 5px;
      border: 2px solid #ccc;
      border-radius: 1px;
      font-size: 14px;
      cursor: text;
      margin-bottom: 0px;
  `;
 const genderBox = document.createElement('input');
  genderBox.type = 'text';
     genderBox.id='gender';
  genderBox.placeholder = '请输入学生性别';
  genderBox.style.cssText = `
      width: 200px;
      padding: 5px;
      border: 2px solid #ccc;
      border-radius: 1px;
      font-size: 14px;
      cursor: text;
      margin-bottom: 0px;
  `;
  const tjButton = document.createElement('button');
    tjButton.type = 'button';
    tjButton.id='submit';
    tjButton.innerHTML='提交';
    tjButton.style.cssText = `
      width: 200px;
      padding: 10px;
      border: 2px solid #ccc;
      border-radius: 10px;
      font-size: 14px;
      cursor: text;
      margin-bottom: 0px;
  `;

  const resultDiv = document.createElement('div');
  resultDiv.style.cssText = `
      margin-top: 0px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 14px;
      line-height: 1.4;
      cursor: default;
  `;

    container.appendChild(resultDiv);
    container.appendChild(nameBox);
    container.appendChild(genderBox);
    container.appendChild(tjButton);
    document.body.appendChild(container);
    resultDiv.textContent ="学生心理健康调查自动提交，请输入学生姓名和性别后点击提交按扭"
 document.getElementById('submit').addEventListener('click', function() {
      if (nameBox.value!=="" && genderBox.value!=="" ){
            dj(nameBox.value,genderBox.value);
           resultDiv.textContent =document.getElementById('name').value + "提交成功";
      }
     else{
         resultDiv.textContent ="姓名或性别不能为空";
     }
  });

})();