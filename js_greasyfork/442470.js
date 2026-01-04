// ==UserScript==
// @name         党旗飘飘~~~UESTC
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  (v1.4.0更新全自动)我爱中国共产党！党旗飘飘，只是不希望被无意义而且频繁的弹窗打断我的课程学习（欸嘿）全平台适用！
// @author       Onion
// @include      *//*.*.edu.cn/*/play*
// @include      *//*.*.edu.cn/user/lesson
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uestc.edu.cn
// @grant        GM_notification
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/442470/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98~~~UESTC.user.js
// @updateURL https://update.greasyfork.org/scripts/442470/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98~~~UESTC.meta.js
// ==/UserScript==

//1.0 demo版本，还没学会用cookies，因为不想默认开启，所以没办法在重新定向网页的时候，保留用户按下按钮事件的value，过几天修复这个问题（大饼
//本站只匹配了UESTC的党旗飘飘网站，有需要的可以自行修改includ为自家网站
//用法：点开始，就开刷
//停止，就不执行脚本

//1.1更新，更新了cookies，增加连续播放功能

//1.2更新，更新了用户名，发现了因为增加了cookies功能所以导致的几个bug：
//（1）进去太快了可能要按两次"开刷"按钮
//（2）停止按钮有时候停不下来，（累了，今天不修了，刷新网页重定向一下就能解决大多问题
// PS：如果想要改名的话请打开开发者选项（谷歌：ctrl+shift+I），在控制台（console）里面输入：$.removeCookie('username')，以此来清除一下cookies

//1.4更新,更新了全自动刷课功能（不会被抓吧（逃
//目前已知bug，计时器在拦截时会一直计数，原因：暂时未知



(function() {
    'use strict';
    if (window.location.href.match(/play/g)) {

        function checkCookie(){
            var user=getCookie("username");
            if (user!=""){
                //	alert("欢迎 " + user + " 再次访问");
            }
            else {
                GM_notification({
                    text: '刷课系统已经就绪！',
                    timeout: 3000,
                });
                user = prompt("请输入你的名字:","好巧啊彦祖");
                if (user!="" && user!=null){
                    setCookie("username",user,30);
                }
            }
        }


        function alert_user(){
            document.getElementsByClassName("video_cont")[0].children[2].innerText='PS:自动刷课系统_已就绪！\n v1.4.0 by Onion';
        }

        function random_Times(){
            var times= Math.floor((Math.random())+0.5) //随机1-2
            return times;
        }

        var video = document.querySelector("video");


        var button_1 = document.createElement("button"); //创建一个按钮
        button_1.textContent = "开刷"; //按钮内容
        button_1.style.width = "109px"; //按钮宽度
        button_1.style.height = "22px"; //按钮高度
        button_1.style.align = "center"; //居中
        button_1.style.color = "black"; //按钮文字颜色
        // button_1.style.background = "E0E0E0"; //按钮底色
        button_1.addEventListener("click", clickButton_1)


        var button_2 = document.createElement("button"); //创建一个按钮
        button_2.textContent = "不刷了"; //按钮内容
        button_2.style.width = "109px"; //按钮宽度
        button_2.style.height = "22px"; //按钮高度
        button_2.style.align = "center"; //居中
        button_2.style.color = "black"; //按钮文字颜色
        // button_2.style.background = "E0E0E0"; //按钮底色
        button_2.addEventListener("click", clickbutton_2)//祖传按钮

        var times= random_Times();
        function clickButton_1(){
            starting();
            console.log("开刷")
            var times= random_Times();
            $.cookie('do_it', 1);
            location.reload();
        }

        function clickbutton_2(){
            clearInterval(window.start);
            console.log("不刷了不刷了，累了累了")
            video.pause();
            $.cookie('do_it', 0);
            location.reload();
            return;
        }



        var i=0; // 拦截次数
        var toolbox = document.getElementsByClassName('video_tab')?document.getElementsByClassName('video_tab')[0]:false;
        if(toolbox){
            toolbox.appendChild(button_1);
            toolbox.appendChild(button_2);
        }

        var para= document.createElement("p")
        document.getElementsByClassName("video_cont")[0].appendChild(para);
        checkCookie();
        alert_user();

        setTimeout(function(){
            if($.cookie('do_it')==1){
                starting();
            }
        },1000)
        //主函数：
        /*
    function clickPlayBtn(){
        var temp = document.createEvent("MouseEvents"); //建立鼠标事件
        temp.initEvent("click", true, true);
        var list = document.getElementsByClassName("plyr__controls__item plyr__control");//播放按钮
        for (let i = 0; i < list.length; i++) {
            const btn = list[i];
            if(btn.getAttribute("aria-label") == "Play"){
                btn.dispatchEvent(temp)
            }
        }
    }//这几行没啥用
    */

        function starting(){
            if($.cookie('do_it')==1){
                window.start=setInterval(function(){ //循环开始

                    if (document.getElementsByClassName("video_red1")[0].children[0].style.color==="red" && document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling!==null){

                        document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling.children[0].click();
                    }
                    else{
                        if(document.getElementsByClassName("video_red1")[0].children[0].style.color==="red" && document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling===null){
                            GM_notification({
                                text: '臭宝这章学完啦!',
                                timeout: 3000,
                            });
                            console.log("宝儿去下一章吧")
                            //window.clearInterval(start);
                            clearInterval(window.start);
                            window.location.href="https://"+window.document.domain+"/user/lesson"

                        }
                        else{ //开刷！！！
                            var video = document.querySelector("video");
                            if(video.paused){
                                video.play();


                            }

                            if(document.getElementsByClassName("public_cancel")[0]===undefined){
                                //console.log("我刷")


                            }

                            else{
                                document.getElementsByClassName("public_cancel")[0].click();
                                i=i+1;
                                console.log("拦截成功")

                                // setTimeout(function(){
                                //  console.log("inside_Fun")
                                //  document.getElementsByClassName("plyr__control")[0].click(); 谷歌浏览器禁止了这个操作，但我还是找到其他方法了QAQ
                                //  },4000);

                            }
                            if (!document.getElementsByClassName("public_submit")[0]){
                                //console.log("我刷")
                            }
                            else{
                                document.getElementsByClassName("public_submit")[0].click();
                                //     document.getElementsByClassName("plyr__control")[0].click();
                                console.log("拦截成功")
                                i=i+1;
                            }
                        }
                    }


                    document.getElementsByClassName("video_cont")[0].children[2].innerText='欢迎 \''+$.cookie("username")+'\' \n欸嘿，我已经为你拦截了'+i+'次弹窗咯\nPS:火狐目前不支持，请换Chrome\n如果拦截数一直增加，也不用管他，能用就行';
                } ,times*1500)
            }

        }
    }

    if (window.location.href.match(/user\/lesson/g)){
        console.log("让我康康你看了多少")
        console.log("脚本已启用,将自动进行刷课")
        console.log("3秒后将自动开始刷课")
        GM_notification({
            text: '5秒后将自动开始刷课!',
            timeout: 5000,
        });
        /*
        let classAll = document.getElementsByClassName('study_plan2')
        classAll.forEach((e,index)=>{
            document.getElementsByClassName('study_plan2')[0].childNodes[5].children[2].style.color
        })
       */
        setTimeout(()=>{
            Array.from(document.querySelectorAll('.study_plan2')).forEach((e,index) =>{
                if(e.childNodes[5].children[2].style.color=="red"){
                    e.childNodes[5].children[1].children[0].click()
                }
            });
        },5000)

    }

    function setCookie(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }
})();