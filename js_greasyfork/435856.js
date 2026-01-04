// ==UserScript==
// @name         单个课程循环浏览
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  单个课程循环浏览.
// @author       maple
// @match        https://www.coaledu.net/html/coursePlay.html?courseID=*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.min.js
// @icon         https://www.coaledu.net/html/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435856/%E5%8D%95%E4%B8%AA%E8%AF%BE%E7%A8%8B%E5%BE%AA%E7%8E%AF%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/435856/%E5%8D%95%E4%B8%AA%E8%AF%BE%E7%A8%8B%E5%BE%AA%E7%8E%AF%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

/**
 * 脚本名：   煤炭远程教育培训网单个课程循环浏览
 * 版本：    1.0
 * 创建时间： 2020.11.21
 * 脚本用途：全国煤炭行业现代远程教育培训网单个课程循环浏览
 */

$(function () {
    let vlo = 0;

    let currentDate = "&*#";

    let dir = [];

    main();

    function main() {
        setTimeout(camera_pop, 1000);
        setTimeout(browse_main, 3000);
    }


    function camera_pop() {
        let pop = $(".el-message-box")[0];
        if (pop !=null){
            console.log("存在摄像头弹窗，处理")
            pop.getElementsByClassName("el-button")[0].click();
        }
    }

    function restart() {
        location.reload();
    }

    function browse_main() {
        console.clear();
        director();

        next();

        dpi();

        setInterval(play_loop, 3000);

    }


    function director() {

        let list = document.getElementsByClassName("tree-catalog")[0].getElementsByClassName("row1");
        for (let i = 0; i < list.length; i++) {
            let text = list[i].getElementsByTagName("span")[1].innerHTML;
            if (text.indexOf("%")!==-1){
                dir.push(list[i]);
            }
        }
        for (let i = 0; i < dir.length; i++) {
            console.log(dir[i])
        }

    }

    function next() {
        if (dir.length===0){
            restart();
        }

        console.log("未观看视频："+dir[0].getElementsByTagName("a")[0].title)
        dir[0].getElementsByTagName("a")[0].click();
    }

    function dpi() {
        $(".ccH5hdul").children("li")[1].click();
    }


    function play_loop() {

        play();

        let sum_date = play_bar();

        current_time();

        next_video();


        function next_video() {
            if (currentDate===sum_date && currentDate!== "00:00"){
                console.log("本视频结束")

                pop_first();

                evaluate();

                if (dir.length===0){
                    restart();
                }
                next();
            }
        }

    }

    function evaluate(){
        let div_display = $("comment-dialog").css("display");
        if (div_display!=="none"){
            console.log("取消评价")
            $(".el-button--default")[1].click();
        }
    }


    function pop_first() {
        dir.reverse();
        dir.pop();
        dir.reverse();
        console.log("未观看视频的个数为："+dir.length);
    }

    function play() {
        let play_button = $("#replaybtn");
        let play_status = play_button.css("display");
        if (play_status==="block"){
            play_button[0].click();
        }

        if (vlo===0){
            let audio = $(".ccH5vm");
            let volume = audio.css("background-position");
            if (volume!=="100% 50%"){
                audio[0].click();
            }
        }
    }

    function play_bar(){
        let time_node = $(".ccH5Time")[0];
        let sum_date = time_node.getElementsByClassName("ccH5TimeTotal")[0].innerHTML;

        return sum_date;
    }

    function current_time() {
        let time_node = $(".ccH5Time")[0];
        let current_date = time_node.getElementsByClassName("ccH5TimeCurrent")[0].innerHTML;
        console.log("当前观看："+current_date);
        currentDate = current_date;
    }

})