// ==UserScript==
// @name         (新商盟)一键删除可用量=0的
// @namespace    none
// @version      0.1
// @description  none
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468076/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E5%8F%AF%E7%94%A8%E9%87%8F%3D0%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/468076/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E5%8F%AF%E7%94%A8%E9%87%8F%3D0%E7%9A%84.meta.js
// ==/UserScript==

//(方法一)一键删除可用量=0的+立即刷新(一次性删除所有)
/*var rows = document.getElementById('uladd').children;
for (var i = rows.length - 1; i >= 0; i--) {
    var spans = rows[i].getElementsByTagName('span');
    for (var span of spans) {
        if (span.id.startsWith('qty_lmt') && span.innerText.trim() == '0') {
            rows[i].getElementsByClassName('operation')[0].getElementsByClassName('delCgt')[0].click();
        }
    }
}

//获取所有class="num-span"并且id以qty_lmt_span_开头的元素的文本的值,每隔500毫秒检查一次,如果值都大于0,立即刷新一次页面
setInterval(function() {
    var elements = document.querySelectorAll('.num-span[id^="qty_lmt_"]');
    var allGreaterThanZero = true;
    for (var i = 0; i < elements.length; i++) {
        if (parseInt(elements[i].textContent) <= 0) {
            allGreaterThanZero = false;
            break;
        }
    }
    if (allGreaterThanZero) {
        location.reload();
    }
}, 500);*/



//(方法二)一键删除可用量=0的+立即刷新(分批删除)
const rows = document.querySelectorAll('#uladd > li');
let currentIndex = 0;
function processRow(row) {
    return new Promise(resolve => {
        const span = row.querySelector('span[id^="qty_lmt"]');
        if (span && span.textContent.trim() === '0') {
            row.querySelector('.operation .delCgt').click();
        }
        resolve();
    });
}
async function processRows() {// 定义一个函数来分批处理行
    const batchSize = Math.min(120, rows.length - currentIndex);// 计算本次需要处理的行数(数字50可以根据实际情况调整来获得最优效果)
    const batchRows = Array.from(rows).slice(currentIndex, currentIndex + batchSize);
    await Promise.all(batchRows.map(row => processRow(row)));// 同时处理所有行
    currentIndex += batchSize;
    if (currentIndex < rows.length) {
        requestAnimationFrame(processRows);
    }
}
processRows();// 开始分批处理行
//获取所有class="num-span"并且id以qty_lmt_span_开头的元素的文本的值,每隔500毫秒检查一次,如果值都大于0,立即刷新一次页面 用js实现
setInterval(function() {
    var elements = document.querySelectorAll('.num-span[id^="qty_lmt_"]');
    var allGreaterThanZero = true;
    for (var i = 0; i < elements.length; i++) {
        if (parseInt(elements[i].textContent) <= 0) {
            allGreaterThanZero = false;
            break;
        }
    }
    if (allGreaterThanZero) {
        location.reload();
    }
}, 500);