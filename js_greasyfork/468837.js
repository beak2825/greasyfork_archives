// ==UserScript==
// @name         绍兴市继续教育-新版
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  绍兴市专业技术人员继续教育，自动播放下一个，弹窗屏蔽
// @author       xiajie
// @match        http://220.191.224.159/*
// @match        http://jxjy.rsj.sx.gov.cn/*
// @icon         http://220.191.224.159/*favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/468837/%E7%BB%8D%E5%85%B4%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/468837/%E7%BB%8D%E5%85%B4%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E6%96%B0%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var vueInstances = null;
    var vueBox = null;
    var checkVueBox = setInterval(function(){
        if(findVueInstances().length > 0){
            vueInstances = findVueInstances();
            vueBox = vueInstances[0];
            clearInterval(checkVueBox);
            init();
        }
    },500);

    function findVueInstances() {
        // 遍历所有元素查找 Vue 实例
        const vueInstances = Array.from(document.querySelectorAll('*'))
        .map(el => el.__vue__)
        .filter(instance => instance);
        return vueInstances;
    }

    var checkCourse = null;
    var checkPlay = null;

    function init(){
        console.log('初始化成功');
        let path = vueBox.$route.path;
        console.log('初始路由===>',path);
        switchPath(path);

        vueBox.$router.afterHooks.push(()=>{
            let tmpPath = vueBox.$route.path;
            console.log('路由发生改变===>',tmpPath);
            switchPath(tmpPath);
        });
    }

    function switchPath(path){
        clearHandler();
        switch(path){
            case '/personalCenter':
                loadCourseHandler();
                break;
            case '/play':
                playVideoHandler();
                break;
            case '/testShow':
                examHandler();
                break;
            default:
                break;
        }
    }

    function loadCourseHandler(){
        let secondVueBox = vueInstances[3];
        //console.log(secondVueBox.centerData)
        localStorage.removeItem('nowCourse');
        let startLearn = false;
        setInterval(function(){
            secondVueBox.getMyCenter();
            setTimeout(function(){
                learnCourse();
            },5000)
        },1000*60)

        function learnCourse(){
            //console.log(secondVueBox.centerData)
            if(startLearn && secondVueBox.centerData && secondVueBox.centerData.length > 0){
                for (let i = 0; i < secondVueBox.centerData.length; i++) {
                    let course = secondVueBox.centerData[i];
                    let nowCourse = localStorage.getItem('nowCourse');
                    if(course.browseScore < 100){
                        if(nowCourse == course.name){
                            console.log(course.name,course.browseScore);
                            break;
                        }else{
                            //localStorage.setItem('nowCourse',course.name);
                            secondVueBox.toPlay(course);
                            break;
                        }
                    }
                }
            }
        }

        function addhtml(){
            var css = "'position:fixed;z-index:99999;top:0;left:0;right:0;margin:0 auto;width:120px;height:40px;text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
            var html = "<div id='playText' style="+css+">开始学习</div>"
            $('body').append(html);
        }
        $("body").on("click", "#playText", function(){
            $('#playText').text('学习中');
            startLearn = true;
            learnCourse();
        })

        addhtml();
    }

    function playVideoHandler(){
        let secondVueBox = vueInstances[1];

        secondVueBox.handleClickOutside = function(e) {
            console.log('修改后的 handleClickOutside 被调用了');
        };
        secondVueBox.handleWindowBlur = function() {
            console.log('修改后的 handleWindowBlur 被调用了');
        };
        secondVueBox.handleVisibilityChange = function() {
            console.log('修改后的 handleVisibilityChange 被调用了');
        };
        secondVueBox.handleTenMinuteCheck = function() {
            console.log('修改后的 handleTenMinuteCheck 被调用了');
        };
        secondVueBox.showConfirmDialog = function() {
            console.log('修改后的 showConfirmDialog 被调用');
        };
        secondVueBox.handleNodeClick = function(e) {
            this.clearTenMinuteTimer(),
                this.isPausedBySystem = !1,
                this.url = e.url,
                this.nodeId = e.id,
                this.position = this.isValidTime(e.position) ? e.position : 0,
                this.initPlayer(e),
                this.getGetPlay(),
                this.drawer = !1

            setTimeout(function(){
                handleXgVideo(secondVueBox);
            },5000)
        };
        setTimeout(function(){
            const obj = $('.el-icon-arrow-right');
            if(obj){
                $('.el-icon-arrow-right').click();
            }
            localStorage.setItem('nowCourse',secondVueBox.playData.name);
            handleXgVideo(secondVueBox);
            getNodeList(secondVueBox);
        },3000)
        $(window).on('beforeunload', function() {
            // 在页面关闭前执行
            console.log('页面即将关闭或刷新');
            if(localStorage.getItem('nowCourse') == secondVueBox.playData.name){
                localStorage.removeItem('nowCourse');
            }
            //return '您确定要离开吗？未保存的数据可能会丢失。';
        });

        checkPlay = setInterval(function(){
            // 静音+自动播放
            if (secondVueBox.xgVideo && secondVueBox.xgVideo.paused) {
                secondVueBox.xgVideo.muted = true;
                secondVueBox.xgVideo.play()
                secondVueBox.startTenMinuteTimer()
                secondVueBox.isPausedBySystem = false;
            }
            if(localStorage.getItem('nowCourse')){
                if(localStorage.getItem('nowCourse') != secondVueBox.playData.name){
                    window.close();
                }
            }
        },3000)

        function handleXgVideo(secondVueBox){
            if(secondVueBox.xgVideo){
                console.log('视频加载成功')
                secondVueBox.xgVideo.on("ended", (function(e) {
                    console.log('监听视频播放结束');
                    getNodeList(secondVueBox);
                }))
                secondVueBox.xgVideo.on("ratechange", (function(e) {
                    console.log('监听视频速率变化');
                    //secondVueBox.xgVideo.playbackRate = 2;
                }))
                secondVueBox.xgVideo.on("seeking", (function(e) {
                    console.log('监听视频进度变化',secondVueBox.xgVideo.currentTime);
                    if(secondVueBox.xgVideo.currentTime == 0){
                        goVideoLast(secondVueBox);
                    }
                }))
                //secondVueBox.xgVideo.playbackRate = 2;
                goVideoLast(secondVueBox);
            }
        }

        function goVideoLast(secondVueBox){
            //secondVueBox.currentPlayTime = secondVueBox.xgVideo.duration;
            //secondVueBox.xgVideo.currentTime = secondVueBox.xgVideo.duration - 5;
        }

        function getNodeList(secondVueBox){
            let query = secondVueBox.$route.query;
            var nodeUrl = '/api/page/home/getNodeList';
            $.ajax({
                url: nodeUrl,
                dataType: 'json',
                data: {
                    'courseId':query.id
                },
                type: 'post',
                success: function(res) {
                    console.log("请求成功");
                    let nodeList = res.data;
                    let nextNode = null;
                    let isEnd = false;
                    for (let i = 0; i < nodeList.length; i++) {
                        if(nodeList[i].lastPlayFlag && nodeList[i].finishedFlag){
                            isEnd = true;
                            if(i+1 == nodeList.length){
                                window.close();
                            }
                        }else if(nodeList[i].finishedFlag == false && nextNode == null){
                            nextNode = nodeList[i];
                        }
                    }
                    if(nextNode && isEnd){
                        secondVueBox.handleNodeClick(nextNode);
                    }
                }
            });
        }

    }

    function examHandler(){
        
    }

    function clearHandler(){
        console.log('清除所有方法');

        clearInterval(checkPlay);
    }

})();