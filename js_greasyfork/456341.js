// ==UserScript==
// @name         信息采集
// @namespace    zhaiwei
// @version      0.13.11
// @description  autofill
// @author       zhaiwei
// @match        http://106.120.181.195/*
// @match        http://cpadisc2.cpad.gov.cn/*
// @match        http://111.200.209.66/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/456341/%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/456341/%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    // 生成按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '一键全选';
    // 添加按钮的样式类名class值为chooseBtn
    btn.setAttribute('class', 'chooseBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.chooseBtn{position:fixed;top:300px;right:150px;width:75px;height:55px;padding:3px 5px;border:3px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.chooseBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行一键全选函数 chooseAll
    document.querySelector('.chooseBtn').addEventListener('click', function () {
        chooseAll();
    })
    
    // 生成按钮
    var btnSave = document.createElement('button');
    // 按钮文字
    btnSave.innerText = '保存';
    // 添加按钮的样式类名class值为saveBtn
    btnSave.setAttribute('class', 'saveBtn');
    // 生成style标签
    var styleSave = document.createElement('style');
    // 把样式写进去
    styleSave.innerText = `.saveBtn{position:fixed;top:150px;right:150px;width:75px;height:55px;padding:3px 5px;border:3px solid #ce0000;cursor:pointer;color:#ce0000;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.saveBtn:hover{background-color:#ce0000;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(styleSave);
    // 在body中添加button按钮
    document.body.appendChild(btnSave);
    // 点击按钮去执行一键全选函数 saveAll
    document.querySelector('.saveBtn').addEventListener('click', function () {
        saveAll();
    })

    // 一键全选函数
    function chooseAll() {

   
    //入户道路是否硬化
    document.querySelectorAll(".ui-grid-row")[8].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //是否通自来水

    document.querySelectorAll(".ui-grid-row")[9].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //间隔是否低于24小时
    document.querySelectorAll(".ui-grid-row")[9].children[3].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //是否饮水安全
    document.querySelectorAll(".ui-grid-row")[9].children[5].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //是否使用清洁能源
    document.querySelectorAll(".ui-grid-row")[10].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //使用清洁能源的类型
    document.querySelectorAll(".ui-grid-row")[10].children[3].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-multiselect-item")[4].click();

    //其他备注
    var event = new Event("input");
    document.querySelectorAll(".ui-grid-col-2")[32].children[0].value = "液化气";
    document.querySelectorAll(".ui-grid-col-2")[32].children[0].dispatchEvent(event);

    //是否危房
    document.querySelectorAll(".ui-grid-row")[11].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[1].click();

    //是否有淋浴设施
    document.querySelectorAll(".ui-grid-row")[11].children[5].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //是否有卫生户厕
    document.querySelectorAll(".ui-grid-row")[12].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //卫生厕所类型
    document.querySelectorAll(".ui-grid-row")[12].children[3].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[1].click();

    //卫生厕所是否能正常使用
    document.querySelectorAll(".ui-grid-row")[12].children[5].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //卫生户厕是否入室
    document.querySelectorAll(".ui-grid-row")[13].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();


    //卫生户厕是否入院
    document.querySelectorAll(".ui-grid-row")[13].children[3].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[1].click();


    //是否进行过庭院美化
    document.querySelectorAll(".ui-grid-row")[14].children[1].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[2].click();

    //所在村
    document.querySelectorAll(".ui-grid-row")[4].children[3].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[12].click();

    document.querySelectorAll(".ui-dropdown-item")[17].click()

    //民族
    document.querySelectorAll(".ui-grid-row")[6].children[3].children[0].children[0].children[0].children[0].children[2].children[0].click();
    document.querySelectorAll(".ui-dropdown-item")[1].click();

    //政治面貌
    document.querySelectorAll(".ui-grid-row")[6].children[5].children[0].children[0].children[0].children[0].children[1].click();
    document.querySelectorAll(".ui-dropdown-item")[4].click();

    //所在组
        //if(document.querySelectorAll(".ui-grid-row")[4].children[3].childNodes[1].childNodes[2].childNodes[1].childNodes[1].children[1].textContent==="于城村"){}
        //setTimeout('document.querySelectorAll(".ui-grid-row")[4].children[5].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[12].click();',100);
        //圩西组 翟西 邵庄 圩南 圩北 新于 小于 于中组 于北组 南李 斜尖庄 陶庄 翟东 北李 小翟 杨庄 小新 翟中 大新 于南
        //1      2    3    4    5    6    7    8      9      10   11     12   13   14   15   16   17   18   19   20
        //setTimeout('document.querySelectorAll(".ui-dropdown-item")[14].click();',200);
        
    }
    
    // 保存函数
    function saveAll() {
        if(document.querySelector("#on_save")){
            document.querySelector("#on_save").click();
        }
/*
        else if(document.querySelector(".swal2-confirm")){
            document.querySelector(".swal2-confirm").click();
        }
        */
        setTimeout('document.querySelector(".swal2-confirm").click();',1000);
        setTimeout('document.querySelector(".swal2-confirm").click();',2000);
        setTimeout('document.querySelector(".swal2-confirm").click();',3000);
        setTimeout('document.querySelector(".swal2-confirm").click();',5000);
    }
    
})();