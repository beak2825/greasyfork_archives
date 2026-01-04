// ==UserScript==
// @name         信息公示
// @namespace    zhaiwei
// @version      0.13.2
// @description  autofill
// @author       zhaiwei
// @match        https://anhui-jdydt.ccdi.gov.cn:8083/*
// @icon         https://jdydt.ccdi.gov.cn/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456377/%E4%BF%A1%E6%81%AF%E5%85%AC%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/456377/%E4%BF%A1%E6%81%AF%E5%85%AC%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
       // 生成按钮
    var btn0 = document.createElement('button');
//    var btn1 = document.createElement('button');
    var btn2 = document.createElement('button');
    // 按钮文字
    btn0.innerText = '新增';
//    btn1.innerText = '填充';
    btn2.innerText = '发布';
    // 添加按钮的样式类名class值为
    btn0.setAttribute('class', 'addBtn');
//    btn1.setAttribute('class', 'fillBtn');
    btn2.setAttribute('class', 'pubBtn');
    // 生成style标签
    var style0 = document.createElement('style');
//    var style1 = document.createElement('style');
    var style2 = document.createElement('style');
    // 把样式写进去
    //颜色代号https://www.colorhexa.com/

    style0.innerText = `.addBtn{position:fixed;top:150px;right:150px;width:75px;height:55px;padding:3px 5px;border:1px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.addBtn:hover{background-color:#0d6efd;color:#fff;}`;
//    style1.innerText = `.fillBtn{position:fixed;top:250px;right:150px;width:75px;height:55px;padding:3px 5px;border:1px solid #008000;cursor:pointer;color:#008000;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.fillBtn:hover{background-color:#008000;color:#fff;}`;
    style2.innerText = `.pubBtn{position:fixed;top:350px;right:150px;width:75px;height:55px;padding:3px 5px;border:1px solid #fd240d;cursor:pointer;color:#fd240d;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.pubBtn:hover{background-color:#fd240d;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style0);
//    document.head.appendChild(style1);
    document.head.appendChild(style2);
    // 在body中添加button按钮
    document.body.appendChild(btn0);
//    document.body.appendChild(btn1);
    document.body.appendChild(btn2);
    // 点击按钮去执行对应函数
    document.querySelector('.addBtn').addEventListener('click', function () {
        addAll();
    })
//    document.querySelector('.fillBtn').addEventListener('click', function () {
//        fillAll();
//    })
    document.querySelector('.pubBtn').addEventListener('click', function () {
        pubAll();
    })

    // 新增函数
    function addAll() {
    
    if(!document.querySelectorAll(".el-dialog__title")[1]){
        document.querySelectorAll("button")[2].click();
    }
    else{
        $("span:contains(取 消)")[0].click()
    }

    }

    //填充函数
//    function fillAll() {
    //点击上线
    
    function pubAll() {
    document.querySelectorAll(".el-radio__inner")[0].click();
    //显示排序
    //document.querySelectorAll(".el-form-item__content")[6].children[0].children[2].children[0].value="1";
    //document.querySelectorAll(".el-form-item__content")[6].children[0].children[2].children[0].dispatchEvent(new Event("input"))

    let showRank =document.querySelectorAll(".el-form-item__content")[6].children[0].children[2].children[0];
    showRank.value = "1";
        showRank.dispatchEvent(
            new Event("change", {
              view: window,
              bubbles: true,
              cancelable: true,
            })
          );
    //查看权限
    document.querySelectorAll(".el-form-item__content")[7].children[0].children[0].children[0].click();
    document.querySelectorAll(".el-select-dropdown__item")[7].click();

//    }
    //发布函数
//    function pubAll() {
    //确定
    //document.querySelectorAll("button")[101].click();
    $("span:contains(确 定)")[0].click()

    }
})();