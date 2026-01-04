
// ==UserScript==
// @name         新叫号系统优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  新叫号系统优化!
// @author       You
// @match        http://10.176.1.49/call/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469840/%E6%96%B0%E5%8F%AB%E5%8F%B7%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469840/%E6%96%B0%E5%8F%AB%E5%8F%B7%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    1、自动填充用户名密码
    2、密码可见
    3、改变按钮颜色，便于区分【暂停服务】和【正在服务】
    以下为功能优化
    1、css使用!important强制提权，改变按钮颜色更稳定……v0.3 2022年9月9日11:30:40
    2、优化登录逻辑，登录按钮与回车登录、退出登录的逻辑
    */
    window.onload = function(){
        let url = window.location.hash
        ,loginUrl = '#/login'
        ,mainUrl = '#/main'
        ,setServiceButtonTime = 50   //暂停和开启服务按钮 点击后设置按钮颜色的延迟
        ,mainTime = 500   //加载界面后初始化按钮颜色的延迟
        ,nameArry = ["王宇洋","test1","test2"]
        ,userNameArry = ["hdqspj_wangyuyang","test1","test2","test3","test4","test5"]
        ,passWordArry = ["123456","test1","test2","test3","test4"];

        main();
        function main(){
            url = window.location.hash;
            if(url == loginUrl){
                console.log("登录界面");
                addButton();

                setLoginListener();
            }
            if(url == mainUrl){
                console.log("主界面");
                setTimeout(function(){
                    ImportCss();
                    console.log("css");
                    exitLogin();
                    setServiceButton();
                },mainTime);

            }
        }


        function ImportCss(){
            let myCss = document.createElement("style");
            myCss.type = "text/css";
            myCss.id = "myCss";
            myCss.innerHTML = ".el-button--primary{color:#FFF;background-color:#909399;border-color:#909399}.el-button--primary:focus,.el-button--primary:hover{background:#a6a9ad;border-color:#a6a9ad;color:#FFF}.el-button--primary.is-active,.el-button--primary:active{background:#82848a;border-color:#82848a;color:#FFF}.el-button--primary:active{outline:0}.el-button--primary.is-disabled,.el-button--primary.is-disabled:active,.el-button--primary.is-disabled:focus,.el-button--primary.is-disabled:hover{color:#FFF;background-color:#c8c9cc;border-color:#c8c9cc}.el-button--primary.is-plain{color:#909399;background:#f4f4f5;border-color:#d3d4d6}.el-button--primary.is-plain:focus,.el-button--primary.is-plain:hover{background:#909399;border-color:#909399;color:#FFF}.el-button--primary.is-plain:active{background:#82848a;border-color:#82848a;color:#FFF;outline:0}.el-button--primary.is-plain.is-disabled,.el-button--primary.is-plain.is-disabled:active,.el-button--primary.is-plain.is-disabled:focus,.el-button--primary.is-plain.is-disabled:hover{color:#bcbec2;background-color:#f4f4f5;border-color:#e9e9eb}.el-button--danger{color:#FFF;background-color:#909399;border-color:#909399}.el-button--danger:focus,.el-button--danger:hover{background:#a6a9ad;border-color:#a6a9ad;color:#FFF}.el-button--danger.is-active,.el-button--danger:active{background:#82848a;border-color:#82848a;color:#FFF}.el-button--danger:active{outline:0}.el-button--danger.is-disabled,.el-button--danger.is-disabled:active,.el-button--danger.is-disabled:focus,.el-button--danger.is-disabled:hover{color:#FFF;background-color:#c8c9cc;border-color:#c8c9cc}.el-button--danger.is-plain{color:#909399;background:#f4f4f5;border-color:#d3d4d6}.el-button--danger.is-plain:focus,.el-button--danger.is-plain:hover{background:#909399;border-color:#909399;color:#FFF}.el-button--danger.is-plain:active{background:#82848a;border-color:#82848a;color:#FFF;outline:0}.el-button--danger.is-plain.is-disabled,.el-button--danger.is-plain.is-disabled:active,.el-button--danger.is-plain.is-disabled:focus,.el-button--danger.is-plain.is-disabled:hover{color:#bcbec2;background-color:#f4f4f5;border-color:#e9e9eb}.el-button--success{color:#FFF;background-color:#909399;border-color:#909399}.el-button--success:focus,.el-button--success:hover{background:#a6a9ad;border-color:#a6a9ad;color:#FFF}.el-button--success.is-active,.el-button--success:active{background:#82848a;border-color:#82848a;color:#FFF}.el-button--success:active{outline:0}.el-button--success.is-disabled,.el-button--success.is-disabled:active,.el-button--success.is-disabled:focus,.el-button--success.is-disabled:hover{color:#FFF;background-color:#c8c9cc;border-color:#c8c9cc}.el-button--success.is-plain{color:#909399;background:#f4f4f5;border-color:#d3d4d6}.el-button--success.is-plain:focus,.el-button--success.is-plain:hover{background:#909399;border-color:#909399;color:#FFF}.el-button--success.is-plain:active{background:#82848a;border-color:#82848a;color:#FFF;outline:0}.el-button--success.is-plain.is-disabled,.el-button--success.is-plain.is-disabled:active,.el-button--success.is-plain.is-disabled:focus,.el-button--success.is-plain.is-disabled:hover{color:#bcbec2;background-color:#f4f4f5;border-color:#e9e9eb}.mycss{color:#FFF;background-color:#f00 !important;border-color:#E6A23C}";
            document.querySelector("head").appendChild(myCss);
            console.log("插入css");
        }
        function exitLogin(){//退出登录后不重新执行脚本
            let exitButton = document.querySelectorAll('button')[1];
            //console.log(exitButton);
            exitButton.onclick = function(){
                setTimeout(function(){
                    //window.location.reload();
                    //先恢复css
                    document.getElementById('myCss').remove();
                    console.log("恢复css");
                    main();
                },100);
                //window.location.href = "http://10.176.1.49/call/#/login";

            }

        }
        function setServiceButton(){
            let serviceButton = document.getElementsByClassName('el-button')[3];

            serviceButton.onclick = function(){
                let calssName = serviceButton.className;//el-button el-button--warning

                setTimeout(function(){
                    if(serviceButton.textContent == '暂停服务'){
                        //serviceButton.style.backgroundColor = '#E6A23C';
                        serviceButton.className = 'el-button el-button--warning';
                    }else if(serviceButton.textContent == '恢复服务'){
                        //serviceButton.style.backgroundColor = '#f70303';
                        serviceButton.className = 'el-button el-button--warning mycss';
                    }

                },setServiceButtonTime);


            }
        }

        function addButton(){
            if(document.getElementById('myDiv') != null){//检测是否已经插入快捷登录按钮，是则不再次插入
                return;
            }
            var myDiv = document.createElement('div');
            myDiv.id = "myDiv";
            myDiv.style.padding = '20px';
            document.getElementsByClassName('el-card__body')[0].append(myDiv);//login-content
            var parent = document.getElementById('myDiv');
            document.querySelectorAll('input')[1].type = 'text';

            for(var i = 0;i < nameArry.length; i++){
                var span = document.createElement("span");
                span.id = i;
                span.style.color = "#fff";
                span.style.cursor = "pointer";
                span.style.width = '100px';
                span.style.margin = '5px 15px';
                span.title =  userNameArry[i];
                span.textContent = nameArry[i];
                span.className = 'el-button button-login el-button--primary el-button--default';

                parent.append(span);
                span.onclick = function(){//绑定点击事件
                    setLogin(this.id);
                }
            }

        }


        //setLogin();
        function setLogin(num){
            var userName = document.querySelector('input')
            ,passWord = document.querySelectorAll('input')[1];
            passWord.type = 'text';
            if(userName.value == ''){
                userName.value = userNameArry[num];
                if(passWord.value == ''){
                    passWord.value = '123456';
                }else{
                    passWord.value = passWordArry[num];
                }

            }else{
                userName.value = '';
                passWord.value = '';
            }

            setInputEvent(userName);
            setInputEvent(passWord);
        }
        function setLoginListener(){
            document.querySelector("button").onclick = function(){// 监听登录按钮
                setTimeout(function(){
                    main();
                },mainTime);

            }
            document.onkeydown = function (e) { // 监听回车登录，登录成功后初始化颜色
                // 兼容FF和IE和Opera
                let theEvent = window.event || e;
                let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {

                    setTimeout(function(){
                        main();
                    },mainTime);

                }
            }
        }

        function setInputEvent(casess){//直接赋值input无效，需手动触发vue框架的input事件
            var event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
            event.eventType = 'message';
            casess.dispatchEvent(event);
        }
    }

    // Your code here...
})();