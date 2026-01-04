// ==UserScript==
// @name         我的测试Supan
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自行测试，哈哈哈哈
// @author       Supan
// @include      *hzxh.xclearn.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450071/%E6%88%91%E7%9A%84%E6%B5%8B%E8%AF%95Supan.user.js
// @updateURL https://update.greasyfork.org/scripts/450071/%E6%88%91%E7%9A%84%E6%B5%8B%E8%AF%95Supan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let func = () => {
    setInterval(() => {
        //继续学习按钮
        let study_btns = document.getElementsByTagName("p");
        for(let i=0;i<study_btns.length;i++){
            if(study_btns[i].innerHTML=="立即学习"){
                console.log("点击 立即学习")
                study_btns[i].click();
            }
        }
        //所有视频完成后 跳转到主页
        let not_jump_sign=false;
        let vedios = document.getElementsByClassName("videoPercent");
        for(let i=0;i<vedios.length;i++){
            if(vedios[i].innerHTML=="0%"){
                not_jump_sign=true;
            }
        }
        let has_active = document.getElementsByClassName("video_list_active");
        if(vedios.length && !not_jump_sign && !has_active.length){
            console.log("视频播放完跳转至首页")
            window.location.href="http://hzxh.xclearn.com/play/task/0/0";
        }
        let first_page_btns =
            document.getElementsByClassName("task_study_btn");
        if (first_page_btns.length) {
            console.log("点击继续学习")
            first_page_btns[0].click();
        }
        let start_btns =
            document.getElementsByClassName("prism-big-play-btn");
        if (start_btns.length) {
            if (!start_btns[0].classList.contains("pause")&&!start_btns[0].classList.contains("playing")) {
                console.log("初始页面执行")
                start_btns[0].click();
            }
        }

        let pause_btns = document.getElementsByClassName(
            "prism-big-play-btn pause"
        );
        if (pause_btns.length) {
            console.log("暂停后执行")
            pause_btns[0].click();
        }
        // let playing_btns = document.getElementsByClassName("prism-big-play-btn playing");
        // if(playing_btns.length){
        //     playing_btns[0].click();
        // }
        let continue_btns =
            document.getElementsByClassName("video_mask_img");
        if (continue_btns.length) {
            console.log("下一个视频执行")
            continue_btns[0].click();
        }
    }, 1000 * 5); //5秒执行一次
};
func();

    // Your code here...
})();