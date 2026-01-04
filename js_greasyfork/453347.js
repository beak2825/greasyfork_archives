// ==UserScript==
// @name         find reviewers by SI
// @version      0.7
// @description  用来过滤审稿人
// @author       Zero
// @match        *://www.mdpi.com/special-issues*
// @require     https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license             End-User License Agreement
// @namespace http://www.hechao.fun/
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/453347/find%20reviewers%20by%20SI.user.js
// @updateURL https://update.greasyfork.org/scripts/453347/find%20reviewers%20by%20SI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 复制
    function zeroCopy(text){
        GM_setClipboard(text);
        console.log(text, '复制成功！');

    }

    // 过滤数据
    function filterData(){
        if(!document.getElementById('middle-column')) return;
        const nodeList = document.getElementById('middle-column').children[1].children[0].children[1].children[1];
        let trueData = [];
        let trueDatas = [];
        let describes = [];
        const month_obj = {January: '01',February: '02',March: '03',April: '04',May: '05',June: '06',July: '07',August: '08',September: '09',October: '10',November: '11',December: '12'  }
        for(let item of nodeList.children){
            const date_str = item.children[3].innerText.replace('closed (','').replace(/\)/g,'').split(' ');
            if(date_str>3) continue;
            const date = `${date_str[2]}/${month_obj[date_str[1]]}/${date_str[0]}`;
            const time = item.children[4].innerText;
            // 参考日期
            const judge_date = new Date('2022-10-30 23:59:59').valueOf();
            if(new Date(date).valueOf() >judge_date && time > 2){
                const describe = item.children[2].children[0].innerText;
                item.children[4].style.cursor = 'pointer';
                item.children[4].onclick = function(){
                    item.children[4].style.color = '#fb0505';
                    zeroCopy(describe);
                }
                trueData.push(item);
                trueDatas.push({
                    date,
                    time,
                    describe: item.children[2].children[0].innerText

                });
                describes.push(describe);
            }
        }
        nodeList.innerHTML = '';
        for(let item of trueData){
            nodeList.appendChild(item)
        }
        console.table(trueDatas);
        if(describes.length > 0) zeroCopy(describes.join('、'));

    }

   
        let searchContent = `<button id="zeroFilter" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999998; font-size: 16px;padding: 8px 15px;background-color: #21C6E4;border: none;border-radius: 5px;"
>Filter</button
>`;
        $('body').append(searchContent);
        $('#zeroFilter').on('click',filterData)
   

})();