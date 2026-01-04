// ==UserScript==
// @name         dlsite简繁申请检测
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  点击右下角按钮启动 强烈建议！！进入页面等待数秒再点击！最好是等封面全都加载完！不然会导致结果错误 如果不放心可以抽查几个检查 出现bug刷新页面后重新尝试
// @author       feiyu
// @match        *www.dlsite.com/home/works/translatable*
// @match        *www.dlsite.com/maniax/works/translatable*
// @match        *www.dlsite.com/girls/works/translatable*
// @match        *www.dlsite.com/bl/works/translatable*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534663/dlsite%E7%AE%80%E7%B9%81%E7%94%B3%E8%AF%B7%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534663/dlsite%E7%AE%80%E7%B9%81%E7%94%B3%E8%AF%B7%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //创建并添加固定位置按钮
    const button = document.createElement('button');
    button.id = 'fixedButton';
    button.innerText = '简繁申请检测 建议进入页面等待数秒最好封面全部加载后点击';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    //按钮点击事件处理
    button.addEventListener('click', async function() {
    const tableDataArray = []//所有的申请情况表格数组
    const buttons = document.querySelectorAll('.reception_status_btn');

    //点击按钮展开表格 收集申请情况 暂定一秒点二十次左右
    await Promise.all(Array.from(buttons).map(async (button, index) => {
        return new Promise(resolve => {
            setTimeout(() => {
                //点击申请中按钮
                button.click();

                setTimeout(() => {
                    //申请情况表格元素
                    const table = button.closest('li').querySelector('.translation_table');

                    //数据收集到数组中
                    if (table) {
                        const rows = table.querySelectorAll('tr');
                        const tableData = [];
                        rows.forEach(row => {
                            const cells = row.querySelectorAll('th, td');
                            const rowData = Array.from(cells).map(cell => cell.textContent.trim());
                            tableData.push(rowData);
                        });

                        tableDataArray.push(tableData);
                    }
                    resolve();
                }, 20);//等待秒数
            }, index * 30);//点击速度
        });
    }));

    console.log(tableDataArray)

    //获取所有li元素
    const liElements = document.querySelectorAll('.n_worklist .search_result_img_box_inner');

    //遍历数据数组
    tableDataArray.forEach((item, index) => {

        //获取简繁数组数据
        const sc = item.find(row => row[0] === "简体中文");
        const tc = item.find(row => row[0] === "繁体中文");

        //是否满足条件
        if (sc && tc) {
            // 检查简繁的申请和发售是否为0
            const simplifiedZero = sc[1] === "0" && sc[2] === "0";
            const traditionalZero = tc[1] === "0" && tc[2] === "0";

            if (simplifiedZero && traditionalZero) {
                //获取对应的li中的img
                const img = liElements[index].querySelector('.work_img_main .search_img.work_thumb a img');
                if (img) {
                    //替换img变文字
                    const parent = img.parentElement; //a标签
                    parent.innerHTML = '<div style="display: flex; font-size:20px; justify-content: center; align-items: center; height: 100%; color: aqua; font-weight: bold;">简繁均无人申请</div>';
                }
            }
        }
    });

    });
})();

