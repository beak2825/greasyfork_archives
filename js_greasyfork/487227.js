// ==UserScript==
// @name         灰暗之镜 终端版
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @license      GNU AGPLv3
// @description  这个插件的初衷是用来针对SCP-CN-3100的。至于被波及的家伙们，由衷表示活该。
// @author       MentalImageryMirage，即是心象蜃气楼。
// @match        http://scp-wiki-cn.wikidot.com/*
// @match        https://scp-wiki-cn.wikidot.com/*
// @match        http://scpsandboxcn.wikidot.com/the-darkgrey-mirror
// @match        https://scpsandboxcn.wikidot.com/the-darkgrey-mirror
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487227/%E7%81%B0%E6%9A%97%E4%B9%8B%E9%95%9C%20%E7%BB%88%E7%AB%AF%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487227/%E7%81%B0%E6%9A%97%E4%B9%8B%E9%95%9C%20%E7%BB%88%E7%AB%AF%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mirrorTable = '/scp-cn-3109/offset/2'
    var animationLock = false
    var missionLock = true
    var swn001 = ""
    var LogCN2132 = {
        'sumNum':125,
        'sumKarma':293,
        'karmaAve':2.34,
        'karmaLog_0':[28,26,2,0],
        'karmaLog_1':[13,12,1,0],
        'karmaLog_2':[21,20,1,0],
        'karmaLog_3':[23,23,0,0],
        'karmaLog_4':[31,29,2,0],
        'karmaLog_5':[9,7,2,0],
        'upNum':117,
        'upKarmaAve':2.32,
        'downNum':8,
        'downKarmaAve':2.63,
        'noAvatarNum':15,
        'lowKarmaUpNum':38,
        'lowKarmaDownNum':3,
        'lowKarmaUpPer':0.32,
        'lowKarmaDownPer':0.38,
        'abnormalNum': 7,
        'abnormalValue':0.06,
    }
    var LogCN3879 = {
        'sumNum':80,
        'sumKarma':158,
        'karmaAve':1.98,
        'karmaLog_0':[28, 24, 4, 0],
        'karmaLog_1':[4, 4, 0, 0],
        'karmaLog_2':[15, 13, 2, 0],
        'karmaLog_3':[13, 12, 1, 0],
        'karmaLog_4':[15, 14, 1, 0],
        'karmaLog_5':[5, 5, 0, 0],
        'upNum':72,
        'upKarmaAve':2.04,
        'downNum':8,
        'downKarmaAve':1.38,
        'noAvatarNum':18,
        'lowKarmaUpNum':28,
        'lowKarmaDownNum':4,
        'lowKarmaUpPer':0.39,
        'lowKarmaDownPer':0.50,
        'abnormalNum': 15,
        'abnormalValue':0.19,
    }
    var LogCN2349 = {
        'sumNum':197,
        'sumKarma':306,
        'karmaAve':1.55,
        'karmaLog_0':[84, 82, 2, 0],
        'karmaLog_1':[24, 23, 1, 0],
        'karmaLog_2':[27, 26, 1, 0],
        'karmaLog_3':[27, 25, 2, 0],
        'karmaLog_4':[28, 27, 1, 0],
        'karmaLog_5':[7, 7, 0, 0],
        'upNum':190,
        'upKarmaAve':1.54,
        'downNum':7,
        'downKarmaAve':1.86,
        'noAvatarNum':53,
        'lowKarmaUpNum':105,
        'lowKarmaDownNum':3,
        'lowKarmaUpPer':0.55,
        'lowKarmaDownPer':0.43,
        'abnormalNum': 36,
        'abnormalValue':0.18,
    }
    var LogCN3333 = {
        'sumNum':240,
        'sumKarma':393,
        'karmaAve':1.64,
        'karmaLog_0':[100, 99, 1, 0],
        'karmaLog_1':[21, 21, 0, 0],
        'karmaLog_2':[33, 31, 2, 0],
        'karmaLog_3':[45, 45, 0, 0],
        'karmaLog_4':[34, 34, 0, 0],
        'karmaLog_5':[7, 7, 0, 0],
        'upNum':237,
        'upKarmaAve':1.64,
        'downNum':3,
        'downKarmaAve':1.33,
        'noAvatarNum':58,
        'lowKarmaUpNum':120,
        'lowKarmaDownNum':1,
        'lowKarmaUpPer':0.51,
        'lowKarmaDownPer':0.33,
        'abnormalNum': 46,
        'abnormalValue':0.19,
    }
    var LogCN2000 = {
        'sumNum':2799,
        'sumKarma':2466,
        'karmaAve':0.88,
        'karmaLog_0':[1712, 1693, 19, 0],
        'karmaLog_1':[300, 294, 6, 0],
        'karmaLog_2':[386, 377, 9, 0],
        'karmaLog_3':[235, 226, 9, 0],
        'karmaLog_4':[141, 135, 6, 0],
        'karmaLog_5':[25, 25, 0, 0],
        'upNum':2750,
        'upKarmaAve':0.87,
        'downNum':49,
        'downKarmaAve':0.88,
        'noAvatarNum':996,
        'lowKarmaUpNum':1987,
        'lowKarmaDownNum':25,
        'lowKarmaUpPer':0.72,
        'lowKarmaDownPer':0.51,
        'abnormalNum': 861,
        'abnormalValue':0.31,
    }
    if(window.location.href.includes('forum') || window.location.href.includes('random')){console.log('照妖镜关闭');return}
    if(document.querySelector('.printuser')){
        swn001 = document.querySelector('.printuser').innerText
    }
        // <div id="mainBoard" onclick="window.enter()" onmouseleave="window.sleep()" onmouseenter="window.ready()">

    var mirrorCode = `
        <div id="avatarBoard" style="display:flex;flex-direction:column;"></div>
        <div id="mainBoard" onclick="window.enter()" onmouseleave="window.sleep()" onmouseenter="window.ready()">
            <div id="dashBoard">
                <div id="logoBoard">
                    <div class="rhombic" id="rhombic_1" onclick='window.change(1)'><div class="rhombicIn" id="rhombicIn_1"></div></div>
                    <div class="rhombic" id="rhombic_2" onclick='window.change(2)'><div class="rhombicIn" id="rhombicIn_2"></div></div>
                    <div class="rhombic" id="rhombic_3" onclick='window.change(3)'><div class="rhombicIn" id="rhombicIn_3"></div></div>
                    <div id="lights"><div id="light_1" class="light" style="background-color:grey"></div><div id="light_2" class="light" style="background-color:grey"></div><div id="light_3" class="light" style="background-color:grey"></div></div>
                </div>
                <div id="resultBoard">
                    <div class="resultBoard" id="resultBoard_1">评分列表获取：<div id="theCloseButton" onclick="window.out()">X</div><div class="loader" id="load1"></div></div>
                    <div class="resultBoard" id="resultBoard_2">Karma值统计：<div class="loader" id="load2"></div></div>
                    <div class="resultBoard" id="resultBoard_3">可疑账号检索：<div style="display:flex;justify-content:space-between"><div class="loader" id="load3"></div></div></div>
                </div>
            </div>
            <div id="information">
                <div id="message">照射目标：http://scp-wiki-cn.wikidot.com/<input style="height:11px;width:130px;border:2px groove whitesmoke;" type="text" id="targetLinkInput"/></div>
                <div id="textWindow">确认到swn001-1实体：<span style="color:darkred;font-weight: bold;">${swn001}</span><br/><span style="color:green;font-weight: bold;">程式装载完毕，欢迎使用“灰暗之镜”系统。</span></div>
                <div id="switches">
                    <div class="switch" onclick="window.getThisPage()">照射</div>
                    <div class="switch" id="analize" onclick="window.analize()">解析</div>
                </div>
            </div>
        </div>
    </div>
    <style>
    #theCloseButton{
        width:15px;
        height:15px;
        position:fixed;
        right:0;
        top:0;
        text-align:center;
        line-height:15px;
        overflow:hidden;
        color:darkred;
        font-weight:bolder;
        background-color:lightgrey;
        cursor:pointer;
        user-select: none;
        border:4px groove white;
        z-index:1000;
    }
    #theCloseButton:hover {
        border: 4px outset whitesmoke;
    }
    #theCloseButton:active {
        border: 4px inset white;
        color:red;background-color:whitesmoke;
    }
    #lights{
        display:none;
        animation:showoff 0.5s 1 forwards;
        flex-direction:column;
        justify-content:space-around;
        width:90%;
        flex-grow: 1;
    }
    .light{
        border-top-left-radius:10px;
        border-bottom-left-radius:10px;
        width:60%;
        height:3px;
        border:2px inset white;
        transform: translate(-4px, 0px);
    }
    #dashBoard{
        display:flex;
        justify-content:space-between;
        width:100%;
        height:100%;
    }
    #resultBoard{
        animation:showoff 0.5s 1 forwards;
        width:0;
        display:none;
        flex-direction:column;
        background-color: white;
        color: black;
        border: 4px groove white;
        margin-bottom:2px;
        overflow-x:hidden;
        white-space: nowrap;
    }
    #resultBoard:after{
        content: '';
        display: block;
        width: 80%;
        height:65%;
        position: absolute;
        top: 5px;
        right: 5px;
        background-image:url(https://scpsandboxcn.wikidot.com/local--files/the-darkgrey-mirror/main.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        opacity:0.1;
    }
    .resultBoard{
        height:32%;
        padding-left:5px;
        font-weight:bolder;
        padding-right:5px;
    }
    #information{
        display:none;
        user-select: none;
        flex-direction:column;
        width:0;
        align-self:center;
        animation:showoff 0.5s 1 forwards;
        overflow-x:hidden;
        flex-grow: 1;
        margin-bottom:5px;
        padding:0px 5px 0px 5px;
        background-color: whitesmoke;
        border: 5px groove white;
        padding-left: 5px;
        max-height: 25%;
    }
    #textWindow{
        overflow-x:hidden;
        overflow-y:scroll;
        flex-grow: 1;
        white-space: nowrap;
        margin-bottom:2px;
        background-color: white;
        border: 5px groove white;
    }
    #textWindow::after {
        content: "◣";
        animation: typeBlink 1s infinite
    }
    #switches{
        display:flex;
        justify-content: space-around;
        width:100%;
    }
    .switch {
        border: 4px groove white;
        width:30%;
        text-align:center;
        cursor:pointer;
        padding-left:5px;
        padding-right:5px;
        overflow-x:hidden;
        white-space: nowrap;
        font-weight:bold;
    }
    .switch:hover {
        border: 4px outset white;
        transform: translate(-1px, -1px);
    }
    .switch:active {
        border: 4px inset white;
        color:white;background-color:grey;
        transform: translate(-1px, -1px);
    }
    #analize{
        display:none;
        animation:Analize 0.5s 1 forwards;
        width:0px;
        padding-left:0px;
        padding-right:0px;
        overflow-x:hidden;
        white-space: nowrap;
    }
    #logoBoard{
        display:flex;
        flex-direction:column;
        align-items:start;
    }
    #mainBoard{
        display:flex;
        opacity:0.5;
        transform: rotateZ(90deg);
        flex-direction:column;
        width:65px;
        height:80px;
        background-color: lightgray;
        border: 5px groove grey;
        border-radius: 0px;
        text-align: start !important;
    }
    .rhombic{
        width:60px;
        height:60px;
        cursor:pointer;
        color:white;
        opacity:0;
        background-color: whitesmoke;
        border: 7px ridge whitesmoke;
    }
    .rhombic:hover {
        border: 7px groove white;

    }
    .rhombic:active {
        background-color: gray;
        color:white;
        border: 5px inset whitesmoke;
    }
    .rhombicIn{
        width:0%;
        height:0%;
        animation:rhombicShow 0.3s 1 forwards;
        display:none;
        background-color: grey;
    }
    #rhombic_1{
        z-index:99;
    }
    #rhombic_2{
        z-index:98;
    }
    #rhombic_3{
        z-index:97;
    }
    #rhombicIn_1{
        border-top:10px ridge darkred;
    }
    #rhombicIn_2{
        border-top:10px ridge darkblue;
    }
    #rhombicIn_3{
        border-top:10px ridge gold;
    }
    .loading{
        display:flex;
        justify-content:center;
        align-items:center;
        width:0%;
        height:0%;
    }
    .loader{
        overflow-x:hidden;
        overflow-y:hidden;
        white-space: nowrap;
        width:0;
        height:40px;
        text-align:end;
        color:white;
    }
    #load1{
        background-color:darkred;
        display:none;
        animation:Loader 0.5s 1 forwards;
    }
    #load2{
        background-color:darkblue;
    }
    #load3{
        background-color:yellow;
        color:black
    }
    @keyframes Loader{
        from{width:0;}
        to{width:100%;}
    }

    @keyframes showoff{
        0%{width:0px;}
        100%{width:90%;}
    }
    @keyframes change{
        0%{width:80%;}
        100%{width:0px;}
    }
    @keyframes rhombicShow{
        0%{width:0%;height:0%}
        100%{width:100%;height:80%}
    }
    @keyframes Analize{
        0%{
            width:0px;
            padding-left:0px;
            padding-right:0px;
        }
        100%{
            width:30%;
            padding-left:5px;
            padding-right:5px;
        }
    }
    @keyframes typeBlink {
            0% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }
    @keyframes ready{
        from{
            transform: rotateZ(0deg)skew(0deg,0deg);
            opacity:0;
        }
        to{
            transform: rotateZ(-45deg)skew(15deg,15deg);
            opacity:1;

        }
    }
    @keyframes sleep{
        from{
            transform: rotateZ(-45deg)skew(15deg,15deg);
            opacity:1;
        }
        to{
            transform: rotateZ(0deg)skew(0deg,0deg);
            opacity:0;
        }
    }
    `
    var thread = document.querySelector('#footer');
    console.log(window.location.href)
    if(window.location.href.includes(mirrorTable)){
        thread = document.getElementById('u-anchor')
        console.log('镜台模式')
        mirrorCode = `
        <div style="z-index:999;position:absolute;left:50%;transform:translate(-50%,0px);margin-top:0%;display:flex;flex-direction:column;justify-content:start;align-items:center;color: black;">
        ${mirrorCode}
        #message{
            overflow-x:hidden;
            white-space: nowrap;
            text-align:center;
            font-size:small;
            font-weight:bolder;
            width:100%;
            padding-bottom:2px;
            ${window.innerWidth<500 ? 'display:flex;flex-direction:column':''}
        }
        @keyframes open{
            0%{transform: rotateZ(90deg);border: 5px groove;opacity:0.5;}
            10%{transform: rotateZ(0deg);width:80px;}
            50%{transform: rotateZ(0deg);width:550px;height:65px;}
            100%{transform: rotateZ(0deg);width:550px;height:450px;border: 5px outset whitesmoke;opacity:1;}
        }
        @keyframes close{
            0%{transform: rotateZ(0deg);width:550px;height:450px;border: 5px outset whitesmoke;opacity:1;}
            50%{transform: rotateZ(0deg);width:550px;height:65px;}
            90%{transform: rotateZ(0deg);width:65px;}
            100%{transform: rotateZ(90deg);border: 5px groove;opacity:0.5;}
        }
        </style>
        `

    }
    else{
        console.log('终端模式')
        mirrorCode = `
        <div style="z-index:999;position: fixed;right:20px;top:20%;margin:auto 0;display:flex;flex-direction:column;justify-content:start;align-items:center;color: black;">
        ${mirrorCode}
        #message{
            display:none;
            overflow-x:hidden;
            white-space: nowrap;
            text-align:center;
            font-size:small;
            font-weight:bolder;
            width:100%;
            padding-bottom:2px;
        }
        `
        if(window.innerWidth<500){
            console.log('窄屏适配')
            mirrorCode += `
                @keyframes open{
                    0%{transform: rotateZ(90deg);border: 5px groove;opacity:0.5;}
                    10%{transform: rotateZ(0deg);width:80px;}
                    50%{transform: rotateZ(0deg);width:80vw;height:65px;}
                    100%{transform: rotateZ(0deg);width:90vw;height:50vh;border: 5px outset whitesmoke;opacity:1;}
                }
                @keyframes close{
                    0%{transform: rotateZ(0deg);width:90vw;height:50vh;border: 5px outset whitesmoke;opacity:1;}
                    50%{transform: rotateZ(0deg);width:80vw;height:65px;}
                    90%{transform: rotateZ(0deg);width:65px;}
                    100%{transform: rotateZ(90deg);border: 5px groove;opacity:0.5;}
                }
                </style>
            `
        }
        else{
            mirrorCode += `
                @keyframes open{
                    0%{transform: rotateZ(90deg);border: 5px groove;opacity:0.5;}
                    10%{transform: rotateZ(0deg);width:80px;}
                    50%{transform: rotateZ(0deg);width:450px;height:65px;}
                    100%{transform: rotateZ(0deg);width:450px;height:400px;border: 5px outset whitesmoke;opacity:1;}
                }
                @keyframes close{
                    0%{transform: rotateZ(0deg);width:450px;height:400px;border: 5px outset whitesmoke;opacity:1;}
                    50%{transform: rotateZ(0deg);width:450px;height:65px;}
                    90%{transform: rotateZ(0deg);width:65px;}
                    100%{transform: rotateZ(90deg);border: 5px groove;opacity:0.5;}
                }
                </style>
            `
        }
    }
    if(window.location.href.includes(mirrorTable)&&thread){
        thread.innerHTML = mirrorCode
        document.getElementById('textWindow').innerHTML += '<span style="color:green;font-weight: bold;">启用镜台模式。</span>'
    }
    else if(thread){
        thread.innerHTML += mirrorCode
        document.getElementById('textWindow').innerHTML += '</br><span style="color:green;font-weight: bold;">启用终端模式。</span>'

    }
    else{
        document.querySelector('body').innerHTML += mirrorCode
        document.getElementById('textWindow').innerHTML += '</br><span style="color:green;font-weight: bold;">启用终端模式。</span>'
    }

//     window.test = function(){
//         var MyWin=window.open("http://scp-wiki-cn.wikidot.com/scp-cn-2880","","width=1050,height=650,resizable=no,location=no,");
//         console.log(MyWin)
//         setTimeout(function(){var t = MyWin.document;console.log(t)},1000)

//         // console.log(newWindow)
//         // var html = MyWin.document
//         // var parser = new DOMParser();
//         // Parse the text
//         // var doc = parser.parseFromString(html, "text/html");
//         // console.log(doc.querySelector('body').innerHTML.outerHTML)

//     }
    window.ready = function(){
        setTimeout(function(){document.getElementById('rhombic_1').style.animation = 'ready 0.5s 1 forwards'},50)
        setTimeout(function(){document.getElementById('rhombic_2').style.animation = 'ready 0.5s 1 forwards'},100)
        setTimeout(function(){document.getElementById('rhombic_3').style.animation = 'ready 0.5s 1 forwards'},150)
    }
    window.sleep = function(){
        setTimeout(function(){document.getElementById('rhombic_1').style.animation = 'sleep 0.5s 1 forwards'},50)
        setTimeout(function(){document.getElementById('rhombic_2').style.animation = 'sleep 0.5s 1 forwards'},100)
        setTimeout(function(){document.getElementById('rhombic_3').style.animation = 'sleep 0.5s 1 forwards'},150)
    }
    var openlock = false
    window.enter = function(){
        if(!animationLock){
            openlock = true
            // document.getElementById('information').style.display = 'flex'
            document.getElementById('mainBoard').style.animation='open 0.5s 1 forwards'
            setTimeout(function(){
                animationLock = true;
                document.getElementById('logoBoard').style.width = '20%';
                document.getElementById('dashBoard').style.height = '70%';
                document.getElementById('information').style.display = 'flex'
                document.getElementById('resultBoard').style.display = 'flex'
                document.getElementById('lights').style.display = 'flex'
            },300)
        }
    }
    window.out = function(){
        console.log('关闭面板')
        if(animationLock){
            openlock = false
            document.getElementById('resultBoard').style.display = 'none'
            document.getElementById('lights').style.display = 'none'
            document.getElementById('information').style.display = 'none'
            document.getElementById('dashBoard').style.height = '100%'
            document.getElementById('logoBoard').style.width = '100%';
            document.getElementById('mainBoard').style.animation='close 0.5s 1 forwards'
            setTimeout(function(){
                animationLock = false;
            },400)
        }
    }
    var target
    window.getThisPage = function(){
        var link
        function check (url){
            console.log(url)
            if (url.includes('forum') || url.includes('random') || url=="http://scp-wiki-cn.wikidot.com/"){
                console.log('目标处于照射范围外，照妖镜程式停止动作。')
                document.getElementById('textWindow').innerHTML = '<span style="color:red;font-weight: bold;">目标不在照射范围内，</span><br/><span style="color:red;font-weight: bold;">系统停止动作。</span>'
                document.getElementById('textWindow').scrollTop = document.getElementById('textWindow').scrollHeight;
                // document.getElementById('textWindow').innerHTML = '目标处于照射范围外，照妖镜系统停止动作。'
                missionLock = true
                return false
            }
            else{
                return true
            }
        }
        if(missionLock){
            missionLock = false
            if(window.location.href.includes(mirrorTable)){
                console.log('检测到镜台')
                link = "http://scp-wiki-cn.wikidot.com/" + document.getElementById("targetLinkInput").value
                if(check(link)){
                    target = new searchAndDestroy(link,false)
                    target.messageLog('<span style="color:gold;font-weight:bold;">调用镜台模式启动方案。</span>')
                    target.mirrorTableStart()
                }
                else{return}
            }
            else{
                link = window.location.href
                if(check(link)){
                    var name = document.getElementById('page-title').innerText.replace(/^\s*|\s*$/g, "")
                    target = new searchAndDestroy(link,false,name )
                    target.messageLog('<span style="color:gold;font-weight:bold;">调用终端模式启动方案。</span>')
                    // target = new searchAndDestroy('http://scp-wiki-cn.wikidot.com/scp-cn-3879' , '3879' , false)
                    target.start()
                }
            }
        }
        else{
            document.getElementById('textWindow').innerHTML += '<br/><span style="color:red;font-weight: bold;">不可重复操作。</span>'
            document.getElementById('textWindow').scrollTop = document.getElementById('textWindow').scrollHeight;
        }
    }
    window.analize = function(){
        console.log('解析')
        target.analize()
        if(target.complete){
            document.getElementById('textWindow').innerHTML += '<br/><span style="color:green;font-weight: bold;">解析成功。</span>'
            document.getElementById('textWindow').scrollTop = document.getElementById('textWindow').scrollHeight;
            var rhombics = document.getElementsByClassName('rhombicIn')
            for(var rIndex = 0;rIndex<rhombics.length;rIndex++){
                rhombics[rIndex].style.display = "block"
            }
        }
        else{
            document.getElementById('textWindow').innerHTML += '<br/><span style="color:red;font-weight: bold;">结果异常！</span>'
            document.getElementById('textWindow').scrollTop = document.getElementById('textWindow').scrollHeight;
        }

    }
    var tempHTML = document.getElementById('resultBoard').innerHTML
    document.getElementById('resultBoard').addEventListener("animationend",function(){
        // console.log("清除")
        document.getElementById('resultBoard').style.animation = '';
    });
    window.change = function(id){
        console.log('展示解析结果：'+id)
        // console.log(tempHTML)
        if(openlock && (typeof target == "undefined" || !target.complete)){
            document.getElementById('textWindow').innerHTML += '<br/><span style="color:red;font-weight: bold;">解析未完成。</span>'
            document.getElementById('textWindow').scrollTop = document.getElementById('textWindow').scrollHeight;
        }
        else if(typeof target != "undefined" && target.complete){
            // if(true){
            document.getElementById('resultBoard').style.zIndex = '1000'
            document.getElementById('resultBoard').style.animation = "change 0.3s 1 forwards"
            if(id == 1){
                document.getElementById('rhombic_1').style.zIndex = '1001'
                document.getElementById('rhombic_2').style.zIndex = '99'
                document.getElementById('rhombic_3').style.zIndex = '98'
                target.messageLog('<span style="color:lightred;font-weight: bold;">概况一览</span>')
                setTimeout(function(){
                    document.getElementById('resultBoard').innerHTML = `
                    <div id="analizeResult_1">
                        <span style="font-weight:bolder">评分概况一览</span>
                        <div class="resultRow"><div id="theCloseButton" onclick="window.out()">X</div>
                            <div class="resultTitle">总分：${target.result['upNum']-target.result['downNum']}</div>
                            <div class="resultContent">
                                <div class="LoaderUp" style="width:${((target.result['upNum']/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%"></div>
                                <div class="LoaderDown" style="width:${((target.result['downNum']/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%"></div>
                            </div>
                            <div class="info">
                                <div style="color:springgreen">+${target.result['upNum']}</div>
                                <div class="resultTitle">UP/DOWN比：${(target.result['upNum']/target.result['downNum']).toFixed(2)}</div>
                                <div style="color:red">-${target.result['downNum']}</div>
                            </div>
                        </div>
                        <div class="resultRow">
                            <div class="resultTitle">评分用户平均K值：${target.result['karmaAve']}</div>
                            <div class="resultContent">
                                <div class="Loader0K" style="width:${((target.result['karmaLog_0'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%;background-color:black">
                                </div>
                                <div class="Loader1K" style="width:${((target.result['karmaLog_1'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%;background-color:lightgreen">
                                </div>
                                <div class="Loader2K" style="width:${((target.result['karmaLog_2'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%;background-color:green">
                                </div>
                                <div class="Loader3K" style="width:${((target.result['karmaLog_3'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%;background-color:yellow">
                                </div>
                                <div class="Loader4K" style="width:${((target.result['karmaLog_4'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%;background-color:orange">
                                </div>
                                <div class="Loader5K" style="width:${((target.result['karmaLog_5'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%;background-color:red">
                                </div>
                            </div>
                        </div>
                        <div class="resultRow">
                            <div class="resultTitle">UP用户平均K值：${target.result['upKarmaAve']}</div>
                            <div class="resultContent">
                                <div class="Loader0K" style="width:${((target.result['karmaLog_0'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}%;background-color:black">
                                </div>
                                <div class="Loader1K" style="width:${((target.result['karmaLog_1'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}%;background-color:lightgreen">
                                </div>
                                <div class="Loader2K" style="width:${((target.result['karmaLog_2'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}%;background-color:green">
                                </div>
                                <div class="Loader3K" style="width:${((target.result['karmaLog_3'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}%;background-color:yellow">
                                </div>
                                <div class="Loader4K" style="width:${((target.result['karmaLog_4'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}%;background-color:orange">
                                </div>
                                <div class="Loader5K" style="width:${((target.result['karmaLog_5'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}%;background-color:red">
                                </div>
                            </div>
                        </div>
                        <div class="resultRow">
                            <div class="resultTitle">DOWN用户平均K值：${target.result['downKarmaAve']}</div>
                            <div class="resultContent">
                                <div class="Loader0K" style="width:${((target.result['karmaLog_0'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%;background-color:black">
                                </div>
                                <div class="Loader1K" style="width:${((target.result['karmaLog_1'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%;background-color:lightgreen">
                                </div>
                                <div class="Loader2K" style="width:${((target.result['karmaLog_2'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%;background-color:green">
                                </div>
                                <div class="Loader3K" style="width:${((target.result['karmaLog_3'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%;background-color:yellow">
                                </div>
                                <div class="Loader4K" style="width:${((target.result['karmaLog_4'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%;background-color:orange">
                                </div>
                                <div class="Loader5K" style="width:${((target.result['karmaLog_5'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%;background-color:red">
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>
                    #analizeResult_1{
                        z-index:100;
                        height:100%;
                        width:100%;
                        display:flex;
                        justify-content: space-around;
                        align-items:center;
                        flex-direction:column;
                    }
                    .resultTitle{
                        font-weight:bold;
                    }
                    .resultRow{
                        width:90%;
                        display:flex;
                        flex-direction:column;
                    }
                    .info{
                        font-size:smaller;
                        display:flex;
                        justify-content: space-between;
                    }
                    .resultContent{
                        display:flex;
                        height:3px;
                        width:100%;
                    }
                    .LoaderUp{
                        text-align:start;
                        background-color:springgreen;
                        height:100%;
                    }
                    .LoaderDown{
                        background-color:red;
                        height:100%;

                    }
                    </style>
                    `
                    // document.getElementById('resultBoard').innerHTML = tempHTML
                },200)
            }
            if(id == 2){
                document.getElementById('rhombic_1').style.zIndex = '99'
                document.getElementById('rhombic_2').style.zIndex = '1001'
                document.getElementById('rhombic_3').style.zIndex = '98'
                target.messageLog('<span style="color:darkblue;font-weight: bold;">评分细节</span>')
                setTimeout(function(){
                    document.getElementById('resultBoard').innerHTML = `
                    <div id="analizeResult_2">
                        <span style="font-weight: 900;">各级Karma用户评分细节</span><div id="theCloseButton" onclick="window.out()">X</div>
                        <div class="karmaResults">
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="font-weight: bold;" style="font-weight: bolder;" style="font-weight: bolder;">Karma值</div>
                                <div style="font-weight: bold;" style="font-weight: bolder;">UP/DOWN占比</div>
                                <div style="font-weight: bold;">总人数占比</div>
                            </div>
                            <div class="karmaResult" id="karma_0">
                                <div class="karmaLoaderUp" style="width:${(target.result['karmaLog_0'][1]/target.result['karmaLog_0'][0]).toFixed(2)*100}%"></div>
                                <div class="karmaLoaderDown" style="width:${(target.result['karmaLog_0'][2]/target.result['karmaLog_0'][0]).toFixed(2)*100}%"></div>
                            </div>
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="width:35px;">0K：</div><div style="width:100px;text-align:end">${((target.result['karmaLog_0'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}% / ${((target.result['karmaLog_0'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%</div>
                                <div style="width:60px;text-align:end">${((target.result['karmaLog_0'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>

                        <div class="karmaResults">
                            <div class="karmaResult" id="karma_1">
                                <div class="karmaLoaderUp" style="width:${(target.result['karmaLog_1'][1]/target.result['karmaLog_1'][0]).toFixed(2)*100}%"></div>
                                <div class="karmaLoaderDown" style="width:${(target.result['karmaLog_1'][2]/target.result['karmaLog_1'][0]).toFixed(2)*100}%"></div>
                            </div>
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="width:35px;">1K：</div><div style="width:100px;text-align:end">${((target.result['karmaLog_1'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}% / ${((target.result['karmaLog_1'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%</div>
                                <div style="width:60px;text-align:end">${((target.result['karmaLog_1'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>

                        <div class="karmaResults">
                            <div class="karmaResult" id="karma_2">
                                <div class="karmaLoaderUp" style="width:${(target.result['karmaLog_2'][1]/target.result['karmaLog_2'][0]).toFixed(2)*100}%"></div>
                                <div class="karmaLoaderDown" style="width:${(target.result['karmaLog_2'][2]/target.result['karmaLog_2'][0]).toFixed(2)*100}%"></div>
                            </div>
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="width:35px;">2K：</div><div style="width:100px;text-align:end">${((target.result['karmaLog_2'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}% / ${((target.result['karmaLog_2'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%</div>
                                <div style="width:60px;text-align:end">${((target.result['karmaLog_2'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>

                        <div class="karmaResults">
                            <div class="karmaResult" id="karma_3">
                                <div class="karmaLoaderUp" style="width:${(target.result['karmaLog_3'][1]/target.result['karmaLog_3'][0]).toFixed(2)*100}%"></div>
                                <div class="karmaLoaderDown" style="width:${(target.result['karmaLog_3'][2]/target.result['karmaLog_3'][0]).toFixed(2)*100}%"></div>
                            </div>
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="width:35px;">3K：</div><div style="width:100px;text-align:end">${((target.result['karmaLog_3'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}% / ${((target.result['karmaLog_3'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%</div>
                                <div style="width:60px;text-align:end">${((target.result['karmaLog_3'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>

                        <div class="karmaResults">
                            <div class="karmaResult" id="karma_4">
                                <div class="karmaLoaderUp" style="width:${(target.result['karmaLog_4'][1]/target.result['karmaLog_4'][0]).toFixed(2)*100}%"></div>
                                <div class="karmaLoaderDown" style="width:${(target.result['karmaLog_4'][2]/target.result['karmaLog_4'][0]).toFixed(2)*100}%"></div>
                            </div>
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="width:35px;">4K：</div><div style="width:100px;text-align:end">${((target.result['karmaLog_4'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}% / ${((target.result['karmaLog_4'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%</div>
                                <div style="width:60px;text-align:end">${((target.result['karmaLog_4'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>

                        <div class="karmaResults">
                            <div class="karmaResult" id="karma_5">
                                <div class="karmaLoaderUp" style="width:${(target.result['karmaLog_5'][1]/target.result['karmaLog_5'][0]).toFixed(2)*100}%"></div>
                                <div class="karmaLoaderDown" style="width:${(target.result['karmaLog_5'][2]/target.result['karmaLog_5'][0]).toFixed(2)*100}%"></div>
                            </div>
                            <div style="transform: translate(0px,-3px);display: flex;justify-content: space-between;">
                                <div style="width:35px;">5K：</div><div style="width:100px;text-align:end">${((target.result['karmaLog_5'][1]/target.result['upNum']).toFixed(2)*100).toFixed(0)}% / ${((target.result['karmaLog_5'][2]/target.result['downNum']).toFixed(2)*100).toFixed(0)}%</div>
                                <div style="width:60px;text-align:end">${((target.result['karmaLog_5'][0]/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>

                    </div>
                    <style>
                    #analizeResult_2{
                        height:100%;
                        width:100%;
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        justify-content:space-evenly;
                    }
                    .karmaResults{
                        width:90%;
                        display:flex;
                        flex-direction:column;
                    }
                    .karmaResult{
                        display:flex;
                        height:3px;
                        width:100%;
                    }
                    .karmaLoaderUp{
                        text-align:start;
                        background-color:springgreen;
                        height:100%;
                    }
                    .karmaLoaderDown{
                        background-color:red;
                        height:100%;

                    }
                    </style>
                    `
                },200)
            }
            if(id == 3){
                document.getElementById('rhombic_1').style.zIndex = '99'
                document.getElementById('rhombic_2').style.zIndex = '98'
                document.getElementById('rhombic_3').style.zIndex = '1001'
                target.messageLog('<span style="color:gold;font-weight: bold;">异常指数评估</span>')
                // 'noAvatarNum':noAvatarNum,
                // 'lowKarmaUpNum':karmaLog[0][1]+karmaLog[1][1],
                // 'lowKarmaDownNum':karmaLog[0][2]+karmaLog[1][2],
                // 'lowKarmaUpPer':((karmaLog[0][1]+karmaLog[1][1])/upNum).toFixed(2),
                // 'lowKarmaDownPer':((karmaLog[0][2]+karmaLog[1][2])/downNum).toFixed(2),
                // 'abnormalNum': sus,
                // 'abnormalValue':(sus/sumNum).toFixed(2),
                setTimeout(function(){
                    document.getElementById('resultBoard').innerHTML = `
                    <div id="analizeResult_3">
                        <span style="font-weight:bolder">异常指数评估</span>
                        <div id="theCloseButton" onclick="window.out()">X</div>
                        <div class="susResultRow">
                            <div class="susResultTitle">默认头像用户：</div>
                            <div class="susResultContent">
                                <div class="LoaderNormal" style="width:100%"><div class="LoaderAbnormal" style="width:${((target.result['noAvatarNum']/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%"></div></div>
                            </div>
                            <div class="susInfo">
                                <div>${target.result['noAvatarNum']}个</div>
                                <div>${((target.result['noAvatarNum']/target.result['sumNum']).toFixed(2)*100).toFixed(0)}%</div>
                            </div>
                        </div>
                        <div class="susResultRow">
                            <div class="susResultTitle">低K值用户UP：</div>
                            <div class="susResultContent">
                                <div class="LoaderNormal" style="width:100%"><div class="LoaderAbnormal" style="width:${(target.result['lowKarmaUpPer']*100).toFixed(0)}%"></div></div>
                            </div>
                            <div class="susInfo">
                                <div>${target.result['lowKarmaUpNum']}个</div>
                                <div>${(target.result['lowKarmaUpPer']*100).toFixed(0)}%</div>
                            </div>
                        </div>
                        <div class="susResultRow">
                            <div class="susResultTitle">低K值用户DOWN：</div>
                            <div class="susResultContent">
                                <div class="LoaderNormal" style="width:100%"><div class="LoaderAbnormal" style="width:${(target.result['lowKarmaDownPer']*100).toFixed(0)}%"></div></div>
                            </div>
                            <div class="susInfo">
                                <div>${target.result['lowKarmaDownNum']}个</div>
                                <div>${(target.result['lowKarmaDownPer']*100).toFixed(0)}%</div>
                            </div>
                        </div>
                        <div class="susResultRow">
                            <div class="susResultTitle">可疑评分账号：</div>
                            <div class="susResultContent">
                                <div class="LoaderNormal" style="width:100%"><div class="LoaderAbnormal" style="width:${(target.result['abnormalValue']*100).toFixed(0)}%"></div></div>
                            </div>
                            <div class="susInfo">
                                <div>${target.result['abnormalNum']}个</div>
                                <div>${(target.result['abnormalValue']*100).toFixed(0)}%</div>
                            </div>
                        </div>
                        <div class="susResultRow">
                            <div class="susResultTitle">最终异常指数评估：</div>
                            <div class="susResultContent">
                                <div class="LoaderNormal" style="width:100%"><div class="LoaderAbnormal" style="width:${(target.result['abnormalFinal']*100).toFixed(0)}%"></div></div>
                            </div>
                            <div class="susInfo">
                                <div>${(target.result['abnormalFinal']*10).toFixed(2)}分</div>
                                <div>${(target.result['abnormalFinal']*100).toFixed(0)}%</div>
                            </div>
                        </div>
                    </div>
                    <style>
                    #analizeResult_3{
                        z-index:100;
                        height:100%;
                        width:100%;
                        display:flex;
                        justify-content: space-around;
                        align-items:center;
                        flex-direction:column;
                    }
                    .susResultTitle{
                        font-weight:bold;
                    }
                    .susResultRow{
                        width:90%;
                        display:flex;
                        flex-direction:column;
                    }
                    .susInfo{
                        font-size:smaller;
                        display:flex;
                        justify-content: space-between;
                    }
                    .susResultContent{
                        display:flex;
                        height:3px;
                        width:100%;
                    }
                    .LoaderAbnormal{
                        background-color:black;
                        height:100%;
                    }
                    .LoaderNormal{
                        background-color:white;
                        border:1px solid black;
                        height:100%;

                    }
                    </style>
                    `
                    if(target.result['abnormalFinal']>0.35){
                        if(target.result['sumNum']>200){
                            if(target.result['lowKarmaDownPer']>LogCN2000['lowKarmaDownPer']){
                                target.messageLog('<span style="color:red;font-weight:bold">该作品可能存在差评异常，疑似遭受恶意评分。</span>')
                            }
                            if (target.result['lowKarmaUpPer']>LogCN2000['lowKarmaUpPer']){
                                target.messageLog('<span style="color:red;font-weight:bold">该作品可能存在好评异常，涉嫌过度曝光或违规刷分。</span>')
                            }

                        }
                        else{
                            if(target.result['lowKarmaDownPer']>LogCN3879['lowKarmaDownPer']){
                                target.messageLog('<span style="color:red;font-weight:bold">该作品可能存在差评异常，疑似遭受恶意评分。</span>')
                            }
                            if (target.result['lowKarmaUpPer']>LogCN3879['lowKarmaUpPer']) {
                                target.messageLog('<span style="color:red;font-weight:bold">该作品可能存在好评异常，涉嫌过度曝光或违规刷分。</span>')
                            }
                        }
                    }
                    else{
                        target.messageLog('<span style="color:green;font-weight:bold">该作品异常值未进入警戒范围。</span>')
                    }
                },200)
            }
            // setTimeout(function(){
            //     document.getElementById('resultBoard').style.animation = " "
            // },600)
        }


    }
    class searchAndDestroy{
        target;
        name;
        aoe = true;
        listener = 0;
        Container;
        pageId;
        complete = false;
        listName = [];
        title = 'N/A';
        result = [];
        constructor(target,aoe,name){
            this.target = target
            this.name = name
            this.title = `《${name}》`
            this.aoe = aoe
        }

        start(){
            // link = 'http://scp-wiki-cn.wikidot.com/scp-cn-3100'
            console.log('照妖镜终端.exe启动，系统开始校准，当前目标：'+ this.title)
            this.messageLog('照妖镜程式启动，系统开始校准。<br/><span style="color:red">当前目标：'+ this.title + '</span>')
            var b = new Object();
            b.pageId = WIKIREQUEST.info.pageId;
            var that = this
            var parser = new DOMParser();
            OZONE.ajax.requestModule("pagerate/WhoRatedPageModule", b, function(res){
                console.log('获取'+ that.title + '评分名单成功')
                that.messageLog('获取'+ that.title + '评分名单成功')
                document.getElementById('load1').style.display = 'block'
                var listHtml = res.body
                var list = parser.parseFromString(listHtml,"text/html")
                // console.log(list)
                that.filter(list)
            })

        }
        mirrorTableStart(){
            console.log('镜台启动方案')
            fetch(this.target).then(res =>{
                console.log('成功捕获')
                // console.log(res)
                return res.text()
            }).then(html=>{
                var parser = new DOMParser();
                // Parse the text
                var doc = parser.parseFromString(html, "text/html");
                this.title = "《" + doc.getElementById('page-title').innerText.replace(/^\s*|\s*$/g, "") + "》"
                //console.log(WIKIREQUEST.info.pageId)
                var b = new Object();
                // b.pageId = WIKIREQUEST.info.pageId;k

                // console.log("id 本页面:"+ b.pageId)
                var pageIdString = doc.querySelectorAll("script")[1].innerHTML
                // console.log(pageIdString)
                var idIndex = pageIdString.indexOf('pageId')
                if(idIndex != -1){
                    var idIndexEnd = pageIdString.indexOf(';',idIndex)
                    // console.log(idIndex)
                    this.pageId = pageIdString.slice(idIndex+9,idIndexEnd)
                    console.log("目标页面id："+ this.pageId)
                }
                else{
                    console.log('目标页面id获取失败')
                }
                b.pageId = this.pageId
                var that = this
                OZONE.ajax.requestModule("pagerate/WhoRatedPageModule", b, function(res){
                    console.log('获取'+that.title+'评分名单成功')
                    document.getElementById('load1').style.display = 'block'

                    var listHtml = res.body
                    var list = parser.parseFromString(listHtml,"text/html")
                    // console.log(list)
                    that.filter(list)
                })
                // const event = document.createEvent('Events');
                // WIKIDOT.modules.PageRateModule.listeners.showWho(event, 1452016610)
                // event.initEvent( 'click', true, false );
                // const targetElement = doc.getElementById('pagerate-button');
                // targetElement.dispatchEvent(event);
            }).catch(e=>{console.log('获取评分名单失败：'+ e);this.messageLog('<span style="color:red">获取评分名单失败！</span>')})
        }
        messageLog(msg){
            document.getElementById('textWindow').innerHTML += `<br/>${msg}`
            document.getElementById('textWindow').scrollTop = document.getElementById('textWindow').scrollHeight;
        }
        filter(list){
            console.log("开始分析评分名单")
            // document.getElementById('loader').style.display='flex'
            // console.log(list.querySelectorAll('span'))
            var LIST = list.querySelectorAll('span')
            // console.log(LIST)
            // var LISTNAME = list.querySelectorAll('.printuser')
            var that = this
            var i = 0
            var judgeCheck
            // var listStatus = []
            var checkLimit = 0
            var temp = 0
            var parser = new DOMParser();
            // load += LIST.length
            document.getElementById('load1').innerHTML = `${LIST.length/2}人`
            if(LIST.length >= 2000){
                console.log('检测到'+ this.title + '为过大极端目标，不予操作。')
                this.messageLog('<span style="color:red">目标过大，您没有足够的操作权限。</span>')
                return
            }
            if(LIST.length >= 1000 && !this.aoe){
                console.log('检测到'+ this.title + '为单例极端目标，开始降速运行。')
                this.messageLog('<span style="color:red">检测到单例极端目标，开始降速运行。</span>')
                var karmaChecker
                i = 0
                clearInterval(karmaChecker)
                karmaChecker = setInterval(function(){
                    if(i < LIST.length){
                        if(i%2 == 0){
                            var tempHTML = parser.parseFromString(LIST[i].innerHTML,"text/html")
                            if(tempHTML.querySelectorAll('a').length>0){
                                var name = tempHTML.querySelectorAll('a')[1].innerHTML
                                // console.log(name)
                                // console.log(tempHTML.querySelectorAll('a')[0].querySelector('img').style.backgroundImage)
                                var tempString = tempHTML.querySelectorAll('a')[0].querySelector('img').style.backgroundImage
                                var userId = tempString.replace(/[^\d]/g, "")
                                var tempSrc= tempHTML.querySelectorAll('a')[0].querySelector('img').src
                                that.listName.push([name , tempSrc ,"" ,userId , -1 ,false])
                                that.getUserInfo(userId,that.listName.length-1)
                            }
                            else{
                                console.log("account deleted")
                                // that.messageLog("account deleted")
                                that.listName.push(['account deleted' , "N/A" ,"" ,"N/A" , 2 ,"N/A"])
                                that.listener ++
                            }
                            // window.judge(tempSrc,listName.length-1)
                        }
                        else{
                            if(LIST[i].innerHTML.includes("+")){
                                // console.log(listName[i-listName.length][0] + ": +")
                                that.listName[i-that.listName.length][2] = "+"
                                // listStatus.push("+")
                            }
                            else if(LIST[i].innerHTML.includes("-")){
                                // console.log(listName[i-listName.length][0] + ": -")
                                that.listName[i-that.listName.length][2] = "-"
                                // listStatus.push("-")
                            }

                        }
                        i++
                        document.getElementById('load2').style.width = `${(that.listener/(LIST.length/2)).toFixed(2)*100}%`
                        document.getElementById('load2').innerHTML = `${(that.listener/(LIST.length/2)).toFixed(2)*100}%`
                    }
                    else{
                        console.log('降速运行结束。')
                        that.messageLog('降速运行结束。')
                        // load -= LIST.length
                        // var judgeCheck
                        // var that = this
                        clearInterval(judgeCheck)
                        judgeCheck = setInterval(function(){
                            if(that.listener == that.listName.length){
                                console.log(that.title+'K值更新完毕，开始检索可疑账号。')
                                that.messageLog('K值更新完毕，开始检索可疑账号。')
                                document.getElementById('load2').style.width = "100%"
                                document.getElementById('load2').innerHTML = `100%`
                                clearInterval(judgeCheck)
                                that.judge()
                            }
                            else if(checkLimit > 30){
                                console.warn(that.title+'检测到K值更新死循环，停止动作。')
                                that.messageLog('检测到K值更新死循环，停止动作。</br>请刷新页面重新操作。')
                                for(var index = 0;index<that.listName.length;index++){
                                    if(that.listName[index][4] == -1){
                                        console.warn('警告：'+that.title+'中'+ that.listName[index][0] +'存在更新失败的K值：'+that.listName[index][4])
                                        that.messageLog('<span style="color:red">警告：存在更新失败的K值：'+that.listName[index][4]+'</span>')
                                    }
                                }
                                clearInterval(judgeCheck)
                            }
                            else{
                                if( temp < that.listener){
                                    temp = that.listener
                                    checkLimit = 0
                                }
                                else{
                                    checkLimit ++
                                }
                                console.log(that.title+'K值更新中。仍有'+ that.listName.length + ' - ' + that.listener + ' = ' + (that.listName.length - that.listener))
                                that.messageLog('K值更新中。仍有'+ that.listName.length + ' - ' + that.listener + ' = ' + (that.listName.length - that.listener))
                                document.getElementById('load2').style.width = `${(that.listener/that.listName.length).toFixed(2)*100}%`
                                document.getElementById('load2').innerHTML = `${(that.listener/that.listName.length).toFixed(2)*100}%`
                                // document.getElementById('load1').style.height = `${(that.listener/that.listName.length).toFixed(2)*70}px`
                            }
                        },500)
                        clearInterval(karmaChecker)
                    }
                },25)
            }
            else{
                // var i = 0
                for(i = 0;i<LIST.length;i++){
                    // console.log(LIST[i].innerHTML)
                    if(i%2 == 0){
                        var tempHTML = parser.parseFromString(LIST[i].innerHTML,"text/html")
                        if(tempHTML.querySelectorAll('a').length>0){
                            var name = tempHTML.querySelectorAll('a')[1].innerHTML
                            // console.log(name)
                            // console.log(tempHTML.querySelectorAll('a')[0].querySelector('img').style.backgroundImage)
                            var tempString = tempHTML.querySelectorAll('a')[0].querySelector('img').style.backgroundImage
                            var userId = tempString.replace(/[^\d]/g, "")
                            var tempSrc= tempHTML.querySelectorAll('a')[0].querySelector('img').src
                            this.listName.push([name , tempSrc ,"" ,userId , -1 ,false])
                            this.getUserInfo(userId,this.listName.length-1)
                        }
                        else{
                            console.log("account deleted")
                            this.messageLog("account deleted")
                            this.listName.push(['account deleted' , "N/A" ,"" ,"N/A" , 2 ,"N/A"])
                            this.listener ++
                        }
                        // window.judge(tempSrc,listName.length-1)
                    }
                    else{
                        if(LIST[i].innerHTML.includes("+")){
                            // console.log(listName[i-listName.length][0] + ": +")
                            this.listName[i-this.listName.length][2] = "+"
                            // listStatus.push("+")
                        }
                        else if(LIST[i].innerHTML.includes("-")){
                            // console.log(listName[i-listName.length][0] + ": -")
                            this.listName[i-this.listName.length][2] = "-"
                            // listStatus.push("-")
                        }

                    }
                }
                // console.log(this.listName)
                // load -= LIST.length
                // var that = this
                clearInterval(judgeCheck)
                judgeCheck = setInterval(function(){
                    if(that.listener == that.listName.length){
                        console.log(that.title+'K值更新完毕，开始检索可疑账号。')
                        that.messageLog('K值更新完毕，开始检索可疑账号。')
                        document.getElementById('load2').style.width = "100%"
                        document.getElementById('load2').innerHTML = "100%"
                        clearInterval(judgeCheck)
                        that.judge()
                    }
                    else if(checkLimit > 30){
                        console.warn(that.title+'检测到K值更新死循环，停止动作。')
                        that.messageLog('检测到K值更新死循环，停止动作。</br>请刷新页面重新操作。')
                        clearInterval(judgeCheck)
                    }
                    else{
                        if( temp < that.listener){
                            temp = that.listener
                        }
                        else{
                            checkLimit ++
                        }
                        console.log(that.title+'K值更新中。仍有'+ that.listName.length + ' - ' + that.listener + ' = ' + (that.listName.length - that.listener))
                        that.messageLog('K值更新中。仍有'+ that.listName.length + ' - ' + that.listener + ' = ' + (that.listName.length - that.listener))
                        document.getElementById('load2').style.width = `${(that.listener/that.listName.length).toFixed(2)*100}%`
                        document.getElementById('load2').innerHTML = `${(that.listener/that.listName.length).toFixed(2)*100}%`
                        // document.getElementById('load1').style.height = `${(that.listener/that.listName.length).toFixed(2)*70}px`
                    }
                },500)
            }
        }
        getUserInfo(userID,id){
            var c = new Object();
            var parser = new DOMParser()
            c.user_id = userID;
            var that = this
            // console.log('《'+that.title+'》:'+ that.listName[id][0])
            OZONE.ajax.requestModule("users/UserInfoWinModule", c, function(res){
                var tempHTML = parser.parseFromString(res.body,"text/html")
                // console.log(tempHTML)
                var tempTr = tempHTML.querySelectorAll('tr')
                let checkFlag = true
                for(var index = 0;index<tempTr.length;index++){
                    // console.log(index)
                    if(tempTr[index].querySelectorAll('td')[0].querySelector('b').innerHTML == '活跃等级（Karma）'){
                        checkFlag = false
                        var tempString = tempTr[index].querySelectorAll('td')[1].innerHTML.toString()
                        // var karma =
                        if(tempString[9] == "无"){
                            that.listName[id][4] = 0
                            that.messageLog(that.listener +':' + that.listName[id][0] +'K值：0')
                        }
                        else if(tempString[9] == "低"){
                            that.listName[id][4] = 1
                            that.messageLog(that.listener +':' + that.listName[id][0] +'K值：1')
                        }
                        else if(tempString[9] == "中"){
                            that.listName[id][4] = 2
                            that.messageLog(that.listener +':' + that.listName[id][0] +'K值：2')
                        }
                        else if(tempString[9] == "高"){
                            that.listName[id][4] = 3
                            that.messageLog(that.listener +':' + that.listName[id][0] +'K值：3')
                        }
                        else if(tempString[9] == "非"){
                            that.listName[id][4] = 4
                            that.messageLog(that.listener +':' + that.listName[id][0] +'K值：4')
                        }
                        else if(tempString[9] == "上"){
                            that.listName[id][4] = 5
                            that.messageLog(that.listener +':' + that.listName[id][0] +'K值：5')
                        }
                        else {
                            that.listName[id][4] = 1.5
                            console.warn('警告：'+ that.listName[id][0] +'K值更新失败，记为1.5')
                        }
                        console.log(that.listener + that.title + that.listName[id][0] +'K值：'+ tempString[9])

                        that.listener ++
                        // listName[id][4] = tempString[9]
                        // console.log(karma)
                    }
                }
                if(checkFlag){
                    that.listName[id][4] = 1
                    that.listener ++
                }
                // var karma = tempHTML.querySelectorAll('tr')[2].querySelectorAll('td')[1].innerHTML.toString()
                // console.log(karma)
            })
        }
        judge(){
            console.log('开始扫描'+ this.title)
            this.messageLog('开始扫描')
            var container = document.getElementById('avatarBoard')
            container.innerHTML += `<div data-id="${this.name}" id="_${this.pageId}"></div>`
            // var Container
            // eval(`this.Container = container.querySelector("[data-id= '${this.name}']")`)
            this.Container = document.getElementById(`_${this.pageId}`)
            for(var index = 0;index<this.listName.length;index++){
                if(this.listName[index][1]!='N/A'){
                    var img = document.createElement('img')
                    img.src = this.listName[index][1]
                    img.alt = this.listName[index][0]
                    img.style = 'display:none'
                    img.className = 'avatar'
                    this.Container.appendChild(img)
                    // console.log('宽：'+ img.naturalWidth)
                }
                else{
                    console.log('检测到N/A：' + this.listName[index][0])
                    this.messageLog('检测到N/A：' + this.listName[index][0])
                }
            }
            // console.log(this.Container+'添加完毕')
            var count = 0
            // console.log('开始扫描')
            var that = this
            function scan (){
                var avatars = that.Container.getElementsByClassName('avatar')
                var aIndex = 0
                // console.log(that.listName)
                var tempListName = that.listName
                for(aIndex;aIndex<avatars.length;aIndex++){
                    // console.log(aIndex + '名评分者：'+ that.listName[aIndex][0])
                    if(avatars[aIndex].naturalWidth == 48 && tempListName[aIndex][5] == false){
                        // console.log(listName[aIndex][0]+'：默认头像！')
                        that.listName[aIndex][5] = true
                        count++
                    }
                }
                console.log('对'+ that.title +'本次检索可疑账号总数：'+count)
                that.messageLog('本次扫描结果：'+count)
                document.getElementById('resultBoard_3').innerHTML = `可疑账号检索：<div style="display:flex;justify-content:space-between"><div class="loader" id="load3"></div>${count}个</div>`
                document.getElementById('load3').style.width = `${(count/that.listName.length).toFixed(2)*100}%`
                // document.getElementById('load2').style.height = `${(count/that.listName.length).toFixed(2)*100}%`
            }
            var scanner
            clearInterval(scanner)
            var tempCount = 0
            var limit = 0
            scanner = setInterval(function () {
                scan()
                if(tempCount!=count){
                    tempCount = count
                    limit = 0
                }
                else{
                    limit++
                }
                if((limit == 3 && count != 0)||limit == 10){
                    console.log('对'+ that.title +'扫描结束，最终结果为：'+ count)
                    that.messageLog('扫描结束，最终结果为：'+ count)
                    that.messageLog('<span style="color:green;font-weight: bold;">基本数据记录完毕。</span>')
                    tempHTML = document.getElementById('resultBoard').innerHTML

                    document.getElementById('resultBoard_3').innerHTML = `可疑账号检索：<div style="display:flex;justify-content:space-between"><div class="loader" id="load3"></div>${count}个</div>`
                    document.getElementById('load3').style.width = `${(count/that.listName.length).toFixed(2)*100}%`
                    // document.getElementById('load2').style.height = `${(count/that.listName.length).toFixed(2)*100}%`
                    // console.log(that.Container)
                    // that.Container.innerHTML = ''
                    clearInterval(scanner)
                    // that.analize()
                    document.getElementById('analize').style.display = 'block'
                    // return
                }
            }, 1000)
            // setTimeout(function(){
            //     scan()
            // },10000)
        }

        analize(lowK=false,noAva=false){
            console.log('=============================')
            console.log('照妖镜系统启动')
            console.log(this.title+ '分析开始')
            // console.log('《'+ document.getElementById('page-title').innerText.replace(/^\s*|\s*$/g, "") + '》分析开始')
            // console.log('《'+ this.title+ '》清空')
            // console.log(this.Container.innerHTML)
            // this.Container.innerHTML = ''
            document.getElementById(`_${this.pageId}`).innerHTML = ' '
            // console.log(document.getElementById('avatarBoard'))
            // console.log(this.Container.innerHTML)

            var sumNum = this.listName.length
            var upNum = 0
            var downNum = 0
            var noAvatarNum = 0
            var lowKarmaNum = 0
            var lowKarmaUpNum = 0
            var lowKarmaDownNum = 0
            var karmaLog = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
            var sumKarma = 0
            var sumKarmaUp = 0
            var sumKarmaDown = 0
            var sus = 0
            // console.log('原始数据：')
            // console.log(this.listName)
            for(var index = 0;index<sumNum;index++){
                if(this.listName[index][2] == "+"){
                    upNum++
                    sumKarmaUp += this.listName[index][4]
                    karmaLog[this.listName[index][4]][1] ++
                }
                else{
                    downNum++
                    sumKarmaDown += this.listName[index][4]
                    karmaLog[this.listName[index][4]][2] ++

                }
                if(this.listName[index][4] != -1){
                    sumKarma += this.listName[index][4]
                    karmaLog[this.listName[index][4]][0] ++
                }
                else{
                    console.warn('警告：'+this.title+'中'+ this.listName[index][0] +'存在更新失败的K值：'+this.listName[index][4])
                    this.messageLog('<span style="color:red">警告：存在更新失败的K值，按参考值计为1.5。</span>')
                    sumKarma += 1.5
                }
                // if(this.listName[index][4] == 0){
                //     lowKarmaNum++
                //     karmaLog[0][] ++
                //     if(this.listName[index][2] == "+"){
                //         lowKarmaUpNum++
                //         karma_0[1] ++
                //     }
                //     else if(this.listName[index][2] == "-"){
                //         lowKarmaDownNum++
                //         karma_0[2] ++
                //     }
                // }
                if(this.listName[index][5] == true){
                    noAvatarNum++
                }
                if(this.listName[index][4] == 0 && this.listName[index][5] == true){
                    sus++
                }
            }
            var tempUpPer = ( upNum == 0 ? 0 : ((karmaLog[0][1]+karmaLog[1][1])/upNum).toFixed(2))
            var tempDownPer = ( downNum == 0 ? 0 : ((karmaLog[0][2]+karmaLog[1][2])/downNum).toFixed(2))
            this.result = {
                'sumNum':sumNum,
                'sumKarma':sumKarma,
                // 'sumKarmaDown':sumKarmaDown,
                // 'sumKarmaUp':sumKarmaUp,
                'karmaAve':(sumKarma/sumNum).toFixed(2),
                'karmaLog_0':karmaLog[0],
                'karmaLog_1':karmaLog[1],
                'karmaLog_2':karmaLog[2],
                'karmaLog_3':karmaLog[3],
                'karmaLog_4':karmaLog[4],
                'karmaLog_5':karmaLog[5],
                'upNum':upNum,
                'upKarmaAve':(sumKarmaUp/upNum).toFixed(2),
                'downNum':downNum,
                'downKarmaAve':(sumKarmaDown/downNum).toFixed(2),
                'noAvatarNum':noAvatarNum,
                'lowKarmaUpNum':karmaLog[0][1]+karmaLog[1][1],
                'lowKarmaDownNum':karmaLog[0][2]+karmaLog[1][2],
                'lowKarmaUpPer':tempUpPer,
                'lowKarmaDownPer':tempDownPer,
                'abnormalNum': sus,
                'abnormalValue':(sus/sumNum).toFixed(2),
                'abnormalFinal':0
            }
            var abnormalCompute = 0
            if(this.result['abnormalValue']>LogCN2132['abnormalValue'] && this.result['sumNum']>5){
                abnormalCompute += (this.result['abnormalValue'] - LogCN2132['abnormalValue']) * 0.2
            }
            if(this.result['lowKarmaUpPer']>LogCN2132['lowKarmaUpPer'] && this.result['upNum']>10){
                abnormalCompute += (this.result['lowKarmaUpPer'] - LogCN2132['lowKarmaUpPer']) * 0.2
            }
            if(this.result['lowKarmaDownPer']>LogCN2132['lowKarmaDownPer'] && this.result['downNum']>10){
                abnormalCompute += (this.result['lowKarmaDownPer'] - LogCN2132['lowKarmaDownPer']) * 0.2
            }
            console.log('2132标准异常指数计算结果：' + abnormalCompute)

            if(this.result['abnormalValue']>LogCN3879['abnormalValue'] && this.result['sumNum']>5){
                abnormalCompute += (this.result['abnormalValue'] - LogCN3879['abnormalValue']) * 0.6
            }
            if(this.result['lowKarmaUpPer']>LogCN3879['lowKarmaUpPer'] && this.result['upNum']>10){
                abnormalCompute += (this.result['lowKarmaUpPer'] - LogCN3879['lowKarmaUpPer']) * 0.6
            }
            if(this.result['lowKarmaDownPer']>LogCN3879['lowKarmaDownPer'] && this.result['downNum']>10){
                abnormalCompute += (this.result['lowKarmaDownPer'] - LogCN3879['lowKarmaDownPer']) * 0.6
            }
            console.log('3879标准异常指数计算结果：' + abnormalCompute)

            if(this.result['abnormalValue']>LogCN2349['abnormalValue'] && this.result['sumNum']>5){
                abnormalCompute += (this.result['abnormalValue'] - LogCN2349['abnormalValue']) * 0.4
            }
            if(this.result['lowKarmaUpPer']>LogCN2349['lowKarmaUpPer'] && this.result['upNum']>10){
                abnormalCompute += (this.result['lowKarmaUpPer'] - LogCN2349['lowKarmaUpPer']) * 0.4
            }
            if(this.result['lowKarmaDownPer']>LogCN2349['lowKarmaDownPer'] && this.result['downNum']>10){
                abnormalCompute += (this.result['lowKarmaDownPer'] - LogCN2349['lowKarmaDownPer']) * 0.4
            }
            console.log('2349标准异常指数计算结果：' + abnormalCompute)

            // if(this.result['abnormalValue']>LogCN3333['abnormalValue']){
            //     abnormalCompute += (this.result['abnormalValue'] - LogCN3333['abnormalValue']) * 0.4
            // }
            // if(this.result['lowKarmaUpPer']>LogCN3333['lowKarmaUpPer']){
            //     abnormalCompute += (this.result['lowKarmaUpPer'] - LogCN3333['lowKarmaUpPer']) * 0.4
            // }
            // if(this.result['lowKarmaDownPer']>LogCN3333['lowKarmaDownPer']){
            //     abnormalCompute += (this.result['lowKarmaDownPer'] - LogCN3333['lowKarmaDownPer']) * 0.4
            // }
            // console.log('周穆王协议异常指数计算结果：' + abnormalCompute)

            if(this.result['sumNum']>250){
                console.log('检测到极端曝光目标，启用混沌理论协议。' )
                this.messageLog('<span style="color:red">检测到极端曝光目标，启用混沌理论协议。</span>')
                abnormalCompute = (abnormalCompute/2).toFixed(2)
                // console.log(abnormalCompute)
                if(this.result['abnormalValue']>LogCN2000['abnormalValue']){
                    abnormalCompute = parseFloat(abnormalCompute) + parseFloat((this.result['abnormalValue'] - LogCN2000['abnormalValue']) * 0.6.toFixed(2))
                    // console.log(abnormalCompute)
                }
                if(this.result['lowKarmaUpPer']>LogCN2000['lowKarmaUpPer'] && this.result['upNum']>10){
                    abnormalCompute = parseFloat(abnormalCompute) + parseFloat((this.result['lowKarmaUpPer'] - LogCN2000['lowKarmaUpPer']) * 0.6.toFixed(2))
                    // console.log(abnormalCompute)
                }
                if(this.result['lowKarmaDownPer']>LogCN2000['lowKarmaDownPer'] && this.result['downNum']>10){
                    abnormalCompute = parseFloat(abnormalCompute) + parseFloat((this.result['lowKarmaDownPer'] - LogCN2000['lowKarmaDownPer']) * 0.6.toFixed(2))
                    // console.log(abnormalCompute)
                }
                console.log('混沌理论协议异常指数计算结果：' + abnormalCompute)
            }

            this.result['abnormalFinal'] = parseFloat(abnormalCompute).toFixed(2)

            var that = this
            var msg = '警戒程度：Explained'
            setTimeout(function(){
                if(that.result['karmaAve']<LogCN2132['karmaAve']){
                    document.getElementById('light_3').style.backgroundColor = 'red'
                    msg = '警戒程度：Safe'
                }
                else{
                    document.getElementById('light_3').style.backgroundColor = 'springgreen'
                }
            },500)
            setTimeout(function(){
                if(that.result['karmaAve']<LogCN3879['karmaAve']){
                    document.getElementById('light_2').style.backgroundColor = 'red'
                    msg = '警戒程度：Euclid'
                }
                else{
                    document.getElementById('light_2').style.backgroundColor = 'springgreen'
                }
            },1000)
            setTimeout(function(){
                if(that.result['karmaAve']<LogCN2349['karmaAve']){
                    document.getElementById('light_1').style.backgroundColor = 'red'
                    msg = '警戒程度：Keter'
                }
                else{
                    document.getElementById('light_1').style.backgroundColor = 'springgreen'
                }
                that.messageLog(msg)
            },1500)

            console.log(this.result)

            console.log('------------------------------')
            console.log("UP人数：" + upNum)
            console.log("UP平均K值：" + sumKarmaUp +' / '+upNum +' = '+ (sumKarmaUp/upNum).toFixed(2))
            console.log("Down人数：" + downNum)
            console.log("Down平均K值：" + sumKarmaDown +' / '+downNum +' = '+ (sumKarmaDown/downNum).toFixed(2))
            console.log("默认头像人数：" + noAvatarNum)
            console.log('------------------------------')

            console.log("0K用户UP人数：" + karmaLog[0][1])
            console.log("0K用户Down人数：" + karmaLog[0][2])
            console.log("0K用户评分占比：" )
            console.log("UP比例：" + (karmaLog[0][1]/upNum).toFixed(2))
            console.log("Down比例：" + (karmaLog[0][2]/downNum).toFixed(2))
            console.log('------------------------------')

            console.log("评分用户平均K值：" + (sumKarma/sumNum).toFixed(2))
            console.log("UP用户平均K值：" + (sumKarmaUp/upNum).toFixed(2))
            console.log("Down用户平均K值：" + (sumKarmaDown/downNum).toFixed(2))
            console.log('------------------------------')

            console.log("异常指数："+ abnormalCompute)
            console.log(this.result)
            console.log('=============================')
            this.complete = true
        }
    }

})();
