// ==UserScript==
// @name         湖南法网
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  仅凭连接访问，定制版
// @author       Xiguayaodade
// @license      MIT
// @match        *://hn.12348.gov.cn/*
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @connect      learning.mhtall.com
// @antifeature  free  限时免费
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/503736/%E6%B9%96%E5%8D%97%E6%B3%95%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/503736/%E6%B9%96%E5%8D%97%E6%B3%95%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_setValue = GM_setValue
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    unsafeWindow.GM_deleteValue = GM_deleteValue

    // 检查当前窗口是否为顶层窗口
    if (window.self !== window.top) {
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
    var studyTime = 0;
    var totalTime = 0;
    var elementsArray = 0;
    var timeStr = null;
    var search = null;
    var searchVD = null;
    var searchFC = null;
    var coursIndex = 0;
    var allCours = 0;

    var nowUrl = "";
    /**
     * 请求地址
     * @type {string}
     */
    var href = '';
    /**
     * 获取cookie
     * @returns {*}
     */
    function getCookie(){
        return document.cookie;
    }

    function saveHomeUrl(){
        let homeUrl = window.location.href;
        GM_setValue('homeUrl',homeUrl);
    }

    function getHomeUrl(){
        return GM_getValue('homeUrl');
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
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: baseline;justify-content: center;top: 20%;width:94%;height:62%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        // var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="saveExam" style="position: absolute;width:69;right: 356px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">录入</button><button id="beginExam" style="position: absolute;width:69;right: 306px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">考试</button><button id="delExam" style="position: absolute;width:69;right: 256px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">删除</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="saveExam" style="position: absolute;width:69;right: 356px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">录入</button><button id="delExam" style="position: absolute;width:69;right: 256px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">删除旧表</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');


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
            top: 69%;
            left: 66%;
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


        $("#beginExam").on('click',function(){
            ddds3.children().remove();
            let examName = $('<div id="tableForm"><div><input type="text" id="xgExamName" placeholder="请输入考试课程名称"></div><button id="xgSelect" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始</button></div>');
            examName.appendTo(ddds3);

            $("#xgSelect").on('click',function(){
                let ju = getAnswerByName();
                if(!ju){
                    return;
                }

                ddds3.children().remove();
                addMessage('开始答题：'+ju);
                document.querySelector("#insertPaper").children[1].children[0].children[2].click();
                let danxuanCount = document.querySelector("#insertPaper").children[2].childElementCount;
                nowAnswer = ju;
                completed = true;
                beginExam(danxuanCount);
            });

            pintOldData();
        });

        $('#saveExam').on('click',function(){
            ddds3.children().remove();
            let tableForm = $('<div id="tableForm"><div><input type="text" id="xgExamName" placeholder="请输入考试课程名称"></div><div><textarea type="text" id="xgAnswer" placeholder="请输入答案集"></textarea></div><button id="xgSave" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">保存</button></div>');
            tableForm.appendTo(ddds3);

            document.querySelector("#xgExamName").style.border = "1px solid #000";
            document.querySelector("#xgAnswer").style.border = "1px solid #000";
            document.querySelector("#xgExamName").value = document.getElementsByClassName('s_flzs_fbiao ContentTitle')[0].innerText;

            $("#xgSave").on('click',function(){
                let xgExamName = $("#xgExamName").val();
                let xgAnswer = $("#xgAnswer").val();
                if(xgExamName === '' || xgExamName === null || xgExamName === undefined){
                    alert("考试课程不可为空!");
                }
                else if(xgAnswer === '' || xgAnswer === null || xgAnswer === undefined){
                    alert("答案集不可为空!");
                }
                else{
                    console.log(xgAnswer);
                    let aw = xgAnswer.split(',');
                    saveAnswer(xgExamName,aw);
                    ddds3.children().remove();
                    addMessage('保存成功：（'+JSON.stringify(aw)+'）');
                    let ct = document.getElementsByClassName('node_name').length;
                    setTimeout(function(){
                        beginExam(ct);
                    },1000);
                }
            });

            pintOldData();
        });

        $("#delExam").on('click',function(){
            ddds3.children().remove();
            GM_deleteValue('accuntData');
            GM_deleteValue('accuntDataExam');
            addMessage("旧表已删除，请重新导入");
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
            container.css({ width: 422 });
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
            var messageElement = $('<div class="messagexg"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    var answer_key;

    function shouJi(){
        if(radioIndex < quesionCount){
            ksPage = document.querySelector("body > div.paper_body");

            //获取当前题目
            answer_key = ksPage.getElementsByClassName('item_li')[radioIndex].children[0].innerText.split('、')[1];
            //获取当前题目选项总数
            opCount = ksPage.getElementsByClassName('item_li')[radioIndex].children[1].childElementCount;
            console.log(quesionCount,radioIndex,opCount,answer_key);

            //获取答案
            nowXuanSJ(0,opCount);

        }else{
            addMessage("搜集完毕");
            toggleOverlay(false);
            // let as = getAnswer();
            // console.log(as);
            radioIndex = 0;
        }
    }

    panel();
    if(!GM_getValue('aotuTest')){
         GM_setValue('aotuTest',false);
    }else{
        $("#btnAotu").text("自动答题：开启");
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

    var wait = null;
    var overlay;

    // 手动启动定时器
    function startTimer() {
        wait = setInterval(function (){
            ddds3.children().first().remove();
            if(window.location.href.split('?')[0] === 'http://hn.12348.gov.cn/fxmain/subpage/legalpublicity/fx_regulations.html'){
                addMessage("学习页");

                tipsWin().then((result) => {
                    if(!result){
                        ddds3.children().remove();
                        addMessage("开始学习答题");
                        let ct = document.getElementsByClassName('node_name').length;
                        setTimeout(function(){
                            beginExam(ct);
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }else if(window.location.href.split('?')[0] === 'http://hn.12348.gov.cn/ucenter/#/login'){


                importAccunt(1);

                let acData = getAccuntData();
                if(acData.length > 0){
                    addMessage("当前："+acData[0][0]+"-"+acData[0][1]);
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[0].value = acData[0][0];
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[0].dispatchEvent(new Event('input'))
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[1].value = acData[0][1];
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[1].dispatchEvent(new Event('input'))

                    // document.querySelector("#app > div > div.login-center.el-row > div.el-col.el-col-8.el-col-offset-2 > div > form > div:nth-child(5) > div > button").addEventListener('click',function() {
                    //     acData.shift();
                    //     updateAccuntData(acData);
                    // });
                }
                else{
                    addMessage("没有账号数据，请点击左上角选择表格导入");
                }
            }else if(window.location.href.split('?')[0] === 'http://hn.12348.gov.cn/#/' || window.location.href.split('?')[0] === 'http://hn.12348.gov.cn/fxmain/study'){
                ddds3.children().remove();
                $.ajax({
                    type : 'get',
                    url : 'http://hn.12348.gov.cn/fxmain/legalpublicity/rule',
                    dataType : 'json',
                    contentType : "application/json; charset=utf-8",
                    timeout: 8000,
                    success : function(answerResult) {
                        let acData = getAccuntData();

                        addMessage("选修已获得"+answerResult.lpPersonScore.score+"分。");
                        addMessage("必修已获得"+answerResult.lpPersonScore.pubZsScore+"分。");
                        let nickName = JSON.parse(sessionStorage.getItem('userInfo')).nickName+'';
                        let mobile = JSON.parse(sessionStorage.getItem('userInfo')).mobile+'';
                        let ad = acData[0][0]+'';
                        if(nickName === ad || mobile === ad){
                            acData.shift();
                            updateAccuntData(acData);
                            addMessage("updateAccountData！");
                        }else{
                            addMessage("AccountData！");
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if (textStatus === "timeout") {
                            addMessage("请求超时，3秒后自动重发！"); // 超时提示
                        } else {
                            addMessage("请求失败：" + textStatus+"3秒后将自动重新建立连接"); // 其他错误提示
                        }

                    }
                });
            }else if(window.location.href.split('?')[0] === 'http://hn.12348.gov.cn/rufawebsite/examination/content/navigate' || window.location.href.split('?')[0] === 'http://hn.12348.gov.cn/rufawebsite/examination/content/goexam'){
                ddds3.children().remove();
                importAccunt(2);

                let acDataExam = getAccuntDataExam();
                if(acDataExam.length > 0){
                    addMessage("当前："+acDataExam[0][0]+"-"+acDataExam[0][1]);
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[0].value = acDataExam[0][0];
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[0].dispatchEvent(new Event('input'))
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[1].value = acDataExam[0][1];
                    document.getElementsByTagName('form')[0].getElementsByTagName('input')[1].dispatchEvent(new Event('input'))

                    document.querySelector("#myform > ul > li:nth-child(5) > a").addEventListener('click',function() {
                        acDataExam.shift();
                        updateAccuntDataExam(acDataExam);
                    });
                }
                else{
                    addMessage("没有考试账号数据，请点击左上角选择表格导入");
                }
            }else{
                addMessage("请选择要学习的版块");
            }
            clearInterval(wait);
        }, 100);
    }

    function importAccunt(index){
        // 添加一个文件输入框
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        document.body.appendChild(input);

        input.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // 获取第一个表的名称
                const worksheet = workbook.Sheets[sheetName]; // 获取第一个表的内容

                // 将工作表转换为 JSON 格式
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const filteredData = jsonData.filter(row => row.some(cell => cell !== undefined));
                console.log(filteredData); // 在控制台打印数据

                // console.log(JSON.stringify(filteredData));
                // 处理 jsonData保存
                if(index === 1){
                    saveAccuntData(filteredData);
                }
                if(index === 2){
                    saveAccuntDataExam(filteredData);
                }

                window.location.reload();
            };
            reader.readAsArrayBuffer(file);
        });

        // 添加样式（可选）
        GM_addStyle(`
        input[type="file"] {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999; /* 确保文件输入框位于其他元素之上 */
        }
        `);
    }

    function getAccuntDataExam(){
        let oldData = GM_getValue('accuntDataExam');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveAccuntDataExam(data){
        let accuntDataExam = getAccuntDataExam();

        if(accuntDataExam.length < 1){
            addMessage('首次保存考试账号纪录完成,请刷新');
            GM_setValue('accuntDataExam',data);
            return;
        }

        let juge;

        for(let i=0;i<data.length;i++){

            juge = accuntDataExam.some(obj => obj[0] === data[i][0]);

            if (juge) {
                addMessage(data[i].courseCode,"已存在");
                continue;
            }

            addMessage('新纪录，保存！',data[i][0]);
            accuntDataExam.push(data[i]);

            GM_setValue('accuntDataExam',accuntDataExam);
        }

    }

    function updateAccuntDataExam(data){
        GM_setValue('accuntDataExam',data);
    }

    function getAccuntData(){
        let oldData = GM_getValue('accuntData');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveAccuntData(data){
        let accuntData = getAccuntData();

        if(accuntData.length < 1){
            addMessage('首次保存账号纪录完成,请刷新');
            GM_setValue('accuntData',data);
            return;
        }

        let juge;

        for(let i=0;i<data.length;i++){

            juge = accuntData.some(obj => obj[0] === data[i][0]);

            if (juge) {
                addMessage(data[i].courseCode,"已存在");
                continue;
            }

            addMessage('新纪录，保存！',data[i][0]);
            accuntData.push(data[i]);

            GM_setValue('accuntData',accuntData);
        }

    }

    function updateAccuntData(data){
        GM_setValue('accuntData',data);
    }

    function getCourseData(){
        let oldData = GM_getValue('courseData');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveCourseData(data){
        let courseData = getCourseData();

        if(courseData.length < 1){
            console.log('无纪录，保存！');
            GM_setValue('courseData',data);
            return;
        }

        let juge;

        for(let i=0;i<data.length;i++){

            juge = courseData.some(obj => obj.courseCode === data[i].courseCode);

            if (juge) {
                console.log(data[i].courseCode,"已存在");
                continue;
            }

            console.log('新纪录，保存！',data[i].courseCode);
            courseData.push(data[i]);

            GM_setValue('courseData',courseData);
        }

    }

    // 手动停止定时器
    function stopTimer() {
        clearInterval(wait);
    }

    startTimer();

    function toggleOverlay(show) {
        if (show) {
            overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';

            overlay.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
            });

            document.body.appendChild(overlay);
        } else {
            if (overlay) {
                overlay.parentNode.removeChild(overlay);
                overlay = null;
            }
        }
    }

    function reloadPage(){
        setInterval(function (){
            window.location.reload()
        },1000*60*33);
    }

    function pintOldData(){
        addMessage('保存记录：');
        getAnswer().forEach(obj => {
            for (let key in obj) {
                addMessage(key);
            }
        });
    }

    function getAnswerByName(){
        let xgExamName = document.getElementsByClassName('s_flzs_fbiao ContentTitle')[0].innerText;

        if(xgExamName === '' || xgExamName === null || xgExamName === undefined){
            alert("考试课程不可为空!");
            return false;
        }

        let data = getAnswer();

        let result = data.reduce((accumulator,obj) => {
            if(xgExamName in obj){
                return obj[xgExamName];
            }
            return accumulator;
        },undefined);

        if(!result){
            addMessage('没有此考试数据！');
            return false;
        }
        return result;
    }

    function getAnswer(){
        let oldData = GM_getValue('answerList');

        if(Array.isArray(oldData)){
            return oldData;
        }

        return [];
    }

    function saveAnswer(name,content){
        let answer = getAnswer();

        let existIndex = answer.findIndex(obj => name in obj);

        if (existIndex !== -1) {
            // 更新值为['1','2','3']
            answer[existIndex][name] = content;
        } else {
            // push新集合
            let tempMap = {};
            tempMap[name] = content;
            answer.push(tempMap);
        }

        GM_setValue('answerList',answer);
    }

    function judgeOk(){

    }

    var nowAnswer = null;
    var questionIndex = 0;
    var answerIndex = 0;
    var completed = true;
    function beginExam(count){
        if(questionIndex < count){
            //判定当前页答题卡
            if(!judgeAnswerPage()){
                questionIndex++;
                document.getElementsByClassName('next')[0].click();
                setTimeout(function(){
                    beginExam(count);
                },800);
                return;
            }

            nowAnswer = getAnswerByName();
            if(!nowAnswer){
                setTimeout(function(){
                    document.querySelector("#saveExam").click();
                },200);
                return;
            }

            completed = true;
            answerPost(nowAnswer,count);
            // inputRadio(0,nowAnswer[answerIndex],count,2);
        }
        else{
            addMessage('学习结束');
        }
    }

    function judgeAnswerPage(){
        if(document.querySelector("#question").childElementCount > 0){
            return true;
        }else{
            return false;
        }
    }

    function inputRadio(index,answer,count,page){
        let tempAW = answer;
        let tempCount = count;
        let tempPage = page;
        console.log(index,answer,count,page);
        addMessage(index+","+answer+","+count+","+page);
        if(index < tempAW.length){
            switch(answer[index])
            {
                case 'A':
                    console.log("第"+(answerIndex+1)+"题选","A");
                    radioOk(0,answerIndex);
                    break;
                case 'B':
                    console.log("第"+(answerIndex+1)+"题选","B");
                    radioOk(1,answerIndex);
                    break;
                case 'C':
                    console.log("第"+(answerIndex+1)+"题选","C");
                    radioOk(2,answerIndex);
                    break;
                case 'D':
                    console.log("第"+(answerIndex+1)+"题选","D");
                    radioOk(3,answerIndex);
                    break;
                case 'E':
                    console.log("第"+(answerIndex+1)+"题选","E");
                    radioOk(4,answerIndex);
                    break;
                case '√':
                    console.log("第"+(answerIndex+1)+"题选","是");
                    radioOk(0,answerIndex);
                    break;
                case '×':
                    console.log("第"+(answerIndex+1)+"题选","否");
                    radioOk(1,answerIndex);
                    break;
            }

            setTimeout(function(){
                inputRadio(++index,tempAW,tempCount,tempPage)
            },300);
        }else{
            console.log("第"+(answerIndex+1)+"题结束");
            answerIndex++;
            setTimeout(function(){

                if(answerIndex >= nowAnswer.length){
                    questionIndex++;
                    answerIndex = 0;

                    addMessage("开始第"+questionIndex+"节");
                    setTimeout(function(){
                        answerPost();
                        setTimeout(function(){
                            document.getElementsByClassName('next')[0].click();
                            setTimeout(function(){
                                beginExam(count);
                            },1000);
                        },1000);
                    },100)
                }
                else{
                    inputRadio(0,nowAnswer[answerIndex],count,2);
                }
            },333);
        }
    }

    function radioOk(index1,index2){
        if(!document.querySelector("#question").getElementsByClassName('neiinput')[index2].getElementsByTagName('input')[index1].checked){
            document.querySelector("#question").getElementsByClassName('neiinput')[index2].getElementsByTagName('input')[index1].click();
        }
        else{
            console.log('无需重复选择');
        }
    }

    function answerPost(answerList,count){
        var answerDTOList = [];
        var $span = $("form.questions").find("span");
        for (var i = 0; i < $span.length;i++) {
            var answer = {};
            answer.questionId = $($span[i]).attr("qid");
            answer.contentId = objId.split('objId=')[1];
            answer.contentType = $(".ctype").val();
            answer.flag = $($span[i]).attr("flag");
            answer.chapterId = $(".chaptId").val();
            if (answer.flag == 2) {
                var v = [];
                // var $select = $("input:checkbox[name='"+answer.questionId+"']:checked");
                var select = answerList[i];
                for (var j = 0; j < select.length;j++) {
                    v.push(select[j]);
                }

                answer.answerResult=v.join(",");
                console.log(v,answer.answerResult);
            }else{
                answer.answerResult = answerList[i];
            }
            if (!answer.answerResult) {
                $("#answer"+answer.questionId).val("请选择");
                $("#answer"+answer.questionId).addClass("answerfalse");
            }
            if( answer.answerResult){
                answerDTOList.push(answer);
            }
        }

        $.ajax({
            type : 'post',
            async : true,
            url : '/fxmain/onlineanswer/ex',
            data : JSON.stringify(answerDTOList),
            dataType : 'json',
            contentType : "application/json; charset=utf-8",
            timeout: 8000,
            success : function(answerResult) {
                if(answerResult.extend.result.code == "500") {
                    alert("答题异常，请不要采取非法答题！");
                    return;
                }else{
                    var flag = false;

                    for (var res in answerResult.extend.result) {
                        var c = answerResult.extend.result[res];
                        if (c == "0") {
                            $("#answer"+res).val("回答错误");
                            $("#answer"+res).addClass("answerfalse");
                            flag = true;
                            addMessage('此题答案有误，请重新录入');
                            completed = false;
                            document.querySelector("#saveExam").click();
                            setTimeout(function(){
                                document.querySelector("#xgAnswer").placeholder = '此题答案有误，请重新录入';
                            },300);
                            break;
                        }
                        if (c == "1") {
                            $("#answer"+res).val("回答正确");
                            $("#answer"+res).addClass("answertrue").removeClass("answerfalse").removeClass("answerxz");
                            $("#answer"+res).prop("disabled",true);
                            $('input[name="'+res+'"]').each(function(){
                                $(this).prop("disabled",true);
                            });
                        }
                    }

                    if(completed){
                        questionIndex++;
                        let cName = document.getElementsByClassName('s_flzs_fbiao ContentTitle')[0].innerText;
                        addMessage('--正确--'+cName);
                        document.getElementsByClassName('next')[0].click();
                        setTimeout(function(){
                            beginExam(count);
                        },500);
                    }

                    if (flag) {
                        $(".tijiao").attr("onclick","");
                        $(".tijiao").text("答题错误，请仔细阅读再答(9999秒)");
                        $(".tijiao").attr("onclick","answer();");
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (textStatus === "timeout") {
                    addMessage("请求超时，3秒后自动重发！"); // 超时提示
                    setTimeout(function(){
                        beginExam(count);
                    },3000);
                } else {
                    addMessage("请求失败：" + textStatus+"3秒后将自动重新建立连接"); // 其他错误提示
                    setTimeout(function(){
                        beginExam(count);
                    },3000);
                }

            }
        });
    }

})();