// ==UserScript==
// @name         B站(哔哩哔哩bilibili)倍速控制及视频解析
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  按键Z：恢复默认速度；按键X：减速0.25；按键C：加速0.25.
// @author       Faded_lov
// @license      GPL
// @match         *://www.bilibili.com/video/*
// @match         *://www.bilibili.com/bangumi/play/*
// @icon         https://img.ixintu.com/download/jpg/20200831/b5b5fef64ab25c86b410cb2048926f07_512_464.jpg
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/458488/B%E7%AB%99%28%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%29%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%8F%8A%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/458488/B%E7%AB%99%28%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%29%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%8F%8A%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
$(function () {

    //^ 等待元素加载完成
    jQuery.fn.wait = function (selector, func, times, interval) {
        var _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = this,
            _selector = selector, //选择器
            _iIntervalID; //定时器id
        if (this.length) { //如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function () {
                if (!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --

                _self = $(_selector); //再次选择
                if (_self.length) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }

    //* 添加速度显示框
    let $div = $(`
    <div id = "speed" style = "display: none;">
        <span>Test</span>
    </div>
    `);
    let $style = $(`
    <style type="text/css">
    #speed {
        position: absolute;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        top: 50%;
        left: 50%;
        min-width: 84px;
        height: 32px;
        padding: 8px;
        color: #000;
        font-size: 20px;
        border-radius: 7px;
        background: hsla(0,0%,100%,.6);
        transform: translate(-50%,-50%);
        z-index: 77;
    }

    #speed span {
        margin: auto;
        text-align: center;
    }
    </style>
    `);
    // $('.bpx-player-primary-area').append($div);
    $('.bpx-player-primary-area').wait('.bpx-player-primary-area', function () {
        $(this).append($div);
    });
    $("head").append($style);

    //* 按键 Z,X,C 调节速度
    // 1. 按键绑定事件
    $(window).on('keydown', (event) => {
        // 2. 按键分析处理
        if (!event.ctrlKey) {
            let video = $('video')[0] || $('bwp-video')[0];
            let keyValue = event.key;
            // 2.1 减速播放
            if (keyValue == 'x' || keyValue == 'X') {
                if (video.playbackRate > 0.25) {
                    video.playbackRate -= 0.25;
                }
                // 显示速度
                $('#speed').html('<span>' + video.playbackRate + '&nbsp;X </span>');
                $('#speed').stop(true, true).fadeIn().delay(1000).fadeOut();
            }
            // 2.2 加速播放
            if (keyValue == 'c' || keyValue == 'C') {
                if (video.playbackRate < 16) {
                    video.playbackRate += 0.25;
                }
                $('#speed').html('<span>' + video.playbackRate + '&nbsp;X </span>');
                $('#speed').stop(true, true).fadeIn().delay(1000).fadeOut();
            }
            // 2.3 恢复初始速度
            if (keyValue == 'z' || keyValue == 'Z') {
                video.playbackRate = 1;
                $('#speed').html('<span>' + video.playbackRate + '&nbsp;X </span>');
                $('#speed').stop(true, true).fadeIn().delay(1000).fadeOut();
            }
        }
    });

    //* 视频解析框
    let $analysis_div = $(`
    <div>
        <ul id="analysis">
            <li>有弹幕解析
                <ul class="analysis_info">
                    <li url="https://jx.jsonplayer.com/player/?url=">JSONPlayer</li>
                    <li url="https://vip.bljiex.com/?v=">BL解析</li>
                    <li url="https://www.yemu.xyz/?url=">夜幕解析</li>
                    <li url="https://jx.playerjy.com/?url="><del title="失效">Player-JY</del></li>
                </ul>
            </li>
            <li>无弹幕解析
                <ul class="analysis_info info_2" >
                    <li url="https://z1.im1907.top/?jx=">M1907</li>
                    <li url="https://yparse.jn1.cc/index.php?url=">云解析</li>
                    <!-- <li url="https://go.yh0523.cn/y.cy?url=">盘古云解析</li> -->
                </ul>
            </li>
        </ul>
    </div>
    `);
    let $analysis_style = $(`
    <style>
    li {
        list-style: none;
    }

    #analysis {
        display: flex;
        position: absolute;
        top: 125px;
        left: 50%;
        z-index: 1;
        cursor: pointer;
        transform: translateX(-50%);
    }

    #analysis>li {
        float: left;
        height: 30px;
        width: 100px;
        background-color: #f1f2f3;
        text-align: center;
        line-height: 30px;
        transition: background-color 1s, color 1s;
    }

    #analysis>li:hover {
        background-color: #00aeec;
        color: white;
    }

    #analysis>li:first-child {
        border-radius: 8px 0 0 8px;
    }

    #analysis>li:last-child {
        border-radius: 0 8px 8px 0;
    }

    .analysis_info {
        display: none;
        float: left;
        padding: 0;
        margin-top: 1px;
        width: 200px;
    }

    .info_2 {
        float: right;
    }

    .analysis_info li {
        float: left;
        margin: 1px;
        height: 30px;
        width: 96px;
        background-color: #f1f2f3;
        color: black;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
        transition: background-color .5s, color .5s;
    }

    .analysis_info li:hover {
        background-color: #00aeec;
        color: white;
    }
    </style>
    `);
    $('body').append($analysis_div);
    if (window.location.href.includes("bangumi")) {
        $('#analysis').css({
            top: 85,
            left: 120
        });
    }
    $('head').append($analysis_style);

    // 为解析框设置触发效果
    $('#analysis>li').on('mouseover', function () {
        $(this).children('ul').stop().slideDown();
    });
    $('#analysis>li').on('mouseout', function () {
        $(this).children('ul').stop().slideUp();
    });

    //* 解析触发函数
    $('.analysis_info > li').on('click', function () {
        let url = window.location.href;
        let href = $(this).attr('url') + url;
        window.open(href, '_blank');
    });
});