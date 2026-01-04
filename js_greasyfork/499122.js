// ==UserScript==
// @name         抖音复制链接
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  "复制链接脚本"
// @author       xgm
// @match        https://www.douyin.com/*
// @match        https://www.douyin.com/search/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/499122/%E6%8A%96%E9%9F%B3%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/499122/%E6%8A%96%E9%9F%B3%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 自定义css
    let div_css = `
        .cyOperate{
            width: 500px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
        .cyBtn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 20px 10px;
        }
        .keyword {
           margin:20px 0;
        }
        .title {
           font-size:16px;
           font-weight:500;
           color:blue;
        }
        .h1_content{
        font-size:22px;
        font-weight:bold;
        display:none;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="cyOperate">
            <div class="cyBtn">
                <h3>复制链接脚本</h3>
            </div>
        </div>
        <div class="cyloading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
    `
    $("body").append(div);
    let rex = window.location.href;
    // apiHost
    var apiHost = "https://api.oa.cyek.com/";
    const version = "1.3.6"
    // 查找抖音数据id
    function searchData(object, data) {
        for (var key in object) {
            if (object[key] == object[data]){
                // console.log(key)
                return key
            };
            for(var i in object[key]){
                // console.log(i);
                if(i == data){
                    return key;
                }
            }
        }
    }

    function req(url,data,sucFun,specialFun){
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    // console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        alert(json.message);
                        localStorage.removeItem("token");
                        localStorage.removeItem("storagePhone");
                        localStorage.removeItem("storagePwd");
                        localStorage.removeItem("dep_name");
                        localStorage.removeItem("staffName");
                        $(".operate").hide();
                        $(".loginBox").show();
                    }else{
                        alert(json.message);
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });
    }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
//搜索页
    if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null){
        console.log(13123131)
        var originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/search\/item\/*/) != null) {
                        // 在获取到响应后执行你的操作
                        var json = JSON.parse(self.response);
                        let list = json?.data
                        console.log("============获取到数据============")
                        for(let i =0 ;i<list.length;i++){
                            console.log("https://www.douyin.com/video/"+list[i]?.aweme_info?.aweme_id)
                        }
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
        const open = ()=>{
           
        }
 // 抓取达人
        $(".cyBtn button").click(function(){
            open()
        })
    }
    // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })



    dragInfo(100,0)



})();