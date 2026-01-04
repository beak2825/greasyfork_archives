// ==UserScript==
// @name         automatic-gdufe
// @namespace    nothing
// @version      1.6
// @description  广财校园网自动填写账号密码！采用本地cookie储存登录账号，安全且方便
/*本开源脚本仅在本地执行填表动作，不会上传您的数据。*/
// @author       cloudstream
// @match        http://100.64.13.17/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434013/automatic-gdufe.user.js
// @updateURL https://update.greasyfork.org/scripts/434013/automatic-gdufe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var account = '';
    var code = '';
    let result = document.cookie.match("(^|[^;]+)\\s*jwsession\\s*=\\s*([^;]+)");
	let value = (result ? result.pop() : "");
    if(value != ""){//decode
        let parts = value.split('x');
        let len1 = parseInt(parts[0]);
        let len2 = parseInt(parts[1]);
        let soup = parts[2];
        let output1="", output2="";
        let major = len1+len2
        for(let i=0; i<major;){
            if(len1-- > 0){
                output1 += soup[i++];
            }
            if(len2-- > 0){
                output2 += soup[i++];
            }
        }
        account = output1;
        code = output2;//decode account number and password
    }
    //writes information to input labels
    var hasInputs = false;
    function fillPage(){
        var flag = true;
        var content = window.document.querySelectorAll('.edit_lobo_cell');
        for(let i=0; i<content.length; i++){
            let item = content[i];
            if(item!=null){
                let slot = item.getAttribute('name');
                if(slot=='logout') {hasInputs = true; flag = false; console.log('Already logged in.'); return;}
                else if(slot=='DDDDD') {item.value = account; flag = false;}
                else if(slot=='upass') item.value = code;
                ee&&ee(1);  // 自动点击登录按钮
            }
        }
        if(hasInputs) alert("没找到对应资源哦，刷新看看");
    }
    function modifyPage(){
        var style = document.createElement("style");
        style.innerHTML = ".edit_cell {cursor: default!important;}";//修复原来登录页面鼠标指针异常问题
        document.head.appendChild(style);
        if(hasInputs) return;
        var aLabel = document.createElement("a");
        aLabel.setAttribute("style", "top: 103px; left: 0px; width: 70px; height: 28px; color: rgb(127, 127, 127); padding: 4px; position: absolute;");
        aLabel.setAttribute("href", "#saved");
        aLabel.setAttribute("id","aLabel");
        aLabel.innerHTML = "Save";
        aLabel.onclick = function(){
            let content = window.document.querySelectorAll('.edit_lobo_cell');
            let arg1 = "", arg2 = "";
            for(let i=0; i<content.length; i++){
                let item = content[i];
                if(item!=null){
                    let slot = item.getAttribute('name');
                    if(slot=='logout') {console.log('Already logged in.'); return;}
                    else if(slot=='DDDDD') {arg1 = item.value;}
                    else if(slot=='upass') arg2 = item.value;
                }
            }
            let len1 = arg1.length;
            let len2 = arg2.length;
            let output = len1+"x"+len2+"x";
            let major = Math.max(len1, len2);
            for(let i=0; i<major; i++){
                if(len1-- > 0){
                    output += arg1[i];
                }
                if(len2-- > 0){
                    output += arg2[i];
                }
            }
            document.cookie = "jwsession="+output+"; max-age=120000000;";
            document.getElementById("aLabel").innerHTML = "Saved √";
        }//save点击事件
        var anchor = window.document.getElementsByName('f1')[0];
        anchor.appendChild(aLabel);
    }
    //hook of the script
    onload=function(){
        var body = document.getElementsByTagName('body')[0];
        if(body.innerHTML != null && body.innerHTML.startsWith("内核接口")){
            location.reload(true);
        }
        fillPage();
        modifyPage();
     }
})();