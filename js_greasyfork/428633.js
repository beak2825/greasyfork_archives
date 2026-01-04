// ==UserScript==
// @name         抢课
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  抢
// @author       Jeaz
// @include      *://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/*default/curriculavariable.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428633/%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/428633/%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'using strict'
 window.classID = [];
window.count = [];

function sendRequest(url, params, mode) {
  let request = new XMLHttpRequest();
  let result = new Promise((resolve)=>{
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        resolve(request.responseText);
      };
    };
  })
  request.open(mode, url, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.setRequestHeader('token', sessionStorage.token);
  request.send(params);
  return result;
}

function getTime(index) {
  let url = "http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteer.do";
  let mode = "POST";
  let params = `addParam=${buildAddVolunteerParam(window.classID[index]).addParam}`;  
  return sendRequest(url, params, mode).then((res)=>{
    let currentTime = JSON.parse(res).timestamp;
    let startTime = 1625014801000;                                               
    console.log(window.classID[index], " getTime: ", startTime-currentTime);
    // return 5000;
    return (startTime-currentTime);
  })
}

function robClass(index){
  let url = "http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteer.do";
  let mode = "Post";
  let params = `addParam=${buildAddVolunteerParam(window.classID[index]).addParam}`; 
  console.log("robClass done")
  sendRequest(url, params, mode).then((res)=>{
    let result = JSON.parse(res);
    if(result.code === '1'){
      console.log(result.msg);
    }else{
      if(window.count[index] > 20){                                           
        return;
      }
      window.count[index]++;                                                     
      setTimeout(robClass, 50, index);
    }
  })
}

function setData() {
  while(1) {
    let input = prompt("输入-1为结束");
    let data = Number(input);
    if(data === -1){
      return
    }else {
      window.classID.push(input);
      window.count.push(0);
    }

  }
}

function start(){
  setData();
  console.log(window.classID);
  window.classID.forEach((value, index)=>{
    getTime(index).then((res)=>{
      setTimeout(robClass, res, index);
      console.log(window.classID[index], '设置成功请等待');
    })
  })
}


start();
// Your code here...
})();