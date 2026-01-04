// ==UserScript==
// @name 🦄️广东开放大学-广开-小猪手-回顾答案保存🦄️
// @namespace http://tampermonkey.net/
// @version 1.3
// @description  回顾答案保存，降低难度
// @author Your name
// @match https://*.ougd.cn/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @connect    				enncy.cn
// @connect    				icodef.com
// @connect    				ocsjs.com
// @connect    				localhost
// @downloadURL https://update.greasyfork.org/scripts/480839/%F0%9F%A6%84%EF%B8%8F%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6-%E5%B9%BF%E5%BC%80-%E5%B0%8F%E7%8C%AA%E6%89%8B-%E5%9B%9E%E9%A1%BE%E7%AD%94%E6%A1%88%E4%BF%9D%E5%AD%98%F0%9F%A6%84%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/480839/%F0%9F%A6%84%EF%B8%8F%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6-%E5%B9%BF%E5%BC%80-%E5%B0%8F%E7%8C%AA%E6%89%8B-%E5%9B%9E%E9%A1%BE%E7%AD%94%E6%A1%88%E4%BF%9D%E5%AD%98%F0%9F%A6%84%EF%B8%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create a div for the floating box
    var floatingBox = $('<div id="customFloatingBox"></div>');
    $('body').append(floatingBox);

    // Apply styles to the floating box
    floatingBox.css({
        'display': 'none', // Hide the floating box initially
        'position': 'fixed',
        'top': '10px',
        'right': '10px',
        'width': '300px',
        'border': '1px solid #000',
        'border-radius': '10px',
        'z-index': '9999',
        'box-shadow': '0 4px 8px 0 rgba(0,0,0,0.2)',
        'cursor': 'move',
        'background': 'linear-gradient(to bottom, rgba(255, 165, 0, 0.5), rgba(255, 165, 0, 0.2))',
        'backdrop-filter': 'blur(10px)'
    });

    // Make the floating box draggable
    var isDragging = false;
    var xOffset = 0;
    var yOffset = 0;

    floatingBox.mousedown(function(e) {
        isDragging = true;
        xOffset = e.clientX - floatingBox.offset().left;
        yOffset = e.clientY - floatingBox.offset().top;
    });

    $(document).mousemove(function(e) {
        if (isDragging) {
            floatingBox.css({
                left: (e.clientX - xOffset) + 'px',
                top: (e.clientY - yOffset) + 'px'
            });
        }
    });

    $(document).mouseup(function() {
        isDragging = false;
    });

    // Add content to the floating box
    floatingBox.append('<h2>广开小猪手</h2>');
    floatingBox.append('<input type="text" id="searchInput" placeholder="搜索题目" style="color: #000">');
    floatingBox.append('<select id="courseSelect"><option value="course1">未搜索到课程</option><option value="course2">未搜索到课程...</option></select>');
    floatingBox.append('<label for="formativeAssessment">形成性考核<input type="checkbox" id="formativeAssessment"></label>');
    floatingBox.append('<div id="speedControl">提交速度调节</div>');
    floatingBox.append('<input type="range" id="speedSlider" min="1" max="10" value="5">');
    floatingBox.append('<button id="uploadQuestions">上传题目</button>');
    floatingBox.append('<button id="recordQuestions">收录题库</button>');
    floatingBox.append('<button id="customButton">教程/反馈</button>');
    floatingBox.append('<div id="menuContent" style="display: none;"></div>'); // Moved menu content outside of menu bar

    // Add styles
    GM_addStyle(`
        #customFloatingBox button, #customFloatingBox select, #customFloatingBox label, #customFloatingBox input {
            display: block;
            margin: 10px auto;
            border-radius: 5px;
            padding: 10px;
            background-color: #FF6347;
            color: #fff;
            border: none;
            cursor: pointer;
            width: 80%;
        }
        #customFloatingBox h2 {
            text-align: center;
            margin: 10px;
            color: #FF6347;
        }
        #speedControl {
            text-align: center;
            color: #FF6347;
        }
        #menuContent {
            padding: 10px;
            border: 1px solid #000;
            border-radius: 0 0 10px 10px;
            background-color: #FF6347;
            display: none;
        }
    `);

    // Add menu bar and toggle button
    var menuBar = $('<div id="menuBar"><button id="toggleMenu">菜单栏▼</button></div>');
    floatingBox.append(menuBar);

    // Fade in the floating box when the page is loaded
    $(document).ready(function() {
        floatingBox.fadeIn(1000);
    });

    // Add functionality to the custom button
    $(document).on('click', '#customButton', function() {
        // Navigate to www.baidu.com
        window.location.href = "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=XaThxBcRK9DEhvuNXGMwO4Q80tFo3mmA&authKey=GYzAl0hsNVyb%2FiyRlnPuxVjDJSte0kw70rcSLQrI9SI7J3HekTZK5csWAdbBifWw&noverify=0&group_code=218886190";
    });

    // Toggle menu bar functionality
    $(document).on('click', '#toggleMenu', function() {
        $('#menuContent').slideToggle();
    });

    // Add menu content
    var menuContent = $('#menuContent');
    menuContent.append('<div style="display: flex; align-items: center;"><label class="custom-checkbox"><input type="checkbox" id="saveReview" style="display:none;"><span class="checkmark"></span><span class="checkbox-label">保存回顾答案</span></label></div>');
    menuContent.append('<div style="display: flex; align-items: center;"><label class="custom-checkbox"><input type="checkbox" id="autoFillReview" style="display:none;"><span class="checkmark"></span><span class="checkbox-label">自动填回回顾答案</span></label></div>');
    menuContent.append('<div style="display: flex; align-items: center;"><label class="custom-checkbox"><input type="checkbox" id="forceSubmit" style="display:none;"><span class="checkmark"></span><span class="checkbox-label">强制提交答案</span></label></div>');

    // Add styles for checkboxes and menuContent
    GM_addStyle(`
        .custom-checkbox {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 18px;
        }

        .custom-checkbox input[type="checkbox"] {
            display: none;
        }

        .checkmark {
            display: inline-block;
            position: relative;
            width: 25px;
            height: 25px;
            border: 1px solid #ccc;
            border-radius: 50%; /* 圆形样式 */
            margin-right: 10px;
        }

        .custom-checkbox input:checked + .checkmark {
            background-color: #2196F3;
            border-color: #2196F3;
        }

        .checkmark:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* 文字居中 */
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
            display: none;
        }

        .custom-checkbox input:checked + .checkmark:after {
            display: block;
        }

        #menuContent {
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); /* 添加阴影特效 */
            padding: 20px;
        }
    `);

    // Add more custom functionality as needed
})();