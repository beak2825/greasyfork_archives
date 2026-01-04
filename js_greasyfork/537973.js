// ==UserScript==
// @name         艾利斯顿皇家医学院-评教脚本
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.3.0
// @description  自动评教，自动跳过弹窗
// @author       You
// @match        http://oa.csmu.edu.cn:8099/jsxsd/xspj/xspj_edit.do?*
// @match        http://oa.csmu.edu.cn:8099/jsxsd/xspj/xspj_list.do?*
// @match        http://oa.csmu.edu.cn:8099/jsxsd/xspj/xspj_find.do*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537973/%E8%89%BE%E5%88%A9%E6%96%AF%E9%A1%BF%E7%9A%87%E5%AE%B6%E5%8C%BB%E5%AD%A6%E9%99%A2-%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/537973/%E8%89%BE%E5%88%A9%E6%96%AF%E9%A1%BF%E7%9A%87%E5%AE%B6%E5%8C%BB%E5%AD%A6%E9%99%A2-%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局覆盖 alert 和 confirm
    window.alert = () => { };
    window.confirm = () => true;

    // 检查并点击包含特定文本的链接
    function clickLinkByText(textArr) {
        const links = Array.from(document.getElementsByTagName('a'));
        for (let text of textArr) {
            const target = links.find(link => link.textContent.trim() === text);
            if (target) {
                target.click();
                return true;
            }
        }
        return false;
    }

    // 自动点击“进入评价”或“评价”链接
    const found = clickLinkByText(['进入评价', '评价']);

    // 自动点击一系列ID的按钮
    const idsToClick = [
        "pj0601id_1_1", "pj0601id_2_2", "pj0601id_3_1",
        "pj0601id_4_1", "pj0601id_5_2", "pj0601id_6_1",
        "pj0601id_7_1", "pj0601id_8_2", "pj0601id_9_2",
        "pj0601id_10_1", "pj0601id_11_2", "pj0601id_12_1",
        "pj0601id_13_1", "pj0601id_14_1", "pj0601id_15_1",
        "pj0601id_16_2", "pj0601id_17_1"
    ];

    // 延时执行，确保页面元素加载完成
    setTimeout(() => {
        idsToClick.forEach(id => {
            if (!id) return;
            const element = document.getElementById(id);
            if (element) {
                element.click();
                // element.checked = true;
                document.querySelector('#jynr').textContent = "暂无";
                document.querySelector('#tj').click();
            } else {
                console.warn('没有找到ID为 ' + id + ' 的元素');
            }
        });
    }, 500); // 0.5秒后执行
    // 如果需要自动翻页，可以取消注释以下代码
    /*
    if (!found) {
        const nextPageButton = document.getElementById('PagingControl1_btnNextPage');
        if (nextPageButton) {
            nextPageButton.click();
        } else {
            console.error('没有找到ID为 \"PagingControl1_btnNextPage\" 的“下一页”按钮');
        }
    }
    */
})();