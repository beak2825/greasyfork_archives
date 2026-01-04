// ==UserScript==
// @name         广东省教育双融双创智慧共享社区
// @namespace    http://tampermonkey.net/
// @version      2025-05-29
// @description  广东省教育“双融双创”平台提供教育资源共享、名师工作室和教学研究服务，助力教育事业发展。
// @author       yygdz1921
// @match        https://srsc.gdedu.gov.cn/course/study?courseId=*
// @match        https://srsc.gdedu.gov.cn/course/study/questionnaire?courseId=*
// @match        https://srsc.gdedu.gov.cn/course/study/questionnaireContent?courseId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdedu.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537227/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E8%82%B2%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E6%99%BA%E6%85%A7%E5%85%B1%E4%BA%AB%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/537227/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E8%82%B2%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E6%99%BA%E6%85%A7%E5%85%B1%E4%BA%AB%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const tick_ms = 15 * 1000; // 检查间隔
    const tips = "首次进入【课程学习页】，须您手动开始视频播放！！！";
    let count = 0;
    let log = function(...args){
        console.log(`[Tampermonkey][${(++count).toString().padStart(9, "0")}]`, ...args);
    }
    const cn_progress = "DN_course_study_resource_tag el-tag el-tag--plain";

    // 显示弹出信息
    function showPopupMessage(message, duration) {
        var popup = document.createElement('div');
        popup.innerText = message;
        popup.style.display = 'block';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#f9f9f9';
        popup.style.padding = '20px'; // 增加内边距，防止字体超出边界
        popup.style.border = '1px solid #ccc';
        popup.style.color = 'red';
        popup.style.fontSize = '50px'; // 设置字体大小为50像素
        popup.style.maxWidth = '80%'; // 设置最大宽度，防止过长的文本导致元素过宽
        popup.style.textAlign = 'center'; // 文本居中显示
        popup.style.lineHeight = '1.2'; // 或者具体像素值，例如 '60px'
        document.body.appendChild(popup);

        // 删除弹出信息
        setTimeout(function() {
            popup.parentNode.removeChild(popup);
        }, duration);
    }

    // 解析进度标签：进度：9/26
    function is_finish(progress){
        let [_, ratio] = progress.split("：");
        let [l, r] = ratio.split("/");
        l = parseInt(l);
        r = parseInt(r);
        log("[is_finish]", progress, l, ">=", r, l >= r);
        return l >= r;
    }

    // 视频是否播放中
    function is_playing(){
        // 选择第一个视频元素
        const video = document.getElementsByTagName("video")[0];
        if (video) {
            const isPlaying = !!(
                video.currentTime > 0 &&
                !video.paused &&
                !video.ended &&
                video.readyState >= 2
            );
            log("[is_playing]", "视频正在播放：", isPlaying);
            return isPlaying;
        } else {
            log("[is_playing]", "页面没有视频元素!!!");
            return false;
        }
    }

    async function tick(){
        try{
            log("tick==================================>");
            showPopupMessage(`挂机中！(${tips})`, tick_ms);
            // 继续学习按钮
            let btn_jixu = document.querySelector("body > div:nth-child(9) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button");
            if(btn_jixu){
                btn_jixu.click();
            }
            // 目录
            let content = document.querySelector("#app > div > div > div > section > main > div > div > div:nth-child(2) > div > div.content > div.x-course-trans.x-infor > div > div.content");
            // 遍历章节
            let list = content.getElementsByClassName("list");
            for(let l of list){
                let progress = l.getElementsByClassName("title")[0].getElementsByClassName(cn_progress)[0].innerText;
                log("list", l, progress);
                // 跳过
                if(is_finish(progress) || is_playing()){
                    continue;
                }
                // 点一下 第几章
                l.getElementsByClassName("title")[0].click();
                log("click list");
                let sections = l.getElementsByClassName("section");
                for(let section of sections){
                    let section_progress = section.getElementsByClassName(cn_progress)[0].innerText;
                    log("section", section, section_progress);
                    // 跳过
                    if(is_finish(section_progress) || is_playing()){
                        continue;
                    }
                    // 点一下 第几节
                    section.getElementsByClassName("ant-row")[0].click();
                    log("click section");
                    // 点一下 学习任务 让资源列表刷新内容
                    let headlines = section.getElementsByClassName("headline");
                    if(headlines.length > 0){
                        headlines[headlines.length - 1].click();
                    }
                    // 切换到资源列表进行操作
                    let resource = document.getElementsByClassName("x-course-trans c-resourceItem");
                    for(let res of resource){
                        let res_progress = res.getElementsByClassName(cn_progress)[0].innerText;
                        log("res", res, res_progress);
                        // 跳过
                        if(res_progress.includes("已完成") || is_playing()){
                            continue;
                        }
                        // 点一下 资源
                        res.click();
                        log("click res");
                        // 阻塞几秒
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        // 开始播放
                        let btn = document.getElementsByClassName("xgplayer-start")[0];
                        if (btn) {
                            btn.click();
                            log("click btn");
                            // 继续阻塞几秒
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            let v = document.getElementsByTagName("video")[0];
                            if(v){
                                v.play();
                                log("开始播放。。。");
                            } else {
                                log("video为空！")
                            }
                        } else {
                            log("btn为空！");
                        }
                        return;
                    }
                }
            }
        }catch(e){
            log(e);
        }finally{
            setTimeout(tick, tick_ms);
        }
    }

    // 问卷调查
    function question(){
        // 单选题 选C
        let radios = document.getElementsByClassName("ant-radio-input");
        for(let i = 2; i < radios.length; i = i +4){
            let radio = radios[i];
            radio.click();
        }
        // 多选题 全选
        async function checkAllWithDelay() {
            let checkboxes = document.getElementsByClassName("ant-checkbox-input");
            for(let j = 0; j < checkboxes.length; j++){
                let cb = checkboxes[j];
                cb.click(); // 勾选
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        checkAllWithDelay();
    }

    function main(){
        // 问卷调查页面
        if(location.href.includes("questionnaire")){
            showPopupMessage("出现调查题后按一下键盘【G】", tick_ms);
        } else {
            showPopupMessage(tips, tick_ms);
            setTimeout(tick, tick_ms);
        }

    }

    document.addEventListener("keydown", function(event) {
        console.log("keydown", event.code);
        if (event.code === "KeyG") {
            question();
        }
    });
    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        window.addEventListener("load", main, { once: true });
    }
})();