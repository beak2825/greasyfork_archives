// ==UserScript==
// @name         画板
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  网页画板，为了方便刷题，简单粗暴的写了一个。
// @author       XiaoLing
// @match        https://www.matiji.net/exam/brushquestion/**/*
// @icon         https://profile-avatar.csdnimg.cn/b0a6a41ae5ba4285a40ef348d1d08be6_qq_43098197.jpg!1
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486045/%E7%94%BB%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/486045/%E7%94%BB%E6%9D%BF.meta.js
// ==/UserScript==

let css = "#canvas-model{position:fixed;left:0;top:0;right:0;bottom:0;display:none;}#canvas-model.on{display:block;}#canvas-model button,#canvas-model input{padding:3px 5px;margin-right:5px;border-radius:5px;outline:none;border:none;cursor:pointer;background-color:#ccc;}#canvas-model button.on,#canvas-model input.on{background-color:white;border-radius:0;border-bottom:4px solid #ccc;}#canvas-model .header{position:absolute;z-index:99;background-color:white;box-shadow:0px 0px 10px 3px rgba(0,0,0,.3);border-radius:50px;height:40px;line-height:40px;padding:0 20px;bottom:15px;left:50px;display:none;user-select:none;z-index:99999999;}#canvas-model .header.on{display:flex;}#canvas-model .header input{vertical-align:middle;}canvas{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(255,255,255,0.3);touch-action:none;z-index:99999998;}#show-canvas-model,#show-canvas-model-utils{width:40px;height:40px;background-color:white;box-shadow:0px 0px 0px 3px inset rgba(0,0,0,.3);border-radius:50%;position:fixed;bottom:15px;left:5px;font-size:12px;line-height:40px;text-align:center;user-select:none;cursor:pointer;}#show-canvas-model-utils{display:none;}#eraser{position:absolute;width:30px;height:30px;background-color:#ccc;border-radius:50%;pointer-events:none;display:none;}"

// -----------------------------------
// TEMP
css += `.answer-area .editormd-preview div .choice-box .choice-item {width:auto!important;}
        #app > div.router-view > div > div.nav-wrapper {display: none!important;}
        .question-wrap .qs-main .no-md {width: auto!important; min-width: unset!important; flex: 1!important;}
        .question-wrap .qs-main {flex-direction: column!important;}
        #app > div.router-view > div > div.container > main > div > div.question-wrap > div.qs-main > div.question-right {min-width: unset!important; flex: 1!important;}`
// -----------------------------------

GM_addStyle(css);

function createHTML() {
    // 创建父容器
    var canvasModelDiv = document.createElement('div');
    canvasModelDiv.id = 'canvas-model';

    // 创建头部部分
    var headerDiv = document.createElement('div');
    headerDiv.className = 'header';

    var group1 = document.createElement('div');
    var group2 = document.createElement('div');
    var group3 = document.createElement('div');

    var paintButton = document.createElement('button');
    paintButton.id = 'paint-btn';
    paintButton.textContent = 'paint';

    var eraseButton = document.createElement('button');
    eraseButton.id = 'erase-btn';
    eraseButton.textContent = 'erase';

    group1.appendChild(paintButton);
    group1.appendChild(eraseButton);

    var colorRedButton = document.createElement('button');
    colorRedButton.id = 'select-color-red';
    colorRedButton.textContent = 'red';

    var colorBlueButton = document.createElement('button');
    colorBlueButton.id = 'select-color-blue';
    colorBlueButton.textContent = 'blue';

    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'select-color';
    colorInput.value = '#cccccc';

    group2.appendChild(colorRedButton);
    group2.appendChild(colorBlueButton);
    group2.appendChild(colorInput);

    var clearButton = document.createElement('button');
    clearButton.id = 'clear';
    clearButton.textContent = 'clear';

    var closeCanvasButton = document.createElement('button');
    closeCanvasButton.id = 'close-canvas-model';
    closeCanvasButton.textContent = 'close';

    var onlyPenCheckbox = document.createElement('input');
    onlyPenCheckbox.type = 'checkbox';
    onlyPenCheckbox.id = 'only-pen';
    onlyPenCheckbox.checked = true;

    var onlyPenLabel = document.createElement('label');
    onlyPenLabel.htmlFor = 'only-pen';
    onlyPenLabel.appendChild(onlyPenCheckbox);
    onlyPenLabel.appendChild(document.createTextNode(' only use pen'));

    group3.appendChild(clearButton);
    group3.appendChild(closeCanvasButton);
    group3.appendChild(onlyPenLabel);

    // group 添加进 header
    headerDiv.appendChild(group1);
    headerDiv.appendChild(group2);
    headerDiv.appendChild(group3);

    // 创建canvas元素
    var canvasElement = document.createElement('canvas');
    canvasElement.id = 'canvas';
    canvasElement.textContent = '你的浏览器不支持 Convas';

    // 将头部容器和canvas元素添加到父容器
    canvasModelDiv.appendChild(headerDiv);
    canvasModelDiv.appendChild(canvasElement);

    // 将父容器添加到body的末尾
    document.body.appendChild(canvasModelDiv);

    // 创建其他div元素
    var showCanvasModelDiv = document.createElement('div');
    showCanvasModelDiv.id = 'show-canvas-model';
    showCanvasModelDiv.textContent = '草稿';
    document.body.appendChild(showCanvasModelDiv);

    var showCanvasModelUtilsDiv = document.createElement('div');
    showCanvasModelUtilsDiv.id = 'show-canvas-model-utils';
    showCanvasModelUtilsDiv.textContent = '工具';
    document.body.appendChild(showCanvasModelUtilsDiv);

    var eraserDiv = document.createElement('div');
    eraserDiv.id = 'eraser';
    document.body.appendChild(eraserDiv);
}

(function() {
    'use strict';
    createHTML()
    // =======================================================
    let canvas = document.getElementById("canvas")
    // canvas.width = window.innerWidth
    canvas.width = document.documentElement.clientWidth || document.body.clientWidth
    canvas.height = window.innerHeight
    let ctx = canvas.getContext("2d")

    const eraser = document.getElementById("eraser");

    ctx.lineWidth = 3
    ctx.lineCap = 'round'; // 圆形线帽
    ctx.lineJoin = 'round'; // 圆形连接点
    ctx.strokeStyle = 'black'

    let isPaint = false
    let isErase = false
    let eraserSize = 20
    let curPointerType = 'pen'


    document.getElementById("paint-btn").onclick = function(event) {
        toggleClass(event.target)
        isPaint = true
        isErase = false
    }
    function toggleClass(e) {
        const child = e.parentElement.children
        e.classList.add('on');
        for(let i = 0; i < child.length; i++) {
            if(child[i] == e) continue
            child[i].classList.remove('on');
        }
    }
    document.getElementById("erase-btn").onclick = function(event) {
        toggleClass(event.target)
        isErase = true
        isPaint = false
    }
    document.getElementById("select-color-red").onclick = function(event) {
        toggleClass(event.target)
        ctx.strokeStyle = '#FF0000'
    }
    document.getElementById("select-color-blue").onclick = function(event) {
        toggleClass(event.target)
        ctx.strokeStyle = '#0000FF'
    }
    document.getElementById("select-color").onchange = function(e) {
        toggleClass(e.target)
        ctx.strokeStyle = e.target.value
    }
    document.getElementById("clear").onclick = function(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    document.getElementById("only-pen").onchange = function(e) {
        if(e.target.checked) curPointerType = 'pen'
        else curPointerType = 'touch'
    }
    document.getElementById("show-canvas-model").onclick = function(e) {
        document.getElementById("canvas-model").style.display = 'block'
        document.getElementById("show-canvas-model-utils").style.display = 'block'
        e.target.style.display = 'none'

        // -----------------------------------
        // temp
        document.querySelector(".answer-area .md-html.editormd-preview").style.zIndex = 'unset'
        document.querySelector("html .nav-wrapper, body .nav-wrapper").style.zIndex = 'unset'
        // -----------------------------------

    }
    document.getElementById("show-canvas-model-utils").onclick = function(e) {
        document.querySelector("#canvas-model .header").classList.toggle('on')
    }
    document.getElementById("close-canvas-model").onclick = function(e) {
        document.getElementById("canvas-model").style.display = 'none'
        document.getElementById("show-canvas-model-utils").style.display = 'none'
        document.getElementById("show-canvas-model").style.display = 'block'
        document.querySelector("#canvas-model .header").classList.toggle('on')
        // -----------------------------------
        // temp
        document.querySelector(".answer-area .md-html.editormd-preview").style.zIndex = '10'
        document.querySelector("html .nav-wrapper, body .nav-wrapper").style.zIndex = '999'
        // -----------------------------------
    }

    const eventPos = event => {
        return { x: event.clientX, y: event.clientY };
    };

    canvas.addEventListener('pointerdown', (event) => {
        event.preventDefault()

        if(isPaint && event.pointerType === curPointerType) {
            ctx.beginPath();
            const x = event.clientX - canvas.getBoundingClientRect().left
            const y = event.clientY - canvas.getBoundingClientRect().top
            ctx.moveTo(x, y)
        }
        if(isErase) {
            eraser.style.display = 'block'
            erase(event)
        }
    })

    canvas.addEventListener('pointermove', moveFun)
    canvas.addEventListener('pointerup', upFun)

    function upFun(event) {
        // canvas.removeEventListener('pointermove', moveFun)
        // canvas.removeEventListener('pointerup', upFun)
        eraser.style.display = 'none'
    }

    function moveFun(event) {
        event.preventDefault()
        if(isPaint && event.pointerType === curPointerType) {
            const x = event.clientX - canvas.getBoundingClientRect().left
            const y = event.clientY - canvas.getBoundingClientRect().top
            ctx.lineTo(x, y)
            ctx.stroke()
        }
        if(isErase) {
            erase(event)
        }
    }

    function erase(event) {
        const x1 = event.clientX - canvas.getBoundingClientRect().left
        const y1 = event.clientY - canvas.getBoundingClientRect().top
        // eraser.style.left = x - eraser.offsetWidth / 2 + "px"
        // eraser.style.top = y - eraser.offsetHeight / 2 + "px"
        const x = event.clientX - canvas.getBoundingClientRect().left + window.scrollX;
        const y = event.clientY - canvas.getBoundingClientRect().top + window.scrollY;
        eraser.style.left = x - eraser.offsetWidth / 2 + "px";
        eraser.style.top = y - eraser.offsetHeight / 2 + "px";
        ctx.clearRect(x1 - eraser.offsetWidth / 2, y1 - eraser.offsetHeight / 2, eraser.offsetWidth, eraser.offsetHeight)
    }
})();
