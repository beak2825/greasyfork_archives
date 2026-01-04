// ==UserScript==
// @name         电视猫优化
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @author       晚枫QQ237832960
// @description  移除推广广告，一键复制剧情简介
// @license      Creative Commons
// @match        *://www.tvmao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438479/%E7%94%B5%E8%A7%86%E7%8C%AB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438479/%E7%94%B5%E8%A7%86%E7%8C%AB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert('开始')
    console.log('~~~~~~~脚本开始执行~~~~~~~')
    console.log('~~~~~~~删除广告~~~~~~~')
    var ele = document.getElementsByClassName("mt20")
    var i
    if (ele != null){
        for (i = ele.length-1;i>=0;i--){
            console.log('下标数字为：    '+i +'    开始，删除推广广告')
            console.log(ele[i])
            ele[i].remove()
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    ele = document.getElementsByClassName("mb10")
    if (ele != null){
        for (i = ele.length-1;i>=0;i--){
            console.log('下标数字为：    '+i +'    开始，删除推广广告1111')
            console.log(ele[i])
            ele[i].remove()
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    ele = document.getElementsByClassName("epi_c")[0].getElementsByTagName('p')
    console.log('获取剧情介绍')
    var str
    for (i = 0; i < ele.length; i++) {
        console.log(ele[i].innerText)
        //prompt(btlink[i].innerText)
        str += ele[i].innerText+'\r\n'
    }
    console.log('获取剧情介绍完毕')
    ele = document.getElementById("iframe7214713_0")
    if(ele != null){
        ele.remove()
    }
    console.log('删除顶部广告')
    ele = document.getElementsByClassName("jaad")[0]
    if (ele != null){
        console.log('第一部分：  '+ele)
        ele.remove()
    }
    ele = document.getElementsByClassName("load_more_material")[0]
    if (ele != null){
        console.log('第二部分：  '+ele)
        ele.remove()
    }
    ele = document.getElementsByClassName("materialLst")[0]
    if (ele != null){
        console.log('第三部分：  '+ele)
        ele.remove()
    }
    console.log('删除底部广告')
    var div = document.createElement("div")
    div.innerHTML = `<input type="button" id="cp" style=" outline-style: none ;border: 1px solid #d2691e;color:#ff7f50;border-radius: 3px;padding: 13px 14px;width: 100px;font-size: 14px;font-weight: 700;font-family: 'Microsoft soft';`+`
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