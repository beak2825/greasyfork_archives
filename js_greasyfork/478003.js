// ==UserScript==
// @name         mobile
// @namespace    http://tampermonkey.net/
// @version      0.5
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @description  让网页适合手机端阅读
// @author       ZQ
// @match        *://*.t66y.com/*
// @match        *://*.javbus.com/forum/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478003/mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/478003/mobile.meta.js
// ==/UserScript==


//创建按钮通过addFunction进行添加，并绑定btnCallBack为点击事件
function addButton(addFunction, text, btnCallBack) {
    var button = $$('<button style="margin:10px;background:green;color:white;font-size:18px">' + text + '</button>')
    button.click(btnCallBack)
    addFunction(button)
}

//获取所有符合ID的elems
function getElems(rootElem,ids) {
    var allElem = [];
    for (let j = 0; j < ids.length; j++) {
        let selectId = ids[j];
        var elems = rootElem.find(selectId);
        for (var i = 0; i < elems.length; i++) {
            var elem = $$(elems[i]);
            allElem.push(elem)
        }
    };
    return allElem;
}

function writeStorage(text){
    var context = localStorage.getItem('copy_context');
    if(context.indexOf(text) == -1){
        context = context + text + "\n"
        localStorage.setItem('copy_context',context);
    }
}
//拷贝内容到剪贴板
function copyToClip(text,btnId, bWriteStorage) {
    let copyBtn = new ClipboardJS("#" + btnId)
    copyBtn.on("success", function (e) {
    });
    if(bWriteStorage){
        writeStorage(text)
    }
}

// @match        *://*.v2ex.com/*
// isThread:通过URL判断是否是主题列表页
// threadSelectors:主题的选择器
// isContent:通过URL判断是否是帖子内容
// contentSelectors:内容的选择器

var $$;
let curWebConfigs = {};//当前网页要使用的配置

function UpdateConfig(){
    var domain = document.domain;
    console.log(domain)
    let allWebConfigs = {
        "www.javbus.com":{
            "isThread":function(url){
                return url.indexOf("mod=forumdisplay") != -1;
            },
            "threadSelectors":[
                "#nv_forum",
                "#nv_forum > div",
                [
                    "#ct > div.mn"
                ]
            ],
            "isContent":function(url){
                return url.indexOf("mod=viewthread") != -1;
            },
            "contentSelectors":[
                "#nv_forum",
                "#nv_forum > div",
                [
                    "#postlist"
                ]
            ],
            "titleSelectors":[
                "div.post_infolist > div > a.s",
                "td",
                "#thread_subject"
            ]
        }  
    }
    curWebConfigs = allWebConfigs[domain] 
    console.log("mobile.js => UpdateConfig",curWebConfigs)
}

function AdjustLayout() {

    if (document.URL.indexOf("") != -1) {
        //主题列表
        var elemsStr = [
            "#Rightbar",
            "#Top"
        ]
        var hideElems = getElems($$(document), elemsStr)


        for (var i = 0; i < hideElems.length; i++) {
            hideElems[i].remove()

        }
    }
}

function replaceElem(parentId,brotherIds,elemIds,titleSelectors){
    var elems = getElems($$(document), elemIds)
    $$(brotherIds).remove()
    for (var i = 0; i < elems.length; i++) {
        for(var j = 0;j < titleSelectors.length;j++){
            elems[i].find(titleSelectors[j]).css("font-size","26px");
        }
        $$(parentId).append(elems[i])
    }
}

function ChangeBody(){
    console.log("mobile.js => ChangeBody",document.URL)
    if(curWebConfigs["isThread"](document.URL)){
        // //帖子列表
        replaceElem(curWebConfigs["threadSelectors"][0],curWebConfigs["threadSelectors"][1],curWebConfigs["threadSelectors"][2],curWebConfigs["titleSelectors"])
    }

    if(curWebConfigs["isContent"](document.URL)){
        //帖子内容
        console.log("替换帖子内容",curWebConfigs["contentSelectors"])
        replaceElem(curWebConfigs["contentSelectors"][0],curWebConfigs["contentSelectors"][1],curWebConfigs["contentSelectors"][2],curWebConfigs["titleSelectors"])
    }

}

(function () {
    'use strict';
    $$ = $.noConflict();
    UpdateConfig();
    ChangeBody();

})();