// ==UserScript==
// @name         zzl
// @version      0.3
// @description  用于zzl
// @author       You
// @match        https://bw.rsbsyzx.cn/#/examWebInfoNew?examId=cc6de80eeeaa4bd3ab65f7bad74bb9c2
// @match        https://bw.rsbsyzx.cn/#/examWebInfoNew?examId=76d2656509894a80b1512bf60bc87f5d
// @grant        GM_xmlhttpRequest
// @icon         https://lichlich.top/uploads/4ad434e3216087aa3f789ad53f8f44e6
// @namespace    https://greasyfork.org/users/322194
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446284/zzl.user.js
// @updateURL https://update.greasyfork.org/scripts/446284/zzl.meta.js
// ==/UserScript==

const xhr = option => new Promise((resolve, reject) => {
  GM.xmlHttpRequest({
    ...option,
    onerror: reject,
    onload: resolve,
  });
})



(function () {
  'use strict';
  // Your code here...
  alert('寻找答案已启用')
  setTimeout(() => {
    var btn = document.createElement('span');
    btn.setAttribute('id', 'myAnswerBtn');
    btn.setAttribute('style', 'display:inline-block;width:80px;height:60px;background-color:blue;color:red;z-index:999');
    btn.innerHTML = '获取答案';
    console.log('btn:', btn);
    btn.addEventListener('click', getTitle)
    var nextBtn = document.querySelectorAll('.btn04_cui.ml20')[0]
    console.log('nextbtn:', nextBtn);
    var btnFath = nextBtn.parentElement;
    btnFath.appendChild(btn)
    console.log('btnFath:', btnFath);
  }, 1000)


})();

async function getTitle() {

  const eTitle = document.querySelectorAll('.f18')[7]
  const title = eTitle.innerText;
  const res = await xhr({
    method: "POST",
    url: "http://localhost:3000/blog/zzls/search",
    data: {
      searchText: title
    }
  })
  console.log(res);
}