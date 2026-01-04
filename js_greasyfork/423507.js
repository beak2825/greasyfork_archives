// ==UserScript==
// @name         天凤生成器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tenhou.net/2/img/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423507/%E5%A4%A9%E5%87%A4%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/423507/%E5%A4%A9%E5%87%A4%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.imageLoading = true
    window.value2Url = ''
    document.querySelector("#o").onload = function() {
        window.imageLoading = false
        console.log('请求完成: '+ window.queryValue);
    }
    var oDivNode =document.querySelector("body");
    var oInput = document.createElement("input");
    oInput.setAttribute('id', 'images')
    oInput.type = "text";
    oDivNode.appendChild(oInput);
    var oButNode = document.createElement("input");
    oButNode.type = "button";
    oButNode.value = "请求图片";
    oButNode.setAttribute('id', 'imageBtn')
    oDivNode.appendChild(oButNode);
    var oButNode1 = document.createElement("input");
    oButNode1.type = "button";
    oButNode1.value = "图片文件对应表";
    oButNode1.setAttribute('id', 'valueBtn')
    oDivNode.appendChild(oButNode1);
    oButNode.onclick = async function (){
        console.log(oInput.value);
        window.value2Url = ''
        var strs = oInput.value;
        var iList = strs.split(/\s+/);
        console.log(iList.length);
        for(let i=1;i<=iList.length;i++){
            const imageValue = iList[i-1];
            let filename =extract34(MPSZ.expand(imageValue));
            console.log('第'+i+'个: ' +imageValue + ' '+filename);
            window.value2Url = window.value2Url + imageValue + '  '+filename + '\n'
            document.querySelector("#tehai").value = imageValue;
            document.querySelector('button').click()
            window.imageLoading = true
            window.queryValue = imageValue
            await sleep(5000)
            for(let j=1;j<4;j++){
                if(window.imageLoading){
                    console.log('第'+i+'个: ' +imageValue +'第'+ j +"次没有请求完，加长等待");
                    await sleep(5000)
                }
            }

        }
    }
    oButNode1.onclick = function (){
        createTxt('对应表.txt',window.value2Url)
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    function createTxt(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
})();