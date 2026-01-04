// ==UserScript==
// @name         摸鱼神器网页版(Thief book in browser)
// @namespace    https://github.com/rainow/Thief-book-in-Browser
// @version      0.4.3
// @description  浏览器版Thief-Book摸鱼神器，可以在网页里面隐蔽地看书（在状态栏看书）, fork自https://github.com/chocovon/thiefbook-js。修复部分Bug，增加了自动滚屏（支持键盘操作），查找文字（不然定位到手机上的进度太难了），自动保存阅读进度和上次的设置，文件编码切换。Slacking off in browser, reading novels in status bar, support auto scrolling, searching text, auto saving current position.
// @author       rainow@gmail.com
// @license      MIT
// @home-url        https://greasyfork.org/zh-CN/scripts/479230
// @home-url2       https://github.com/rainow/Thief-book-in-Browser
// @homepageURL     https://greasyfork.org/zh-CN/scripts/479230
// @lastmodified    2024-05-20
// @match        http*://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/479230/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88%28Thief%20book%20in%20browser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479230/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88%28Thief%20book%20in%20browser%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
        let text = '按，。键翻页\nF1键退出/恢复显示\n回车开关自动滚屏\nGood Luck!'
        let lines = [];
        let lineLength = 20;
        let pointer = 0;
        let keyNextLine = 'Period';
        let keyPreLine = 'Comma';
        let keyHide = 'F1';//'Minus'; 减号在网页中还是要经常使用的，换F1键控制开关
        let keyTimer = 'Enter';//定时滚屏还是需要的，加个快捷键
        let hide = true;//tampermonkey插件版不默认显示界面，否则有可能会议投屏时候打开新页面社死
        let progress = 0;
        let timer = null;
        let timerInterval = 3000;
        let timerFlasher = null;
        let timerFlasherCount = 8;
        let posBeforeSearch = 0;
        let bookmode = false;
        let showMouseShortcuts = true;
        let fileCoder = GM_getValue("thief-book-encoder","utf-8"); // 默认以utf-8格式打开，会记住最后一次切换的格式

        var newStyle = document.createElement("style");
        newStyle.innerHTML =
            '        :root {' +
            '            --thief-book-font-size: 11px;' +
            '        }' +
            '        .thief-book-line-box {\n' +
            '            position: fixed;\n' +
            '            left: 0;\n' +
            '            bottom: 0px;\n' +
            '        }\n' +
            '        .thief-book-line {\n' +
            '            font-size: var(--thief-book-font-size);\n' +
            '            text-align:left;\n' +
            '            background-color: rgb(222,225,230);\n' +
            '            height: 23px;\n' +
            '            line-height: 23px;\n' +
            '            border-radius: 4px;\n' +
            '            padding-left: 5px;\n' +
            '            padding-right: 5px;\n' +
            '        }\n' +
            '        .thief-book-mouse-area {\n' +
            '            position: fixed;\n' +
            '            left: 0;\n' +
            '            bottom: 0;\n' +
            '            z-index: 99999;\n' +
            '            height: 70px;\n' +
            '            width:500px;\n' +
            '            margin: 1px;\n' +
            '        }\n' +
            '        .thief-book-mouse-area:hover .thief-book-settings-area {\n' +
            '            opacity: 1 !important;\n' +
            '        }\n' +
            '        .thief-book-settings-area {\n' +
            '            position: fixed;\n' +
            '            left: 60px;\n' +
            '            bottom: 30px;\n' +
            '            display: flex;\n' +
            '            transition: 0.3s;\n' +
            '        }\n' +
            '        .thief-book-semi-hide {\n' +
            '            opacity: 0;\n' +
            '        }\n' +
            '        .thief-book-icon {\n' +
            '            cursor: default;\n' +
            '            font-size: 30px; width:30px; height:30px;\n' +
            '            transition: 0.3s;\n' +
            '        }\n' +
            '        .thief-book-slider {\n' +
            '            height: 13px;\n' +
            '            width: 100px;\n' +
            '            margin-top: 12px;\n'+
            '        }\n' +
            '        #thief-book-searchbox{\n' +
            '           border: 1px solid black;\n' +
            '           display: none;\n'+
            '           width: 300px;\n' +
            '           height: 150px;\n' +
            '           position: absolute;\n' +
            '           margin:auto;\n' +
            '           top: 0px;left: 0px;bottom: 0px;right: 0px;\n' +
            '           background-color: #eee;\n' +
            '           font-size: 15px;\n' +
            '           z-index: 999;\n' +
            '       }\n' +
            '       #thief-book-searchbox-title{\n' +
            '           width: 100%;\n' +
            '           height: 20px;\n' +
            '           margin: 0px;\n' +
            '           top: 0px;left: 0px;\n' +
            '           background-color: #666;\n' +
            '       }\n' +
            '       .thief-book-search-lines{\n' +
            '           margin:10px;\n' +
            '           display: flex;\n' +
            '           justify-content: space-between;\n' +
            '       }\n' +
            '       .thief-book-search-buttons{\n' +
            '           margin:2px;\n' +
            '           border: 1px solid black;\n' +
            '           height:20px;\n' +
            '           width: 80px;\n' +
            '           background-color: #ccc;\n' +
            '           text-align: center;\n' +
            '           font-size: 12px;\n' +
            '           cursor: pointer;\n' +
            '       }\n' +
            '       #thief-book-changecoder{\n' +
            '           border: 1px solid black;\n' +
            '           height:15px;\n' +
            '           width: 50px;\n' +
            '           background-color: #ccc;\n' +
            '           text-align: center;\n' +
            '           font-size: 10px;\n' +
            '           cursor: pointer;\n' +
            '       }\n' +
            '       #thief-book-currentcoder{\n' +
            '           top: 20px;\n' +
            '           height:15px;\n' +
            '           width: 50px;\n' +
            '           background-color: #eee;\n' +
            '           text-align: center;\n' +
            '           font-size: 10px;\n' +
            '       }\n' +
            '       #thief-book-mouseShortcuts{\
                        position: absolute;\
                        border: 1px dotted black;\
                        top: 500px;\
                        left: 10px;\
                        height:22px;\
                        width:100px;\
                        display: flex;\
                        justify-content: space-between;\
                        margin: auto;\
                        z-index:999;\
                    }\
                    .thief-book-floatIcon{\
                        position: relative;\
                        border: 1px solid black;\
                        height:16px;\
                        width:16px;\
                        margin: auto;\
                        font-size: 10px;\
                        text-align: center;\
                    }\n';
        document.head.appendChild(newStyle);

        var newDiv = document.createElement("div");
        newDiv.id = "thief-book-div";
        newDiv.class = "thief-book-div";
        newDiv.innerHTML =
            '<div id="thief-book-leftCorner" class="thief-book-mouse-area">\n' +
            '    <div id="thief-book-settings" class="thief-book-settings-area">\n' +
            '        <div><div id="thief-book-currentcoder" title="当前编码格式">utf-8</div><div id="thief-book-changecoder" title="点击按钮切换编码格式">乱码点我</div></div>\n' +
            '        <label class="thief-book-icon">&#128193;\n' +
            '            <input type="file" id="thief-book-selectFile" style="display:none">\n' +
            '        </label>\n' +
            '        <label>\n' +
            '            <input id="thief-book-progressSlider" class="thief-book-slider" style="width:500px" type="range" min="0" max="2" value="0">\n' +
            '        </label>\n' +
            '        <label>\n' +
            '            <input id="thief-book-lineLengthSlider" class="thief-book-slider" type="range" min="5" max="70" title="行宽【20】" value="20">\n' +
            '        </label>\n' +
            '        <label>\n' +
            '            <div id="thief-book-timer" class="thief-book-icon" title="开关定时滚屏">&#9200;</div>' +
            '        </label>\n' +
            '        <label>\n' +
            '            <input id="thief-book-timerIntervalSlider" class="thief-book-slider" type="range" min="1" max="10" title="每【3】秒定时滚屏" value="3">\n' +
            '        </label>\n' +
            '        <label>\n' +
            '            <div id="thief-book-search" class="thief-book-icon" title="搜索指定文字">&#128269;</div>' +
            '        </label>\n' +
            '        <label>\n' +
            '            <div id="thief-book-showMouseShortcuts" class="thief-book-icon" title="是否显示鼠标点击用的快捷按钮\n在快捷按钮区滚动滚轮也可以翻页">&#128433;</div>' +
            '        </label>\n' +
            '        <label>\n' +
            '            <div id="thief-book-increaseFontsize" class="thief-book-icon" title="加大字号">➕️</div>' +
            '        </label>\n' +
            '        <label>\n' +
            '            <div id="thief-book-decreaseFontsize" class="thief-book-icon" title="缩小字号">➖️</div>' +
            '        </label>\n' +
            '    </div>\n' +
            '    <div id="thief-book-lineBox" class="thief-book-line-box"></div>\n' +
            '</div>\n' +
            '<div id="thief-book-searchbox">\n' +
            '   <div id="thief-book-searchbox-title">搜索</div>\n' +
            '   <div class="thief-book-search-lines">\n' +
            '       <label for="thief-book-search-text">搜索文字：</label>\n' +
            '       <input type="text" id="thief-book-search-text">\n' +
            '   </div>\n' +
            '   <div class="thief-book-search-lines">\n' +
            '       <div id="thief-book-search-next" class="thief-book-search-buttons">下一个</div>\n' +
            '       <div id="thief-book-search-prev" class="thief-book-search-buttons">上一个</div>\n' +
            '       <div id="thief-book-search-fromstart" class="thief-book-search-buttons">从头搜</div>\n' +
            '   </div>\n' +
            '   <div class="thief-book-search-lines">\n' +
            '       <div id="thief-book-search-close" class="thief-book-search-buttons">关闭</div>\n' +
            '       <div id="thief-book-search-closestay" class="thief-book-search-buttons">留在当前位置</div>\n' +
            '       <div id="thief-book-search-closereturn" class="thief-book-search-buttons">返回原位置</div>\n' +
            '   </div>\n' +
            '</div>' +
            '<div id="thief-book-mouseShortcuts">\
                <div style="display: flex;">\
                    <div id="thief-book-onoffDiv" class="thief-book-floatIcon">×</div>\
                    <div id="thief-book-prelineDiv" class="thief-book-floatIcon">←</div>\
                    <div id="thief-book-nextlineDiv" class="thief-book-floatIcon">→</div>\
                    <div id="thief-book-timerOnoffDiv" class="thief-book-floatIcon">T</div>\
            </div></div>';
        document.body.appendChild(newDiv);

        document.getElementById('thief-book-currentcoder').innerText = fileCoder;
        parseText(false);

        document.getElementById('thief-book-mouseShortcuts').style.left = GM_getValue("thief-book-mouseshortcuts-left", "10px");
        document.getElementById('thief-book-mouseShortcuts').style.top = GM_getValue("thief-book-mouseshortcuts-top", "500px");

        document.getElementById('thief-book-selectFile')
            .addEventListener('change', function(){
                initBook();
        })
        document.getElementById('thief-book-progressSlider')
            .addEventListener('input', function(){
            pointer = parseInt(this.value);
            printLine(true);
            saveProgress();
        })
        document.getElementById('thief-book-progressSlider')
            .addEventListener('mousedown', function(){
            pointer = parseInt(this.value);
            printLine(true);
        })
        document.getElementById('thief-book-lineLengthSlider')
            .addEventListener('input', function(){
            lineLength = parseInt(this.value);
            this.title = "行宽【" + lineLength + "】";
            if(bookmode)GM_setValue("thief-book-linelength", lineLength);
            parseText(true);
        })
        document.getElementById('thief-book-progressSlider')
            .addEventListener('mouseup', function(){
            pointer = parseInt(this.value);
            printLine();
            saveProgress();
        })
        document.getElementById('thief-book-timerIntervalSlider')
            .addEventListener('input', function(){
            clearTimer();
            this.title = "每【" + this.value + "】秒定时滚屏";
            timerInterval = parseInt(this.value)*1000;
            if(bookmode)GM_setValue("thief-book-timerInterval", timerInterval);
        })
        document.getElementById('thief-book-timer')
            .addEventListener('click', function(){
            if(timer){clearTimer();}
            else{startTimer();}
        })
        document.getElementById('thief-book-search')
            .addEventListener('click', function(){
            document.getElementById('thief-book-searchbox').style.display = "block";
            posBeforeSearch = pointer;
        })
        document.getElementById('thief-book-search-next')
            .addEventListener('click', function(){
            t_search(document.getElementById('thief-book-search-text').value, "next", pointer);
        })
        document.getElementById('thief-book-search-prev')
            .addEventListener('click', function(){
            t_search(document.getElementById('thief-book-search-text').value, "prev", pointer);
        })
        document.getElementById('thief-book-search-fromstart')
            .addEventListener('click', function(){
            t_search(document.getElementById('thief-book-search-text').value, "next", 0);
        })
        document.getElementById('thief-book-search-close')
            .addEventListener('click', function(){
            document.getElementById('thief-book-searchbox').style.display = "none";
            saveProgress();
        })
        document.getElementById('thief-book-search-closestay')
            .addEventListener('click', function(){
            document.getElementById('thief-book-searchbox').style.display = "none";
            saveProgress();
        })
        document.getElementById('thief-book-search-closereturn')
            .addEventListener('click', function(){
            gotoLine(posBeforeSearch);
        })
        document.getElementById('thief-book-changecoder')
            .addEventListener('click', function(){
            tryFileCoder();
        })
        document.getElementById('thief-book-showMouseShortcuts')
            .addEventListener('click', function(){
            showMouseShortcuts = !showMouseShortcuts;
            printLine();
        })
        document.getElementById('thief-book-increaseFontsize')
            .addEventListener('click', function(){
              const currentValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--thief-book-font-size")) || 11;
              document.documentElement.style.setProperty("--thief-book-font-size", `${currentValue + 1}px`);
        })
        document.getElementById('thief-book-decreaseFontsize')
            .addEventListener('click', function(){
              const currentValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--thief-book-font-size")) || 11;
              document.documentElement.style.setProperty("--thief-book-font-size", `${currentValue - 1}px`);
        })
        document.getElementById('thief-book-mouseShortcuts')
            .addEventListener('mousedown', function(event){
            let xbox = event.clientX - document.getElementById('thief-book-mouseShortcuts').offsetLeft;
            let ybox = event.clientY - document.getElementById('thief-book-mouseShortcuts').offsetTop;

            function divOndrag(eve){
                let x = eve.clientX;
                let y = eve.clientY;
                let movex = x - xbox;
                let movey = y - ybox;
                document.getElementById('thief-book-mouseShortcuts').style.left = movex + "px";
                document.getElementById('thief-book-mouseShortcuts').style.top = movey + "px";
            };

            document.addEventListener('mousemove', divOndrag);

            document.addEventListener('mouseup', function(){
                document.removeEventListener("mousemove",divOndrag);
                GM_setValue("thief-book-mouseshortcuts-left", document.getElementById('thief-book-mouseShortcuts').style.left);
                GM_setValue("thief-book-mouseshortcuts-top", document.getElementById('thief-book-mouseShortcuts').style.top);
            });
        })
        document.getElementById('thief-book-mouseShortcuts')
            .addEventListener('wheel', function(event) {
            if(event.deltaY > 0){
                if(!hide)nextLine();
            }
            if(event.deltaY < 0){
                if(!hide)preLine();
            }
            event.stopPropagation();
            event.preventDefault();
        })
        document.getElementById('thief-book-onoffDiv')
            .addEventListener('click', function(){
            onOff();
        })
        document.getElementById('thief-book-prelineDiv')
            .addEventListener('click', function(){
            if(!hide)preLine();
        })
        document.getElementById('thief-book-nextlineDiv')
            .addEventListener('click', function(){
            if(!hide)nextLine();
        })
        document.getElementById('thief-book-timerOnoffDiv')
            .addEventListener('click', function(){
            let clickEvent = new Event('click');
            document.getElementById('thief-book-timer').dispatchEvent(clickEvent);
        })
        window.addEventListener('keydown', function(e) {
            if (e.code === keyNextLine) {
                if(!hide)nextLine();
            } else if (e.code === keyPreLine) {
                if(!hide)preLine();
            } else if (e.code === keyHide) {
                onOff();
            } else if (e.code === 'F2') {
                findFloater();
            } else if (e.code === keyTimer) {
                if(!hide){
                    if(timer){clearTimer();}
                    else{startTimer();}
                }
            }
        });

        function initBook(){
            let keepProgress = false;
            let oSelect=document.getElementById('thief-book-selectFile');
            let old_bookname = GM_getValue("thief-book-bookname", "");
            let old_progress = parseFloat(GM_getValue("thief-book-progress", 0));
            let timerInterval = parseInt(GM_getValue("thief-book-timerInterval", 3000));
            document.getElementById('thief-book-timerIntervalSlider').value = parseInt(timerInterval/1000);
            document.getElementById('thief-book-timerIntervalSlider').title = "每【" + parseInt(timerInterval/1000) + "】秒定时滚屏";
            lineLength = parseInt(GM_getValue("thief-book-linelength", lineLength));
            document.getElementById('thief-book-lineLengthSlider').value = lineLength;
            document.getElementById('thief-book-lineLengthSlider').title = "行宽【" + lineLength + "】";

            if(oSelect.files[0].name != ""){
                bookmode = true;
                if(old_bookname == oSelect.files[0].name){
                    progress = old_progress;
                    keepProgress = true;
                    fileCoder = GM_getValue("thief-book-encoder","utf-8");
                    document.getElementById('thief-book-currentcoder').innerText = fileCoder;
                }
                else{
                    GM_setValue("thief-book-bookname", oSelect.files[0].name);
                    GM_setValue("thief-book-progress", 0);
                    GM_setValue("thief-book-encoder", 'utf-8');
                    fileCoder = 'utf-8';
                    document.getElementById('thief-book-currentcoder').innerText = fileCoder;
                    progress = 0;
                    keepProgress = false;
                }
            }
            bookChange(keepProgress);
        }

        function bookChange(keepProgress){
            if(!keepProgress)keepProgress=false;
            let oSelect = document.getElementById('thief-book-selectFile');
            if(!oSelect.files[0])return;
            let fr=new FileReader();
            fr.onload=function(){
                text = fr.result;
                parseText(keepProgress);
            }
            fr.readAsText(oSelect.files[0], fileCoder);
            document.getElementById('thief-book-settings').classList.add('thief-book-semi-hide');
        }
        function parseText(keepProgress) {
            lines = parseLines(text);
            if (keepProgress) {
                pointer = Math.round(progress * (lines.length - 1));
            } else {
                pointer = 0;
                progress = 0;
            }
            let slider = document.getElementById('thief-book-progressSlider')
            slider.min = 0;
            slider.max = lines.length - 1;
            printLine();
        }

        function parseLines(text) {
            text = text.replace(/\r/g, "");
            let i = 0,j = 0;
            let lines = [];
            let tmpline = "";
            while (j < text.length) {
                if (j - i > lineLength || text[j] === '\n') {
                    tmpline = text.slice(i, j+1);
                    if(tmpline.length<=3){
                        lines[lines.length - 1] = lines[lines.length - 1] + tmpline;
                        // 如果下一行太短了就合到上一行去
                    }else{
                        lines.push(tmpline);
                    }
                    i = ++j;
                    continue;
                }
                j++;
            }
            if (j > i) {
                lines.push(text.slice(i, j))
            }
            return lines;
        }

        function nextLine() {
            if (pointer < lines.length - 1) {
                pointer++;
            }else{
                clearTimer();
            }
            printLine();
            saveProgress();
        }
        function preLine() {
            if (pointer > 0) {
                pointer--;
            }
            printLine();
            saveProgress();
        }
        function onOff() {
            hide = !hide;
            printLine();
            clearTimer();
        }
        function startTimer(){
            if(timer){clearInterval(timer)};
            timer = setInterval(nextLine, timerInterval);
            document.getElementById('thief-book-timer').innerHTML = "&#128683;";
        }
        function clearTimer(){
            if(timer){
                clearInterval(timer);
                timer=null;
            }
            document.getElementById('thief-book-timer').innerHTML = "&#9200;";
        }

        function printLine(multiLine) {
            if (hide) {
                document.getElementById('thief-book-searchbox').style.display = "none";
                document.getElementById('thief-book-leftCorner').style.display = "none";
                document.getElementById('thief-book-mouseShortcuts').style.display='none';
            } else {
                document.getElementById('thief-book-leftCorner').style.display = "block";
                if(showMouseShortcuts){
                    document.getElementById('thief-book-mouseShortcuts').style.display='block';
                    document.getElementById('thief-book-showMouseShortcuts').innerHTML = "&#128683;";
                }
                else{
                    document.getElementById('thief-book-mouseShortcuts').style.display='none';
                    document.getElementById('thief-book-showMouseShortcuts').innerHTML = "&#128433;";
                }
            }

            document.getElementById('thief-book-lineBox').innerHTML = '';

            if (multiLine) {
                let i = pointer - 20;
                while (i < pointer) {
                    if (i < 0) {
                        i++;
                        continue;
                    }
                    createLine(i);
                    i++;
                }
            }
            createLine(pointer);

            document.getElementById('thief-book-progressSlider').value = pointer;

            function createLine(i) {
                let newLine = document.createElement('div');
                newLine.classList.add('thief-book-line');
                let line = lines[i];
                if (line.length < lineLength) {
                    line += '　'.repeat(lineLength - line.length);
                }
                newLine.innerText = calProgress() + '  ' + line;
                document.getElementById('thief-book-lineBox').append(newLine);
            }
        }

        function calProgress() {
            progress = pointer / (lines.length - 1);
            return pointer === lines.length - 1 ? '100.00%' :
            ('000' + ((100 * progress).toFixed(2))).slice(-5) + '%';
        }

        function saveProgress(){
            if(!bookmode)return;
            let iProgress = pointer / (lines.length - 1);
            if(iProgress>0 && iProgress<=1){
                GM_setValue("thief-book-progress", iProgress);
            }
        }

        function t_search(stext, direction, from){
            let tmpSearchPos = -1;
            let i = 0;
            if(direction == "prev"){
                for(i=from-1;i>=0;i--){
                    if(lines[i].lastIndexOf(stext)>0){
                        tmpSearchPos = i;
                        gotoLine(tmpSearchPos);
                        return;
                    }
                }
            }
            if(direction == "next"){
                for(i=from?from+1:0;i<lines.length;i++){
                    if(lines[i].lastIndexOf(stext)>0){
                        tmpSearchPos = i;
                        gotoLine(tmpSearchPos);
                        return;
                    }
                }
            }
            if(tmpSearchPos == -1){
                alert("没找到结果");
                return;
            }
        }

        function gotoLine(intLine){
            pointer = intLine;
            printLine();
        }

        function tryFileCoder(){
            let encodingList = [
                'utf-8',
                'gb2312',
                'gbk',
                'gb18030',
                'big5',
                'utf-16be',
                'utf-16le',
                'ascii'
            ];
            let i = encodingList.indexOf(fileCoder);
            i++;
            if(i>=encodingList.length)i=0;
            fileCoder = encodingList[i];
            if(bookmode)GM_setValue("thief-book-encoder", fileCoder);
            document.getElementById('thief-book-currentcoder').innerText = fileCoder;
            initBook();
        }

        function flasher(){
            if(timerFlasherCount==0){
                clearInterval(timerFlasher);
                document.getElementById('thief-book-mouseShortcuts').style.backgroundColor = "transparent";
                return;
            }
            else{
                if(timerFlasherCount%2==0){
                    document.getElementById('thief-book-mouseShortcuts').style.backgroundColor = "red";
                }else{
                    document.getElementById('thief-book-mouseShortcuts').style.backgroundColor = "transparent";
                }
                timerFlasherCount = timerFlasherCount - 1;
            }
        }

        function findFloater(){
            showMouseShortcuts = true;
            document.getElementById('thief-book-showMouseShortcuts').innerHTML = "&#128683;";
            document.getElementById('thief-book-mouseShortcuts').style.display='block';
            document.getElementById('thief-book-mouseShortcuts').style.left = "400px";
            document.getElementById('thief-book-mouseShortcuts').style.top = "400px";
            timerFlasherCount = 8;
            timerFlasher = setInterval(flasher, 300);
        }

    })();
})();