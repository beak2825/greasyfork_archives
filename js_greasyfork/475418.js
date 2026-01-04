// ==UserScript==
// @name         武汉理工大学/衡水学院自考网络助学平台
// @version      0.1.4
// @description  监控面板，防挂机、课堂练习...
// @author       Xiguayaodade
// @license      MIT
// @match        *://cws.edu-edu.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?member/login/
// @source       http://8.130.116.135/?member/login/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @require      https://greasyfork.org/scripts/479975-xiguatjjy/code/xiguatjjy.js?version=1340493
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/475418/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%A1%A1%E6%B0%B4%E5%AD%A6%E9%99%A2%E8%87%AA%E8%80%83%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/475418/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%A1%A1%E6%B0%B4%E5%AD%A6%E9%99%A2%E8%87%AA%E8%80%83%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    
        function getInfo(){
        setTimeout(function(){
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[0].click();
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[0+1].click();
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[0+2].click();
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[0+3].click();
            setTimeout(function(){
                document.getElementsByClassName("zhengshu")[0].getElementsByClassName("xiazai_2")[0].getElementsByClassName("submit_1")[0].click();
                setTimeout(function(){
                    if(document.getElementsByClassName("zhengshu")[0] == null){
                        setTimeout(function(){
                            document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                        },3000);
                    }else{
                        setTimeout(function(){
                            document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                        },3000);
                    }
                },1000);
            },1500);
        },1500);
    }

    function strCz(str) {
        let arr1 = str.split("/");
        let proStr1 = arr1[0];
        let lastStr1 = arr1[1];
        let lastInt = parseInt(lastStr1);
        let proTest = /分钟|秒钟/.test(proStr1);
        if(proTest){
            let proStr2 = proStr1.split(" ");
            if(proStr2[proStr2.length - 2] === '分钟'){
                let proStr3 = proStr2[proStr2.length - 3];
                let proInt = parseInt(proStr3);
                return proInt<lastInt;
            }
            else{
                return 0<lastInt;
            }
        }
        else{
            return 0<lastInt;
        }
    }

    function yscz(){
        for (let i=0;i<30;i++) {

            var cell1 = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[2];
            var cell2 = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[6];

            var temp = document.createElement("td");
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].insertBefore(temp, cell1);
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].insertBefore(cell1, cell2);
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].insertBefore(cell2, temp);
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].removeChild(temp);

            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[0].style.display = "none";
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[1].style.display = "none";
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[2].style.display = "none";
            document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[3].style.display = "none";
        }
    }




    function azx(){
        var er = false;
        console.log("\u5f00\u59cb\u7b54\u9898");
        addMessage("\u5f00\u59cb\u7b54\u9898");
        for(var i=0;i<questionCount;i++){
            console.log("i=:"+ i);
            addMessage("i=:"+ i);
            var answerPrint = document.getElementsByClassName("correct-answer-area")[i].getElementsByTagName("span")[1].innerText;
            console.log("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint);
            addMessage("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint);
            if(answerPrint.length == 1){
                if(document.getElementsByClassName("question-type-tag")[i].innerText === '简答题'){
                    console.log("简答题");
                    addMessage("简答题");
                    switch(answerPrint)
                    {
                        case 'A':
                            document.getElementsByClassName("split-screen-wrapper")[i].getElementsByClassName("form-control")[0].value = "A";
                            break;
                        case 'B':
                            document.getElementsByClassName("split-screen-wrapper")[i].getElementsByClassName("form-control")[0].value = "B";
                            break;
                        case 'C':
                            document.getElementsByClassName("split-screen-wrapper")[i].getElementsByClassName("form-control")[0].value = "C";
                            break;
                        case 'D':
                            document.getElementsByClassName("split-screen-wrapper")[i].getElementsByClassName("form-control")[0].value = "D";
                            break;
                    }
                }else{
                    console.log("\u5355\u9009\u9898");
                    addMessage("\u5355\u9009\u9898");
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
                }
            }else{
                switch(answerPrint)
                {
                    case '正确':
                        console.log("\u5224\u65ad\u9898");
                        addMessage("\u5224\u65ad\u9898");
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn right-btn")[0].click();
                        break;
                    case '错误':
                        console.log("\u5224\u65ad\u9898");
                        addMessage("\u5224\u65ad\u9898");
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn wrong-btn")[0].click();
                        break;
                    default:
                        console.log("\u591a\u9009\u9898");
                        addMessage("\u591a\u9009\u9898");
                        var str1 = answerPrint;
                        var array = str1.split(',');
                        var str2 = array.join('');

                        for(var j=0;j<str2.length;j++){
                            switch(str2[j])
                            {
                                case 'A':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[0].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[0].click();
                                    }
                                    console.log("点击A");
                                    break;
                                case 'B':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[1].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[1].click();
                                    }
                                    console.log("点击B");
                                    break;
                                case 'C':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[2].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[2].click();
                                    }
                                    console.log("点击C");
                                    break;
                                case 'D':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].click();
                                    }
                                    console.log("点击D");
                                    break;
                                case 'E':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[4].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[4].click();
                                    }
                                    console.log("点击E");
                                    break;
                                case 'F':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[5].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[5].click();
                                    }
                                    console.log("点击F");
                                    break;
                                case 'G':
                                    if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[6].getElementsByClassName("checkbox selected").length == 0){
                                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[6].click();
                                    }
                                    console.log("点击G");
                                    break;
                                default:
                                    er = true;
                                    console.log("当前多选题选择过多，系统需更新！");
                            }
                        }
                }
            }
        }
        console.log("\u7b54\u9898\u7ed3\u675f");
        if(er){
            console.log("\u9000\u51fa");
            return;
        }
        //继续答题
        //var btn = document.getElementsByClassName("btn-submit").length-ind;
        var btn = document.getElementsByClassName("btn-submit").length-1;
        addMessage("\u63d0\u4ea4");
        console.log("\u63d0\u4ea4");
        setTimeout(function(){
            for(let i=0; i<btn; i++){
                document.getElementsByClassName("btn-submit")[0].click();
            }
            setTimeout(function(){
                addMessage("\u63d0\u4ea4\u6210\u529f");
                console.log("\u63d0\u4ea4\u6210\u529f");
                unitIndex++;
                setTimeout(search,3000);
            },2000);
        },1500);
    }
})();