// ==UserScript==
// @name         FKCSDN
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  it's a script to blocked The CSDN website like https://www.csdn.net/  in most broswers  because the website is so disgusting
// @description  在大多数都主流浏览器中屏蔽了 CSDN 站点,所以起名 FKCSDN
// @include      *://www.baidu.com/*
// @include      *://www.dogedoge.com/*
// @include      *://www.so.com/*
// @include      *://www.sogou.com/*
// @include      *://www.google.com/*
// @include      *://duckduckgo.com/*
// @include      *.bing.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399389/FKCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/399389/FKCSDN.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var move = false
    var insertHtml = `
     <div style="" class="__fixed-btn">
        <div class="fk-box">
            <div class="fk-csdn">FK CSDN</div>
            <label class="fk-item">
                <input type="checkbox" name="fk-csdn" checked="true">
                <div class="slider round"></div>
            </label>
        </div>
    </div>`

    var insertStyle = `<style type="text/css">
       .__fixed-btn {
       -webkit-user-select: none;
        position: fixed;
        top: 150px;
        left: 0;
        border-radius: 50px;
        width: 100px;
        height: 100px;
        background-color: #f2f8ff;
        z-index: 10000;
    }

    .slider.round {
        border-radius: 34px;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        width: 40px;
        height: 20px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .fk-item input {
        display: none;
    }

    .fk-item {
        position: absolute;
        right: 0;
        top: 10px;
        display: inline-block;
        vertical-align: middle;
        width: 40px;
        height: 20px;
        top: 6px;
    }

    input:checked+.slider {
        background-color: #2196F3;
    }

    input:checked+.slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
    }

    .fk-csdn {
        color: #000;
        font-weight: bold;
        font-size: 12px;
        vertical-align: middle;
    }

    .fk-box {
        position: relative;
        height: 30px;
        line-height: 30px;
    }

    .fk-box:first-child {
        margin-top: 20px;
    }
    </style>
    `
    document.querySelector('body').insertAdjacentHTML('afterbegin', insertHtml);
    document.querySelector('head').insertAdjacentHTML('afterbegin', insertStyle);

    var searchEngineCode = '00';
    var fixedBtn = document.querySelector('.__fixed-btn');
    var inputBox = document.querySelector('input[type=checkbox]');
    var searchBtn = document;
    var searchInput = document;

    // 1 google 2 duck 3 baidu 4 sogo 5 360 6 doge 7 bing
    switch (window.location.host) {
        case 'www.google.com':
            searchEngineCode = '01';
            searchBtn = document.querySelector('.Tg7LZd');
            searchInput = document.querySelector('.gLFyf');
            break;
        case 'duckduckgo.com':
            searchEngineCode = '02';
            searchBtn = document.querySelector('#search_button');
            searchInput = document.querySelector('#search_form_input');
            break;
        case 'www.baidu.com':
            searchEngineCode = '03';
            searchBtn = document.querySelector('#su');
            searchInput = document.querySelector('#kw');
            document.querySelector('#wrapper').insertAdjacentHTML('afterbegin', insertStyle);
            break;
        case 'www.sogou.com':
            searchEngineCode = '04';
            searchBtn = document.querySelector('#searchBtn');
            searchInput = document.querySelector('#upquery');
            break;
        case 'www.so.com':
            searchEngineCode = '05';
            searchBtn = document.querySelector('#su');
            searchInput = document.querySelector('#keyword');
            break;
        case 'www.dogedoge.com':
            searchEngineCode = '06';
            searchBtn = document.querySelector('#search_button');
            searchInput = document.querySelector('#search_form_input');
            break;
        case 'cn.bing.com':
            searchEngineCode = '07';
            searchBtn = document.querySelector('#sb_form_go');
            searchInput = document.querySelector('#sb_form_q');
            break;
        case 'www.bing.com':
            searchEngineCode = '07';
            searchBtn = document.querySelector('#sb_form_go');
            searchInput = document.querySelector('#sb_form_q');
            break;
        default:
            searchEngineCode = '00';
            console.log('不支持此搜索引擎')
            break;
    }

    var isChecked = window.localStorage.getItem('FKCSDNCheck') == 'false' ? false : true;
    inputBox.checked = isChecked;

    var mouseDownClientX, mouseDownClientY, mouseDownOffsetLeft, mouseDownOffsetRight,mouseChangeClientX,mouseChangeClientY;
    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight
    fixedBtn.addEventListener("mousedown", function(e) {
        fixedBtn.style.transition  = '';
        move = true;
        mouseDownClientX = e.clientX;
        mouseDownClientY = e.clientY;
        mouseDownOffsetLeft = fixedBtn.offsetLeft;
        mouseDownOffsetRight = fixedBtn.offsetTop;
    });
    document.addEventListener("mousemove", function(e) {
        if (move == false) {
            return;
        }
        var x = e.clientX;
        var y = e.clientY;
        fixedBtn.style.left = x - (mouseDownClientX - mouseDownOffsetLeft) + "px";
        fixedBtn.style.top = y - (mouseDownClientY - mouseDownOffsetRight) + "px";
    });

    fixedBtn.addEventListener("mouseup", function(e) {
        move = false;
        mouseChangeClientX = e.clientX;
        mouseChangeClientY = e.clientY;
        fixedBtn.style.transition = 'all .3s';
        if(mouseChangeClientX < windowWidth/2){
            fixedBtn.style.left = 0;
        }else {
            fixedBtn.style.left = windowWidth - fixedBtn.clientWidth + 'px';
        }
        if(fixedBtn.offsetTop < 0){
            fixedBtn.style.top = 0;
        }else if(fixedBtn.offsetTop + fixedBtn.clientHeight > windowHeight) {
            fixedBtn.style.top = windowHeight- fixedBtn.clientHeight  + 'px';
        }
    });
    inputBox.addEventListener('change', function() {
        var name = this.getAttribute('name');
        var value = this.getAttribute('checked');
        var ele = this;
        switch (name) {
            case 'fk-csdn':
                FKCSDN(name, value, ele);
                break
            case '':
                break;
            default:
                break;
        }
    })
    searchBtn && searchBtn.addEventListener('click', function(e) {
        if (searchEngineCode == '00') return;
        var searchText = searchInput.value;
        var searchArr = searchText.split(' ');
        var hasValue = false;
        for (var key in searchArr) {
            if (searchArr[key] == '-site:csdn.net') {
                hasValue = true;
            }
        }
        if (!hasValue && isChecked) {
            searchInput.value = searchText + ' -site:csdn.net';
        }
    })

    function FKCSDN(name, value, ele) {
        if (searchEngineCode == '00') return;
        isChecked = ele.checked == true;
        window.localStorage.setItem('FKCSDNCheck', isChecked)
        if (!isChecked) {
            var searchText = searchInput.value;
            var searchArr = searchText.split(' ');
            var newArr = [];
            if (searchArr.includes('-site:csdn.net')) {
                searchArr.forEach((value, index) => {
                    if (value !== '-site:csdn.net') {
                        newArr.push(value);
                    }
                })
                searchInput.value = newArr.join(' ');
            }
        }
        searchBtn.click();

    }

})();