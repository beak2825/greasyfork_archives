// ==UserScript==
// @name         教师培训4月份
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  针对DG地区第三方培训
// @author       You
// @match        http://www.baidu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teacheredu.cn
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/466054/%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD4%E6%9C%88%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466054/%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD4%E6%9C%88%E4%BB%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        study();
    }, 5000);

    function study(){

        if(document.URL.includes('list2')){

            let items=document.querySelectorAll('div.list.ml25>div.item');
            [].slice.call(items).forEach((item,index)=>{
                console.log(item.innerText);
                //console.log(item.querySelector('div.h-tags.h-tag-white.mr10 span').innerText);
                let done=item.querySelector('div.h-tags.h-tag-white.mr10 span');
                if(done.innerText=='已学 0分钟')
                {
                    let goto=item.querySelector('div.right div span');
                    console.log(goto.innerText);
                    goto.click();

                    setTimeout(function() {
                        window.location.reload();
                    }, 5000);

                    //进入学习页面
                    //开始使用计时器





                    //结束就要跳回原来页面
                }
            })
            console.log('执行了');
        }



        if(document.URL.includes('time')){
            console.log('进入学习页面了');



            let timer = setInterval(() => {




               if( document.querySelector("div.el-message-box__btns > button"))
               {
               document.querySelector("div.el-message-box__btns > button").click();//20分钟提示
               }

                //let videoElement = document.querySelector('div.ccH5playerBox video');
                console.log(document.querySelector("#replaybtn").getAttribute('style'))
                let test= document.querySelector("#replaybtn").getAttribute('style').includes('block');
                //if(duration && currentTime ){
                if (test) {
                    console.log('The video has finished playing.');
                    clearInterval(timer);
                } else {
                    console.log('The video is still playing.');
                }
                //}
            }, 5000);


            setTimeout(function() {
                // document.querySelector("#app > div > div.header > div.bottom > div.right > div.btn").click();//结束学习
                console.log('点击结束');
                // document.querySelector("div.el-message-box__btns > button.el-button.el-button--primary").click();//单击确定按钮结束学习
                console.log('确定结束');
            }, 5000);

            setTimeout(function() {
                // document.querySelector("div.el-message-box__btns > button.el-button.el-button--primary").click();//单击确定按钮结束学习
                console.log('确定结束');
            }, 10000);

            setTimeout(function() {
                console.log('刷新页面');
                //window.location.reload();
            }, 15000);

        }

    }
})();