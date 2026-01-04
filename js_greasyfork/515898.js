// ==UserScript==
// @name        农场月卡自动
// @namespace   Violentmonkey Scripts
// @match       *://gamer.qq.com/v2/game/*
// @grant       none
// @version     1.0
// @author      柒
// @license MIT
// @icon https://pp.myapp.com/ma_icon/0/icon_54326199_1724898238/256
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @description 2024/10/7 15:16:431
// @downloadURL https://update.greasyfork.org/scripts/515898/%E5%86%9C%E5%9C%BA%E6%9C%88%E5%8D%A1%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/515898/%E5%86%9C%E5%9C%BA%E6%9C%88%E5%8D%A1%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.innerHTML = `
        #ymzx-wrap {
        height: 400px;
        width: 375px;
        position: fixed;
        top: 0;
        z-index: 9999999;
        background: rgba(197, 233, 233, 0.5);
        padding: 20px;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        gap: 15px;
    }

    #textareaId {
        width: 100%;
        padding: 2px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s;
        resize: none;
    }

    #minimizeRestoreButton {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 20px;
        height: 20px;
        padding: 5px;
        background-color: rgb(160, 236, 221);
        color: black;
        border: none;
        font-size: 20px;
        cursor: pointer;
        transition: color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #common-label {
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    .common-input {
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s;
        -webkit-appearance: none;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    #inputWrapper {
        display: flex;
        align-items: center;
    }

    #start-btn {
        padding: 10px 15px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin: 0 8px;
    }

    #stop-btn {
        padding: 10px 15px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin: 0 8px;
    }

    #buttonWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #textareaWrapper {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    #ymzx-modal {
        position: fixed;
        z-index: 10000001;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #ymzx-modalContent {
        position: relative;
        background-color: rgb(255, 255, 255);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 20px;
        max-width: 400px;
        width: 80%;
    }

    #ymzx-closeButton {
        position: absolute;
        top: 1px;
        right: 3px;
        font-size: 24px;
        color: rgb(170, 170, 170);
        cursor: pointer;
    }

    #ymzx-modal-text {
        font-size: 18px;
        color: rgb(51, 51, 51);
        margin-bottom: 10px;
    }

    #ymzx-tip-text {
        font-size: 16px;
        color: rgb(136, 136, 136);
    }

    #checkbox-container {
        display: flex;
        align-items: center;
        padding: 10px;
    }

    input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border: 2px solid #007bff;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
    }

    input[type="checkbox"]:checked {
        background-color: #007bff;
        border-color: #007bff;
    }

    input[type="checkbox"]:checked::after {
        content: '✔';
        color: white;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .checkbox-label {
        margin-left: 10px;
        font-size: 16px;
        color: #333;
        cursor: pointer;
        font-family: Arial, sans-serif;
        transition: color 0.3s ease;
    }

    input[type="checkbox"]:hover {
        border-color: #0056b3;
    }

    input[type="checkbox"]:checked:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }


    .checkbox-label:hover {
        color: #007bff;
    }

    #check-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #tipsText{    position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(90deg, rgb(255, 126, 95), rgb(254, 180, 123)) text;
        color: transparent;
        padding: 3px 8px;
        box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
        z-index: 10000002;
        animation: 10s linear 0s infinite normal none running scroll;}
        @keyframes scroll {
            0% {
                transform: translateX(100%);
            }
            100% {
                transform: translateX(-100%);
            }
        }
        #team {
            color: red !important;
        }
        `;
document.head.appendChild(style);
(()=>{let e=new KeyboardEvent("keydown",{key:"a",keyCode:65,code:"KeyA",which:65,bubbles:!0}),o=(new KeyboardEvent("keydown",{key:"b",keyCode:66,code:"KeyB",which:66,bubbles:!0}),new KeyboardEvent("keydown",{key:"c",keyCode:67,code:"KeyC",which:67,bubbles:!0}),new KeyboardEvent("keydown",{key:"d",keyCode:68,code:"KeyD",which:68,bubbles:!0})),n=new KeyboardEvent("keydown",{key:"e",keyCode:69,code:"KeyE",which:69,bubbles:!0}),t=(new KeyboardEvent("keydown",{key:"f",keyCode:70,code:"KeyF",which:70,bubbles:!0}),new KeyboardEvent("keydown",{key:"g",keyCode:71,code:"KeyG",which:71,bubbles:!0}),new KeyboardEvent("keydown",{key:"h",keyCode:72,code:"KeyH",which:72,bubbles:!0}),new KeyboardEvent("keydown",{key:"i",keyCode:73,code:"KeyI",which:73,bubbles:!0}),new KeyboardEvent("keydown",{key:"j",keyCode:74,code:"KeyJ",which:74,bubbles:!0}),new KeyboardEvent("keydown",{key:"k",keyCode:75,code:"KeyK",which:75,bubbles:!0}),new KeyboardEvent("keydown",{key:"l",keyCode:76,code:"KeyL",which:76,bubbles:!0})),d=(new KeyboardEvent("keydown",{key:"m",keyCode:77,code:"KeyM",which:77,bubbles:!0}),new KeyboardEvent("keydown",{key:"n",keyCode:78,code:"KeyN",which:78,bubbles:!0}),new KeyboardEvent("keydown",{key:"o",keyCode:79,code:"KeyO",which:79,bubbles:!0}),new KeyboardEvent("keydown",{key:"p",keyCode:80,code:"KeyP",which:80,bubbles:!0}),new KeyboardEvent("keydown",{key:"q",keyCode:81,code:"KeyQ",which:81,bubbles:!0})),c=new KeyboardEvent("keydown",{key:"r",keyCode:82,code:"KeyR",which:82,bubbles:!0}),y=(new KeyboardEvent("keydown",{key:"s",keyCode:83,code:"KeyS",which:83,bubbles:!0}),new KeyboardEvent("keydown",{key:"t",keyCode:84,code:"KeyT",which:84,bubbles:!0}),new KeyboardEvent("keydown",{key:"u",keyCode:85,code:"KeyU",which:85,bubbles:!0}),new KeyboardEvent("keydown",{key:"v",keyCode:86,code:"KeyV",which:86,bubbles:!0}),new KeyboardEvent("keydown",{key:"w",keyCode:87,code:"KeyW",which:87,bubbles:!0}),new KeyboardEvent("keydown",{key:"x",keyCode:88,code:"KeyX",which:88,bubbles:!0}),new KeyboardEvent("keydown",{key:"y",keyCode:89,code:"KeyY",which:89,bubbles:!0}),new KeyboardEvent("keydown",{key:"z",keyCode:90,code:"KeyZ",which:90,bubbles:!0}),new KeyboardEvent("keydown",{key:" ",keyCode:32,code:"Space",which:32,bubbles:!0})),b=(new KeyboardEvent("keydown",{key:"Enter",keyCode:13,code:"Enter",which:13,bubbles:!0}),new KeyboardEvent("keydown",{key:"F1",keyCode:112,code:"F1",which:112,bubbles:!0}),new KeyboardEvent("keydown",{key:"F2",keyCode:113,code:"F2",which:113,bubbles:!0}),new KeyboardEvent("keydown",{key:"F3",keyCode:114,code:"F3",which:114,bubbles:!0}),new KeyboardEvent("keydown",{key:"F4",keyCode:115,code:"F4",which:115,bubbles:!0}),new KeyboardEvent("keydown",{key:"F5",keyCode:116,code:"F5",which:116,bubbles:!0}),new KeyboardEvent("keydown",{key:"F6",keyCode:117,code:"F6",which:117,bubbles:!0}),new KeyboardEvent("keydown",{key:"F7",keyCode:118,code:"F7",which:118,bubbles:!0}),new KeyboardEvent("keydown",{key:"F8",keyCode:119,code:"F8",which:119,bubbles:!0}),new KeyboardEvent("keydown",{key:"F9",keyCode:120,code:"F9",which:120,bubbles:!0}),new KeyboardEvent("keydown",{key:"F10",keyCode:121,code:"F10",which:121,bubbles:!0}),new KeyboardEvent("keydown",{key:"F11",keyCode:122,code:"F11",which:122,bubbles:!0}),new KeyboardEvent("keydown",{key:"F12",keyCode:123,code:"F12",which:123,bubbles:!0}),new KeyboardEvent("keydown",{key:"1",keyCode:49,code:"Digit1",which:49,bubbles:!0}),new KeyboardEvent("keydown",{key:"2",keyCode:50,code:"Digit2",which:50,bubbles:!0}),new KeyboardEvent("keydown",{key:"3",keyCode:51,code:"Digit3",which:51,bubbles:!0}),new KeyboardEvent("keydown",{key:"4",keyCode:52,code:"Digit4",which:52,bubbles:!0}),new KeyboardEvent("keydown",{key:"5",keyCode:53,code:"Digit5",which:53,bubbles:!0}),new KeyboardEvent("keydown",{key:"6",keyCode:54,code:"Digit6",which:54,bubbles:!0}),new KeyboardEvent("keydown",{key:"7",keyCode:55,code:"Digit7",which:55,bubbles:!0}),new KeyboardEvent("keydown",{key:"8",keyCode:56,code:"Digit8",which:56,bubbles:!0}),new KeyboardEvent("keydown",{key:"9",keyCode:57,code:"Digit9",which:57,bubbles:!0}),new KeyboardEvent("keydown",{key:"Shift",keyCode:16,code:"ShiftLeft",which:16,bubbles:!0})),i=new KeyboardEvent("keyup",{key:"a",keyCode:65,code:"KeyA",which:65,bubbles:!0}),a=(new KeyboardEvent("keyup",{key:"b",keyCode:66,code:"KeyB",which:66,bubbles:!0}),new KeyboardEvent("keyup",{key:"c",keyCode:67,code:"KeyC",which:67,bubbles:!0}),new KeyboardEvent("keyup",{key:"d",keyCode:68,code:"KeyD",which:68,bubbles:!0})),s=new KeyboardEvent("keyup",{key:"e",keyCode:69,code:"KeyE",which:69,bubbles:!0}),r=(new KeyboardEvent("keyup",{key:"f",keyCode:70,code:"KeyF",which:70,bubbles:!0}),new KeyboardEvent("keyup",{key:"g",keyCode:71,code:"KeyG",which:71,bubbles:!0}),new KeyboardEvent("keyup",{key:"h",keyCode:72,code:"KeyH",which:72,bubbles:!0}),new KeyboardEvent("keyup",{key:"i",keyCode:73,code:"KeyI",which:73,bubbles:!0}),new KeyboardEvent("keyup",{key:"j",keyCode:74,code:"KeyJ",which:74,bubbles:!0}),new KeyboardEvent("keyup",{key:"k",keyCode:75,code:"KeyK",which:75,bubbles:!0}),new KeyboardEvent("keyup",{key:"l",keyCode:76,code:"KeyL",which:76,bubbles:!0})),k=(new KeyboardEvent("keyup",{key:"m",keyCode:77,code:"KeyM",which:77,bubbles:!0}),new KeyboardEvent("keyup",{key:"n",keyCode:78,code:"KeyN",which:78,bubbles:!0}),new KeyboardEvent("keyup",{key:"o",keyCode:79,code:"KeyO",which:79,bubbles:!0}),new KeyboardEvent("keyup",{key:"p",keyCode:80,code:"KeyP",which:80,bubbles:!0}),new KeyboardEvent("keyup",{key:"q",keyCode:81,code:"KeyQ",which:81,bubbles:!0})),u=new KeyboardEvent("keyup",{key:"r",keyCode:82,code:"KeyR",which:82,bubbles:!0}),w=(new KeyboardEvent("keyup",{key:"s",keyCode:83,code:"KeyS",which:83,bubbles:!0}),new KeyboardEvent("keyup",{key:"t",keyCode:84,code:"KeyT",which:84,bubbles:!0}),new KeyboardEvent("keyup",{key:"u",keyCode:85,code:"KeyU",which:85,bubbles:!0}),new KeyboardEvent("keyup",{key:"v",keyCode:86,code:"KeyV",which:86,bubbles:!0}),new KeyboardEvent("keyup",{key:"w",keyCode:87,code:"KeyW",which:87,bubbles:!0}),new KeyboardEvent("keyup",{key:"x",keyCode:88,code:"KeyX",which:88,bubbles:!0}),new KeyboardEvent("keyup",{key:"y",keyCode:89,code:"KeyY",which:89,bubbles:!0}),new KeyboardEvent("keyup",{key:"z",keyCode:90,code:"KeyZ",which:90,bubbles:!0}),new KeyboardEvent("keyup",{key:" ",keyCode:32,code:"Space",which:32,bubbles:!0})),h=(new KeyboardEvent("keyup",{key:"Enter",keyCode:13,code:"Enter",which:13,bubbles:!0}),new KeyboardEvent("keyup",{key:"F1",keyCode:112,code:"F1",which:112,bubbles:!0}),new KeyboardEvent("keyup",{key:"F2",keyCode:113,code:"F2",which:113,bubbles:!0}),new KeyboardEvent("keyup",{key:"F3",keyCode:114,code:"F3",which:114,bubbles:!0}),new KeyboardEvent("keyup",{key:"F4",keyCode:115,code:"F4",which:115,bubbles:!0}),new KeyboardEvent("keyup",{key:"F5",keyCode:116,code:"F5",which:116,bubbles:!0}),new KeyboardEvent("keyup",{key:"F6",keyCode:117,code:"F6",which:117,bubbles:!0}),new KeyboardEvent("keyup",{key:"F7",keyCode:118,code:"F7",which:118,bubbles:!0}),new KeyboardEvent("keyup",{key:"F8",keyCode:119,code:"F8",which:119,bubbles:!0}),new KeyboardEvent("keyup",{key:"F9",keyCode:120,code:"F9",which:120,bubbles:!0}),new KeyboardEvent("keyup",{key:"F10",keyCode:121,code:"F10",which:121,bubbles:!0}),new KeyboardEvent("keyup",{key:"F11",keyCode:122,code:"F11",which:122,bubbles:!0}),new KeyboardEvent("keyup",{key:"F12",keyCode:123,code:"F12",which:123,bubbles:!0}),new KeyboardEvent("keyup",{key:"1",keyCode:49,code:"Digit1",which:49,bubbles:!0}),new KeyboardEvent("keyup",{key:"2",keyCode:50,code:"Digit2",which:50,bubbles:!0}),new KeyboardEvent("keyup",{key:"3",keyCode:51,code:"Digit3",which:51,bubbles:!0}),new KeyboardEvent("keyup",{key:"4",keyCode:52,code:"Digit4",which:52,bubbles:!0}),new KeyboardEvent("keyup",{key:"5",keyCode:53,code:"Digit5",which:53,bubbles:!0}),new KeyboardEvent("keyup",{key:"6",keyCode:54,code:"Digit6",which:54,bubbles:!0}),new KeyboardEvent("keyup",{key:"7",keyCode:55,code:"Digit7",which:55,bubbles:!0}),new KeyboardEvent("keyup",{key:"8",keyCode:56,code:"Digit8",which:56,bubbles:!0}),new KeyboardEvent("keyup",{key:"9",keyCode:57,code:"Digit9",which:57,bubbles:!0}),new KeyboardEvent("keyup",{key:"Shift",keyCode:16,code:"ShiftLeft",which:16,bubbles:!0}));function l(e){return new Promise((o=>{setTimeout((()=>{o()}),e)}))}async function p(){await l(800),document.dispatchEvent(a)}var v=!1,K=0,E=!1,m=!1;async function C(){const e=$("video").first();if(!e.length){return $("#fsr-canvas")[0]?Promise.resolve({height:$("#fsr-canvas")[0].clientHeight,width:$("#fsr-canvas")[0].clientWidth}):(N("",6),Promise.resolve({height:0,width:0}))}return Promise.resolve({height:e.height(),width:e.width()})}async function f(e="top",o=10,n=500){return new Promise(((t,d)=>{const c=window.innerWidth/2,y=window.innerHeight/2;let b=c,i=y;switch(e){case"left":b-=o;break;case"right":b+=o;break;case"top":i-=o;break;case"bottom":i+=o;break;default:return d('Invalid direction! Use "left", "right", "top", or "bottom".')}const a=document.elementFromPoint(c,y);if(!a)return d("No target element found at the center of the screen");const s=new MouseEvent("mousedown",{clientX:c,clientY:y,bubbles:!0});a.dispatchEvent(s);const r=(b-c)/10,k=(i-y)/10;let u=c,w=y;const h=setInterval((()=>{u+=r,w+=k;const e=new MouseEvent("mousemove",{clientX:u,clientY:w,bubbles:!0});a.dispatchEvent(e)}),n/10);setTimeout((()=>{clearInterval(h);const e=new MouseEvent("mouseup",{clientX:b,clientY:i,bubbles:!0});a.dispatchEvent(e),t()}),n)}))}async function g(){if(v)return;if(!v&&m)return void(v=!0);const e=F();localStorage.setItem("cycletime",e);const o=localStorage.getItem("num");o&&(K=o-0),v=!0,await x(),function(){m=!0;const e=F();var o=`\n                setInterval(() => {\n                    postMessage('autoWorkerCode');  // 每隔指定的周期时间发送消息\n                }, ${e});\n            `;const n=new Blob([o],{type:"application/javascript"});new Worker(URL.createObjectURL(n)).onmessage=e=>{x()};const t=new Blob(["\n                setInterval(() => {\n                    postMessage('reloadWorkerCode');  // 每隔 4500 毫秒发送消息\n                }, 4500);\n            "],{type:"application/javascript"});new Worker(URL.createObjectURL(t)).onmessage=e=>{!async function(){(function(){const e=function(){const e=new Date,o=e.getHours(),n=e.getMinutes();return 0===o&&5===n}(),o=$("#myCheckbox").is(":checked");return e&&o})()&&(localStorage.setItem("isReload",!0),navigation.reload())}()}}()}async function x(){if(!v)return void j("手动暂停！");if(E)return void j("正在收取水族馆，无人机暂停");j("执行开始"),document.dispatchEvent(b),document.dispatchEvent(h),await l(300),document.dispatchEvent(t),document.dispatchEvent(r),j("拒绝好友拉取"),document.dispatchEvent(c),document.dispatchEvent(u),j("复位"),await l(3e3),document.dispatchEvent(e),await async function(){await l(1200),document.dispatchEvent(i)}(),j("移动到无人机"),await l(1e3),document.dispatchEvent(d),document.dispatchEvent(k),j("执行全部"),K+=1;const o=F();await l(o),j("一共执行了"+K+"次"),localStorage.setItem("num",K)}function F(){try{return+$("#cycletime").val()}catch(e){return 8e4}}document.querySelectorAll("*").forEach((e=>{e.style.cursor="auto"}));const S=$("<div>",{id:"ymzx-wrap"});$("body").append(S);let z=!1;const D=$("<button>",{html:"&#x2012;",id:"minimizeRestoreButton"}).css("color","black").on("mouseover",(function(){$(this).css("color","#007BFF")})).on("mouseout",(function(){$(this).css("color","black")})).on("click",(function(){const e=$("#tipsText");z?($("#ymzx-wrap").css({height:"400px",width:"375px",padding:"20px"}),$(this).html("&#x2012;"),e.css("display","flex")):($("#ymzx-wrap").css({height:"20px",width:"20px",padding:"0"}),$(this).html("&#x2B;"),e.css("display","none")),z=!z}));$("#ymzx-wrap").append(D);const W=[function(e,o,n){const t=$("<div>",{id:"inputWrapper"}),d=$("<label>",{text:e,for:o,id:"common-label"}),c=$("<input>",{type:"number",id:o,value:n,placeholder:"不清晰不要动！",class:`common-input ${o}`}).on("focus",(function(){$(this).css("border-color","#007BFF")})).on("blur",(function(){$(this).css("border-color","#ccc")}));return t.append(d,c),{inputWrapper:t,input:c}}("循环时间(ms):","cycletime",8e4)];W.forEach((({inputWrapper:e})=>{$("#ymzx-wrap").append(e)}));const I=$("<input>",{type:"checkbox",id:"myCheckbox"}),B=$("<label>",{for:"myCheckbox",class:"checkbox-label",text:"是否每天00:05自动刷新"}),R=$("<div>",{id:"check-container"}).append(I).append(B);$("#ymzx-wrap").append(R);const M=$("<button>",{text:"收取水族馆",id:"start-btn"}).on("click",(async()=>{minimizeRestoreButton.click(),await async function(){E=!0,document.dispatchEvent(c),document.dispatchEvent(u),await l(200),document.dispatchEvent(o),await p(),document.dispatchEvent(d),document.dispatchEvent(k),await l(300);const e=await C(),t=e.height/8;await f("top",t,600),await l(1600);const i=e.width/20;await f("left",i,600),await l(1600),document.dispatchEvent(y),document.dispatchEvent(w),await l(5e3),document.dispatchEvent(n),document.dispatchEvent(s),await l(1500),document.dispatchEvent(b),document.dispatchEvent(h),E=!1}(),minimizeRestoreButton.click()}));$("#ymzx-wrap").append(M);const q=$("<button>",{text:"前往鱼塘",id:"start-btn"}).on("click",(async()=>{document.dispatchEvent(c),document.dispatchEvent(u),await l(200),document.dispatchEvent(o),await p(),document.dispatchEvent(d),document.dispatchEvent(k),await l(500);const e=(await C()).height/25;await f("top",e,600),await l(1200),document.dispatchEvent(y),document.dispatchEvent(w)}));$("#ymzx-wrap").append(q);const H=$("<button>",{text:"启动",id:"start-btn"}).on("mouseover",(function(){$(this).css("background-color","#0056b3")})).on("mouseout",(function(){$(this).css("background-color","#007BFF")})).on("click",(function(){g(),$(this).prop("disabled",!0),$(this).css("cursor","not-allowed")})),L=$("<button>",{text:"暂停",id:"start-btn"}).on("mouseover",(function(){$(this).css("background-color","#0056b3")})).on("mouseout",(function(){$(this).css("background-color","#007BFF")})).on("click",(function(){v?(v=!1,H.prop("disabled",!1),H.css("cursor","pointer")):N("没启动暂停啥？？？？",6)})),X=$("<div>",{id:"buttonWrapper"}).append(H);X.append(L),$("#ymzx-wrap").append(X);const{textareaWrapper:P,textarea:T}=function(e,o){const n=$("<div>",{id:"textareaWrapper"}),t=$("<label>",{text:e,for:o,css:{fontSize:"14px",fontWeight:"bold",color:"#333"}}),d=$("<textarea>",{id:o,rows:4}).on("focus",(function(){$(this).css("border-color","#007BFF")})).on("blur",(function(){$(this).css("border-color","#ccc")}));return n.append(t,d),{textareaWrapper:n,textarea:d}}("无人机执行日志:","textarea-log");function U(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")} ${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}.${String(e.getMilliseconds()).padStart(3,"0")}`}function j(e){const o=$("#textarea-log");if(0===o.length)return;const n=o.val(),t=n?`${n}\n${e}😊${U()}`:`${e}😊${U()}`;o.val(t),o[0].scrollTop=o[0].scrollHeight}function N(e,o=6){const n=$("<div>",{id:"ymzx-modal"}),t=$("<div>",{id:"ymzx-modalContent"}),d=$("<span>",{text:"×",id:"ymzx-closeButton"}).on("click",(function(){n.remove()})).on("mouseover",(function(){$(this).css("color","#ff5555")})).on("mouseout",(function(){$(this).css("color","#aaa")})),c=document.createElement("p");c.id="ymzx-modal-text",c.innerHTML=e;const y=$("<p>",{id:"ymzx-tip-text",css:{fontSize:"16px",color:"#888"}});t.append(d,c,y),n.append(t),$("body").append(n);let b=o;y.text(`提示框将在 ${b} 秒后自动关闭`);const i=setInterval((()=>{b-=1,y.text(`提示框将在 ${b} 秒后自动关闭`),b<=0&&(clearInterval(i),n.remove())}),1e3)}var Y;$("#ymzx-wrap").append(P),async function(){const e=localStorage.getItem("cycletime")??8e4;$("#cycletime").val(e),localStorage.getItem("isReload")&&(g(),await l(1e3),checkbox.click(),await l(1e3),minimizeRestoreButton.click(),localStorage.removeItem("isReload"))}(),function(){const e='欢迎使用元梦之星农场自动化！';N(e,6);const o=$("<p>",{id:"tipsText",html:e});$("#ymzx-wrap").append(o)}(),Y=$("<button>",{id:"appreciate-btn",text:"",css:{padding:"10px 20px",fontSize:"16px",cursor:"pointer",backgroundColor:"#4CAF50",color:"#fff",border:"none",borderRadius:"5px",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)",transition:"background-color 0.3s",margin:"10px 0"}}),$("#ymzx-wrap").append(Y),Y.on("click",(function(){const e=$("<div>",{id:"qr-code",css:{display:"none",position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:1e3,background:"#fff",padding:"20px",border:"1px solid #ccc",boxShadow:"0 4px 8px rgba(0,0,0,0.2)",borderRadius:"10px"}}),o=$("<img>",{src:"",alt:"",css:{maxWidth:"500px",maxHeight:"500px",display:"block",margin:"0 auto"}}),n=$("<button>",{text:"关闭",css:{padding:"8px 16px",fontSize:"14px",cursor:"pointer",backgroundColor:"#f44336",color:"#fff",border:"none",borderRadius:"5px",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.2)",marginTop:"10px",transition:"background-color 0.3s"}});n.on("click",(function(){e.hide()})),e.append(o).append(n),$("#ymzx-wrap").append(e),e.show()})),Y.hover((function(){$(this).css("background-color","#45a049")}),(function(){$(this).css("background-color","#4CAF50")})),console.log,console.log=function(...e){var o;(o=e)&&o[1]&&11999==o[1]&&(document.dispatchEvent(b),document.dispatchEvent(h))}})();