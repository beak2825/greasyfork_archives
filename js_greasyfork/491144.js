// ==UserScript==
// @name         问卷星填充助手
// @namespace    https://www.wjx.cn/
// @version      1.1
// @description  自动填充问卷星输入框，内容以英文逗号","隔开，题目以#隔开，多个模糊匹配请使用|，举例"姓名#张三,学号#20091110,电话号码|联系方式|手机#17621551111"
// @author       ethanzhu
// @match        https://www.wjx.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/491144/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491144/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var overlay = document.createElement('div');
var setting = document.createElement('div');
var floatingButton = document.createElement('div');
var settingInput = document.createElement('input');
var saveBtn = document.createElement('button');
var ui = [overlay,floatingButton,settingInput,saveBtn];
function showPanel(show){
    if(show) overlay.style.display = 'block';
    else overlay.style.display = 'none';
}
function createUI() {
	// 创建悬浮按钮
    let btnStyle = "font-size:small;background: red;position: fixed;bottom: 60px;right: 20px;color: white;z-index: 9999;padding: 5px;";
	floatingButton.innerHTML = '日志';
    floatingButton.style = btnStyle;
    floatingButton.style.bottom = "60px";
	document.body.appendChild(floatingButton);
	// 点击悬浮按钮
	floatingButton.addEventListener('click', function() {
		overlay.style.display = 'block';
	});

	// 创建浮层
	overlay.innerHTML = '';
	overlay.style = "font-size:small;position: fixed; bottom: 0px; width: 60%; max-height: 90%; background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; z-index: 10000; display: none; word-wrap: break-word; overflow-y: auto;"
	document.body.appendChild(overlay);
	// 点击浮层外部隐藏浮层
	document.addEventListener('click', function(e) {
        for (let i = 0; i < ui.length; i++) {
            if(e.target === ui[i]) return;
        }
        showPanel(false);
	});

    setting.style = "font-size:small;position: absolute;top: 10px;left: 10px;width:90%;color: white;z-index: 9999;padding: 5px;";
    document.body.appendChild(setting);

    settingInput.type = "text";
    settingInput.style = "width:100%;";
    showLog("读取:"+ GM_getValue("setting"));
    settingInput.value = GM_getValue("setting") || "学号#20091110,姓名#张三,电话号码|联系方式|手机#17621551111";
    setting.appendChild(settingInput);
    saveBtn.textContent = '保存';
    saveBtn.addEventListener('click', function() {
        settingInput.value = settingInput.value.trim();
        GM_setValue("setting", settingInput.value);
        autoFit();
        showLog("保存:"+ GM_getValue("setting"));
    });
    setting.appendChild(saveBtn);
}
function showLog(str){
    overlay.innerHTML += str + "<br>"
}

function autoFit(){
    const textList = settingInput.value.split(",");
    const settingArr = [];
    textList.forEach((item, index)=> {
        settingArr.push(item.split("#"));
    });

    const inputs = document.getElementById('divContent').querySelectorAll('input[type="text"]');
    inputs.forEach((item, index)=>{
        if(item.parentElement && item.parentElement.parentElement){
            for(let i=0;i<settingArr.length;i++){
                if(settingArr[i].length==2 && RegExp(settingArr[i][0]).test(item.parentElement.parentElement.innerText)){
                    item.value = settingArr[i][1];
                }
            }
        }


    });
}
(function() {
    'use strict';
    createUI();
    autoFit();
})();