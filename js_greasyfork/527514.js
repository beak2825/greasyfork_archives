// ==UserScript==
// @name         选课标识辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  高亮标注有课状态，以及仅看有课的筛选
// @author       Erix
// @license      MIT
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseQuery/getCurriculmByForm.do*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseQuery/queryCurriculum.jsp*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseQuery/engGridFilter.do*
// @icon         https://www.pku.edu.cn/pku_logo_red.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527514/%E9%80%89%E8%AF%BE%E6%A0%87%E8%AF%86%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/527514/%E9%80%89%E8%AF%BE%E6%A0%87%E8%AF%86%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const underLimitStyle = 'background-color: #abebc6; color: #145a32';
    const reachLimitStyle = 'background-color: #f5b7b1; color: #7b241c';

    const table = document.querySelector('table.datagrid');
    const rows = table.querySelectorAll('tr.datagrid-all,tr.datagrid-even,tr.datagrid-odd');

    let index = 10;
    rows.forEach(row => {
        const EngSign = row.children[2].textContent.trim();
        if (EngSign === 'Y' || EngSign === 'A' || EngSign === 'B' || EngSign === 'C' || EngSign === 'C+' ){
            index = 11;
        }
        const capacity = row.children[index].textContent.trim();

        const match = capacity.match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
            const firstNumber = parseInt(match[1], 10);
            const secondNumber = parseInt(match[2], 10);
            //console.log(firstNumber, secondNumber);
            if (firstNumber > secondNumber){
                row.children[index].style = underLimitStyle;
            } else{
                row.children[index].style = reachLimitStyle;
            }
        } else {
            console.error("Invalid format:", capacity);
        }
    });
    function courseFilter() {
        if(btn.textContent === '只看有课'){
            btn.textContent = '查看全部';
            rows.forEach(row => {
                const capacity = row.children[index].textContent.trim();

                const match = capacity.match(/(\d+)\s*\/\s*(\d+)/);
                if (match) {
                    const firstNumber = parseInt(match[1], 10);
                    const secondNumber = parseInt(match[2], 10);
                    //console.log(firstNumber, secondNumber);
                    if (firstNumber <= secondNumber){
                        row.style.display = 'none';
                    }
                } else {
                    console.error("Invalid format:", capacity);
                }
            });
        }else{
            btn.textContent = '只看有课';
            rows.forEach(row => {
                row.style.display = '';
            });
        }
    }
    const btn = document.createElement('button');
    btn.style.fontSize = '12px';
    btn.textContent = '只看有课';
    btn.onclick = courseFilter;
    const inputBox = document.querySelector('table.datagrid');
    inputBox.parentNode.insertBefore(btn, inputBox);
})();