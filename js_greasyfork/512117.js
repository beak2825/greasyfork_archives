// ==UserScript==
// @name         Jing京Mai麦 by 黎骚
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  京麦自动
// @author       离骚
// @match        https://*shop.jd.com/jdm/cz*
// @icon         https://img01.yzcdn.cn/v2/image/yz_fc.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512117/Jing%E4%BA%ACMai%E9%BA%A6%20by%20%E9%BB%8E%E9%AA%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/512117/Jing%E4%BA%ACMai%E9%BA%A6%20by%20%E9%BB%8E%E9%AA%9A.meta.js
// ==/UserScript==

(async function () {

     await new Promise(resolve => setTimeout(resolve, 1500));
      // 点击第4个下拉菜单项
    document.querySelectorAll(".rcd-select-dropdown__item")[3].click();
    console.log("第4个下拉菜单项已点击");
    // 等待 1 秒
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 点击第5个下拉菜单项
    document.querySelectorAll(".rcd-select-dropdown__item")[4].click();
    console.log("第5个下拉菜单项已点击");
    //查询按钮
       document.querySelectorAll("button")[12].click();
    // 等待 1 秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 获取分页数量
    const many = document.querySelectorAll(".rcd-pager li");

    for (let i = 0; i < many.length; i++) {
        const ele = many[i];

        // 点击分页按钮
        ele.click();
        console.log(`分页按钮 ${i+1} 已点击`);
        // 等待 1 秒
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 点击全选
        const checkboxes = document.querySelectorAll(".rcd-checkbox__original");
        if (checkboxes.length > 1) {
            checkboxes[1].click();
            console.log('全选已点击');
            // 等待 1 秒
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 点击批量修改
        const batchModifyButtons = document.querySelectorAll(".rcd-button.is-plain");
        if (batchModifyButtons.length > 1) {
            batchModifyButtons[1].click();
            console.log('批量修改已点击');
            // 等待 1 秒
            await new Promise(resolve => setTimeout(resolve, 1000));
        }


        await new Promise(resolve => setTimeout(resolve, 25000));
        // 点击确认修改
       let confirmButtons= document.querySelectorAll('.rcd-button.rcd-button--primary');

        for(let i=0;i<confirmButtons.length;i++)
        {
            if(confirmButtons[i].innerText=='一键改价')
            {
                confirmButtons[i].click();
                break;
            }

        // 等待 1 秒后进入下一次循环
        await new Promise(resolve => setTimeout(resolve, 2000));
       }
    }

})();