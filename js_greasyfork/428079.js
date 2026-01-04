// ==UserScript==
// @name        方正教务系统自动评教脚本
// @namespace   Violentmonkey Scripts
// @match       http*://*.edu.cn/*xspjgl/xspj_cxXspjIndex.html*
// @match       http://jwxt.hznu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @match       https://jwgl.njtech.edu.cn/xspjgl/xspj_cxXspjIndex.html*
// @match       http://jwxt.ujnpl.com/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @grant       none
// @version     2.10
// @author      PairZhu
// @description 方正教务系统自动评教脚本，随机选择一个赞同，其余选择完全赞同，并添加评语（目前只测试过南工大、杭师大、烟台科技学院）
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/428079/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428079/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
const wait = ms => {
  return new Promise(resolve => {
    const rt = () => resolve()
    setTimeout(rt, ms)
  })
}
const alldo = async () => {
  let k = 0;
  for (let j of document.querySelector("#tempGrid > tbody").children) {
    if (j.querySelector("td:nth-child(8)").innerText == "未评") {
      j.click();
      await wait(1000);
      await evaluation();
      await wait(500);
    }
  }
  alert("完成");
}
const evaluation = async() => {
  let arr = document.querySelectorAll(".radio-pjf");
  for (let i = 0; i < arr.length; i += 5) {
    arr[i].click();
  }
  let num = Math.floor(Math.random() * arr.length / 5);
  arr[5 * num + 1].click();
  document.querySelector(".form-control").value = document.querySelector("#auto-evalution").value;
  $("#btn_xspj_tj").data('enter','1');
  $("#btn_xspj_tj").click();
  $("#btn_ok").click();
}
const init = async () => {
  console.log('begin');
  while (!document.querySelector("#kc-head")) {
    await wait(1000);
  }
  console.log('finish');
  let tempe = document.createElement('button');
  tempe.innerText = '全部评价';
  tempe.type = 'button';
  tempe.onclick = alldo;
  document.querySelector("#kc-head").appendChild(tempe);
  tempe = document.createElement('button');
  tempe.innerText = '评价当前页';
  tempe.type = 'button';
  tempe.onclick = evaluation;
  document.querySelector("#kc-head").appendChild(tempe);
  tempe = document.createElement('br');
  document.querySelector("#kc-head").appendChild(tempe);
  tempe = document.createElement('span');
  tempe.innerText = '评语：';
  document.querySelector("#kc-head").appendChild(tempe);
  tempe = document.createElement('input');
  tempe.id = 'auto-evalution';
  tempe.value = '很好';
  document.querySelector("#kc-head").appendChild(tempe);
}
setTimeout(init, 100);