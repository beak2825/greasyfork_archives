// ==UserScript==
// @name         驼人云学堂自动刷视频-新版-V2.0
// @namespace    czy
// @version      2.6.3
// @description  云学堂视频自动播放-2024-08-05新增自动2倍速
// @author       czy
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http://*.yunxuetang.cn/plan/*.html
// @match        http://*.yunxuetang.cn/kng/plan/document/*
// @match        http://*.yunxuetang.cn/kng/view/document/*
// @match        http://*.yunxuetang.cn/kng/plan/video/*
// @match        http://*.yunxuetang.cn/kng/view/video/*
// @match        http://*.yunxuetang.cn/kng/view/package/*
// @match        http://*.yunxuetang.cn/kng/plan/package/*
// @match        http://*.yunxuetang.cn/kng/o2ostudy/video/*
// @match        http://*.yunxuetang.cn/mit/myhomeworkexprience*
// @match        http://*.yunxuetang.cn/kng/course/package/video/*
// @match        http://*.yunxuetang.cn/kng/course/package/document/*
// @match        http://*.yunxuetang.cn/sty/index.htm/*
// @match        http://*.yunxuetang.cn/kng/o2ostudy/document/*
// @match        https://*.yunxuetang.cn/plan/*.html
// @match        https://*.yunxuetang.cn/kng/plan/document/*
// @match        https://*.yunxuetang.cn/kng/view/document/*
// @match        https://*.yunxuetang.cn/kng/plan/video/*
// @match        https://*.yunxuetang.cn/kng/view/video/*
// @match        https://*.yunxuetang.cn/kng/view/package/*
// @match        https://*.yunxuetang.cn/kng/plan/package/*
// @match        https://*.yunxuetang.cn/kng/o2ostudy/video/*
// @match        https://*.yunxuetang.cn/mit/myhomeworkexprience*
// @match        https://*.yunxuetang.cn/kng/course/package/video/*
// @match        https://*.yunxuetang.cn/kng/course/package/document/*
// @match        https://*.yunxuetang.cn/sty/index.htm/*
// @match        https://*.yunxuetang.cn/kng/o2ostudy/document/*
// @match        https://*.yunxuetang.cn/kng/*
// @match        https://*.yunxuetang.cn/mit/*
// @match        https://*.yunxuetang.cn/sty/*
// @match        https://*.yunxuetang.cn/plan/*
// @match        https://*.yunxuetang.cn/*

// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @connect      none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/462977/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91-%E6%96%B0%E7%89%88-V20.user.js
// @updateURL https://update.greasyfork.org/scripts/462977/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91-%E6%96%B0%E7%89%88-V20.meta.js
// ==/UserScript==

(function () {
    function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 2%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }

    //新版本
    let currentTime = ""; //当前播放到的时间
    let playTopTxt = "";//还需 ****可完成本课程学习，加油
    if (document.getElementsByClassName('jw-text-elapsed')[0]) {
        currentTime = document.getElementsByClassName('jw-text-elapsed')[0].innerText;
    }
    if (document.getElementsByClassName('play-area-title')[0] && document.getElementsByClassName('play-area-title')[0].innerText) {
        playTopTxt = document.getElementsByClassName('play-area-title')[0].innerText;
    }
    //新版本
    Element.prototype.trigger = function (eventName) {
        this.dispatchEvent(new Event(eventName));
    }


    setInterval(() => {//定时器，5秒处理一次
        //触发看视频中的弹框
        Element.prototype.trigger = function (eventName) {
            this.dispatchEvent(new Event(eventName));
        }


        //新版本新版本新版本新版本新版本新版本新版本新版本新版本
        let myDocumentSpanArrayNew = "";
        if (document.getElementsByClassName('play-right-li')[0]) {
            myDocumentSpanArrayNew = document.getElementsByClassName('play-right-li')[0].getElementsByClassName('kng-chapter-title');//新的章节列表
        }


        //开始学习按钮
        if (document.getElementsByClassName('kngpc-playbutton ')[0]) {
            document.getElementsByClassName('kngpc-playbutton ')[0].trigger('click')
        }

        //继续学习按钮
        for (let i = 0; i < document.getElementsByClassName('yxtf-button').length; i++) {
            if (document.getElementsByClassName('yxtf-button')[i].innerText.indexOf('继续学习') > -1) {
                document.getElementsByClassName('yxtf-button')[i].trigger('click');
            }
        }
        //下一个任务
        if (document.getElementsByClassName('play-area-title')[0] && document.getElementsByClassName('play-area-title')[0].innerText.indexOf('可完成本课程学习') >= 0) {//当前没看完

        } else if (document.getElementsByClassName('yxtulcdsdk-uexam-preview-container').length > 0 && !document.getElementsByClassName('yxtulcdsdk-uexam-preview-container')[0].innerText.includes('考试')) {//当前不是考试界面且看完了
            if (document.getElementsByClassName('yxtf-button')[1]) {
                document.getElementsByClassName('yxtf-button')[1].trigger('click')
            }

        }

        //防治挂机的继续学习校验
        for (let i = 0; i < document.getElementsByClassName('yxt-button').length; i++) {
            if (document.getElementsByClassName('yxt-button')[i].innerText.indexOf('继续学习') > -1 && document.getElementsByClassName('yxt-button')[i].innerText != ('继续学习 (0s)')) {
                document.getElementsByClassName('yxt-button')[i].trigger('click');
            }
        }
        if (document.getElementsByClassName('play-area-title')[0] && document.getElementsByClassName('play-area-title')[0].innerText) {
            if (playTopTxt != "") {
                if (playTopTxt != document.getElementsByClassName('play-area-title')[0].innerText) {//不相同说明正在正常看
                    playTopTxt = document.getElementsByClassName('play-area-title')[0].innerText;
                } else {//相同说明放挂机出现了，刷新一下
                    location.reload();
                }
            }
        }
        //暂停处理
        if (document.getElementsByClassName('jw-text-elapsed')[0]) {
            if (currentTime == document.getElementsByClassName('jw-text-elapsed')[0].innerText) {//上一次的时间和当前时间一样，说明暂停了
                for (let i = 0; i < myDocumentSpanArrayNew.length; i++) {
                    if (myDocumentSpanArrayNew[i].classList.contains('color-primary-6')) {
                        currentTime = ""
                        myDocumentSpanArrayNew[i].parentNode.parentNode.trigger('click');
                    }
                }
            }
        } else {
            for (let i = 0; i < myDocumentSpanArrayNew.length; i++) {
                if (myDocumentSpanArrayNew[i].classList.contains('color-primary-6')) {
                    currentTime = ""
                    myDocumentSpanArrayNew[i].parentNode.parentNode.trigger('click');
                }
            }
        }

        //当前节播放完了吗
        if (myDocumentSpanArrayNew != "" && myDocumentSpanArrayNew.length > 0) {//有章节列表
            if (document.getElementsByClassName('play-area-title')[0].innerText.indexOf('可完成本课程学习') >= 0) {//当前没看完
                for (let i = 0; i < myDocumentSpanArrayNew.length; i++) {
                    if (myDocumentSpanArrayNew[i].classList.contains('color-primary-6')) {
                        if (i < myDocumentSpanArrayNew.length - 2) {
                            let toastTxt = '当前课程：' + myDocumentSpanArrayNew[i].innerText + "\n,下节课：" + myDocumentSpanArrayNew[i + 1].innerText;
                            //console.log('当前课程：'+myDocumentSpanArrayNew[i].innerText + ",下节课："+myDocumentSpanArrayNew[i+1].innerText)
                            Toast(toastTxt, 3000)
                        }
                    }
                }
            } else {//看完了
                for (let i = 0; i < myDocumentSpanArrayNew.length; i++) {
                    if (myDocumentSpanArrayNew[i].classList.contains('color-primary-6')) {
                        console.log('当前课程：' + myDocumentSpanArrayNew[i].innerText)
                        if (i < myDocumentSpanArrayNew.length - 2) {
                            currentTime = ""
                            myDocumentSpanArrayNew[i + 1].parentNode.parentNode.trigger('click');
                        }
                    }
                }
            }

        } else {//无章节列表
            //document.getElementsByClassName('yxtf-button')[1].trigger('click')

        }

        //重新给播放的时间赋值
        if (document.getElementsByClassName('jw-text-elapsed')[0]) {
            currentTime = document.getElementsByClassName('jw-text-elapsed')[0].innerText;
        }




        //新的内容添加
        let buttons = document.getElementsByTagName('button')
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText == '继续学习' || buttons[i].innerText == '开始学习') {
                buttons[i].trigger('click');
            }
        }
        let videos = document.getElementsByTagName('video');
        if (videos.length > 0) {//如果已经加载video了就防治暂停
            let mVideo = videos[0];
            if (mVideo.paused) {
                mVideo.play();
            }
        }
        //下一任务
        if (document.getElementsByClassName('yxtulcdsdk-main')) {
            if (videos.length > 0 && !(document.getElementsByClassName('yxtulcdsdk-main')[0].innerText.indexOf('可完成本课程学习') > -1)) {
                let page__chapter = document.querySelectorAll('.yxtulcdsdk-course-page__info .yxtulcdsdk-course-page__chapter .yxtulcdsdk-course-page__chapter-lock svg');
                if (page__chapter.length <= 0) {//下一任务
                    for (let i = 0; i < buttons.length; i++) {
                        if (buttons[i].innerText.indexOf("下一任务") > -1) {
                            buttons[i].trigger('click');
                        }
                    }

                    setTimeout(() => {
                        if (document.querySelectorAll('.yxtf-dialog__body button')) {
                            for (let j = 0; j < buttons.length; j++) {
                                if (buttons[j].innerText.indexOf("确定") > -1) {
                                    buttons[j].trigger('click');
                                }
                            }
                        }

                    }, 1000)
                } else {//下一小节
                    let ellipsis = document.querySelectorAll('.yxtulcdsdk-course-page__info .yxtulcdsdk-course-page__chapter  .ellipsis');
                    if (ellipsis.length > 0) {
                        let numEllipsis = 0;
                        for (let i = 0; i < ellipsis.length; i++) {
                            if (ellipsis[i].classList.contains('color-primary-6')) {
                                numEllipsis = i;
                            }
                        }
                        if (numEllipsis < (ellipsis.length - 1)) {
                            numEllipsis = numEllipsis + 1;
                            ellipsis[numEllipsis].parentElement.trigger('click')
                        } else {
                            for (let i = 0; i < buttons.length; i++) {
                                if (buttons[i].innerText.indexOf("下一任务") > -1) {
                                    buttons[i].trigger('click');
                                }
                            }

                            setTimeout(() => {
                                if (document.querySelectorAll('.yxtf-dialog__body button')) {
                                    for (let j = 0; j < buttons.length; j++) {
                                        if (buttons[j].innerText.indexOf("确定") > -1) {
                                            buttons[j].trigger('click');
                                        }
                                    }
                                }

                            }, 1000)
                        }
                    }
                }

            }
        }

        //开启倍速
        if (document.querySelectorAll('.jw-overlay ul li')) {
            let overlayX = document.querySelectorAll('.jw-overlay ul li');
            for (let i = 0; i < overlayX.length; i++) {
                if (overlayX[i].innerText.indexOf("×2") > -1) {
                    overlayX[i].trigger('click');
                }
            }
        }
        
        //2024-07-19新增---------------------------------------
        //用来判断当前元素是否显示了
        function isElementVisible(element) {
            return element.offsetParent !== null;
        }
        //根据按钮的文字判断是哪一个按钮
        function autoClick(element,str){
            if(element.innerText.indexOf(str) > -1){
                if(isElementVisible(element)){
                    element.click();
                    element.trigger('click');
                }
            }
        }
        let aButtons = document.querySelectorAll('button')
        for(let i = 0;i<aButtons.length;i++){
            autoClick(aButtons[i],"继续学习下一阶段");
        }
        //根据svg判断是否播放完了
        // 获取 class 为 "task-content-active" 的 div 元素
        var taskContentActiveDiv = document.querySelector('.task-content-active');

        // 检查是否找到该元素
        if (taskContentActiveDiv) {
            // 获取 div 内的 svg 标签
            const svgElement = taskContentActiveDiv.querySelector('svg');

            // 检查是否找到 svg 标签
            if (svgElement) {
                // 获取 svg 内的 path 标签
                const pathElement = svgElement.querySelector('path');

                // 检查是否找到 path 标签
                if (pathElement) {
                    // 获取 path 标签的 fill-rule 属性
                    const fillRule = pathElement.getAttribute('fill-rule');

                    // 检查 fill-rule 属性是否等于 "nonzero"
                    if (fillRule == 'nonzero') {
                        console.log('没播放完.');
                    } else {
                        console.log('播放完了.');
                        let nextButtons = document.querySelectorAll('button');
                        for(let i = 0;i<nextButtons.length;i++){
                            console.log(nextButtons[i].innerText)
                            if(nextButtons[i].innerText.indexOf('下一个') > -1){
                                nextButtons[i].click();
                                 //nextButtons[i].trigger('click');
                            }
                        }
                    }
                } else {
                    console.log('没找到svg里的path.');
                }
            } else {
                console.log('没找到svg.');
            }
        } else {
            console.log('没找到"task-content-active".');
        }
    //开启2倍速
    if(document.getElementsByClassName("jw-controlbar jw-background-color jw-reset").length != 0){
        //播放视频后设置2倍速
        if(document.querySelector(".yxtulcdsdk-fullsize").__vue__.$refs.player.getPlayer().getPlaybackRate() && 
        document.querySelector(".yxtulcdsdk-fullsize").__vue__.$refs.player.getPlayer().getPlaybackRate() != 2){
            document.querySelector(".yxtulcdsdk-fullsize").__vue__.$refs.player.getPlayer().setPlaybackRate(2)
        }
    }
    }, 5000)
})();