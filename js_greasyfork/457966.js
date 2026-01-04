// ==UserScript==
// @name         Bilibili视频播放变速
// @namespace    video-rate
// @version      0.1.2
// @description  bilibili网页视频播放变速，还添加一键二连（点赞和投币）功能按钮，一键三连按钮， 测试了edge和chrome 运行正常,23-1-9
// @author       zip11guge
// @match        https://www.bilibili.com/video/*
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=
// @grant none
// @run-at document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/457966/Bilibili%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%8F%98%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/457966/Bilibili%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%8F%98%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //搜索黑块自定义偏移位置
    // 黑块位置不合适，脚本内容搜索黑块自定义偏移位置，修改加号后的偏移数字，调整到合适的位置
    
    // new div1
    let div1=document.createElement("div");


    //div1 text
    div1.innerHTML=`<span class="v2">(2x) </span><span class="v15">(1.5x)  </span><span class="v125">(1.25x)
    </span><span class="v1">(1x)  </span> </span><span class="erlian">(2-lian) </span> <span class="sanlian">(3-lian) </span>`;


    // div1 click
    div1.onclick=function(event){


        // click speed
        switch (event.target.className) {
            case "v2" :
                playspeed(2);
                break;
            case "v15":
                playspeed(1.5);
                break;
            case "v125":
                playspeed(1.25);
                break;
            case "v1" :
                playspeed(1);
                break;
            case "erlian" :
                erlian();
                break;

            case "sanlian" :
                sanlian();
                break;
        }
    };


    // append div1 button

    document.body.append(div1);

    //css样式为

    // position:fixed; 生成固定定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。
    // position:absolute; 用绝对定位,一个元素可以放在页面上的任何位置

    //z-index:999; 元素设置最上

    //bottom:15px;距窗口底部15px
    //right:15px;距窗口右边15px
    //width:60px;内容的宽度60px
    //height:60px;内容的高度60px

    //background:black;内边距的颜色和内容的颜色设置为黑色，不包括外边距和边框
    //opacity:0.75;不透明度设置为0.75，1为完全不透明
    //color:white;指定文本的颜色为白色

    //text-align:center;指定元素文本的水平对齐方式为居中对齐
    //text-align:justify实现两端对齐文本效果。

    //line-height:60px;设置行高，通过设置为等于该元素的内容高度的值，配合text-align:center;可以使div1的文字居中
    //cursor:pointer;定义了鼠标指针放在一个元素边界范围内时所用的光标形状为一只手


    // share pos- windows start-----------

    var box = document.getElementsByClassName("bpx-player-sending-bar")[0];

    var pos = box.getBoundingClientRect();

    // alert( "top:"+pos.top +
    //     "left:"+pos.left +
    //     "bottom:"+pos.bottom +
    //     "right:"+pos.right +
    //     "width:"+pos.width +
    //     "height:"+pos.height);

    // share pos End -------------

    //搜索黑块自定义偏移位置
    let sleft=pos.left+380;
    // div1 left 左位置

    let stop=pos.top+56

    // div1 top 上边缘 位置

    div1.style = "position:absolute;z-index:999;top:"+stop+"px;left:"+sleft+"px;width:220px;height:30px;background:black;opacity:0.75;color:white;text-align:center;line-height:30px;cursor:pointer;";


//     // add san-lian-button

//     let triple=document.createElement("button");
//     triple.innerText="三连";
//     triple.style.background="#757575";//颜色弄得差不多吧
//     triple.style.color="#fff";

//     triple.onclick=function(){

//         //三连代码
//         sanlian();
//     };

//     let ops=document.querySelector('#arc_toolbar_report .ops');
//     //插入三连之后好像会重新生成,不添加就不会重新生成,暂时没弄清什么情况,先这样处理了.

//     //主要作用是监听ops的DOMNodeInserted事件,等它修改完成之后再插入我们的三连按钮,另外注意run-at是document-end,要等待ops生成之后再监听,不然query返回null会报错

//     //这个事件会多次调用,但是我们insertBefore插入如果元素存在,只是修改而不会新增
//     ops.addEventListener("DOMNodeInserted", function(event) {

//         let share=document.querySelector('.share');
//         share.parentElement.insertBefore(triple,share);

//         //share.parentElement.insertBefore(div1,share);

//     });



    // set video rate

    function playspeed(sd) {

        var xy1 = document.querySelector("video");

        console.log(xy1);

        xy1.playbackRate = sd;

        console.log("video-speed:"+sd);

    }

    //bili-like-coin2

    function erlian() {

        let httpRequest = new XMLHttpRequest();

        httpRequest.open('POST', 'https://api.bilibili.com/x/web-interface/coin/add');
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        httpRequest.withCredentials = true;
        //设置跨域发送带上cookie

        let aid=window.__INITIAL_STATE__.aid;
        let sKey="bili_jct";
        let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        //上面这一段就是取出csrf,在cookie里面是bili_jct,这一段我是直接copy的,总之获取到就好了啦


        httpRequest.send("aid=" + aid + "&multiply=2&select_like=1&cross_domain=true&csrf=" + csrf);
        // POST form

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && httpRequest.status == 200) {


                var json = JSON.parse(httpRequest.responseText);
                //将一个 JSON 字符串转换为对象

                console.log(json);

                if(json.code==0){
                    alert("2连成功!刷新页面可见");
                }else{
                    alert("2连失败/(ㄒoㄒ)/~~");
                }
            }
        };
    }


    // bili-san-lian

    function sanlian() {

        let httpRequest = new XMLHttpRequest();

        httpRequest.open('POST', 'https://api.bilibili.com/x/web-interface/archive/like/triple');
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        httpRequest.withCredentials = true;
        //设置跨域发送带上cookie

        let aid=window.__INITIAL_STATE__.aid;
        let sKey="bili_jct";
        let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        //上面这一段就是取出csrf,在cookie里面是bili_jct,这一段我是直接copy的,总之获取到就好了啦


        httpRequest.send('aid='+aid+'&csrf='+csrf);
        // POST form

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && httpRequest.status == 200) {


                var json = JSON.parse(httpRequest.responseText);
                //将一个 JSON 字符串转换为对象

                console.log(json);

                if(json.code==0){
                    alert("三连成功!刷新页面可见");
                }else{
                    alert("三连失败/(ㄒoㄒ)/~~");
                }
            }
        };
    }

})();