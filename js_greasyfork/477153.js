// ==UserScript==
// @name         网课(中国教育网/吉林财经大学)刷课（生效域名：learning.mhtall.com）
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  解放双手，节省时间，追赶课程进度。拥有个性化操作面板，实现自动播放需要其他平台请联系：qq：1908245302 vx：xiguayaodade_two
// @author       Xiguayaodade
// @license      MIT
// @match        *://learning.mhtall.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @antifeature  free  限时免费
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477153/%E7%BD%91%E8%AF%BE%28%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E7%BD%91%E5%90%89%E6%9E%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%29%E5%88%B7%E8%AF%BE%EF%BC%88%E7%94%9F%E6%95%88%E5%9F%9F%E5%90%8D%EF%BC%9Alearningmhtallcom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477153/%E7%BD%91%E8%AF%BE%28%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E7%BD%91%E5%90%89%E6%9E%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%29%E5%88%B7%E8%AF%BE%EF%BC%88%E7%94%9F%E6%95%88%E5%9F%9F%E5%90%8D%EF%BC%9Alearningmhtallcom%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    var ddds3 = null;
    var addMessage = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var chapterCount = 0;
    var chapterId = 1;
    var sectionCount = 0;
    var sectionId = 1;
    var studyTime = 0;
    var totalTime = 0;
    var elementsArray = 0;
    var timeStr = null;
    var search = null;
    var searchVD = null;
    var searchFC = null;


    search = function(){
        if(chapterId <= chapterCount){
            sectionCount = document.getElementsByClassName("task-part-list")[1].getElementsByClassName("task-part-item")[chapterId-1].getElementsByClassName("task-task-list").length;
            if(sectionCount > 0){
                addMessage("\u7b2c"+chapterId+"\u7ae0\u672a\u5b8c\u6210\uff0c\u5f00\u59cb\u5b66\u4e60\u3002");
                document.getElementsByClassName("task-part-list")[1].getElementsByClassName("task-part-item")[chapterId-1].getElementsByClassName("task-task-list")[0].getElementsByClassName("task-task-item task-item-jump")[0].click();
            }
        }
    }

    searchVD = function(){
        var elements = document.getElementsByClassName("title course-title js-course-title");
        elementsArray = Array.from(elements);
        for(let i=0; i<elementsArray.length; i++){
            if(elementsArray[i].className === "title course-title js-course-title course-active"){
                sectionId = i + 1;
                break;
            }
        }
        if(sectionId <= elementsArray.length){
            addMessage("\u5f53\u524d\u64ad\u653e\u7b2c"+sectionId+"\u4e2a\u89c6\u9891\u3002");
            var searchJD = setInterval(function(){
                timeStr = document.getElementsByClassName("course-list-header")[sectionId-1].getElementsByClassName("tt-suffix js-tt-suffix")[0].innerText;
                if(parseInt(timeStr.substring(1,3)) >= parseInt(timeStr.substring(7,9))){
                    if(parseInt(timeStr.substring(4,6)) >= parseInt(timeStr.substring(10,12))){
                        addMessage("\u7b2c"+sectionId+"\u4e2a\u89c6\u9891\u64ad\u653e\u5b8c\u6210\u3002");
                        if(sectionId == elementsArray.length){
                            addMessage("\u5f53\u524d\u79d1\u76ee\u5df2\u5b8c\u6210\uff0c\u8bf7\u524d\u5f80\u4e0b\u4e00\u79d1\uff01");
                            clearInterval(searchJD);
                        }else{
                            setTimeout(function(){
                                document.getElementsByClassName("course-list-header")[sectionId].click();
                                setTimeout(function(){
                                    clearInterval(searchJD);
                                    searchVD();
                                },1000);
                            },1000);
                        }
                    }else{
                        addMessage("\u7b2c"+sectionId+"\u4e2a\u5373\u5c06\u5b8c\u6210\uff0c\u8bf7\u7a0d\u540e...");
                    }
                }else{
                    addMessage("\u7b2c"+sectionId+"\u4e2a\u89c6\u9891\u5b66\u4e60\u4e2d\uff0c\u8bf7\u7b49\u5f85\u3002");
                }
            },10000);
        }else{
            addMessage("\u5f53\u524d\u79d1\u76ee\u5df2\u5b8c\u6210\uff0c\u8bf7\u524d\u5f80\u4e0b\u4e00\u79d1\uff01");
        }
    }

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u7f51\u8bfe\u52a9\u624b\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
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
        //var ddds1 = $('<div style="position: absolute;top: 20%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        //var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        //var ddds2 = $('<div style="position: absolute;top: 50%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u89c6\u9891\u500d\u901f\uff1a<button id="speedxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">X16</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:62%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;">\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d</div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        //content.append(ddds2);
        content.append(ddds3);
        content.append(ddds4);
        container.append(content);
        container.append(maxButton);
        container.append(minimizeButton);
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

        #gm-minimize-button {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            font-weight: bold;
            background-color: #ffc0c0;
            cursor: pointer;
        }

        #gm-content {
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px 2px 5px 5px;
            background-color: #ffe5e5;
            width: 400px;
            height: 300px;
        }
        .tip{
            font-family: "黑体";
            color: black;
            -webkit-transform: scale(0.8);
            position:absolute;
            padding: 6px 5px;
            background-color:#ffe8f0;
            border-radius: 4px;
            z-index: 9999;
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


        minimizeButton.on('click', function() {
            minimizeButton.attr("style", "display:none;");
            maxButton.attr("style", "display:black;");
            content.slideToggle(0);
            container.css({ width: 200 });
        });

        maxButton.on('click', function() {
            minimizeButton.attr("style", "display:black;");
            maxButton.attr("style", "display:none;");
            content.slideToggle(0);
            container.css({ width: 400 });
        });

        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        addMessage = function(message){
            if (ddds3.children().length >= 15) {
                ddds3.children().first().remove();
            }
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    panel();

    var wait = setInterval(function (){
        if(window.location.href.substring(0,51) === "https://learning.mhtall.com/play/course_detail.html"){
            addMessage("\u7ae0\u8282\u5217\u8868");
            document.getElementsByClassName("tabs-tt")[5].click();
            setTimeout(function(){
                chapterCount = document.getElementsByClassName("task-part-list")[1].getElementsByClassName("task-part-item").length;
                search();
            },1000);
        }else if(window.location.href.substring(0,44) === "https://learning.mhtall.com/play/player.html"){
            addMessage("\u64ad\u653e\u9875");
            sectionCount = document.getElementsByClassName("title course-title js-course-title").length;
            searchVD();
        }
        clearInterval(wait);
    }, 5000);


})();