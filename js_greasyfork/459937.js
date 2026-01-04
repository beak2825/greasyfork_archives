// ==UserScript==
// @name         修改资料
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  update the data of volunteer
// @author       zhaiwei
// @match        http://ah.chinavolunteer.mca.gov.cn/subsite/anhui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mca.gov.cn
// @grant        none
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/459937/%E4%BF%AE%E6%94%B9%E8%B5%84%E6%96%99.user.js
// @updateURL https://update.greasyfork.org/scripts/459937/%E4%BF%AE%E6%94%B9%E8%B5%84%E6%96%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // 生成“修改”按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '修改';
    // 添加按钮的样式类名class值为changeBtn
    btn.setAttribute('class', 'changeBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.changeBtn{position:fixed;top:80%;right:10%;width:75px;height:55px;padding:3px 5px;border:3px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.changeBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行修改函数 changeData
    document.querySelector('.changeBtn').addEventListener('click', function () {
        //changeData();
        denyTeam()
    })
 // 生成"保存"按钮
    var btn0 = document.createElement('button');
    // 按钮文字
    btn0.innerText = '保存';
    // 添加按钮的样式类名class值为saveBtn
    btn0.setAttribute('class', 'saveBtn');
    // 生成style标签
    var style0 = document.createElement('style');
    // 把样式写进去
    style0.innerText = `.saveBtn{position:fixed;top:90%;right:10%;width:75px;height:55px;padding:3px 5px;border:3px solid #ff0033;cursor:pointer;color:#ff0033;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.saveBtn:hover{background-color:#ff0033;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style0);
    // 在body中添加button按钮
    document.body.appendChild(btn0);
    // 点击按钮去执行修改函数 saveData
    document.querySelector('.saveBtn').addEventListener('click', function () {
        saveData();
    })
 // 生成"保存"按钮
    var btn1 = document.createElement('button');
    // 按钮文字
    btn1.innerText = '退出';
    // 添加按钮的样式类名class值为exitBtn
    btn1.setAttribute('class', 'exitBtn');
    // 生成style标签
    var style1 = document.createElement('style');
    // 把样式写进去
    style1.innerText = `.exitBtn{position:fixed;top:65%;right:7%;width:75px;height:55px;padding:3px 5px;border:3px solid #696969;cursor:pointer;color:#696969;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.exitBtn:hover{background-color:#696969;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style1);
    // 在body中添加button按钮
    document.body.appendChild(btn1);
    // 点击按钮去执行退出函数 exitOut()
    document.querySelector('.exitBtn').addEventListener('click', function () {
        exitOut();
    })

    //注册函数
    function changeData(){

    var event = new Event("change");
    document.getElementById("politicsSelect").value="13";
    document.querySelectorAll("#politicsSelect")[0].dispatchEvent(event);
    //$("#politicsSelect").val("13");
    //$("#politicsSelect").change();
    //setTimeout('document.getElementById("politicsSelect").options.selectedIndex = 13;',50);
    //$('i:contains("社区服务")')[0].click();
    //$('i:contains("其他")')[0].click();
    //$('i:contains("其他")')[1].click();

        document.getElementsByClassName("checkbox-fixed")[0].children[0].click()
        document.getElementsByClassName("checkbox-fixed")[0].children[1].click()

        document.getElementsByClassName("checkbox-fixed")[1].children[2].click()
        document.getElementsByClassName("checkbox-fixed")[1].children[4].click()
        document.getElementsByClassName("checkbox-fixed")[1].children[5].click()
        document.getElementsByClassName("checkbox-fixed")[1].children[13].click()
    document.getElementsByClassName("checkbox-fixed")[2].children[20].click()
    //$('i:contains("默认同意")')[0].click();
    document.getElementsByClassName("col v-m t-l")[0].children[0].children[1].click()
    //$('i:contains("默认同意")')[1].click();
    document.getElementsByClassName("col v-m t-l")[1].children[0].click()

    
    //选择居住区域
    setTimeout('document.querySelectorAll("#chooseLive")[0].click();',50);
    setTimeout('document.getElementsByClassName("category__item")[12].click()',200);
    setTimeout('document.getElementsByClassName("category__item")[47].click()',350);
    setTimeout('document.getElementsByClassName("category__item")[56].click()',500);
    setTimeout('document.getElementsByClassName("form t-c")[0].children[0].click()',650);

    setTimeout('document.getElementsByClassName("pt-30 t-c")[0].children[0].click()',850);
    //
    setTimeout('document.getElementsByClassName("swal-button swal-button--confirm")[0].click()',1700);
    }
    
    function denyTeam(){
        // 获取页面的高度
        const pageHeight = document.documentElement.scrollHeight;
        // 设置滚动位置到页面底部
        window.scrollTo(0,pageHeight);
        //默认拒绝队伍
        document.querySelector("#updatedata > li > div.tabbar-down > div > div:nth-child(8) > div > div > label:nth-child(2) > span").click();
        //保存修改
        setTimeout('document.getElementsByClassName("pt-30 t-c")[0].children[0].click()',200);
       //确定
       setTimeout('document.getElementsByClassName("swal-button swal-button--confirm")[0].click()',1200);

    }

   function saveData(){

       setTimeout('document.getElementsByClassName("pt-30 t-c")[0].children[0].click()',10);
       //
       setTimeout('document.getElementsByClassName("swal-button swal-button--confirm")[0].click()',1000);
   }

    function exitOut(){
    $('a:contains("退出")')[0].click();
    }
    // Your code here...
})();