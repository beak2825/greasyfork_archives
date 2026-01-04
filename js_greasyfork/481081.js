// ==UserScript==
// @name         临床医学
// @description  表格美化...
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.chictr.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnca.cn
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481081/%E4%B8%B4%E5%BA%8A%E5%8C%BB%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/481081/%E4%B8%B4%E5%BA%8A%E5%8C%BB%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    // Your code here...
    var ddds3 = null;

    function actionCheang(){
        document.querySelectorAll("tbody")[1].children[0].children[0].style.display = "none";
        document.querySelectorAll("tbody")[1].children[0].children[2].style.display = "none";
        document.querySelectorAll("tbody")[1].children[2].children[0].style.display = "none";
        document.querySelectorAll("tbody")[1].children[2].children[2].style.display = "none";
        document.querySelectorAll("tbody")[1].children[4].children[0].style.display = "none";
        document.querySelectorAll("tbody")[1].children[4].children[2].style.display = "none";
        document.querySelectorAll("tbody")[1].children[6].children[0].style.display = "none";
        document.querySelectorAll("tbody")[1].children[6].children[2].style.display = "none";
        document.querySelectorAll("tbody")[1].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[3].style.display = "none";
        document.querySelectorAll("tbody")[1].children[5].style.display = "none";
    }

    function actionCheang1(){
        document.querySelectorAll("tbody")[1].children[0].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[2].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[4].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[6].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[3].style.display = "none";
    }
    function actionCheang2(){
        document.querySelectorAll("tbody")[1].children[0].children[3].style.display = "none";
        document.querySelectorAll("tbody")[1].children[2].children[3].style.display = "none";
        document.querySelectorAll("tbody")[1].children[4].children[3].style.display = "none";
        document.querySelectorAll("tbody")[1].children[6].children[3].style.display = "none";
        document.querySelectorAll("tbody")[1].children[1].style.display = "none";
        document.querySelectorAll("tbody")[1].children[3].style.display = "none";
    }

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar"><button id="speedxgsex" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">点击整理表格</button><div id="gm-title-bar"><button id="speedxgtow" style="position: absolute;width:48px;right: 60px;">2</button><button id="speedxgone" style="position: absolute;width:48px;right: 120px;">1</button></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c----\u4f5c\u8005\uff1a\u897f\u74dc\u8981\u5927\u7684\uff08\u611f\u8c22\u652f\u6301\uff01\uff09').css({
            'position': 'absolute',
            'top': '15%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '90%',
            'height': '25px',
            'font-size': '16px',
            'line-height': '1.5',
            'white-space': 'nowrap'
        }).appendTo(content);
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;">\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d</div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        $('body').append(container);
        $('body').append(tips);

        GM_addStyle(`
        #gm-interface {
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 5px;
            background-color: white;
            z-index: 9999;
        }

        #gm-title-bar {
            padding: 5px;
            background-color: #ffc0c0;
            border: 1px solid black;
            border-radius: 5px;
            cursor: grab;
        }
    `);

        titleBar.on('mousemove',function(e){
            tips.attr("style", "display:black;");
            var top = e.pageY+5;
            var left = e.pageX+5;
            tips.css({
                'top' : top + 'px',
                'left': left+ 'px'
            });
        });

        titleBar.on('mouseout',function(){
            tips.hide();
        });

        titleBar.on('mousedown', function(e) {
            var startX = e.pageX - container.offset().left + window.scrollX;
            var startY = e.pageY - container.offset().top + window.scrollY;

            $(document).on('mousemove', function(e) {
                e.preventDefault();
                var newX = e.pageX - startX;
                var newY = e.pageY - startY;
                container.css({ left: newX, top: newY });
            });

            $(document).on('mouseup', function() {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
        });


        $("#speedxgsex").on('click',function(){
            actionCheang();
        });
        $("#speedxgtow").on('click',function(){
            actionCheang2();
        });
        $("#speedxgone").on('click',function(){
            actionCheang1();
        });


    }

    panel();
    actionCheang();

})();