// ==UserScript==
// @name         Fuck You Maogai
// @namespace    fuck_maogai
// @match        *://learn.intl.zju.edu.cn/*
// @version      2.0.2
// @license      MIT
// @description  ha ha ha ha ha ha ha ha ha ha ha !
// @author       NaN
// @icon         https://img0.baidu.com/it/u=1318541766,1632186299&fm=253&app=120&f=JPEG?w=480&h=600
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.2/jquery.slim.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.2.2/axios.min.js
// @connect      127.0.0.1
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456951/Fuck%20You%20Maogai.user.js
// @updateURL https://update.greasyfork.org/scripts/456951/Fuck%20You%20Maogai.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var data = {
        "终端": '',
    }
    for (let key in data)
        data[key] = data[key].replaceAll('\n', '<br class="fadeSelect">');
    GM_addStyle(
        `
    #fuckMainBox {
        background-color: transparent;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content:center;
        position: fixed;
        left:  30%;
        top:  30%;
/* ============ SIZE HERE ============ */
        width: 500px;
        height: 500px;
/* ============ SIZE HERE ============ */
        z-index: 888888;
        font-size:2rem;
        border: 3px dotted #f0f0f0;
        padding: 5px;
    }
    .no-select {
        user-select: none;
    }
    .noScroll::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }

    .noScroll {
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        overflow-x: hidden;
        overflow-y: auto;
    }

    .noFocus:focus {
        outline: none;
    }

    .fadeSelect::selection {
        background:#f5f5f5;
        color:#cacaca;
    }

    .fadeSelect::-moz-selection {
        background:#f5f5f5;
        color:#cacaca;
    }

    .fadeSelect::-webkit-selection {
        background:#f5f5f5;
        color:#cacaca;
    }

    .textEditor {
        margin-bottom: 12px;
        padding: 10px;
        width: 500px;
        height: 100px;
        border: 1px solid #ccc;
        overflow-y: auto;
    }

    .row{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .input{
        border: 3px dotted #f0f0f0;
        background-color: transparent;
        font-size:.7rem;
        color: #e8e8e8;
        display: flex;
    }

    .hiled{
        color: #a0a0a0;
        border: 1px solid #d5d5d5;
    }
    `);

    var isMouseDown, initX, initY;

    var mainBox = $('<div id="fuckMainBox"></div>')
    $("body").append(mainBox);
    // var text = $('<textarea readonly class="noScroll noFocus fadeSelect"></textarea>');
    var text = $('<div autofocus class="textEditor noScroll noFocus fadeSelect"></div>');
    var search = $('<input class="noFocus fadeSelect input"></input>');
    var btnRow = $('<div class="row"></div>');
    var btnRow2 = $('<div class="row"></div>');
    var edge = $('<div></div>');
    text.css({
        "width": "100%",
        "height": "100%",
        "font-size": "1.3rem",
        "color": "#e8e8e8",
        "border": "0px",
        "background-color": "transparent",
        "font-family": "Consolas, 微软雅黑",
        "word-wrap": "break-word",
    });
    edge.css({
        "width": "100%",
        "height": "60px"
    });
    btnRow.css({
        "width": "100%",
        "height": "24px"
    });
    search.css({
        "flex-grow": "1",
    });
    text.html(data['终端']);
    mainBox.append(text);
    btnRow.append(search);
    mainBox.append(btnRow);
    mainBox.append(btnRow2);
    mainBox.append(edge);
    var toSonX = mainBox.offset().left - edge.offset().left;
    var toSonY = mainBox.offset().top - edge.offset().top;
    edge.mousedown(function (e) {
        isMouseDown = true;
        $("body").addClass('no-select');
        initX = e.offsetX;
        initY = e.offsetY;
    });
    $(document).mousemove(function (e) {
        if (isMouseDown) {
            mainBox.css('left', e.clientX - initX + toSonX + 'px');
            mainBox.css('top', e.clientY - initY + toSonY + 'px');
        }
    });
    edge.mouseup(function (e) {
        isMouseDown = false;
        $("body").removeClass('no-select');
    });
    var hiledText, currentKey = '终端', currentMatchIndex = 0, matchOffsetTop = [];
    function changeText() {
        let keyWords = search.val().trim().split(' ');
        console.log(keyWords);
        console.log(currentKey);
        if (keyWords[0] == '') {
            text.html(data[currentKey]);
            currentMatchIndex = 0;
            matchOffsetTop = [];
            return;
        }
        hiledText = data[currentKey];
        for (var keyWord of keyWords) {
            hiledText = hiledText.replaceAll(keyWord, `<span class="hiled fadeSelect">${keyWord}</span>`);
        }
        text.html(hiledText);
        matchOffsetTop = [];
        currentMatchIndex = 0;
        setTimeout(() => {
            $("span.hiled").each(function () {
                matchOffsetTop.push($(this)[0].offsetTop - 140);
                // console.log($(this)[0].offsetTop - 140);
            });
            if (matchOffsetTop.length > 0) {
                text.scrollTop(matchOffsetTop[0]);
            }
        }, 200);
        console.log(matchOffsetTop);
    }
    search.change(changeText);
    changeText();


    var upMatch = $(`<button class="noFocus input">&#11165;</button>`);
    upMatch.click(function () {
        if (matchOffsetTop.length == 0) return;
        if (currentMatchIndex <= 0) currentMatchIndex = matchOffsetTop.length - 1;
        else currentMatchIndex--;
        text.scrollTop(matchOffsetTop[currentMatchIndex]);
    });
    var downMatch = $(`<button class="noFocus input">&#11167;</button>`);
    downMatch.click(function () {
        if (matchOffsetTop.length == 0) return;
        if (currentMatchIndex >= matchOffsetTop.length - 1) currentMatchIndex = 0;
        else currentMatchIndex++;
        text.scrollTop(matchOffsetTop[currentMatchIndex]);
    });
    var goSearch = $(`<button class="noFocus input">&#11044;</button>`);
    goSearch.click(changeText)
    var clearSearch = $(`<button class="noFocus input">&#10007;</button>`);
    clearSearch.click(() => { search.val(''); changeText(); })
    btnRow.append(goSearch);
    btnRow.append(clearSearch);
    btnRow.append(upMatch);
    btnRow.append(downMatch);

    for (let key in data) {
        var btn = $(`<button class="noFocus input">${key}</button>`);
        btn.click(function () {
            currentKey = key;
            changeText();
        });
        btnRow2.append(btn);
    }

    var selectText;
    var selectBtn = $('<button class="input noFocus">&#11044;</button>');
    selectBtn.css({
        // "width": "35px",
        // "height": "35px",
        "position": "fixed",
        "font-size": "1.2rem",
        "left": "500px",
        "top": "500px",
        "z-index": "999999",
    });
    selectBtn.hide();
    selectBtn.click(function () {
        rmSelectBtn();
        window.getSelection().empty()
        search.val(selectText);
        changeText();
    });

    function showSelectBtn(e) {
        selectBtn.show();
        selectBtn.offset({ 'left': e.pageX, 'top': e.pageY - 35 });
    }
    function rmSelectBtn() {
        selectBtn.hide();
    }
    function getSelected(e) {
        setTimeout(() => {
            if (document.selection) selectText = document.selection.createRange().text;
            else selectText = window.getSelection() + '';
            selectText = selectText.trim();
            if (selectText) showSelectBtn(e);
            else rmSelectBtn();
            console.log(selectText);
        }, 100);
    }
    $(document).dblclick(getSelected);
    $(document).mouseup(getSelected);
    $('body').append(selectBtn);

    mainBox.hide();
    var isShown = false;
    var allCtrl = $('<span class="no-select">&#128065;</span>');
    allCtrl.css({
        "position": "fixed",
        "left": "150px",
        "top": "50px",
        "z-index": "999999",
        "color": "darkgray",
        "font-size": "1.4rem",
    });
    allCtrl.click(function () {
        isShown = !isShown;
        if (isShown) {
            mainBox.show();
            mainBox.css('left', '400px');
            mainBox.css('top', '200px');
        }
        else mainBox.hide();
    });
    $('body').append(allCtrl);

    var runCode = $('<span class="no-select">#</span>');
    runCode.css({
        "position": "fixed",
        "left": "190px",
        "top": "50px",
        "z-index": "999999",
        "color": "darkgray",
        "font-size": "1.4rem",
    });

    function postData(url, data) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(data),
                onload(xhr) {
                    resolve(xhr.responseText);
                }
            });
        });
    }

    //   链接：https://juejin.cn/post/7078453415281426468

    function trans(str) {
        var temp = "";
        if (str.length == 0) return "";
        temp = str.replace(/&/g, "&amp;");
        temp = temp.replace(/</g, "&lt;");
        temp = temp.replace(/>/g, "&gt;");
        temp = temp.replace(/ /g, "&nbsp;");
        temp = temp.replace(/\'/g, "&#39;");
        temp = temp.replace(/\"/g, "&quot;");
        temp = temp.replaceAll('\n', '<br class="fadeSelect">');
        console.log(temp);
        return temp;
    }

    runCode.click(function () {
        navigator.clipboard.readText()
            .then(text => {
                console.log('Pasted content: ', text);
                let bText = btoa(encodeURIComponent(text));

                var code = postData('http://127.0.0.1:56789/run', { "code": bText });
                code.then(function (msg) {
                    console.log(msg);
                    data['终端'] = trans(msg);
                    changeText();
                })
                // GM_xmlhttpRequest({
                //     url:"http://127.0.0.1:56789/run",
                //     method :"POST",
                //     data: "asd=" + bText,
                //     headers: {
                //         "Content-type": "application/x-www-form-urlencoded"
                //     },
                //     onload:function(xhr){
                //         console.log(xhr.responseText);
                //     }
                // });
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    });

    $('body').append(runCode);

    navigator.clipboard.readText()
        .then(text => {
            console.log('Pasted content: ', text);
        });

    // 
})();