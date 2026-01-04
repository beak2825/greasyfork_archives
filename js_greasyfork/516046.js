// ==UserScript==
// @name         Red Leaves 做种条目筛选（配合批量认领使用）
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  红叶做种条目筛选脚本,清除含有特定字符串的条目（比如特定IP）
// @author       Hui-Shao
// @license      MIT
// @match        https://*.leaves.red/userdetails.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leaves.red
// @downloadURL https://update.greasyfork.org/scripts/516046/Red%20Leaves%20%E5%81%9A%E7%A7%8D%E6%9D%A1%E7%9B%AE%E7%AD%9B%E9%80%89%EF%BC%88%E9%85%8D%E5%90%88%E6%89%B9%E9%87%8F%E8%AE%A4%E9%A2%86%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516046/Red%20Leaves%20%E5%81%9A%E7%A7%8D%E6%9D%A1%E7%9B%AE%E7%AD%9B%E9%80%89%EF%BC%88%E9%85%8D%E5%90%88%E6%89%B9%E9%87%8F%E8%AE%A4%E9%A2%86%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 创建 input 元素
    const btn_inst = document.createElement('input');

    // 设置按钮的属性
    btn_inst.setAttribute('class', 'btn');
    btn_inst.setAttribute('type', 'button');
    btn_inst.setAttribute('id', 'my_filter_btn');
    btn_inst.setAttribute('value', '筛选');
    btn_inst.setAttribute('style', 'padding:0.5px 2px;margin-left:8px;margin-right:4px;');
    btn_inst.onclick = async function () {
        btn_inst.disabled = true;
        my_filter();
        btn_inst.disabled = false;
    };

    // 插入按钮
    const td = Array.from(document.querySelectorAll(".rowhead")).find(
        (el) => el.textContent === "当前做种"
    ).nextElementSibling;
    td.querySelector('a').insertAdjacentElement('afterend', btn_inst);


    function my_filter() {
        const str=prompt("[筛选脚本] 请输入关键字（用于移除）\n例如：放弃");
        if (!str) return;
        // 获取所有的 tr 元素
        document.querySelectorAll('#ka1 > table tr').forEach(row => {
            // 检查每一行是否包含 "特定字符"
            if (row.innerText.includes(str)) {
                // 如果包含，移除该行
                row.remove();
            }
        });
    }

})();