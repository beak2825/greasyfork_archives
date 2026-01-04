// ==UserScript==
// @name         南京理工大学自动评教
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  南京理工大学自动评教脚本，自动填入，需要先手动点进去
// @author       HuChuQi
// @match        http://*/njlgdx/xspj/xspj_edit.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=81.112
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469195/%E5%8D%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/469195/%E5%8D%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 设置全选第几个，反正是脚本，不会有人还要特意选其他的吧？默认第二个，修改chooseIndex设置默认位置，Ctrl+S保存
let chooseIndex = 2;
let table1 = document.querySelector('#table1')
let tbody = table1.firstElementChild;
let realChildNum = tbody.children.length-1;
// alert('孩子数量为：'+realChildNum);

for (let index = 1; index <= realChildNum; index++) {

    let child = tbody.children[index].children[1];

    for(let j=0;j<child.children.length;j+=2){
        child.children[j].checked = false;
    }
}
for (let index = 1; index <= realChildNum; index++) {
    let child = tbody.children[index].children[1];
    // 选择第几个
    let inputC = child.children[2*(chooseIndex-1)];
    inputC.checked = true;
}

})();