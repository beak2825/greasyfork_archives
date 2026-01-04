// ==UserScript==
// @name         gjdtwlxy
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://e-learning.spicti.com/*
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
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @antifeature  free  限时免费
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    // 检查当前窗口是否为顶层窗口
    if (window.self != window.top) {
        return; // 如果不是顶层窗口，则不执行脚本
    }

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
    var search = null;
    var searchVD = null;
    var searchFC = null;
    let uL = null;
    var courseCount = 0;
    var courseIndex = 0;

    function savePID(pid){
        GM_setValue('pageID',pid);
    }

    function getPID(){
        let oldPage = GM_getValue('pageID');

        if(!oldPage){
            savePID(21);
            return 21;
        }

        return oldPage;
    }

    function saveTable(table){
        GM_setValue('table',table);
    }

    function getTable(){
        let oldTable = GM_getValue('table');

        if(!oldTable){
            saveTable('全部');
            return '全部';
        }

        return oldTable;
    }

    function saveTablePID(table,tablePid){
        GM_setValue(table,tablePid);
    }

    function getTablePID(table){
        let oldTablePage = GM_getValue(table);

        if(!oldTablePage){
            saveTablePID(table,1);
            return 1;
        }

        return oldTablePage;
    }

    search = function(){
        if(chapterId <= chapterCount){
            if(sectionId <= sectionCount){
                addMessage("\u5171"+chapterCount+"\u7ae0\uff0c\u5f53\u524d\u7b2c"+chapterId+"\u7ae0\u7b2c"+sectionId+"\u8282\uff0c\u5171"+sectionCount+"\u8282\u3002");
                var xxjd = document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover")[sectionId-1].getElementsByClassName("iconfont m-right")[1].innerText;
                if(xxjd === '重新学习'){
                    addMessage("\u7b2c"+chapterId+"\u7ae0\u7b2c"+sectionId+"\u8282\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u8282\u3002");
                    sectionId++;
                    search();
                }else{
                    addMessage("\u7b2c"+chapterId+"\u7ae0\u7b2c"+sectionId+"\u8282\u672a\u5b8c\u6210\uff0c\u5373\u5c06\u8fdb\u5165\u5b66\u4e60\u3002");
                    setTimeout(function(){
                        document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover")[sectionId-1].getElementsByClassName("iconfont m-right")[1].click();
                    },1000);
                }
            }else{
                addMessage("\u5f53\u524d\u7ae0\u8282\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u7ae0\u3002");
                sectionId = 1;
                chapterId++;
                if(chapterId <= chapterCount){
                    sectionCount = document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover").length;
                }
                search();
            }
        }else{
            addMessage("\u5b66\u4e60\u5b8c\u6210\uff0c\u9000\u51fa\uff01");
        }
    }

    searchVD = function(){
        // let xxzt = document.getElementsByClassName("section-item section-item11")[0].getElementsByTagName("span")[1].innerText;

        if(document.getElementsByTagName('video')[0].paused){
            let btnCloseNext = null;
            if(document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div.top.new-course-top > div > div.player-wrapper.new-play-wrapper.play-area-padding.player-section-video > div > div.player-content.relative.new-play-content.new-play-content-warp > div:nth-child(5) > div") != null){
                btnCloseNext = document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div.top.new-course-top > div > div.player-wrapper.new-play-wrapper.play-area-padding.player-section-video > div > div.player-content.relative.new-play-content.new-play-content-warp > div:nth-child(5) > div");

                if(btnCloseNext != null && btnCloseNext.children[1].children[1].innerText === '关闭'){
                    addMessage("本章结束，5S后自动返回首页");
                    setTimeout(function(){
                        window.open('https://e-learning.spicti.com/#/study/course/index','_self');
                        setTimeout(function(){
                            window.location.reload();
                            clearInterval(searchFC);
                        },3000);
                    },5000);
                }
                else if(btnCloseNext != null && btnCloseNext.children[1].children[1].innerText.slice(-3) === '下一节'){
                    addMessage("小节结束");
                }
                else{
                    addMessage("暂停了，我帮你自动播放咯");
                    document.getElementsByTagName('video')[0].play();
                }
            }else{
                addMessage("本章结束，5S后自动返回首页");
                setTimeout(function(){
                    window.open('https://e-learning.spicti.com/#/study/course/index','_self');
                    setTimeout(function(){
                        window.location.reload();
                        clearInterval(searchFC);
                    },3000);
                },5000);
            }

        }else{
            addMessage("\u5f53\u524d\u89c6\u9891\u6b63\u5728\u5b66\u4e60\u4e2d\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u002e\u002e\u002e");
        }
    }

    function tipsWin(){
        return new Promise((resolve, reject) => {

            var popup = document.createElement('div');
            popup.id = 'customPopup';
            popup.style.display = 'none';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#fff';
            popup.style.padding = '20px';
            popup.style.border = '1px solid #ccc';
            popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            popup.style.zIndex = '9999';
            popup.innerHTML = `
        <p id="timeCount">5秒后执行脚本?</p>
        <button id="confirmButton">是</button>
        <button id="cancelButton">否</button>
       `;

            document.body.appendChild(popup);

            var confirmButton = document.getElementById('confirmButton');
            var cancelButton = document.getElementById('cancelButton');
            var confirmed = false;
            let juNext = false;

            popup.style.display = 'block';

            confirmButton.addEventListener('click', function() {
                confirmed = true;
                closePopup();
                resolve(false);
            });

            cancelButton.addEventListener('click', function() {
                ddds3.children().remove();
                addMessage("刷新页面即可重启");
                confirmed = true;
                closePopup();
                resolve(true);
            });

            function ju(time){
                if(!confirmed){
                    if(time < 1){
                        popup.innerHTML = ` <p>时间到了! 脚本启动.</p>`;
                        setTimeout(function() {
                            closePopup();
                            resolve(false);
                            // setTimeout(function(){
                            //     // 手动启动定时器
                            //     startTimer();
                            //     window.open("https://jlufe.mhtall.com/jlufe/rs/roll_course");"_self"
                            //     window.close();
                            // },1000);
                        }, 1000);
                    }
                    document.getElementById('timeCount').innerText = time+'秒后执行脚本?'
                    setTimeout(function(){
                        ju(--time)
                    },1000);

                }
            }

            ju(5);

            function closePopup() {
                popup.style.display = 'none';
            }
        });

    }

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49课时工具\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c').css({
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
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:62%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\</a></div>');

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
            if (ddds3.children().length >= 288) {
                ddds3.children().first().remove();
            }
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");

    var wait;

    // 手动启动定时器
    function startTimer() {
        wait = setInterval(function (){
            ddds3.children().remove();
            if(window.location.href === "https://e-learning.spicti.com/#/home"){
                addMessage("\u5f53\u524d\u5904\u4e8e\u9996\u9875\uff0c\u8bf7\u8fdb\u5165\u5bf9\u5e94\u8bfe\u7a0b\u5c06\u81ea\u52a8\u64ad\u653e");
            }else if(window.location.href.substring(0,42) === "https://e-learning.spicti.com/oauth/#login"){
                addMessage("登录页");
                clearInterval(wait);
            }else if(window.location.href === "https://e-learning.spicti.com/#/study/course/index"){
                clearInterval(wait);
                tipsWin().then((result) => {
                    if(!result){
                        addMessage("课程页，无需操作，将自动播放");
                        clearInterval(wait);
                        if(document.querySelector("#D203registerMask") != null){
                            document.querySelector("#D203registerMask").click();
                        }

                        setTimeout(function(){
                            let oldTable = getTable();
                            if(oldTable === '全部'){
                                let oldPID = getPID();
                                selectPage(oldPID);
                            }else{
                                addMessage(oldTable+"!=全部:"+(oldTable != '全部'));
                                document.querySelector("#D164more-btn-2").click();
                                setTimeout(function(){
                                    let tatleCount = document.querySelector("#D164topic-box").childElementCount;
                                    for(let i=0;i<tatleCount; i++){
                                        let forTatle = document.querySelector("#D164topic-box").children[i].innerText;
                                        if(oldTable === forTatle){
                                            document.querySelector("#D164topic-box").children[i].click();
                                            setTimeout(function(){
                                                let oldPID = getTablePID(oldTable);
                                                try{
                                                    selectPage(oldPID);
                                                }catch(e){
                                                    addMessage("标签："+oldTable+"，没有课程请重新设置");
                                                }
                                            },800);
                                            return;
                                        }else if(i == (tatleCount-1)){
                                            addMessage("没有标签："+oldTable+"，请重新设置");
                                        }
                                    }
                                },800);
                            }

                            clearInterval(wait);
                        },2000);
                    }else{
                        addMessage("取消");
                        inputTable();
                    }
                });

            }else if(window.location.href === "https://e-learning.spicti.com/#/study/subject/index"){
                addMessage("\u5f53\u524d\u5904\u4e8e\u4e13\u9898\u9875\u8bf7\u9009\u62e9\u5bf9\u5e94\u8bfe\u7a0b\uff0c\u5c06\u81ea\u52a8\u64ad\u653e");
            }else if(window.location.href.substring(0,53) === "https://e-learning.spicti.com/#/study/subject/detail/"){
                addMessage("\u5f53\u524d\u5904\u4e8e\u8bfe\u7a0b\u7ae0\u8282\u9875\u65e0\u9700\u64cd\u4f5c\uff0c\u5c06\u81ea\u52a8\u64ad\u653e");
                chapterCount = document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li").length;
                sectionCount = document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover").length;
                setTimeout(search,1000);
                clearInterval(wait);
            }else if(window.location.href.substring(0,52) === "https://e-learning.spicti.com/#/study/course/detail/"){
                addMessage("当前处于课程视频页无需操作，将自动播放");

                if(document.querySelector("#D203registerMask") != null){
                    document.querySelector("#D203registerMask").click();
                }

                setTimeout(function(){
                    document.getElementsByTagName('video')[0].play();
                },2000);


                searchFC = setInterval(searchVD,8000);
                clearInterval(wait);
            }
        }, 2000)
    }



    function inputTable(){
            ddds3.children().remove();
            let tableForm = $('<div id="tableForm"><div><input type="text" id="xgtable" placeholder="请输入下次要学习的标签"></div><button id="xgsave" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">保存</button></div>');
            tableForm.appendTo(ddds3);
            $("#xgsave").on('click',function(){
                let table = $("#xgtable").val();
                if(table === '' || table === null){
                    alert("标签名为空!");
                }
                else{
                    console.log(table);
                    GM_setValue('table',table);
                    alert('保存成功：（'+GM_getValue('table')+'），刷新页面即可自启动');
                }
            });
        }

    // 手动停止定时器
    function stopTimer() {
        clearInterval(wait);
    }

    startTimer();

    function selectPage(oldPID){
        let nowPID = getNowPid();
        if(nowPID < oldPID){
            console.log('nowPID',nowPID);
            let btnCount = document.querySelector("#D162pager").childElementCount;
            document.querySelector("#D162pager > div:nth-child("+btnCount+") > i").click();
            setTimeout(function(){
                selectPage(oldPID)
            },800);
        }
        else{
            console.log('nowPID',nowPID,'oldPID',oldPID);
            setTimeout(function(){
                setTimeout(function(){
                    uL = document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div > div.page-main-one > div > div.main-list.course-list > ul");
                    courseCount = uL.childElementCount;
                    courseIndex = 0;
                    setTimeout(function(){
                        selectStudying();
                        clearInterval(wait);
                    },2000);
                },1000);
            },2000);
        }
    }

    function getNowPid(){
        let nowPIDSTR = document.querySelector("#D162pager").getElementsByClassName('item active')[0].dataset.page
        let nowPID = parseInt(nowPIDSTR);
        return nowPID;
    }

    function selectStudying(){
        if(courseIndex < courseCount){

            let uL = document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div > div.page-main-one > div > div.main-list.course-list > ul");
            let a = uL.children[courseIndex].children[0].children[0].children[0].childElementCount;
            let title = uL.children[courseIndex].children[0].children[1].getElementsByClassName('text-overflow title')[0].innerText;
            let b = document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div > div.page-main-one > div > div.main-list.course-list > ul").children[courseIndex].children[0].children[1].children[1].title.split('|')[0].split('：')[1];

            if(!isNaN(parseInt(b))){

                if(a != 1){
                    let status = uL.children[courseIndex].children[0].children[0].innerText;
                    addMessage(status+"status");
                    if(status === '已完成'){
                        addMessage(title+"|已完成");
                        courseIndex++;
                        setTimeout(function(){
                            selectStudying();
                        },200);
                    }
                    if(status === '学习中'){
//                         addMessage(title+"|未完成");
//                         let imSrc = uL.children[2].children[0].children[0].children[0].children[0].style.backgroundImage;
//                         if(imSrc != 'url("images/default-cover/default_course.jpg")'){
//                             if(getTable() === '全部'){
//                                 savePID(getNowPid());
//                             }else{
//                                 saveTablePID(getTable(),getNowPid())
//                             }
                            
//                             uL.children[courseIndex].children[0].children[1].children[0].children[0].click();
//                             setTimeout(function(){
//                                 window.close();
//                             },3000);
//                         }else{
//                             addMessage(title+"|PPT，无需学习");
//                             courseIndex++;
//                             setTimeout(function(){
//                                 selectStudying();
//                             },200);
//                         }
                        addMessage(title+"|学习过，无需学习");
                        courseIndex++;
                        setTimeout(function(){
                            selectStudying();
                        },200);
                    }
                }else{
                    addMessage(title+"|开始学习");
                    let imSrc = uL.children[2].children[0].children[0].children[0].children[0].style.backgroundImage;
                    if(imSrc != 'url("images/default-cover/default_course.jpg")'){

                        if(getTable() === '全部'){
                            savePID(getNowPid());
                        }else{
                            saveTablePID(getTable(),getNowPid())
                        }

                        uL.children[courseIndex].children[0].children[1].children[0].children[0].click();
                        setTimeout(function(){
                            window.close();
                        },3000);
                    }else{
                        addMessage(title+"|PPT，无需学习");
                        courseIndex++;
                        setTimeout(function(){
                            selectStudying();
                        },200);
                    }
                }
            }
            else{
                addMessage(title+"|无学分，无需学习");
                courseIndex++;
                setTimeout(function(){
                    selectStudying();
                },200);
            }
        }
        else{
            addMessage("|一页结束");
            let btnCount = document.querySelector("#D162pager").childElementCount;
            document.querySelector("#D162pager > div:nth-child("+btnCount+") > i").click();
            // uL = document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div > div.page-main-one > div > div.main-list.course-list > ul");
            courseCount = uL.childElementCount;
            courseIndex = 0;
            setTimeout(function(){
                selectStudying();
            },5000);
        }
    }

})();