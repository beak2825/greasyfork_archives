

    // ==UserScript==
    // @name        京麦自动低价by离骚2.0
    // @namespace    http://tampermonkey.net/
    // @version      2.0
    // @description  京麦自动低价
    // @author       离骚
    // @match        https://*shop.jd.com/jdm/cz*
    // @icon        https://i2.hdslb.com/bfs/archive/42c654bf2d82328ae8e0f84784b47275cf7af1ee.jpg
  // @grant        GM_setValue
  // @grant        GM_getValue
 // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512120/%E4%BA%AC%E9%BA%A6%E8%87%AA%E5%8A%A8%E4%BD%8E%E4%BB%B7by%E7%A6%BB%E9%AA%9A20.user.js
// @updateURL https://update.greasyfork.org/scripts/512120/%E4%BA%AC%E9%BA%A6%E8%87%AA%E5%8A%A8%E4%BD%8E%E4%BB%B7by%E7%A6%BB%E9%AA%9A20.meta.js
    // ==/UserScript==

    (async function () {

         await new Promise(resolve => setTimeout(resolve, 4500));
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

            const idBtn=document.querySelectorAll(".rcd-button.rcd-button--primary");
                     for(let j=0;j<idBtn.length;j++)
                     {
                         if(idBtn[j].innerText=="确 认")
                         {
                             console.log("找到确定按钮");
                             idBtn[j].click();
                              await new Promise(resolve => setTimeout(resolve, 1000));
                             break;
                         }

                     }
           


            const tiaoBtns=document.querySelectorAll(".rcd-button.rcd-button--primary.is-link.shop-button-text");
            for(let i=0;i<tiaoBtns.length;i++)
            {

                 if(tiaoBtns[i].innerText=="调价提流量")
                 {
                     console.log('找到了'+i);
                     tiaoBtns[i].click();
                     const idBtn=document.querySelectorAll(".rcd-button.rcd-button--primary");
                     for(let j=0;j<idBtn.length;j++)
                     {
                         if(idBtn[j].innerText=="确 认")
                         {
                             console.log("找到确定按钮");
                             idBtn[j].click();
                              await new Promise(resolve => setTimeout(resolve, 1000));
                             break;
                         }

                     }
                     await new Promise(resolve => setTimeout(resolve, 1000));
              
                 }

            }

              await new Promise(resolve => setTimeout(resolve, 1500));
            // 点击确认修改
      

            // // 等待 1 秒后进入下一次循环
            // await new Promise(resolve => setTimeout(resolve, 1000));

        }
         await new Promise(resolve => setTimeout(resolve, 1000));

    })();

