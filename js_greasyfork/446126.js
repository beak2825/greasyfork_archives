// ==UserScript==
// @name         婆罗影评
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       晚枫QQ237832960
// @description  一键复制影评全文
// @license      Creative Commons
// @match        https://www.poluoa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446126/%E5%A9%86%E7%BD%97%E5%BD%B1%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/446126/%E5%A9%86%E7%BD%97%E5%BD%B1%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert('开始')
    console.log('~~~~~~~脚本开始执行~~~~~~~')
    var ele = document.getElementsByClassName("entry-content")[0].getElementsByTagName('p')
    console.log('获取剧情介绍')
    var str,i
    for (i = 0; i < ele.length; i++) {
        console.log(ele[i].innerText)
        //prompt(btlink[i].innerText)
        str += ele[i].innerText+'\r\n'
    }
    console.log('获取剧情介绍完毕')
    var div = document.createElement("div")
    div.innerHTML = `<input type="button" id="cp" style=" outline-style: none ;border: 1px solid #d2691e;color:#ff7f50;border-radius: 3px;padding: 9px 9px;width: 100px;font-size: 14px;font-weight: 700;font-family: 'Microsoft soft';`+`
                      background-color:transparent;" value="点击复制" />`+
        `<br/><textarea id="input" style="width: 1px;height: 1px;border:none;resize:none;" > </textarea>`
    div.style.cssText="color: black;\n" +
        "    text-decoration: none;\n" +
        "    text-align:center;\n" +
        "    width: 50px;\n" +
        "    height: 30px;\n" +
        "    line-height: 40px;\n" +
        "    text-align: center;\n" +
        "    position: fixed;\n" +
        "    top: 30%;\n" +
        "    background-color:transparent;\n" +
        "    z-index:999;\n" +
        "    left: 10px;\n" +
        "    cursor: pointer;"
    document.body.appendChild(div)
    let cp = document.getElementById('cp')
    cp.addEventListener('click', function (e) {
        copyStr();
    });
    var copyStr = function() {
        var inputT = document.getElementById("input");
        inputT.value =  str.replace('undefined', ''); // 修改文本框的内容
        inputT.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        let suc = document.execCommand("copy")
        if(suc == true){
            alert("复制成功");
        }
        else{
            alert("复制失败");
        }
    }
    console.log('~~~~~~~脚本执行完毕~~~~~~~')
})();