// ==UserScript==
// @name         GoogleEasySearch
// @version      2.9
// @license      MIT
// @description  建立搜索引擎允许的语法上使我们更快找到自己所需要的内容！
// @author       小乘字节
// @match        *.google.com/*
// @include      http*://www.google.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @namespace    https://blog.csdn.net/qq_38238956?type=blog
// @downloadURL https://update.greasyfork.org/scripts/449808/GoogleEasySearch.user.js
// @updateURL https://update.greasyfork.org/scripts/449808/GoogleEasySearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 配置Google搜索语法
    let dict = [
        {
            "value": "AND ",
            "describe": "并且"
        },
        {
            "value": "OR ",
            "describe": "或者"
        },
        {
            "value": "intitle:",
            "describe": "标题包含"
        }, {
            "value": "intext:",
            "describe": "内容包含"
        }, {
            "value": "site:",
            "describe": "指定网站"
        }, {
            "value": "index of /",
            "describe": "网站目录"
        }, {
            "value": "inurl:",
            "describe": "指定路径"
        }, {
            "value": "filetype:",
            "describe": "文件类型"
        }, {
            "value": "similar to ",
            "describe": "相似网站"
        }, {
            "value": "alternative to ",
            "describe": "相似软件"
        }, {
            "value": "link:",
            "describe": "查找外链"
        }, {
            "value": "define ",
            "describe": "词的意思"
        }, {
            "value": "weather:",
            "describe": "查询天气"
        }, {
            "value": "movie:",
            "describe": "电影信息"
        }, {
            "value": "stocks:",
            "describe": "查询股票"
        }
    ];

    let q = jQuery("input[name='q']");
    let form = q.parent().parent().parent().parent().parent().parent().filter("form");
    let RNNXgb = form.find("div.RNNXgb");
    let newValue = q.val();
    let logo = form.find("div.logo");
    let sfbg = jQuery("div.sfbg");

    jQuery("head").append(`<style>
    .earySearch{
        position: absolute;
        top: 38px;
        left: ${window.location.pathname === "/search"? "2.5vw":"calc(50% - 410px)"};
    }
    .earySearch select{
        width: 100px;
        background-color: #fff;
    }
    .earySearch select option{
        font-weight: 700;
        text-align: center;
    }
    </style>`);
    sfbg.height(sfbg.height()+20);
    logo.css("top", "0px");
    form.css({"position": "relative"});

    // 添加相关元素
    RNNXgb.before(`<div class="easySearchText" style="margin:0 0 5px 0;color:#758a99;">
                        模糊匹配【*】、精确匹配【" "】、过滤【-】、包含【+】、范围【..】
                   </div>`);
    form.append(`<div class='earySearch'>
                     <select class='earySearchDict'>
                         <option value='-1'>--进阶搜索--</option>
                         <option value='https://blog.csdn.net/qq_38238956/article/details/126424625' style="color:#00e09e;">使用帮助</option>
                     </select>
                 </div>`);
    let earySearch = form.find("div.earySearch");
    let earySearchDict = earySearch.find(".earySearchDict");
    dict.map((data)=>{
        earySearchDict.append(`<option value='${data.value}'>${data.describe}</option>`);
    });

    // 监听select元素
    earySearchDict.change(function() {
        let index = this.selectedIndex;
        if (index === 0) {
            return;
        }else if(index === 1){
            window.location.href = this.value;
            return;
        }
        // 向搜索框添加内容
        q.val(newValue.concat(" ", this.value));
        q.focus();
    });

    // 获取键盘输入的内容
    q.on("input", function() {
        clearTimeout(this.myTimeOut);
        let _this = this;
        this.myTimeOut = setTimeout(()=>{
            newValue = _this.value;
        }, 300);
    });

    // 清空搜索框
    let ariaLavel = jQuery("div.BKRPef > div");
    ariaLavel.on('click', function() {
        newValue = '';
    });

})();