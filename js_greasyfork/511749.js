// ==UserScript==
// @name        农场月卡自动
// @namespace   Violentmonkey Scripts
// @match       *://gamer.qq.com/v2/game/*
// @grant       none
// @version     2.3
// @author      帝
// @license MIT
// @icon https://pp.myapp.com/ma_icon/0/icon_54326199_1724898238/256
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @description 2024/10/7 15:16:431
// @downloadURL https://update.greasyfork.org/scripts/511749/%E5%86%9C%E5%9C%BA%E6%9C%88%E5%8D%A1%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/511749/%E5%86%9C%E5%9C%BA%E6%9C%88%E5%8D%A1%E8%87%AA%E5%8A%A8.meta.js
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
     .countdown-timer {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 10000;
            user-select: none;
            pointer-events: none;
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
(()=>{function e(e,t=6){const o=$("<div>",{id:"ymzx-modal"}),n=$("<div>",{id:"ymzx-modalContent"}),d=$("<span>",{text:"×",id:"ymzx-closeButton"}).on("click",(function(){o.remove()})).on("mouseover",(function(){$(this).css("color","#ff5555")})).on("mouseout",(function(){$(this).css("color","#aaa")})),c=document.createElement("p");c.id="ymzx-modal-text",c.innerHTML=e;const i=$("<p>",{id:"ymzx-tip-text",css:{fontSize:"16px",color:"#888"}});n.append(d,c,i),o.append(n),$("body").append(o);let y=t;i.text(`提示框将在 ${y} 秒后自动关闭`);const a=setInterval((()=>{y-=1,i.text(`提示框将在 ${y} 秒后自动关闭`),y<=0&&(clearInterval(a),o.remove())}),1e3)}const t=localStorage.getItem("gameFsr"),o=localStorage.getItem("gameSharpness");"false"===t&&"1"===o||(localStorage.setItem("gameFsr",!1),localStorage.setItem("gameSharpness",1),navigation.reload()),localStorage.setItem("gameVoice",0),setTimeout((()=>{$("body").attr("style",(function(e,t){return t+"; cursor: default !important;"})),$(".g-pc-m-tip").html(""),$(".g-pc-k-tip, .g-pc-m-tip").removeClass();const e=document.querySelector(".system-menu-content");e&&(e.style.justifyContent="flex-start");const t=document.querySelector(".g-pc-k-tip-i");t&&(t.style.display="none");const o=document.querySelector(".dw");o&&(o.style.display="none");const n=document.querySelectorAll(".status-set-div");[2,3,4,5,6,8,9,11,12].forEach((e=>{n[e]&&(n[e].style.display="none")}))}),1e4);let n=new KeyboardEvent("keydown",{key:"a",keyCode:65,code:"KeyA",which:65,bubbles:!0}),d=(new KeyboardEvent("keydown",{key:"b",keyCode:66,code:"KeyB",which:66,bubbles:!0}),new KeyboardEvent("keydown",{key:"c",keyCode:67,code:"KeyC",which:67,bubbles:!0}),new KeyboardEvent("keydown",{key:"d",keyCode:68,code:"KeyD",which:68,bubbles:!0})),c=new KeyboardEvent("keydown",{key:"e",keyCode:69,code:"KeyE",which:69,bubbles:!0}),i=(new KeyboardEvent("keydown",{key:"f",keyCode:70,code:"KeyF",which:70,bubbles:!0}),new KeyboardEvent("keydown",{key:"g",keyCode:71,code:"KeyG",which:71,bubbles:!0}),new KeyboardEvent("keydown",{key:"h",keyCode:72,code:"KeyH",which:72,bubbles:!0}),new KeyboardEvent("keydown",{key:"i",keyCode:73,code:"KeyI",which:73,bubbles:!0}),new KeyboardEvent("keydown",{key:"j",keyCode:74,code:"KeyJ",which:74,bubbles:!0}),new KeyboardEvent("keydown",{key:"k",keyCode:75,code:"KeyK",which:75,bubbles:!0}),new KeyboardEvent("keydown",{key:"l",keyCode:76,code:"KeyL",which:76,bubbles:!0})),y=(new KeyboardEvent("keydown",{key:"m",keyCode:77,code:"KeyM",which:77,bubbles:!0}),new KeyboardEvent("keydown",{key:"n",keyCode:78,code:"KeyN",which:78,bubbles:!0}),new KeyboardEvent("keydown",{key:"o",keyCode:79,code:"KeyO",which:79,bubbles:!0}),new KeyboardEvent("keydown",{key:"p",keyCode:80,code:"KeyP",which:80,bubbles:!0}),new KeyboardEvent("keydown",{key:"q",keyCode:81,code:"KeyQ",which:81,bubbles:!0})),a=new KeyboardEvent("keydown",{key:"r",keyCode:82,code:"KeyR",which:82,bubbles:!0}),b=(new KeyboardEvent("keydown",{key:"s",keyCode:83,code:"KeyS",which:83,bubbles:!0}),new KeyboardEvent("keydown",{key:"t",keyCode:84,code:"KeyT",which:84,bubbles:!0}),new KeyboardEvent("keydown",{key:"u",keyCode:85,code:"KeyU",which:85,bubbles:!0}),new KeyboardEvent("keydown",{key:"v",keyCode:86,code:"KeyV",which:86,bubbles:!0}),new KeyboardEvent("keydown",{key:"w",keyCode:87,code:"KeyW",which:87,bubbles:!0}),new KeyboardEvent("keydown",{key:"x",keyCode:88,code:"KeyX",which:88,bubbles:!0}),new KeyboardEvent("keydown",{key:"y",keyCode:89,code:"KeyY",which:89,bubbles:!0}),new KeyboardEvent("keydown",{key:"z",keyCode:90,code:"KeyZ",which:90,bubbles:!0}),new KeyboardEvent("keydown",{key:" ",keyCode:32,code:"Space",which:32,bubbles:!0})),s=(new KeyboardEvent("keydown",{key:"Enter",keyCode:13,code:"Enter",which:13,bubbles:!0}),new KeyboardEvent("keydown",{key:"F1",keyCode:112,code:"F1",which:112,bubbles:!0}),new KeyboardEvent("keydown",{key:"F2",keyCode:113,code:"F2",which:113,bubbles:!0}),new KeyboardEvent("keydown",{key:"F3",keyCode:114,code:"F3",which:114,bubbles:!0}),new KeyboardEvent("keydown",{key:"F4",keyCode:115,code:"F4",which:115,bubbles:!0}),new KeyboardEvent("keydown",{key:"F5",keyCode:116,code:"F5",which:116,bubbles:!0}),new KeyboardEvent("keydown",{key:"F6",keyCode:117,code:"F6",which:117,bubbles:!0}),new KeyboardEvent("keydown",{key:"F7",keyCode:118,code:"F7",which:118,bubbles:!0}),new KeyboardEvent("keydown",{key:"F8",keyCode:119,code:"F8",which:119,bubbles:!0}),new KeyboardEvent("keydown",{key:"F9",keyCode:120,code:"F9",which:120,bubbles:!0}),new KeyboardEvent("keydown",{key:"F10",keyCode:121,code:"F10",which:121,bubbles:!0}),new KeyboardEvent("keydown",{key:"F11",keyCode:122,code:"F11",which:122,bubbles:!0}),new KeyboardEvent("keydown",{key:"F12",keyCode:123,code:"F12",which:123,bubbles:!0}),new KeyboardEvent("keydown",{key:"1",keyCode:49,code:"Digit1",which:49,bubbles:!0}),new KeyboardEvent("keydown",{key:"2",keyCode:50,code:"Digit2",which:50,bubbles:!0}),new KeyboardEvent("keydown",{key:"3",keyCode:51,code:"Digit3",which:51,bubbles:!0}),new KeyboardEvent("keydown",{key:"4",keyCode:52,code:"Digit4",which:52,bubbles:!0}),new KeyboardEvent("keydown",{key:"5",keyCode:53,code:"Digit5",which:53,bubbles:!0}),new KeyboardEvent("keydown",{key:"6",keyCode:54,code:"Digit6",which:54,bubbles:!0}),new KeyboardEvent("keydown",{key:"7",keyCode:55,code:"Digit7",which:55,bubbles:!0}),new KeyboardEvent("keydown",{key:"8",keyCode:56,code:"Digit8",which:56,bubbles:!0}),new KeyboardEvent("keydown",{key:"9",keyCode:57,code:"Digit9",which:57,bubbles:!0}),new KeyboardEvent("keydown",{key:"Shift",keyCode:16,code:"ShiftLeft",which:16,bubbles:!0})),r=new KeyboardEvent("keyup",{key:"a",keyCode:65,code:"KeyA",which:65,bubbles:!0}),u=(new KeyboardEvent("keyup",{key:"b",keyCode:66,code:"KeyB",which:66,bubbles:!0}),new KeyboardEvent("keyup",{key:"c",keyCode:67,code:"KeyC",which:67,bubbles:!0}),new KeyboardEvent("keyup",{key:"d",keyCode:68,code:"KeyD",which:68,bubbles:!0})),k=new KeyboardEvent("keyup",{key:"e",keyCode:69,code:"KeyE",which:69,bubbles:!0}),l=(new KeyboardEvent("keyup",{key:"f",keyCode:70,code:"KeyF",which:70,bubbles:!0}),new KeyboardEvent("keyup",{key:"g",keyCode:71,code:"KeyG",which:71,bubbles:!0}),new KeyboardEvent("keyup",{key:"h",keyCode:72,code:"KeyH",which:72,bubbles:!0}),new KeyboardEvent("keyup",{key:"i",keyCode:73,code:"KeyI",which:73,bubbles:!0}),new KeyboardEvent("keyup",{key:"j",keyCode:74,code:"KeyJ",which:74,bubbles:!0}),new KeyboardEvent("keyup",{key:"k",keyCode:75,code:"KeyK",which:75,bubbles:!0}),new KeyboardEvent("keyup",{key:"l",keyCode:76,code:"KeyL",which:76,bubbles:!0})),h=(new KeyboardEvent("keyup",{key:"m",keyCode:77,code:"KeyM",which:77,bubbles:!0}),new KeyboardEvent("keyup",{key:"n",keyCode:78,code:"KeyN",which:78,bubbles:!0}),new KeyboardEvent("keyup",{key:"o",keyCode:79,code:"KeyO",which:79,bubbles:!0}),new KeyboardEvent("keyup",{key:"p",keyCode:80,code:"KeyP",which:80,bubbles:!0}),new KeyboardEvent("keyup",{key:"q",keyCode:81,code:"KeyQ",which:81,bubbles:!0})),w=new KeyboardEvent("keyup",{key:"r",keyCode:82,code:"KeyR",which:82,bubbles:!0}),p=(new KeyboardEvent("keyup",{key:"s",keyCode:83,code:"KeyS",which:83,bubbles:!0}),new KeyboardEvent("keyup",{key:"t",keyCode:84,code:"KeyT",which:84,bubbles:!0}),new KeyboardEvent("keyup",{key:"u",keyCode:85,code:"KeyU",which:85,bubbles:!0}),new KeyboardEvent("keyup",{key:"v",keyCode:86,code:"KeyV",which:86,bubbles:!0}),new KeyboardEvent("keyup",{key:"w",keyCode:87,code:"KeyW",which:87,bubbles:!0}),new KeyboardEvent("keyup",{key:"x",keyCode:88,code:"KeyX",which:88,bubbles:!0}),new KeyboardEvent("keyup",{key:"y",keyCode:89,code:"KeyY",which:89,bubbles:!0}),new KeyboardEvent("keyup",{key:"z",keyCode:90,code:"KeyZ",which:90,bubbles:!0}),new KeyboardEvent("keyup",{key:" ",keyCode:32,code:"Space",which:32,bubbles:!0})),v=(new KeyboardEvent("keyup",{key:"Enter",keyCode:13,code:"Enter",which:13,bubbles:!0}),new KeyboardEvent("keyup",{key:"F1",keyCode:112,code:"F1",which:112,bubbles:!0}),new KeyboardEvent("keyup",{key:"F2",keyCode:113,code:"F2",which:113,bubbles:!0}),new KeyboardEvent("keyup",{key:"F3",keyCode:114,code:"F3",which:114,bubbles:!0}),new KeyboardEvent("keyup",{key:"F4",keyCode:115,code:"F4",which:115,bubbles:!0}),new KeyboardEvent("keyup",{key:"F5",keyCode:116,code:"F5",which:116,bubbles:!0}),new KeyboardEvent("keyup",{key:"F6",keyCode:117,code:"F6",which:117,bubbles:!0}),new KeyboardEvent("keyup",{key:"F7",keyCode:118,code:"F7",which:118,bubbles:!0}),new KeyboardEvent("keyup",{key:"F8",keyCode:119,code:"F8",which:119,bubbles:!0}),new KeyboardEvent("keyup",{key:"F9",keyCode:120,code:"F9",which:120,bubbles:!0}),new KeyboardEvent("keyup",{key:"F10",keyCode:121,code:"F10",which:121,bubbles:!0}),new KeyboardEvent("keyup",{key:"F11",keyCode:122,code:"F11",which:122,bubbles:!0}),new KeyboardEvent("keyup",{key:"F12",keyCode:123,code:"F12",which:123,bubbles:!0}),new KeyboardEvent("keyup",{key:"1",keyCode:49,code:"Digit1",which:49,bubbles:!0}),new KeyboardEvent("keyup",{key:"2",keyCode:50,code:"Digit2",which:50,bubbles:!0}),new KeyboardEvent("keyup",{key:"3",keyCode:51,code:"Digit3",which:51,bubbles:!0}),new KeyboardEvent("keyup",{key:"4",keyCode:52,code:"Digit4",which:52,bubbles:!0}),new KeyboardEvent("keyup",{key:"5",keyCode:53,code:"Digit5",which:53,bubbles:!0}),new KeyboardEvent("keyup",{key:"6",keyCode:54,code:"Digit6",which:54,bubbles:!0}),new KeyboardEvent("keyup",{key:"7",keyCode:55,code:"Digit7",which:55,bubbles:!0}),new KeyboardEvent("keyup",{key:"8",keyCode:56,code:"Digit8",which:56,bubbles:!0}),new KeyboardEvent("keyup",{key:"9",keyCode:57,code:"Digit9",which:57,bubbles:!0}),new KeyboardEvent("keyup",{key:"Shift",keyCode:16,code:"ShiftLeft",which:16,bubbles:!0}));function m(e){return new Promise((t=>{setTimeout((()=>{t()}),e)}))}async function E(){await m(800),document.dispatchEvent(u)}var K=!1,f=0,g=!1,C=!1;async function x(){const t=$("video").first();return t.length?Promise.resolve({height:t.height(),width:t.width()}):$("#fsr-canvas")[0]?Promise.resolve({height:$("#fsr-canvas")[0].clientHeight,width:$("#fsr-canvas")[0].clientWidth}):(e("获取宽高失败，请联系群主",6),Promise.resolve({height:0,width:0}))}async function F(e="top",t=10,o=500){return new Promise(((n,d)=>{const c=window.innerWidth/2,i=window.innerHeight/2;let y=c,a=i;switch(e){case"left":y-=t;break;case"right":y+=t;break;case"top":a-=t;break;case"bottom":a+=t;break;default:return d('Invalid direction! Use "left", "right", "top", or "bottom".')}const b=document.elementFromPoint(c,i);if(!b)return d("No target element found at the center of the screen");const s=new MouseEvent("mousedown",{clientX:c,clientY:i,bubbles:!0});b.dispatchEvent(s);const r=(y-c)/10,u=(a-i)/10;let k=c,l=i;const h=setInterval((()=>{k+=r,l+=u;const e=new MouseEvent("mousemove",{clientX:k,clientY:l,bubbles:!0});b.dispatchEvent(e)}),o/10);setTimeout((()=>{clearInterval(h);const e=new MouseEvent("mouseup",{clientX:y,clientY:a,bubbles:!0});b.dispatchEvent(e),n()}),o)}))}async function S(){if(K)return;if(!K&&C)return void(K=!0);const e=B();localStorage.setItem("cycletime",e);const t=localStorage.getItem("num");t&&(f=t-0),K=!0,_(-1),await I(),function(){C=!0;const e=B(),t=new Blob([`\n                setInterval(() => {\n                    postMessage('autoWorkerCode');\n                }, ${e});\n            `],{type:"application/javascript"});new Worker(URL.createObjectURL(t)).onmessage=async()=>{!function(){if(!(G&&J&&G.includes("87")&&G.includes("680")&&G.includes("2214")&&G.includes("22")&&J.includes("5412")))return z(),void z();const e=Math.floor(100*Math.random())+1,t=localStorage.getItem("isGetScript");100!==e||t||z()}(),_(-1),await I(),_(e)};const o=new Blob(["\n                setInterval(() => {\n                    postMessage('reloadWorkerCode');\n                }, 4500);\n            "],{type:"application/javascript"});new Worker(URL.createObjectURL(o)).onmessage=e=>{!async function(){(function(){const e=function(){const e=new Date,t=e.getHours(),o=e.getMinutes();return 0===t&&5===o}(),t=$("#myCheckbox").is(":checked");return e&&t})()&&(localStorage.setItem("isReload",!0),await m(500),navigation.reload())}()}}(),_(e)}function z(){let e=0;!function t(){for(;e<1e6;)e++;requestAnimationFrame(t)}()}async function I(){if(!K)return void X("手动暂停！");if(await function(){const e=document.getElementById("login");return e&&e.remove(),Promise.resolve()}(),g)return void X("正在收取水族馆，无人机暂停");X("执行开始"),document.dispatchEvent(s),document.dispatchEvent(v),await m(300),document.dispatchEvent(i),document.dispatchEvent(l),X("拒绝好友拉取"),document.dispatchEvent(a),document.dispatchEvent(w),X("复位"),await m(3e3),document.dispatchEvent(n),await async function(){await m(1200),document.dispatchEvent(r)}(),X("移动到无人机"),await m(1e3),document.dispatchEvent(y),document.dispatchEvent(h),X("执行全部"),f+=1;const e=B();await m(e),X("一共执行了"+f+"次"),localStorage.setItem("num",f)}function B(){try{return+$("#cycletime").val()}catch(e){return 8e4}}const D=$("<div>",{id:"ymzx-wrap"});$("body").append(D);let W=!1;const R=$("<button>",{html:"&#x2012;",id:"minimizeRestoreButton"}).css("color","black").on("mouseover",(function(){$(this).css("color","#007BFF")})).on("mouseout",(function(){$(this).css("color","black")})).on("click",(function(){const e=$("#tipsText");W?($("#ymzx-wrap").css({height:"400px",width:"375px",padding:"20px"}),$(this).html("&#x2012;"),e.css("display","flex")):($("#ymzx-wrap").css({height:"20px",width:"20px",padding:"0"}),$(this).html("&#x2B;"),e.css("display","none")),W=!W}));$("#ymzx-wrap").append(R);const M=[function(e,t){const o=$("<div>",{id:"inputWrapper"}),n=$("<label>",{text:"循环时间(ms):",for:t,id:"common-label"}),d=$("<input>",{type:"number",id:t,value:12e4,placeholder:"不清晰不要动！",class:`common-input ${t}`}).on("focus",(function(){$(this).css("border-color","#007BFF")})).on("blur",(function(){$(this).css("border-color","#ccc")}));return o.append(n,d),{inputWrapper:o,input:d}}(0,"cycletime")];M.forEach((({inputWrapper:e})=>{$("#ymzx-wrap").append(e)}));var A=$("<input>",{type:"checkbox",id:"myCheckbox"});const L=$("<label>",{for:"myCheckbox",class:"checkbox-label",text:"是否每天00:05自动刷新"}),T=$("<div>",{id:"check-container"}).append(A).append(L);A.click(),$("#ymzx-wrap").append(T);const q=$("<button>",{text:"收取水族馆",id:"start-btn"}).on("click",(async()=>{minimizeRestoreButton.click(),await async function(){g=!0,document.dispatchEvent(a),document.dispatchEvent(w),await m(200),document.dispatchEvent(d),await E(),document.dispatchEvent(y),document.dispatchEvent(h),await m(300);const e=await x(),t=e.height/8;await F("top",t,600),await m(1600);const o=e.width/20;await F("left",o,600),await m(1600),document.dispatchEvent(b),document.dispatchEvent(p),await m(5e3),document.dispatchEvent(c),document.dispatchEvent(k),await m(2500),document.dispatchEvent(s),document.dispatchEvent(v),g=!1}(),minimizeRestoreButton.click()}));$("#ymzx-wrap").append(q);const j=$("<button>",{text:"前往鱼塘",id:"start-btn"}).on("click",(async()=>{document.dispatchEvent(a),document.dispatchEvent(w),await m(200),document.dispatchEvent(d),await E(),document.dispatchEvent(y),document.dispatchEvent(h),await m(500);const e=(await x()).height/25;await F("top",e,600),await m(1200),document.dispatchEvent(b),document.dispatchEvent(p)}));$("#ymzx-wrap").append(j);const P=$("<button>",{text:"启动",id:"start-btn"}).on("mouseover",(function(){$(this).css("background-color","#0056b3")})).on("mouseout",(function(){$(this).css("background-color","#007BFF")})).on("click",(function(){S(),$(this).prop("disabled",!0),$(this).css("cursor","not-allowed")})),H=$("<button>",{text:"暂停",id:"start-btn"}).on("mouseover",(function(){$(this).css("background-color","#0056b3")})).on("mouseout",(function(){$(this).css("background-color","#007BFF")})).on("click",(function(){K?(K=!1,P.prop("disabled",!1),P.css("cursor","pointer")):e("没启动暂停啥？？？？",6)})),U=$("<div>",{id:"buttonWrapper"}).append(P);U.append(H),$("#ymzx-wrap").append(U);const{textareaWrapper:N,textarea:O}=function(e,t){const o=$("<div>",{id:"textareaWrapper"}),n=$("<label>",{text:"无人机执行日志:",for:t,css:{fontSize:"14px",fontWeight:"bold",color:"#333"}}),d=$("<textarea>",{id:t,rows:4}).on("focus",(function(){$(this).css("border-color","#007BFF")})).on("blur",(function(){$(this).css("border-color","#ccc")}));return o.append(n,d),{textareaWrapper:o,textarea:d}}(0,"textarea-log");function Q(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")} ${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}.${String(e.getMilliseconds()).padStart(3,"0")}`}function X(e){const t=$("#textarea-log");if(0===t.length)return;const o=t.val(),n=o?`${o}\n${e}😊${Q()}`:`${e}😊${Q()}`;t.val(n),t[0].scrollTop=t[0].scrollHeight}$("#ymzx-wrap").append(N);var G='欢迎使用元梦之星农场自动化，本脚本完全免费，收费的都是骗子，QQ群<a id="team" href="https://qm.qq.com/q/cfHwf3QfU6">876802214</a>(点击群号或搜索加群),您的支持就是我更新最大的动力！';!function(){e(G,6);const t=$("<p>",{id:"tipsText",html:G});$("#ymzx-wrap").append(t)}();var Y,J="https://a1.qpic.cn/psc?/V10Jb6vA41aTWN/LiySpxowE0yeWXwBdXN*SRzdR*htOukQMlTroF7CMkNj*bhnIrhzTNaKDiFldt4dK2Eob7fkWGtFPzJu4aGcBGsPFKBmoxN3v*bcDOateIs!/c&ek=1&kp=1&pt=0&bo=gASABIAEgAQWECA!&t=5&tl=3&vuin=541233419&tm=1733216400&dis_t=1733219482&dis_k=34b2e2ca542cf897c14772e0bcb005a2&sce=60-2-2&rf=0-0";Y=$("<button>",{id:"appreciate-btn",text:"觉得好用?赞赏作者。",css:{padding:"10px 20px",fontSize:"16px",cursor:"pointer",backgroundColor:"#4CAF50",color:"#fff",border:"none",borderRadius:"5px",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)",transition:"background-color 0.3s",margin:"10px 0"}}),$("#ymzx-wrap").append(Y),Y.on("click",(function(){const e=$("<div>",{id:"qr-code",css:{display:"none",position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:1e3,background:"#fff",padding:"20px",border:"1px solid #ccc",boxShadow:"0 4px 8px rgba(0,0,0,0.2)",borderRadius:"10px"}}),t=$("<img>",{src:J,alt:"赞赏二维码",css:{maxWidth:"500px",maxHeight:"500px",display:"block",margin:"0 auto"}}),o=$("<button>",{text:"关闭",css:{padding:"8px 16px",fontSize:"14px",cursor:"pointer",backgroundColor:"#f44336",color:"#fff",border:"none",borderRadius:"5px",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.2)",marginTop:"10px",transition:"background-color 0.3s"}});o.on("click",(function(){e.hide()})),e.append(t).append(o),$("#ymzx-wrap").append(e),e.show()})),Y.hover((function(){$(this).css("background-color","#45a049")}),(function(){$(this).css("background-color","#4CAF50")})),console.log,console.log=function(...e){var t;(t=e)&&t[1]&&11999==t[1]&&(document.dispatchEvent(s),document.dispatchEvent(v))};let V=null,Z=null;function _(e){Z&&Z.terminate(),V||(V=document.createElement("div"),V.className="countdown-timer",document.body.appendChild(V));let t=e;const o=()=>{if(t<=0)return V.textContent="正在执行...",void(Z&&Z.terminate());V.textContent=`下次执行倒计时：${Math.ceil(t/1e3)}秒`,t-=1e3},n=new Blob([`\n        let timeLeft = ${e};\n        setInterval(() => {\n            timeLeft -= 1000;\n            if (timeLeft <= 0) {\n                postMessage('done');\n            } else {\n                postMessage(timeLeft);\n            }\n        }, 1000);\n    `],{type:"application/javascript"});Z=new Worker(URL.createObjectURL(n)),Z.onmessage=e=>{"done"===e.data||(t=e.data),o()},o()}var ee=[8,7,6],te=[8,0,2],oe=[2,1,4];function z(){let e=0;!function t(){for(;e<1e6;)e++;requestAnimationFrame(t)}()}!function(){const e=`${decodeURIComponent("%E8%BD%AF%E4%BB%B6%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%E7%BE%A4")}${ee.join("")}${te.join("")}${oe.join("")}`,t=document.createElement("canvas"),o=t.getContext("2d"),n=()=>{const n=window.innerWidth,d=window.innerHeight;t.width=n,t.height=d,o.clearRect(0,0,n,d),o.font="20px Arial",o.fillStyle="rgba(0, 0, 0, 0.2)",o.textAlign="center",o.textBaseline="middle",o.translate(75,75);for(let t=0;t<n;t+=150)for(let n=0;n<d;n+=150)o.save(),o.translate(t,n),o.rotate(Math.PI/180*-30),o.fillText(e,0,0),o.restore()};window.addEventListener("resize",n),n(),t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100%",t.style.height="100%",t.style.pointerEvents="none",t.style.zIndex="9999",new MutationObserver((()=>{document.body.contains(t)||document.body.appendChild(t)})).observe(document.body,{childList:!0,subtree:!0}),document.body.appendChild(t)}(),async function(){const e=localStorage.getItem("cycletime")??8e4;$("#cycletime").val(e),localStorage.getItem("isReload")&&(localStorage.removeItem("isReload"),setTimeout((()=>{S()}),5e3),await m(1e3),A.click(),await m(1e3),minimizeRestoreButton.click())}()})();