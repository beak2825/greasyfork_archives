// ==UserScript==
// @name         🍉西瓜刷课助手🍉
// @version      0.0.5
// @description  🍉西瓜刷课助手🍉（此脚本只适用于部分平台），解放双手，节省时间，追赶课程进度。拥有个性化操作面板，实现自动播放、防挂机、答题、作业、考试....🍉需要其他平台请联系：qq：1908245302 vx：xiguayaodade🍉
// @author       xiguayaodade
// @license      MIT
// @match        *://*.360xkw.com/*
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
// @namespace    http://tampermonkey.net/
// @homepage     101.37.88.140
// @source       101.37.88.140
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @antifeature  free  限时免费
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/472320/%F0%9F%8D%89%E8%A5%BF%E7%93%9C%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%8D%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472320/%F0%9F%8D%89%E8%A5%BF%E7%93%9C%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%8D%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    var ddds3 = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapCSS);

    var bootstrapJS = document.createElement("script");
    bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/js/bootstrap.min.js";
    document.body.appendChild(bootstrapJS);

    var autoAnswer = function(){

        var sectionCount = 0;

        var sectionId = 1;

        var sectionAndVd = 0;

        var questionCount = 0;

        var ind = 2;



        var sectionNext = null;

        var search = null;

        var answer = null;



        sectionNext = function(){
            if(sectionId <= sectionCount){
                sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                ddds3.text("\u0078\u0069\u0067\u0075\u0061\uff1a\u5171"+sectionCount+"\u8282\u002c\u5f53\u524d\u7b2c"+sectionId+"\u8282\uff0c\u89c6\u9891\u52a0\u4e60\u9898\u603b\u6570"+sectionAndVd+"\u4e2a\u3002");
                setTimeout(search,3000);
            }else{
                ddds3.text("\u5f53\u524d\u7ae0\u8282\u4e60\u9898\u5df2\u5b8c\u6210\uff0c\u7a0d\u540e\u8fdb\u5165\u4e0b\u4e00\u7ae0\u002e\u002e\u002e");
                setTimeout(function(){
                    document.getElementsByClassName("back-btn control-btn cursor return-url")[0].click();
                },1000);
            }
        }

        search = function(){
            document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[sectionAndVd-1].click();
            setTimeout(function(){
                if(document.getElementsByTagName("video")[1] == null){
                    setTimeout(function(){
                        if(document.getElementsByClassName("question-view")[0].getElementsByClassName("question-setting-item")[1] == null){
                            ddds3.text("\u5f53\u524d\u4e60\u9898\u672a\u6ee1\u5206\uff0c\u9700\u91cd\u505a\u002e\u002e\u002e");
                            ind = 1;

                            questionCount = document.getElementsByClassName("correct-answer-area").length;
                            ddds3.text("\u83b7\u53d6\u5230\u9898\u76ee\u6570\u91cf\uff0c\u5f00\u59cb\u7b54\u9898");
                            setTimeout(answer,1000);
                        }else{
                            var sor = parseInt(document.getElementsByClassName("question-view")[0].getElementsByClassName("question-setting-item")[1].innerText);
                            if(sor < 100){
                                ddds3.text("\u5f53\u524d\u4e60\u9898"+sor+"\u5206\uff0c\u9700\u91cd\u505a\u002e\u002e\u002e");
                                ind = 1;

                                questionCount = document.getElementsByClassName("correct-answer-area").length;
                                document.getElementsByClassName("btn-hollow btn-redo")[document.getElementsByClassName("btn-hollow btn-redo").length - 1].click();
                                ddds3.text("\u83b7\u53d6\u5230\u9898\u76ee\u6570\u91cf\uff0c\u5f00\u59cb\u7b54\u9898");
                                setTimeout(answer,1000);
                            }else{
                                ddds3.text("\u5f53\u524d\u4e60\u9898\u6ee1\u5206\uff0c\u65e0\u9700\u91cd\u505a\u002e\u002e\u002e");
                                ind = 2;
                                sectionId+=1;
                                setTimeout(sectionNext,1000);
                            }
                        }
                    },2000);
                }else{
                    ddds3.text("\u5f53\u524d\u5c0f\u8282\u65e0\u4e60\u9898\uff0c\u8fdb\u5165\u4e0b\u4e00\u8282");
                    ind = 2;
                    sectionId+=1;
                    setTimeout(sectionNext,1000);
                }
            },1000);
        }


        answer = function(){
            var er = false;
            ddds3.text("\u5f00\u59cb\u7b54\u9898");
            for(var i=0;i<questionCount;i++){
                var answerPrint = document.getElementsByClassName("correct-answer-area")[i].getElementsByTagName("span")[1].innerText;
                ddds3.text("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint);
                if(answerPrint.length == 1){
                    ddds3.text("\u5355\u9009\u9898");
                    switch(answerPrint)
                    {
                        case 'A':
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[0].click();
                            break;
                        case 'B':
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[1].click();
                            break;
                        case 'C':
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[2].click();
                            break;
                        case 'D':
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].click();
                            break;
                    }
                }else{
                    switch(answerPrint)
                    {
                        case '正确':
                            ddds3.text("\u5224\u65ad\u9898\uff1a\u6b63\u786e");
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn right-btn")[0].click();
                            break;
                        case '错误':
                            ddds3.text("\u5224\u65ad\u9898\uff1a\u9519\u8bef");
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn wrong-btn")[0].click();
                            break;
                        default:
                            ddds3.text("\u591a\u9009\u9898");
                            var str1 = answerPrint;
                            var array = str1.split(',');
                            var str2 = array.join('');

                            for(var j=0;j<str2.length;j++){
                                switch(str2[j])
                                {
                                    case 'A':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[0].click();
                                        ddds3.text("\u70b9\u51fb\u0041");
                                        break;
                                    case 'B':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[1].click();
                                        ddds3.text("\u70b9\u51fb\u0042");
                                        break;
                                    case 'C':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[2].click();
                                        ddds3.text("\u70b9\u51fb\u0043");
                                        break;
                                    case 'D':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].click();
                                        ddds3.text("\u70b9\u51fb\u0044");
                                        break;
                                    case 'E':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[4].click();
                                        ddds3.text("\u70b9\u51fb\u0045");
                                        break;
                                    case 'F':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[5].click();
                                        ddds3.text("\u70b9\u51fb\u0046");
                                        break;
                                    case 'G':
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[6].click();
                                        ddds3.text("\u70b9\u51fb\u0047");
                                        break;
                                    default:
                                        er = true;
                                        ddds3.text("\u5f53\u524d\u591a\u9009\u9898\u9009\u62e9\u8fc7\u591a\uff0c\u7cfb\u7edf\u9700\u66f4\u65b0\uff01");
                                }
                            }
                    }
                }
            }
            ddds3.text("\u7b54\u9898\u7ed3\u675f");
            if(er){
                ddds3.text("\u9000\u51fa");
                return;
            }

            var btn = document.getElementsByClassName("btn-submit").length-ind;
            ddds3.text("\u63d0\u4ea4");
            setTimeout(function(){
                document.getElementsByClassName("btn-submit")[btn].click();
                ddds3.text("\u63d0\u4ea4\u6210\u529f");
                sectionId+=1;
                setTimeout(sectionNext,10000);
            },1500);
        }



        var wait = setInterval(function (){
            if(document.getElementsByTagName("video")[1] == null){
                ddds3.text("\u0078\u0069\u0067\u0075\u0061\uff1a\u7b49\u5f85\u89c6\u9891\u52a0\u8f7d\uff01");
            }else{
                ddds3.text("\u0078\u0069\u0067\u0075\u0061\uff1a\u89c6\u9891\u52a0\u8f7d\u5b8c\u6210\uff01\u8fdb\u5165\u4e0b\u4e00\u6b65\u002e\u002e\u002e");

                sectionCount = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item").length;

                sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                ddds3.text("\u0078\u0069\u0067\u0075\u0061\uff1a\u9996\u6b21\u83b7\u53d6\u6570\u636e\uff0c\u5171"+sectionCount+"\u8282\u002c\u5f53\u524d\u7b2c"+sectionId+"\u8282\uff0c\u89c6\u9891\u52a0\u4e60\u9898\u603b\u6570"+sectionAndVd+"\u4e2a");
                setTimeout(search,1000);
                clearInterval(wait);
            }
        }, 5000);

    }

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49</div>');
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
        var ddds1 = $('<div style="position: absolute;top: 30%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        var ddds2 = $('<div style="position: absolute;top: 50%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u89c6\u9891\u500d\u901f\uff1a<button style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">X2</button></div>');
        ddds3 = $('<div style="position: absolute;display: grid;align-content: center;justify-content: center;top: 65%;width:90%;height:15%;padding: 3px;background: #ffffff;border-radius: 5px;">\u002d\u002d\u002d\u002d\u70b9\u51fb\u542f\u52a8\u002d\u8fd0\u884c\u811a\u672c\u002d\u002d\u002d\u002d</div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="//101.37.88.140" style="position: absolute;right: 10px;text-decoration: none;color: pink;">>>>\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        content.append(ddds1);
        content.append(ddds2);
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

        ddds1.on('click',function(){
            autoAnswer();
            ddds3.text("\u6b63\u5728\u542f\u52a8\u8bf7\u7a0d\u540e\u002e\u002e\u002e");
            $("#startxg").attr("disabled",true);
            $("#startxg").css("cursor","not-allowed");
        });

        ddds2.on('click',function(){
            ddds3.text("\u529f\u80fd\u672a\u5f00\u653e\u002e\u002e\u002e");
        });
    }

    panel();

})();