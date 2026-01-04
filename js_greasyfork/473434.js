// ==UserScript==
// @name         支付宝页面筛选
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  达人管理数据绑定
// @author       xgm
// @match        https://sweb.alipay.com/p/talent*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/473434/%E6%94%AF%E4%BB%98%E5%AE%9D%E9%A1%B5%E9%9D%A2%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/473434/%E6%94%AF%E4%BB%98%E5%AE%9D%E9%A1%B5%E9%9D%A2%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let div_css = `
        .loginBox{
            min-width: 330px;
            padding: 30px 30px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            top: 50%;
            left: 5%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 999;
            font-size: initial;
        }
        .login-title{
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .login-tel{
            margin: 20px 0 10px;
        }
        .login-tel,.login-pwd{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-tel span,.login-pwd span{
            width: 70px;
            font-size: 16px;
            text-align: right;
        }
        .login-tel input,.login-pwd input{
            width: 200px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 6px;
            border: 1px solid #aaa;
        }
        .login-btn{
            margin-top: 20px;
            text-align: center;
        }
        .login-btn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 6px;
            cursor: pointer;
        }
        .logo{
            width: 80px;
            position: absolute;
            top: 10px;
            left: 10px;
        }
        .logo img{
            width: 100%;
        }
        .operate{
            width: 400px;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 998;
            color: #333;
            display: none;
            box-sizing: initial;
        }
        .operate-toggle,.login-toggle{
            position: absolute;
            right: 15px;
            top: 2px;
            cursor: pointer;
        }
        .operate-toggle svg,.login-toggle svg{
            width: 40px;
            height: 40px;
        }
        .operate-name{
            width: 230px;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .operate-quit{
            position: absolute;
            right: 60px;
            top: 8px;
        }
        .operate-quit a{
            display: block;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #1890ff;
            color: #fff;
            font-size: 14px;
            text-decoration: none;
        }
        .info-name{
            font-size: 20px;
            font-weight: bold;
        }
        #copy{
            word-break : break-all;
            margin-left: 0;
        }
        .info-name p{
            display: inline-block;
            font-size: 16px;
            font-weight: normal;
            margin-left: 15px;
        }
        .info-name div{
            font-size: 16px;
            font-weight: normal;
            margin-top: 10px;
        }
        .info-name span{
            margin-left: 15px;
            font-size: 16px;
            font-weight: normal;
            cursor: pointer;
        }
        .info-data{
            margin-top: 15px;
        }
        .info-data>div{
            word-break: break-all;
            font-size: 16px;
            margin-bottom: 5px;
            min-height: 32px;
            line-height: 32px;
        }
        .info-data>div span{
            display: inline-block;
            vertical-align: top;
        }
        .cy-tool{
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #ccc;
        }
        svg{
            width: 32px;
            height: 32px;
        }
        .windowH{
            max-height: 400px;
            overflow-y: auto;
        }
        /*定义滚动条高宽及背景
         高宽分别对应横竖滚动条的尺寸*/
        .windowH::-webkit-scrollbar
        {
            width:10px;
            height:10px;
            background-color:#F5F5F5;
        }
        /*定义滚动条轨道
         内阴影+圆角*/
        .windowH::-webkit-scrollbar-track
        {
            -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
            // border-radius:10px;
            background-color:#F5F5F5;
        }
        /*定义滑块
         内阴影+圆角*/
        .windowH::-webkit-scrollbar-thumb
        {
            border-radius:10px;
            -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
            background-color:#555;
        }
        .data-btn{
            margin-top: 30px;
            text-align: center;
        }
        .btnNormal{
            padding: 7px 20px;
            background-color: #1890ff;
            font-size: 14px;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            border: 0;
/*             margin-right: 20px; */
            margin-bottom: 10px;
        }
        .btnHide{
            display: none;
        }
        .loading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.7);
            z-index: 9999;
            display: none;
        }
        .loading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .loading svg text{
            font-size: 2px;
        }
        .msg{
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px;
            background-color: #fff;
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            display: none;
        }
        .showBtn{
            margin-left: 10px;
            cursor: pointer;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);


    let div = `
        <div class="loginBox">
            <div class="logo">
                <img src="https://www.cyek.com/img/logo-scroll.svg" alt="">
            </div>
            <div class="login-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
            <div class="cylogin-box">
                <div class="login-title">筛选</div>
                <div class="login-tel">
                    <input type="tel" placeholder="输入筛选关键字" name="phone" id="cyphoneNum" autocomplete="off" tabindex="1" />
                </div>
                <div class="login-btn">
                    <button>筛选</button>
                </div>
            </div>
            <div class="cy-tool">灿耀易客浏览器工具</div>
        </div>
        <div>
            <p></p>
            <input textarea="输入筛选关键字" />
        </div>
    `

    $("body").append(div);






    $(".login-btn button").click(function(){

        // console.log($(".dropMenu___kpYlK").children().text())

        let word = $("#cyphoneNum").val()

        $(".dropMenu___kpYlK").children().each(function(){
            // console.log(word)
            $(this).css("display","none")
            // console.log(self)
            if($(this).text().indexOf(word) != -1){
                $(this).css("display","flex")
            }
        })

    })
















    // 信息框拖拽
    function dragInfo(yTop,yBot){
        var _move=false;//移动标记
        var _x,_y;//鼠标离控件左上角的相对位置
        $(".operate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move=true;
            _x=e.pageX-parseInt($(".operate").css("left"));
            _y=e.pageY-parseInt($(".operate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move){
                var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y;
                //console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.operate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.operate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.operate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.operate').outerHeight(true) + yBot;
                }
                $(".operate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeft",$(".operate").css("left"));
            localStorage.setItem("elTop",$(".operate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取信息框拖拽后位置
    var elLeft = localStorage.getItem("elLeft");
    var elTop = localStorage.getItem("elTop");
    $(".operate").css({
        "left": elLeft,
        "top": elTop
    })


    // 登录框拖拽
    function dragInfo1(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".loginBox").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".loginBox").css("left"));
            _y1=e.pageY-parseInt($(".loginBox").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.loginBox').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.loginBox').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.loginBox').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.loginBox').outerHeight(true) + yBot;
                }
                $(".loginBox").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".loginBox").css("left"));
            localStorage.setItem("elTopLogin",$(".loginBox").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".loginBox").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })

    // 点击收起展开
    // el 元素 elBox 展开收起元素  toggleName localStorage存储名称 drag 调用函数 yTop,yBot,yTop1,yBot1 展开收起时各自对于顶部以及底部的限制范围
    function toggleShow(el,elBox,toggleName,drag,yTop,yBot,yTop1,yBot1,flag){
        el.click(function(){
            if($(this).attr("data-bind") == 1){
                el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
                elBox.slideUp();
                localStorage.setItem(toggleName,false);
                $(this).attr("data-bind",2);
                if(flag){
                    elBox.next().css({
                        "marginTop":"0",
                        "textAlign": "left"
                    });
                }
                drag(yTop,yBot);
            }else{
                el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
                elBox.slideDown();
                localStorage.setItem(toggleName,true);
                $(this).attr("data-bind",1);
                elBox.next().css({
                    "marginTop":"20px",
                    "textAlign": "center"
                });
                drag(yTop1,yBot1);
            }
        })
        var toggle = localStorage.getItem(toggleName);
        // console.log(toggle);
        if(toggle == "true" || toggle == undefined){
            el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
            elBox.show();
            el.attr("data-bind",1);
            elBox.next().css({
                "marginTop":"20px",
                "textAlign": "center"
            });
            drag(yTop1,yBot1);
        }else{
            el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
            elBox.hide();
            el.attr("data-bind",2);
            if(flag){
                elBox.next().css({
                    "marginTop":"0",
                    "textAlign": "left"
                });
            }
            drag(yTop,yBot);
        }
    }

    // 信息框收起展开
    toggleShow($(".operate-toggle"),$(".operate-box"),"toggle1",dragInfo,100,0,300,329,true);

    // 登录框收起展开
    toggleShow($(".login-toggle"),$(".cylogin-box"),"toggle2",dragInfo1,120,40,200,140);


})();