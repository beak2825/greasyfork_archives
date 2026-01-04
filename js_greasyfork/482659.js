// ==UserScript==
// @name         新疆大学教学质量管理平台评教助手
// @namespace    http://tampermonkey.net/
// @version      1
// @description  评价牛魔酬宾
// @author       懂不懂大师的含金量（原作者peterg）
// @match        https://jpv2-2.mycospxk.com/*
// @icon         https://glut.mycospxk.com/logo.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/482659/%E6%96%B0%E7%96%86%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/482659/%E6%96%B0%E7%96%86%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var itext=GM_getValue("itext", "1");
    var icheckbox=GM_getValue("icheckbox", "");
    var itextarea=GM_getValue("itextarea", "努力");
    setTimeout(function(){
        var myDiv = document.createElement("div");
        myDiv.id = "my-script";
        myDiv.innerHTML = "<h1>湖商自动评教</h1><p>单选的选项:</p>" +
            "<input placeholder='1' type='text' id='input-text'>" +
            "<p>多选的选项:</p>" +
            "<input placeholder='1 2(空格隔开,星号*全选)' type='text' id='input-checkbox'>" +
            "<p>问答的回答:</p>" +
            "<input placeholder='非常满意' type='text' id='input-textarea'>" +
            "<button id='submit-button'>一键填写</button>"+
            "<p>提醒：再次点击“一键填写”可取消选择</p>";
        document.body.appendChild(myDiv);
        var css = "#my-script { position: fixed; top: 50%; left: 75%; z-index: 9999; " +
            "border: 1px solid #969fff; border-radius: 10px; padding: 20px; color: #333; }" +
            "#my-script input, #my-script button { border-radius: 5px; }";
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        document.getElementById("input-text").value=itext;
        document.getElementById("input-checkbox").value=icheckbox;
        document.getElementById("input-textarea").value=itextarea;
        function setNativeValue(element, value) {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else {
                valueSetter.call(element, value);
            }
        }
        document.getElementById("submit-button").addEventListener("click", function() {
            let radiogroup = document.querySelectorAll('div.ant-radio-group');
            let checkboxroup = document.querySelectorAll('div.ant-checkbox-group');
            let formitem = document.querySelectorAll('div.ant-form-item-control');
            var inputText = document.getElementById("input-text").value;
            var inputCheckbox = document.getElementById("input-checkbox").value;
            var inputTextarea = document.getElementById("input-textarea").value;
            if(inputText){
                GM_setValue("itext", inputText);
                for(var i = 0;i<radiogroup.length;i++){
                    let radioinput = radiogroup[i].querySelectorAll('input.ant-radio-input');
                    if(i == 0){
                        radioinput[2].click();
                    }
                    for(var j = 0;j<radioinput.length;j++){
                        if(i!=0){
                        if(inputText-1>radioinput.length)inputText=radioinput.length+1;
                        if(inputText-1<0)inputText=0+1;
                        if(j==inputText-1)radioinput[j].click();
                        }

                    }
                }
            }
            if(inputCheckbox){
                GM_setValue("icheckbox", inputCheckbox);
                let temp = inputCheckbox.split(" ");
                for(var ii = 0;ii<checkboxroup.length;ii++){
                    let checkboxinput = checkboxroup[ii].querySelectorAll('input.ant-checkbox-input');
                    for(var jj = 0;jj<checkboxinput.length;jj++){
                        for(var kk = 0;kk<temp.length;kk++){
                            if(temp[0]=="*"){checkboxinput[jj].click();}
                            else{
                                if(jj==temp[kk]-1)checkboxinput[jj].click();}
                        }
                    }
                }}
            if(inputTextarea){
                GM_setValue("itextarea", inputTextarea);
                for(var iii = 0;iii<formitem.length;iii++){
                    let textareainput = formitem[iii].querySelectorAll('textarea.ant-input');
                    for(var jjj = 0;jjj<textareainput.length;jjj++){
                        setNativeValue(textareainput[jjj],inputTextarea);
                        textareainput[jjj].dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    let input1 = formitem[iii].querySelectorAll('input.ant-input');
                    for(var kkk = 0;kkk<input1.length;kkk++){
                        setNativeValue(input1[kkk],inputTextarea);
                        input1[kkk].dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            }

            var subButton = document.getElementsByClassName("ant-btn index_submit-2EYSG ant-btn-primary")[0];
            subButton.click();

            // 使用 setTimeout 模拟延迟
            setTimeout(function() {
                // 查找和点击 "checkButton"
                var checkButton = document.getElementsByClassName("ant-btn ant-btn-primary")[1];
                if (checkButton) {
                    console.log(checkButton);
                    checkButton.click();
                    setTimeout(test, 3000);
                } else {
                    console.log('无法找到 checkButton');
                }
            }, 3500); // 延迟1秒（1000毫秒）

            function test(){
                var nextMainDiv = document.getElementsByClassName("am-modal-content")[0];
                if(nextMainDiv){
                    console.log(nextMainDiv);
                }
                var nextButton = document.getElementsByClassName("TaskMainContent_next_btn-3Z7bS")[0];
                if(nextButton){
                    console.log(nextButton);
                    nextButton.click();
                }
            }

    },1000);

    });

})();