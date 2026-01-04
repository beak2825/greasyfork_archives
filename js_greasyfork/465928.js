// ==UserScript==
// @name         CUFE党课自动点击、后台播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只在CUFE上测试过，可能视频刚开始播放时需要手动点击一下，能够自动点击弹窗，自动切换下一集内容，能够后台播放，如果要在其他平台测试，请修改开头@match信息
// @author       Jack
// @match        http://jjfz.cufe.edu.cn/jjfz/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cufe.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465928/CUFE%E5%85%9A%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%81%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/465928/CUFE%E5%85%9A%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%81%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {

    var time=1000;
    var i=0;
    var t=0;

    // 添加提示信息
    var pa = document.createElement('p');
    if(document.getElementsByClassName("video_cont")[0]===undefined){
        console.log("视频出错，即将刷新");
        location.reload();
    }else{
       document.getElementsByClassName("video_cont")[0].appendChild(pa);
    }

    console.log('开始运行');

    window.addEventListener("visibilitychange", function(event) {
        event.stopImmediatePropagation();
    }, true);

    console.log('禁用浏览器状态监测');


    var tm=setInterval(function(){
        t++;
        //console.log(t);
        if(document.getElementsByClassName("video_red1")[0].children[0].style.color=="red"){//如果当前已经看完
            showInfo("当前视频已看完，将点击下一视频");
            delay();
            if(document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling===null){
                window.clearInterval(tm);
                window.alert('当前课程没有需要学习的内容了！');
                //window.location.href="http://jjfz.cufe.edu.cn/jjfz/lesson?stg=5";
            }else{
                document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling.children[0].click();//点击下一视频
            }
        } else {
            // 继续观看
            if(document.getElementsByClassName("public_cancel")[0]){
                document.getElementsByClassName("public_cancel")[0].click();
            }
            // 关闭弹窗
            if(document.getElementsByClassName("public_submit")[0]){
                delay();
                // 看完视频的弹窗
                if(document.querySelector(".public_text").children[1].textContent=="当前视频播放完毕！"){
                    console.log("查找到关闭窗口，播放下一个");
                    $(".public_close").click();
                    showInfo("当前视频已看完，将点击下一视频");
                    delay();
                    if(document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling===null){
                        window.clearInterval(tm);
                        window.alert('当前课程没有需要学习的内容了！');
                        //window.location.href="http://jjfz.cufe.edu.cn/jjfz/lesson?stg=5";
                    }else{
                        document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling.children[0].click();//点击下一视频
                    }
                } else {
                    i++;
                    showInfo('点击了弹窗，共点击了'+i+'次');
                    // document.getElementsByClassName("public_submit")[0].click();
                    $(".public_close").click(); //此为关闭方法
                }
            }
        }
        // 自动播放视频
        if(document.querySelector(".plyr__control--overlaid[aria-label='Play']")){// 找到播放键
            delay();
            document.getElementsByClassName("plyr__control--overlaid")[0].click();
            console.log("点击播放键");
        }
    },time);
})();

function showInfo(str){
    console.log(str);
    document.getElementsByClassName("video_cont")[0].children[2].innerText=str;
}

function playNext(){
    showInfo("当前视频已看完，将点击下一视频");
    delay();
    if(document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling===null){
        window.clearInterval(tm);
        window.alert('当前课程没有需要学习的内容了！');
        window.open('http://www.baidu.com','newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');        
        //window.location.href="http://jjfz.cufe.edu.cn/jjfz/lesson?stg=5";
    }else{
        document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling.children[0].click();//点击下一视频
    }
}

function delay(){
    setTimeout(showDelay,1000);
}

function showDelay(){
    console.log("Delay");
}
