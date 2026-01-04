// ==UserScript==
// @name        ListProjects - gitcode.net
// @namespace   Violentmonkey Scripts
// @match       https://gitcode.net/users/u011405698/projects
// @grant       none
// @version     2311171546
// @author      alvin
// @license     MIT
// @description 2023/11/17 14:57:11
// @downloadURL https://update.greasyfork.org/scripts/480113/ListProjects%20-%20gitcodenet.user.js
// @updateURL https://update.greasyfork.org/scripts/480113/ListProjects%20-%20gitcodenet.meta.js
// ==/UserScript==

function data_to_csv(data, name) {
    const blob = new Blob(data, { type: 'text/csv,charset=UTF-8' });
    const uri = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = (name + ".csv") || "temp.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function exportProjects(){
    projects = document.querySelectorAll("li.project-row")
    //保存数据，注意换行格式
    var data_list = Array();
    data_list.push(["标题", "链接", "\n"]);
    projects.forEach(project => {
        href = project.querySelector('.project').href
        description = ''
        descriptionNode = project.querySelector('.description')
        if (descriptionNode) {
            description = descriptionNode.innerHTML
        }
        data_list.push([href, description]);
        console.log(href)
        console.log(description)

    })
    data_to_csv(data_list, "projects.csv");
}


function addbut() {
    'use strict';
    console.log('我的脚本加载了');
    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "导出项目列表";
    button.style.width = "60px";
    button.style.height = "40px";
    button.style.align = "center";

    //绑定按键点击功能
    button.onclick = function () {
        console.log('点击了按键');
        exportProjects();
        //为所欲为 功能实现处
        //alert("你好");
        return;
    };

    var x = document.querySelector('.gl-pagination');
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    x.appendChild(button);

    //var y = document.getElementById('s_btn_wr');
    //y.appendChild(button);
};


window.onload = function () {
   addbut();
}

