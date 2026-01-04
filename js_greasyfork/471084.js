// ==UserScript==
// @name         自动点击
// @version      1.0.2
// @author       姚俊华
// @description  自动点击继续学习按钮
// @match        *://*/*
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace https://gitee.com/webyjh
// @downloadURL https://update.greasyfork.org/scripts/471084/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/471084/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==



(function() {
    'use strict';
    console.log("开始记录日志");
    console.log("location.hostname:",location.hostname);
        if(location.hostname == "jspx.tze.cn"){
            setInterval(() => {
                const el_main= document.querySelector(".el-main");
                if (el_main!==null){
                    const img_ele = document.querySelector(".el-main").querySelector("img")
                    console.log(img_ele);
                    //获取点击继续计时图片element，当图片出现时，点击它
                    if (img_ele.style.display != 'none'){
                        img_ele.click();
                        console.log("已自动点击继续学习图片");
                    }
                }else{
                    console.log('未找到图');
                };
                //检查是否已学完,两个时间一样表示已经学完
    //            const t= document.querySelector(".left").querySelectorAll("span");
    //            var t1=t[0].innerText;
    //            var t2=t[1].innerText;
    //            console.log(t1,t2);
    //            if (t1==t2){
    //                GM_notification({
    //                    title: '恭喜你',
    //                    text: '当前小节已学完，请开始下一个学习。',
    //                    timeout: 55000,
    //                    onclick: function() {
    //                        console.log('点击通知');
    //                    }
    //                });
    //            }
            }, 500);
        }
    //自动点击脚本结束
})();