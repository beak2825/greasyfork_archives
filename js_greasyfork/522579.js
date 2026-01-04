// ==UserScript==
// @name         浮动窗体UI_TEST
// @namespace    浮动窗体UI
// @version      0.0.1
// @description  创建基本浮动窗体UI
// @author       城市美
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        *://*/*
// @require      https://update.greasyfork.org/scripts/522211/1511565/jQueryv214.js
// @grant        GM_xmlhttpRequest
// @connect

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522579/%E6%B5%AE%E5%8A%A8%E7%AA%97%E4%BD%93UI_TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/522579/%E6%B5%AE%E5%8A%A8%E7%AA%97%E4%BD%93UI_TEST.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery $ */

    var BaseUI=CreateFloatingFrameUI({title:"WEB-TOOL",width:"200px",height: '200px',top: '100px',left: '1650px'});

    const element = document.getElementById('element_Id');
    var test_element = document.createElement('div');
    test_element.innerHTML = "test_element";

    BaseUI.add_Dom(test_element);
})();

// 创建基本浮动窗体UI
function CreateFloatingFrameUI(options={}) {
    /*
    // 使用示例：
    var BaseUI=CreateFloatingFrameUI({title:"WEB-TOOL",width:"200px",height: '200px',top: '100px',left: '1650px'});
    const element = document.getElementById('element_Id');
    BaseUI.add_Dom(element);
    */

    // 默认配置项
    var defaults = {
        width: '200px',
        height: '200px',
        "min-width": "100px",
        "min-height": "100px",
        color: '#fff', // 文字颜色
        background: '#333', // 背景颜色
        padding: '0px', // 内边距
        borderRadius: '5px', // 圆角半径
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // 阴影效果
        zIndex: 9999999,// 悬浮框位置
        top: '50px',
        left: '50px',
        title:"标题"
    };

    // 合并配置项
    var settings = Object.assign({}, defaults, options,{"position":"fixed"});

    // 创建悬浮框元素
    var box = document.createElement('div');
    box.id=generateID();
    // 应用style
    Object.keys(settings).forEach(key => {
        box.style[key]=settings[key];
    });

    // 添加标题
    var title_element = document.createElement('div');
    title_element.innerHTML = settings.title == "" ? "标题" : settings.title;
    title_element.style["text-align"]="left";
    title_element.style["line-height"]="20px";
    title_element.style.height = "20px";
    title_element.style.margin="0";
    title_element.style.padding="5px";
    title_element.style.background="brown";
    title_element.style.borderRadius = settings.borderRadius + " " + settings.borderRadius +" 0px 0px";
    title_element.style["-webkit-user-select"]="none"; /* Chrome, Safari, Opera */
    title_element.style["-moz-user-select"]="none"; /* Firefox */
    title_element.style["-ms-user-select"]="none"; /* Internet Explorer/Edge */
    title_element.style["user-select"]="none";
    box.appendChild(title_element);

    // 添加body容器
    var body_element = document.createElement('div');
    body_element.style.height = box.style.height.replace(/[\D]+/gi, "") - 30 + box.style.height.match(/[\D]+/gi).join('');
    box.appendChild(body_element);

    // 添加元素
    box.add_Dom=function(Dom){
        console.log("添加元素");
        console.log(Dom);
        var isDOM = Dom instanceof HTMLElement && Dom.nodeType === 1;
        console.log("isDOM:"+isDOM);
        if(isDOM){
            console.log("添加元素完成");
            body_element.appendChild(Dom);
        }
    }

    // 添加悬浮框元素到页面
    document.body.appendChild(box);

    // 立即执行窗体拖动事件
    (()=>{
        var isDragging = false; // 是否在拖动中
        var startOffset = { x: 0, y: 0 }; // 鼠标按下时的偏移量

        // 鼠标按下事件
        title_element.addEventListener('mousedown', function (e) {
            isDragging = true;
            startOffset.x = e.clientX - box.offsetLeft;
            startOffset.y = e.clientY - box.offsetTop;
            title_element.style.cursor = 'move';
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                box.style.top = e.clientY - startOffset.y + 'px';
                box.style.left = e.clientX - startOffset.x + 'px';
            }
        });

        // 鼠标松开事件
        document.addEventListener('mouseup', function (e) {
            isDragging = false;
            title_element.style.cursor = 'default';
        });
    })();

    // 随机ID生成
    function generateID(id_model="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx",radix = 36) {
        var model = id_model.toLowerCase().replace(/^./, "y"),radix1,radix2;
        radix1 = radix > 36 ? 36 : radix;
        radix1 = radix < 2 ? 2 : radix;
        radix2 = radix > 26 ? 26 : radix;
        radix2 = radix < 2 ? 2 : radix;
        var A=[..."abcdefghijklmnopqrstuvwxyz0123456789"];
        var test = model.replace(/[xy]/g, function(c) {
            var v;
            if(c === "x"){
                v = A[Math.random() * radix1 | 0]
            }
            if(c === "y"){
                v = A[Math.random() * radix2 | 0]
            }
            return v;
        });
        return test
    }

    // 返回悬浮框元素
    return box;
};