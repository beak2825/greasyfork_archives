// ==UserScript==
// @name         学习平台
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  学习平台观看!
// @author       安之立
// @match        https://vpahw.xjtu.edu.cn/*
// @match        https://vpahw.xjtu.edu.cn/course-detail/*
// @match        https://vpahw.xjtu.edu.cn/video/*
// @match        https://org.xjtu.edu.cn/openplatform/login.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xjtu.edu.cn
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @license MIT
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489535/%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489535/%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //创建ui
    // 创建一个容器div来包含所有的元素
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width='200px';
    container.style.zIndex = '9999';

    const accountInput = document.createElement('input');
    accountInput.setAttribute('type', 'text');
    accountInput.placeholder = '请输入账号';

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.placeholder = '请输入密码';

    const loginButton = document.createElement('button');
    loginButton.innerHTML = '登录';

    const logoutButton = document.createElement('button');
    logoutButton.innerHTML = '注销';

    // 将所有的元素添加到容器div中
    container.appendChild(accountInput);
    container.appendChild(passwordInput);
    container.appendChild(loginButton);
    container.appendChild(logoutButton);

    // 将容器div添加到页面中
    document.body.appendChild(container);

    // 初始化输入框的值
    const account = GM_getValue('account');
    if (account) {
        console.log(account)
        accountInput.value = account;
    }
    const password = GM_getValue('password');
    if (password) {
        passwordInput.value = password;
    }

    // 登录按钮事件
    loginButton.addEventListener('click', () => {
        const accountValue = accountInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!accountValue || !passwordValue) {
            alert('请输入账号和密码');
            return;
        }

        // 保存账号和密码到GM_setValue中
        GM_setValue('account', accountValue);
        GM_setValue('password', passwordValue);
        alert('登录成功');
    });

    // 注销按钮事件
    logoutButton.addEventListener('click', () => {
        // 删除GM_setValue中的账号和密码
        GM_setValue('account', '');
        GM_setValue('password', '');
        accountInput.value = '';
        passwordInput.value = '';
        alert('注销成功');
    });

    // 设置容器div的位置和大小，使其悬浮在页面上方
    function setPosition() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        container.style.width = `${width * 0.3}px`;
        container.style.height = `${height * 0.1}px`;
        container.style.left = `${width * 0.1}px`;
        container.style.top = `${height * 0.1}px`;
    }

    setPosition();

    // 监听窗口大小变化，重新设置容器div的位置和大小
    window.addEventListener('resize', () => {
        setPosition();
    });






    //  window.onload = function () {
    // 创建一个计时器，并每100毫秒检查一次
    var old_url;
    var new_url;
    const timer = setInterval(() => {
        if(GM_getValue('account')){

            if(GM_getValue('password')){
                new_url=window.location.href;
                if(new_url==old_url){
                    //说明地址没有变
                    //clearInterval(timer);
                }else if(new_url.includes("org.xjtu.edu.cn/openplatform")){
                    //这里需要判断一下是否来自学习平台；
                    const referrer = document.referrer;
                    const url = new URL(referrer);

                    if (url.hostname === 'vpahw.xjtu.edu.cn') {
                        console.log('上一个页面的域名是https://vpahw.xjtu.edu.cn');
                        var teach=$('span.teach')[0].innerText
                        if(teach==''){
                            console.log('被点击了')
                            alert('未发现应用APPID')
                        }else{
                            $('input.username')[0].value=GM_getValue('account');
                            $('input.pwd')[0].value=GM_getValue('password');
                            const click=setInterval(() => {
                                $('div#account_login.login_btn.account_login').click();
                                clearInterval(click);
                            },2000)

                            }
                    } else {
                        console.log('上一个页面的域名不是https://vpahw.xjtu.edu.cn');
                        clearInterval(timer);
                    }


                }else{
                    old_url=new_url;
                    //地址变了，这里去执行相关地址的代码；
                    if (new_url.includes("https://vpahw.xjtu.edu.cn/my-courses")) {
                        // 当前URL是https://vpahw.xjtu.edu.cn/my-courses
                        //clearInterval(timer);
                        console.log("当前URL是https://vpahw.xjtu.edu.cn/my-courses");
                        my_courses();
                    } else if(new_url.includes("https://vpahw.xjtu.edu.cn/course-detail/")){
                        // 当前URL不是https://vpahw.xjtu.edu.cn/my-courses
                        //clearInterval(timer);
                        console.log("当前URL是课程详情页");
                        course_detail();
                    } else if(new_url.includes("https://vpahw.xjtu.edu.cn/video/")){
                        console.log("视频播放界面")
                        //clearInterval(timer);
                        video_jiemian();
                    } else if(new_url.includes("https://vpahw.xjtu.edu.cn/courses")){
                        //clearInterval(timer);
                        console.log("主页");
                        const referrer = document.referrer;
                        const url = new URL(referrer);
                        //https://org.xjtu.edu.cn/openplatform/login.html
                        if (url.hostname === 'org.xjtu.edu.cn') {
                            //来自登录页面
                            location.href = "https://vpahw.xjtu.edu.cn/my-courses";//跳到课程页去判断
                        }else if(url.toString().includes("https://vpahw.xjtu.edu.cn/video/")){
                            //来自视频页面
                            location.href = "https://vpahw.xjtu.edu.cn/my-courses";
                        }
                    }
                }
            }

        }


        // 检查页面上是否存在特定元素或变量
    }, 5000);
    //}




    function click_and_fresh(c){
        c.click();
        //var clickfresh=setInterval(function() {
        //   location.href=window.location.href;
        //}, 3000);
    }

    function course_detail(){
        //这里检测一下是否登录
        var xiang = setInterval(function() {
             var nn=document.querySelector("#root > div > div.sticky.top-0.z-50 > header.w-screen.h-16.items-center.bg-blue-400.px-6.hidden.md\\:flex > div.ant-space.ant-space-horizontal.ant-space-align-center > div > span > span > span")
              if(nn){
                 if(nn.innerText=='登录'){
                     console.log('未登录');
                     nn.click();

                 }
              }else{
                  console.log('登陆了')
            var c=document.querySelectorAll("#root > div > div.min-h-\\[calc\\(100vh-64px\\)\\] > div > div:nth-child(2) > div.mt-6.flex-auto.bg-white.py-4.rounded-lg > ul > li > div > span > svg");
            let k=0;
            for(var i=0;i<c.length;i++){
                var text=c[i].getAttribute('data-icon');
                if(text=='check-circle'){
                    k=k+1;
                    console.log("课程详情页这一个看了")
                }else{
                    clearInterval(xiang);
                    c[i].parentElement.click();
                    break;
                }
            }
            if(k==c.length && k!=0){
                clearInterval(xiang);
                console.log('这里都看完了，返回上一级');
                location.href = "https://vpahw.xjtu.edu.cn/my-courses";
            }
             }
            

        },3000)

        }


    function playPauseHandler() {
        var video=document.querySelector("#player > div > div > div.ck-video > video")
        //document.querySelector("#player > div > div > div.ck-video > video").playbackRate=5;
        console.log('播放/暂停监听');
        if (video.paused) {
            console.log('视频处于暂停状态');
            video.play();
        } else {
            console.log('视频正在播放');
        }

    }

    function endedHandler() {
        console.log('播放完成');
        //document.exitPictureInPicture();
        var tid = setInterval(function() {
            end_check();
            clearInterval(tid);
        },2000);

    }

    function end_check(){
        var c=document.querySelectorAll("#root > div > div > div.mt-2.flex-auto.bg-white.py-4 > ul > li > div > span > svg");
        let m=0;
        for(var i=0;i<c.length;i++){
            var sx=c[i].getAttribute('data-icon')
            if(sx=='check-circle'){
                m=m+1;
                console.log('completed')
            }else{
                c[i].parentElement.click();
                document.querySelector("#player > div > div > div.ck-video > video").volume=0;
            }
        }
        if(m==c.length && m!=0){
            console.log('这里都看完了，返回上一级');
            location.href = "https://vpahw.xjtu.edu.cn/my-courses";
        }

    }

    function click(x, y) {
        var ev = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'screenX': x,
            'screenY': y
        });
        var el = document.elementFromPoint(x, y);
        console.log(el); //print element to console
        el.dispatchEvent(ev);
    }



    function video_jiemian(){
        var timetid = setInterval(function() {
            console.log(document.querySelector("#player > div > div > div.ck-video > video"));
            if ($('video').length == 0 || $('video')[0].readyState==0  ) {
                console.log("还没加载好")
                document.querySelector("#player > div > div > div.ck-video > video").autoplay;
                document.querySelector("#player > div > div > div.ck-video > video").volume=0;
            } else if($('video')[0].readyState==1 || $('video')[0].readyState==4) {
                document.querySelector("#player > div > div > div.ck-video > video").autoplay;
                document.querySelector("#player > div > div > div.ck-video > video").volume=0;
                var playerr = $('video')[0];
                console.log("加载好")
                clearInterval(timetid);
                playerr.addListener('play', playPauseHandler);
                playerr.addListener('pause', playPauseHandler);
                playerr.addListener('ended', endedHandler);
                console.log(playerr.readyState);
                if(playerr.paused==true){
                    console.log('暂停状态')
                    document.querySelector("#player > div > div > div.ck-video > video").play();
                    //document.querySelector("#player > div > div > div.ck-video > video").playbackRate=5;
                    //click(400,400);
                    //document.querySelector("#player > div > div > div.ck-video > video").requestPictureInPicture();
                }
            }
            // do something
        }, 3000);
    }


    function my_courses(){
        //window.onload=function(){
        var nn=document.querySelector("#root > div > div.sticky.top-0.z-50 > header.w-screen.h-16.items-center.bg-blue-400.px-6.hidden.md\\:flex > div.ant-space.ant-space-horizontal.ant-space-align-center > div > span > span > span")
        if(nn){
            if(nn.innerText=='登录'){
                console.log('未登录');
                nn.click();

            }
        }else{
            console.log('登陆了')
            var timetid = setInterval(function() {
                for (var i = 0; i < document.getElementsByClassName('flex justify-start flex-wrap')[0].children.length; i++) {
                    console.log(document.getElementsByClassName('flex justify-start flex-wrap')[0].children.length)
                    var txt=document.getElementsByClassName('flex justify-start flex-wrap')[0].children[i].innerText;
                    if(txt.includes("体育")){
                        console.log("体育跳过")
                    }else{
                        var text = document.getElementsByClassName('flex justify-start flex-wrap')[0]
                        .children[i].children[0].children[0].children[1].children[3].children[1].children[0].children[1].innerText
                        if (text == '') {
                            console.log('课程页这一个看了')
                        } else {
                            clearInterval(timetid);
                            document.getElementsByClassName('flex justify-start flex-wrap')[0]
                                .children[i].children[0].click();
                            break;
                        }
                    }

                }
                clearInterval(timetid);
                // do something
            }, 3000);
        }

        // }
    }


    // Your code here...
})();