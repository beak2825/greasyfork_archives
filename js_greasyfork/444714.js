// ==UserScript==
// @name         四川电子科大刷课脚本
// @namespace    http://tampermonkey.net/
// @version      0.9.6
// @description  四川电子科大刷课简易脚本，网教与学堂云两个平台均支持，脚本并不完善可能存在问题，欢迎在评论区留言帮助作者改善脚本
// @author       Cribug
// @license      MIT
// @match        https://uestcedu.yuketang.cn/pro/lms/*
// @match        https://learning.uestcedu.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/444714/%E5%9B%9B%E5%B7%9D%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444714/%E5%9B%9B%E5%B7%9D%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {


    // Your code here...

    //创建弹窗
    (function(){
        var div = document.createElement('div');
        div.id = "cribug";
        div.innerHTML = `<div class="cribug-pop" style="position:fixed;right:17px;bottom:0;width:400px;height:500px;border-radius:3px 0 0 0;border-left:3px solid #333;border-top:3px solid #333;background:#fff;transition:all .2s ease;z-index:999;">
    <div class="cribug-title" style="position:relative;background:#ccc;line-height:40px;color:#333;text-indent:6px">电子科大刷课脚本 <button class="cribug-open">支持作者</button><div class="cribug-switch" style="position:absolute;right:15px;top:10px;width:16px;height:20px;"><i style="display:block;width:100%;height:2px;margin-top:9px;background:#333;"></i></div></div>
    <div class="cribug-importantInfo" style="padding-left:6px;color:red;height:30%;border-bottom:1px solid #333;overflow:auto;">
        <p>注意：当前脚本完全开源免费，如果你从任何途径购买了本脚本，请要求对方退费！有问题欢迎在Greasy Fork评论反馈。</p>
    </div>
    <div class="cribug-journal" style="height:calc(70% - 41px);padding-left:6px;overflow:auto;"></div>
</div>

<div class="cribug-sponsor" style="display:none;position:fixed;left:50%;top:50%;width:100%;height:100%;transform:translate(-50%,-50%);background:rgba(0,0,0,.4);z-index:999;">
    <div style="margin:200px auto 0;width:500px;height:300px;padding:20px;background:#fff;border-radius:5px;border:2px solid #333">
        感谢您对作者的支持！<br />您的打赏能够有效加快脚本的完善！
        <div style="display:flex;justify-content:center;margin-top:25px;width:100%;">
                <div>
                        <div style="width:100%;text-align:center;">微信</div>
                        <img src="https://www.helloimg.com/images/2022/05/26/ZaZDZQ.th.jpg">
                </div>
                <div style="margin-left:20px">
                        <div style="width:100%;text-align:center;">支付宝</div>
                        <img src="https://www.helloimg.com/images/2022/05/26/ZaZcy1.th.jpg">
                </div>
        </div>
        <button class="cribug-shut" style="margin:30px auto;display:block;">关闭</button>
    </div>
</div>`

        var bob = document.querySelector('body');
        bob.appendChild(div)

        //打赏页面开关
        var open = document.getElementsByClassName("cribug-open")[0];
        var shut = document.getElementsByClassName("cribug-shut")[0];
        var spomsor = document.getElementsByClassName("cribug-sponsor")[0];
        open.onclick = function(){spomsor.style.display = "block"};
        shut.onclick = function(){spomsor.style.display = "none"};

        //弹窗最小化，最大化
        var switc = document.getElementsByClassName("cribug-switch")[0];
        var pop = document.getElementsByClassName("cribug-pop")[0];
        switc.onclick = function(){
            if(pop.style.transform != "translateY(460px)"){
                pop.style.transform = "translateY(460px)"
            }else{
                pop.style.transform = "translateY(0)"
            }
        }
    })();


    //日志输出
    var importantInfo = document.getElementsByClassName("cribug-importantInfo")[0];
    var journal = document.getElementsByClassName("cribug-journal")[0];
    function output(position,text){
        var p = document.createElement('p');
        p.style.cssText = "padding:2px 0;border-bottom:1px solid #000;"
        p.innerHTML = text;
        position.appendChild(p)
        position.scrollTop = position.scrollHeight;
    };

    //等待页面加载完毕判断当前运行的平台并运行相应的代码
    window.onload = function(){
        output(importantInfo,"页面加载完成，脚本即将启动")
        setTimeout(document.location.host[0] == "u" ? xty:wj,2000)
    }

    function xty(){
        //获取video元素、video外层的div、作业页面的元素，用于判断当前处于哪个页面
        var elevideo = document.getElementsByClassName("xt_video_player")[0];
        var idVideo = document.getElementById("video-box");
        var zy = document.getElementsByClassName("container-body")[0];
        var url = window.location.href;
        var csdsq;

        //判断当前页面状态
        if(elevideo){
            localStorage.setItem("isPlay",true)
            let title = document.getElementsByClassName("title-fl")[0].getElementsByTagName("span")[0].innerHTML;
            let zeroPlay = 1;
            output(importantInfo,"当前为学堂云平台视频课件,脚本运行中...");
            output(importantInfo,`当前时间：${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);

            //静音
            if(elevideo.volume != 0){
                elevideo.pause()
                document.getElementsByClassName("xt_video_player_common_icon")[0].click();
                output(importantInfo,"视频已自动静音")
            }
            //2X播放(搞不懂为什么不行哦)
            //var playSpeedDiv = document.getElementsByClassName("xt_video_player_common_list_wrap")[1];
            //playSpeedDiv.style.cssText = "display:block;opacity:1;";
            //playSpeedDiv.getElementsByTagName("li")[0].click();
            //output(importantInfo,"视频已自动2倍速播放")
            setTimeout(function(){elevideo.play()},1000)

            //视频播放完毕后执行函数
            function videoEnd(){
                output(journal,"视频已播放完毕，此页面即将关闭")
                var l = JSON.parse(localStorage.getItem("studyListData"));
                for(let i in l){
                    if(l[i].name == title && l[i].state != "已完成"){
                        l[i].state = "已完成";
                        localStorage.setItem("studyListData",JSON.stringify(l))
                        break;
                    }
                }
                setTimeout(function(){
                    localStorage.setItem("isPlay",false)
                    window.open("about:blank","_self").close()
                },3000)
            };

            setInterval(function(){
                if(zeroPlay && elevideo.paused){
                    output(journal,"脚本无法区分意外情况导致的视频暂停或用户手动暂停，现已尝试恢复播放，如您需要暂停视频请再次点击暂停")
                    elevideo.play();
                    zeroPlay--
                }
                if(document?.getElementsByClassName("text")[1]?.innerHTML?.slice(4) === "100%"){
                    videoEnd()
                }
            },5000);
        }else if(idVideo){
            output(importantInfo,"脚本已跳转到不正确的地址，或因网络问题导致出错，脚本将自动重试");
            output(importantInfo,`当前时间：${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);
            csdsq = setInterval(function(){
                if(document.getElementsByClassName("xt_video_player")[0]){
                    clearInterval(csdsq)
                    xty()
                }
            },3000)
        }else if(zy){
            localStorage.setItem("isPlay",true)
            let title = document?.getElementsByClassName("title-fl")[0]?.getElementsByTagName("span")[0]?.innerHTML || document.getElementsByClassName("text text-ellipsis")[0].innerHTML;
            output(importantInfo,"当前为学堂云平台作业页面，自动答题中...")
            output(importantInfo,"目前仅支持单选题")
            //答题序号列表的li
            var numberList = document.getElementsByClassName("exam-aside--close")[0].getElementsByTagName("li");
            //提交答案按钮
            var btn = document.getElementsByClassName("text-center")[0].getElementsByTagName("button")[0];
            var i = 0;
            //答题逻辑(代码有点烂，层层套娃，技术有限)
            function answer(){
                if(i < numberList.length){
                    numberList[i].getElementsByTagName("div")[0].click();
                    setTimeout(function(){
                        //题目答案列表
                        var daan = document.getElementsByClassName("list-unstyled")[0].getElementsByTagName("li");
                        var z = 0;
                        function answer2(){
                            if(numberList[i].getElementsByTagName("svg").length){
                                output(journal,`第${i+1}题已回答正确，进入下一题`);
                                i++;
                                z = 0;
                                answer();
                            }else{
                                setTimeout(function(){
                                    daan[z].getElementsByTagName("label")[0].click();
                                    z++;
                                },1000)
                                setTimeout(function(){btn.click()},1500)
                                setTimeout(function(){answer2()},4000)
                            }
                        }
                        answer2();
                    },1000)
                }else{
                    output(journal,"所有题目回答完毕，此页面即将关闭")
                    var l = JSON.parse(localStorage.getItem("studyListData"));
                    for(let i in l){
                        if(l[i].name == title){
                            l[i].state = "已完成";
                            localStorage.setItem("studyListData",JSON.stringify(l))
                            break;
                        }
                    }
                    setTimeout(function(){
                        localStorage.setItem("isPlay",false)
                        window.open("about:blank","_self").close()
                    },3000)
                }
            }
            answer();
        }else{
            output(importantInfo,"当前为学堂云平台学科目录，正在遍历列表...")
            localStorage.setItem("isPlay",false)
            //初始化，获取学习列表并保存到本地
            var studyKey = 0;
            var studyListData = {};
            var studyList = document.getElementsByClassName("el-tooltip leaf-detail");
            for(let item of studyList){
                studyListData[studyKey] = {
                    id:studyKey,
                    name:item.getElementsByClassName("title")[0].innerHTML,
                    state:item.getElementsByClassName("item")[0].innerHTML
                };
                studyKey++;
            }
            output(importantInfo,"列表遍历完毕，即将自动学习")
            localStorage.setItem("studyListData",JSON.stringify(studyListData))
            //判断正在进行的课件课件是否播放完毕，并遍历学习列表自动打开未完成的章节
            function monitorIsPlay(){
                var s = JSON.parse(localStorage.getItem("studyListData"))
                if(localStorage.getItem("isPlay") == "false"){
                    for(let i in s){
                        if(s[i].state != "已完成"){
                            localStorage.setItem("isPlay",true)
                            output(journal,`当前正在学习【${s[i].name}】,当前时间：${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
                            studyList[s[i].id].click();
                            break;
                        }else if(s[i].id == Object.keys(studyList).length-1 && s[i].state == "已完成"){
                            output(importantInfo,"当前科目所有课件已学习完毕")
                            break;
                        }
                    }
                }
            }
            monitorIsPlay();
            //监听本地存储的变化
            window.addEventListener("storage",monitorIsPlay)
        }
        //监听地址栏变化
        var dsq = setInterval(function(){
            var nUrl = window.location.href;
            if(nUrl != url){
                output(importantInfo,"用户已手动切换课件，脚本即将重新启动...")
                clearInterval(dsq)
                setTimeout(xty,10000)
            }
        },3000)
    }

    function wj(){
        var wmain = document.getElementsByName("w_main")[0].contentWindow.document;
        var home = wmain.getElementById('divSysColumn_1');
        var btn = wmain.getElementById("w_code");
        if(home){
            output(importantInfo,"当前为网教平台首页，遍历目录中...");
            //为每个课程链接添加上点击事件，以达到监听是否进入了课件详情页的目的
            var list = wmain.getElementById("frame_learning_content_1").getElementsByTagName("a");
            for(var a of list){
                a.addEventListener("click",function(){
                    return setTimeout(wj,3000)
                })
            }
            //遍历课程目录并自动点击未完成的课件
            var kj = wmain.querySelectorAll("#frame_learning_content_1 #tblDataList>tbody>tr")
            for(var l of kj){
                if(!l.querySelector(".completed") && !l.querySelector(".blank")){
                    return l.querySelector("a").click()
                }
            }
        }else if(btn){
            var btn2 = btn?.contentWindow?.document?.getElementById("tdPlayerControl")?.childNodes;
            if(btn2 == undefined){
                return setTimeout(wj,2000);
            }
            output(importantInfo,"当前为网教平台课件页面，脚本运行中...")
            var btnPrev = btn2[1];
            var btnNext = btn2[3];
            var wjdsq = null;
            var count = 0;
            function fn(){
                wjdsq = setInterval(function(){
                    var isxx = wmain.getElementById("w_lms_content").contentWindow.document.getElementsByTagName("tr")[1].getElementsByTagName("td")[0].innerHTML.indexOf("已经学习完毕");
                    if(isxx > 0){
                        btnNext.click();
                        output(journal,`已自动切换下一课件，当前时间：${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
                        count = 0;
                    }else if(count > 24){
                        btnNext.click();
                        setTimeout(function(){btnPrev.click()},500)
                        output(importantInfo,`当前课件计时疑似出错，将进行重试，当前时间：${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);
                        count = 12;
                    }else{
                        count++
                    }
                },5000)
            };
            fn();
        }
    }

})();