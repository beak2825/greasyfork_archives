// ==UserScript==
// @name         GPT角色选择[需自己修改脚本]
// @description  点击左侧栏角色后会将角色信息复制到粘贴板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       leon
// @match        https://*.com/chatgpt/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473539/GPT%E8%A7%92%E8%89%B2%E9%80%89%E6%8B%A9%5B%E9%9C%80%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9%E8%84%9A%E6%9C%AC%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/473539/GPT%E8%A7%92%E8%89%B2%E9%80%89%E6%8B%A9%5B%E9%9C%80%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9%E8%84%9A%E6%9C%AC%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 创建一个div区域
    var whiteDiv = document.createElement("div");
    whiteDiv.style.backgroundColor = "white";
    whiteDiv.style.width = "fit-content";
    whiteDiv.style.height = "100%";
    whiteDiv.style.overflow = "scroll";
    whiteDiv.style.position = "absolute";
    whiteDiv.style.top = "10px";
    whiteDiv.style.left = "10px";
    whiteDiv.style.padding = "10px";
    whiteDiv.style.boxSizing = "border-box";

    document.body.appendChild(whiteDiv);

    const roles =
          {
              "Js开发":"请扮演一位JavaScript专家, 我希望在你的帮助下通过JavaScript完成一个功能. 我会向你请教一些问题, 请给与详细的解答, 若有示例, 请给出注释.",
              "JSP开发":"请扮演一位前端开发专家, 我使用的环境是JSP, Jquery, JS, CSS, HTML4.01. 我打算向你请教一些问题, 请给与详细的解答, 若有示例代码请加以注释.",
              "java8开发":"请扮演一位Java技术专家, 你熟练掌握Java8, Spring3, Dubbo, Zookeeper, Redis, Mybatis, Oracle等相关知识. 我使用的环境是Java8, 我打算向你请教一些问题, 请给与详细的解答, 若有示例代码请加以注释.",
              "OracleSQL编写":"请扮演一位Oracle技术专家, 你熟练掌握Oracle12C的SQL语法, 我使用的Oracle版本12C, 我希望在你的帮助下完成sql的编写, 请根据我的问题给出示例与注释.",
              "MysqlSQL编写":"请扮演一位Mysql技术专家, 你熟练掌握Mysql的SQL语法, 我使用的Mysql版本是5.8, 我希望在你的帮助下完成sql的编写, 请根据我的问题给出示例与注释.",
              "Oracle运维":"请扮演一位Oracle技术专家, 你熟练掌握Oracle, Centos, 等相关知识. 我使用的Oracle版本是12C, 目前我的数据库出现了一些问题, 我希望在你的帮助下解决这些问题, 请根据我的提问给与详细的解答.",
              "Linux运维":"请扮演一位Linux系统运维专家, 你熟练掌握Centos,Docker,Nginx等相关知识. 我使用系统版本是Centos7, 我打算向你请教一些问题, 请给出详细的解答.",
			  "Shell脚本":"请扮演一位Linux系统运维专家, 你熟练掌握Shell脚本相关的知识. 我使用系统版本是Centos7, 我希望在你的帮助下完成脚本的编写, 若有示例代码请加以注释.",
			  "Docker":"请扮演一位Docker专家, 你熟练掌握Docker容器相关知识,我使用系统版本是Centos7, 我希望在你的帮助下完成项目环境的搭建, 请给与详细的解答.",
			  "全栈":"请扮演全栈技术专家, 我会向你请教一些问题, 请给与详细的解答, 若有示例, 请给出注释.",
          };


    // 创建一个角色列表
    for (var role in roles){
        var listDiv = document.createElement("div");
        listDiv.style.border = "1px solid black";
        listDiv.style.marginBottom = "10px";
        listDiv.style.padding = "5px";
        listDiv.style.boxSizing = "border-box";
        listDiv.style.cursor = "pointer";
        listDiv.style.background = "white";
        whiteDiv.appendChild(listDiv);

        // 创建标题
        var titleNode = document.createElement("span");
        titleNode.innerHTML = role+" ";
        listDiv.appendChild(titleNode);
        // 创建内容
        var contentNode = document.createElement("span");
        contentNode.innerHTML = roles[role];
        contentNode.style.display = "none";
        contentNode.style.color = "blue";
        listDiv.appendChild(contentNode);


        const content = roles[role];
        // 添加点击事件
        listDiv.onclick = function() {
            inputContent(content);
        };

        const node = contentNode;
        listDiv.addEventListener("mouseover", function() {
            block(node);
        });

        listDiv.addEventListener("mouseout", function() {
            none(node);
        });
    }

    function block(node){
        node.style.display = "inline-block";
    }

    function none(node){
        node.style.display = "none";
    }



    function inputContent(content) {

        var tempInput = document.createElement("input");
        tempInput.value = content;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

    }
})();