// ==UserScript==
// @name         虎牙弹幕屏蔽及热度排序
// @namespace    http://tampermonkey.net/
// @version      1.33
// @description  弹幕屏蔽关键词（在原屏蔽按钮后面）,直播页面按热度排序。
// @author       Hugo16
// @match        *://www.huya.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @namespace    https://greasyfork.org/users/238424
// @downloadURL https://update.greasyfork.org/scripts/385896/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E5%8F%8A%E7%83%AD%E5%BA%A6%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/385896/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E5%8F%8A%E7%83%AD%E5%BA%A6%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加屏蔽界面
    var blockWordsWrap = $('<div class="block-mask-wrap"><div id="block-mask"></div><div id="blockWrap"><div id="bWtop"><input id="blockWord"/><button id="blockBtn">屏蔽</button></div><div id="wordsWrap"><ul></ul></div></div></div>');
    $("body").append(blockWordsWrap);
    blockWordsWrap.hide();
    var blockShowBtn = $("<i class='room-chat-tool room-chat-tool-blockWords' id='J_roomChatIconBlockWords1' title='免登录屏蔽'></i>");
    findElement("J_roomChatIconBlockWords",function(){
        $("#J_roomChatIconBlockWords").after(blockShowBtn);
        blockShowBtn.on("click",function(){
            blockWordsWrap.show();
        })
        $("#block-mask").on("click",function(){
            blockWordsWrap.hide();
        })
    })

    // 读取屏蔽词
    var blockWords = readBlockWords();
    // 添加屏蔽词
    $("#blockBtn").on("click",function(){
        var word = $("#blockWord").val().toLocaleUpperCase();
        if(word!=""){
            blockWords.push(word);
            $("#wordsWrap ul").append("<li><span class='keyWords'>"+word+"</span><span class='cancelBtn'>取消屏蔽<span></li>");
        }
        writeBlockWords(blockWords);
    });
    // 删除屏蔽词
    $("#wordsWrap ul").on("click","li span.cancelBtn",function(event){
        var target = $(event.target);
        var word = target.prev().text();
        target.parent().remove();
        blockWords = $.grep(blockWords, function(value) {
            return value != word;
        });
        writeBlockWords(blockWords);
    })


    // 检测新弹幕
    window.onload = function(){
        $("#danmudiv").bind("DOMNodeInserted", function(){
            var item = $(this).children("div:last");
            var text = item.children("span").text();
            if(compareStr(text,blockWords)){
                item.children("span").html("")
            }
        });
    }

    // 热度排序
    sort();
})();

// 寻找元素
function findElement(name,func){
    if(document.getElementById(name)|| document.getElementsByClassName(name)){
        func();
    }
    else{
        setTimeout(function(){findDanmuDiv(func)},500);
    }
}

// 比较屏蔽词
function compareStr(str,strArr){
    for(var i=0;i<strArr.length;i++){
        if(str.toLocaleUpperCase().indexOf(strArr[i])>=0){
            console.log(strArr[i] + ":" + str);
            return true;
        }
    }
    return false;
}

// 读取屏蔽词
function readBlockWords(){
    var words = [];
    // 读取屏蔽词
    if(localStorage.getItem("huyaBlock")!=null&&localStorage.getItem("huyaBlock")!=""){
        words = localStorage.getItem("huyaBlock").split(',')
    }
    for(var i=0;i<words.length;i++){
        $("#wordsWrap ul").append("<li><span class='keyWords'>"+words[i]+"</span><span class='cancelBtn'>取消屏蔽<span></li>");
    }
    return words;
}

// 写入屏蔽词
function writeBlockWords(blockWords){
    var words = blockWords.join(",");
    window.localStorage.setItem('huyaBlock',words)
}

// 热度排序
function sort() {

    setTimeout(() => {
        let fHot = document.getElementsByClassName("js-num");
        if(!fHot[0]){
            fHot = $(".subscribe-live-item .num");
            if(!fHot[0]){
            return;
        }
        }
        if (fHot[0].innerHTML != "") {
            let lists = document.getElementById("js-live-list");
            if (!lists) {
                lists = document.getElementsByClassName("live-list")[0];
                if (!lists) {
                    return;
                }
            }

            let arr = new Array();

            let list = lists.children;
            for (let i = 0; i < list.length; i++) {
                let hot;
                if($(list[i]).find(".js-num").length!=0){
                    hot = list[i].getElementsByClassName("js-num")[0].innerText;
                }
                else if($(list[i]).find(".num").length!=0){
                    try{
                        hot = list[i].getElementsByClassName("num total")[0].innerText;
                    }
                    catch{
                        hot = "0";
                    }
                }
                else{
                    return;
                }
                hot = hot.replace(/,/g,'');
                console.log(hot)
                if (hot.indexOf("万") != -1) {
                    hot = hot.replace(/万/, "") * 1 * 10000;
                }
                else if (hot.indexOf("亿") != -1) {
                    hot = hot.replace(/亿/, "") * 1 * 100000000;
                }
                arr.push([list[i], hot])
            }

            arr.sort(function (a, b) {
                return b[1] - a[1];
            })

            lists.innerHTML = "";
            for (let j = 0; j < arr.length; j++) {
                $(arr[j][0]).find('.pic').attr("src",$(arr[j][0]).find('.pic').attr("data-original"));
                lists.appendChild(arr[j][0]);
            }

        }
        else {
            sort();
        }

    }, 10);

}

var content = document.getElementsByClassName('js-responded-list')[0];


GM_addStyle(".block-mask-wrap { width: 100%; height: 100%;top:0;position:absolute;z-index:99999}"
            + "#block-mask { width: 100%; height: 100%; background: #000; opacity: .5;}"
            + "#blockWrap { width: 500px; height: 500px;top:50%;left:50%;margin:-250px 0 0 -250px; background: white;opacity:1; position: absolute; bottom: 0; border-top: 1px solid #80808042; padding: 10px;border-radius:3px; }"
            + "#bWtop { display: flex;height:30px;margin-bottom:3px}"
            + "#blockWord { width: 70%; margin-right: 3%;}"
            + "#blockBtn { width: 20%}"
            + "#wordsWrap { overflow: auto;height:calc(100% - 33px)}"
            + "#wordsWrap>ul>li { display: flex;height:35px;align-items: center;padding-left:3px;color:#808080b5;}"
            + "#wordsWrap>ul>li:nth-child(Odd) { background:#8080804f;}"
            + "#wordsWrap>ul>li:hover { background:#f49f0fb3;color:white;}"
            + "#wordsWrap>ul>li>span:nth-child(1) { width: 354px; margin-right: 15px;}"
            + "#wordsWrap>ul>li>span:nth-child(2) { width:20%;text-align:center;cursor:pointer}");