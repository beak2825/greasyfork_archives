// ==UserScript==
// @name         bipt北石化教学评价脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/456845-bipt%E5%8C%97%E7%9F%B3%E5%8C%96%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC
// @version      1.0
// @description  自动填写教学评价（默认好评）。填写后需要手动提交（目的是 可以根据自己需求修改评价）
// @author       金英诺
// @match        https://jwzx.bipt.edu.cn/academic/eva/index/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bipt.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456845/bipt%E5%8C%97%E7%9F%B3%E5%8C%96%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456845/bipt%E5%8C%97%E7%9F%B3%E5%8C%96%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

let tbody = document.getElementsByTagName("tbody")[3];
let tr = tbody.getElementsByTagName("tr");


// 选择题 全部选很同意。
 for(let i=1; i < tr.length-2; i++){
	 let td = tr[i].getElementsByTagName("td")[2];
	 let input = td.getElementsByTagName("input");
	 let choose = input[4].click();
 }


 // 我每周课外用于本门课程的学习时间约为: A.不到1小时；B.1到2小时；C.2到4小时；D.4到6小时；E.6小时以上（请根据实际填写选项）

 let td_2 = tr[tr.length-2].getElementsByTagName("td")[2];
 let text_2 = td_2.getElementsByTagName("textarea")[0];
 text_2.value += "B";


 // 你对该课程教学还有什么意见和建议？

 let td_1 = tr[tr.length-1].getElementsByTagName("td")[2];
 let text_1 = td_1.getElementsByTagName("textarea")[0];
 text_1.value += "无意见";


})();