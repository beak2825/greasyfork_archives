// ==UserScript==
// @name         自动阅读器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pc 端自动阅读器，实现不同速度，在阅读中解放双手，页面自动滚动
// @author       windymiao
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455685/%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455685/%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = `<div class="toggle">
                    <span>阅读设置</span>
                  </div>`

    var content = `<div id="auto-reading">
        <div class="title">
            <span>自动阅读设置</span>
            <span style="float:right;" class="hidden">❯</span>
        </div>


        <div style="margin: 16px 0;">
            阅读速度
        </div>

        <div class="forRadio">
            <input type="radio" id="0.6" name="step" value="0.6" checked="">
            <label for="0.6" class="radio-label">0.6</label>
        </div>
        <div class="forRadio">
            <input type="radio" id="1.0" name="step" value="1.0">
            <label for="1.0" class="radio-label">1.0</label>
        </div>
        <div class="forRadio">
            <input type="radio" id="1.2" name="step" value="1.2">
            <label for="1.2" class="radio-label">1.2</label>
        </div>
        <div class="forRadio">
            <input type="radio" id="1.5" name="step" value="1.5">
            <label for="1.5" class="radio-label">1.5</label>
        </div>
        <div class="forRadio">
            <input type="radio" id="1.8" name="step" value="1.8">
            <label for="1.8" class="radio-label">1.8</label>
        </div>
        <div class="forRadio">
            <input type="radio" id="2.0" name="step" value="2">
            <label for="2.0" class="radio-label">2.0</label>
        </div>



        <div style="margin: 10px auto;width: 100%;">
            <div class="start" title="开启自动阅读">
                开启
            </div>
            <div class="stop" title="关闭自动阅读">
                关闭
            </div>
        </div>

    </div>`

    var styleStr = `<style>
    #auto-reading {
        position: fixed;
        right: -200px;
        top: 100px;
        color:#000000;
        font-size:16px;

        width: 155px;
        padding: 10px;
        background: #ffffff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        box-sizing: border-box;
        transition: right 2s ease-out;
        -webkit-transition: right 0.5s ease-in-out;
        -moz-transition: right 2s ease-out;
        -ms-transition: right 2s ease-out;
        -o-transition: right 2s ease-out;

        z-index:1000000;

    }

    #auto-reading.active {
        right: 0px;
    }



    .title {
        font-size: 18px;
        /* text-align: center; */
        display: block;
        width: 100%;
    }

    .hidden {
        cursor: pointer;
        display: inline-block;
    }

    .hidden:hover {
        color: #1296db;
    }

    .start,
    .stop {
        cursor: pointer;
        display: inline-block;
        background: #1296db;
        color: #ffffff;
        padding: 2px 8px;
        border-radius: 7px;
        font-size: 14px;

        text-align: center;
        line-height: 20px;

    }
    .stop{
        margin-left: 12px;
    }

    .start:hover,
    .stop:hover {
        background-color: #1296db;
        box-shadow: 0px 0px 4px 1px #cccccc;
        cursor: pointer;
    }


    .forRadio {
        margin-right: 16px;
        display: inline-block;
        line-height: 19px;
    }

    .forRadio .radio-label {
        cursor: pointer;
    }

    .forRadio input[type="radio"] {
        position: absolute;
        opacity: 0;
    }

    .forRadio input[type="radio"]+.radio-label:before {
        content: "";
        background: #fff;
        border-radius: 100%;
        border: 1px solid #c8c8c8;
        display: inline-block;
        width: 14px;
        height: 14px;
        position: relative;
        margin-right: 8px;
        top: 1.5px;
        vertical-align: top;
        cursor: pointer;
        text-align: center;
        -webkit-transition: all 250ms ease;
        transition: all 250ms ease;
    }

    .forRadio input[type="radio"]+.radio-label:hover:before {
        border: 1px solid #1296db;
    }

    .forRadio input[type="radio"]:checked+.radio-label:before {
        background-color: #1296db;
        box-shadow: inset 0 0 0 3px #f4f4f4;
        border-color: #1296db;
    }

    .forRadio input[type="radio"]:focus+.radio-label:before {
        outline: none;
        border-color: #1296db;
    }

    .forRadio input[type="radio"]:disabled:checked+.radio-label:before {
        box-shadow: inset 0 0 0 3px #f4f4f4;
        border-color: #c8c8c8;
        background: #c8c8c8;
    }

    .forRadio input[type="radio"]:disabled+.radio-label:before {
        border-color: #c8c8c8;
        cursor: not-allowed;
    }

    .forRadio input[type="radio"]:disabled+.radio-label {
        color: #c8c8c8;
        cursor: not-allowed;
    }

    .forRadio input[type="radio"]:disabled:checked+.radio-label {
        color: #c8c8c8;
        cursor: not-allowed;
    }

    .forRadio input[type="radio"]+.radio-label:empty:before {
        margin-right: 0;
    }

    .toggle {
        width: 50px;
        height: 50px;
        background: #1296db;
        position: fixed;
        right: -14px;
        top: 155px;
        border-radius: 33%;
        z-index:1000000;


    }

    .toggle:hover {
        background-color: #1296db;
        box-shadow: 0px 0px 8px 3px #cccccc;
        cursor: pointer;
    }

    .toggle span {
        display: block;
        width: 30px;
        height: 30px;
        font-size: 12px;
        margin: 9px 8px;
        color: #ffffff;
        line-height:17px;

    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #cccccc;
        margin-top: 5px;
    }
</style>`

    console.log('aaa');
    $('body').append(button);
    $('body').append(content);
    $('head').append(styleStr);

    var interval; // 定时器
    var v; // 阅读速度

    $('.start').on('click', function () {
        start();
    })

    $('.stop').on('click', function () {
        stop();
    })

    /**
     * 开始自动阅读
     * */
    function start() {
        if (interval) {
            clearInterval(interval);
        }
        var startPos = $(window).scrollTop();
        var top = 0;
        v = parseFloat($('input[name="step"]:checked').val());

        interval = setInterval(function () {


            top = startPos += v
            window.scrollTo({
                left: 0, // x坐标
                top: top,  // y 坐标
                behavior: 'smooth' // 可选值：smooth、instant、auto
            })
        }, 50)
    }

    /**
     * 停止自动阅读
     */
    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    /**
     * 改变阅读速度
     */
    $('input:radio[name="step"]').change(function (event) {

        if (interval) {
            start();
        }
    })

    /**
     * 监听鼠标滑动事件
     */
    $(window).on('mousewheel', function (event) {
        console.log(event);
        stop();
    }, function () {
        if (interval) {
            start();
        }
    });


    $('.toggle').click(function (event) {

        $(this).fadeOut();
        $('#auto-reading').addClass('active');
    })

    $('.hidden').click(function () {
        hiddenSetting();
    })

    function hiddenSetting(){
        setTimeout(() => {
            $('.toggle').fadeIn();
        }, 500);
        $('#auto-reading').removeClass('active');
    }

    $(window).scroll(function(){
       if ($(window).scrollTop() + $(window).height() + 5 >= $(document).height()) {
           console.log('bottom');
           clearInterval(interval);
           interval = null;

       }
    });



})();