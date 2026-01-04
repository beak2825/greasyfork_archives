// ==UserScript==
// @name         生成md链接
// @namespace    http://tampermonkey.net/
// @version      0.4.11
// @description  把当前网站链接生成markdown格式的链接形式：[title](url)
// @author       myaijarvis
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @run-at       document-end
// @match        *://*/*
// @exclude      *://*/*.ipynb
// @exclude      https://www.kaggle.com/code/*/edit
// @exclude      https://editor.csdn.net/*
// @exclude      https://www.bilibili.com/bangumi/play/*
// @exclude      https://aistudio.baidu.com/*/user/*
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/draggabilly@3.0.0/dist/draggabilly.pkgd.min.js
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437033/%E7%94%9F%E6%88%90md%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/437033/%E7%94%9F%E6%88%90md%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 全局变量最好都初始化在匿名函数(function () {})();之前

(function () {
    "use strict";

    //console.log(layui);
    addStyle();
    addBtn();
    drag_func();

    let isclick = false; // 防止过快重复点击
    $("#copyBtn").click(function () {
        if (!isclick) {
            copy();
            isclick = true;
            setTimeout(() => {
                isclick = false;
            }, 3000);
        }
    });
})();

// 公共变量
let result = {
    // 是否需要去掉？后面的参数,默认true，如果需要为false请到urlMap添加网址,
    // 然后需要自定义去除？后面的参数请到urlMap的函数中自己操作
    flag: true,
    url: document.URL, // 处理后的url
    title: document.title, // 处理后的标题
    text: "", // 复制到剪贴板的内容
};

const removeParamPattern = /\?.*/; // 去掉问号后面的参数
function removeParam(url) {
    return url.replace(removeParamPattern, "");
}

// 对象映射
// url(支持正则,特殊字符需要自己转义):function(){ 处理title;}
// 每个url要留一个样例
const urlMap = {
    "mp.weixin.qq.com": function (result) {
        // https://mp.weixin.qq.com/s/vlLEEqhGHocUIU78Hq_Tug
        const name = $("#profileBt a").text().trim(); // 公众号名称
        result.title = `${result.title}_${name}_微信公众号`;
    },

    "blog.csdn.net/": function (result) {
        result.title = result.title.replace(/\(.*?\)/, "").trim(); // 去掉CSDN "(1条消息)title"  再去掉前后空格
        result.title = result.title.replace(/CSDN博客.*/, "CSDN博客"); // title_author-CSDN博客_keyword 去掉keyword
        const url=result.url;
        if (url.match(/blog.csdn.net\/.*?\/category_*/)) {
            // 匹配分类专栏链接
            result.title = `==分类专栏==: ${result.title}`;
        } else {
            //https://blog.csdn.net/ljw_study_in_CSDN/article/details/121512562?spm=1001.2101.3001.6650.4
            result.url = result.url.split("?")[0]; // 去掉？后面的参数
        }
    },
    "toutiao.com/article/": function (result) {
        // https://www.toutiao.com/article/7205128234114023969/?app=news_article_lite
        result.flag = true;
        const author = $("a.user-name").text();
        result.title = `${result.title}-【${author}】-文章`;
    },
    "toutiao.com/w/": function (result) {
        // https://www.toutiao.com/w/1764132707047428/?log_from=b3f6898d5ce3e_1682696312708
        result.flag = true;
        const author = $("a.name").text();
        result.title = document.title.substring(0,50);
        result.title = `${result.title}-【${author}】-微头条`;
    },
    "toutiao.com/video/": function (result) {
        // https://www.toutiao.com/video/7225244935484604980/?from_scene=video&log_from=a9ec249ec59a7_1682696455912
        result.flag = true;
        const author = $('.author-info>a').text();
        result.title = `${result.title}-【${author}】`;
    },
    "ixigua.com/": function (result) {
        // https://www.ixigua.com/7225244935484604980/?from_scene=video&log_from=a9ec249ec59a7_1682696455912
        result.flag = true;
        const author = $(".author__userName span.user__name").text();
        result.title = `${result.title}-【${author}】`;
    },
    // 设置flag为false，不需要自定义title的直接返回空字符串
    "bilibili.com/video/": function (result) {
        result.flag = false; // https://www.bilibili.com/video/BV1dU4y1C7so?p=3
        const author = $(".up-name").eq(0).text().trim();
        result.title = `${result.title}-【${author}】`;
    },
    "toutiao.com/profile_v3_public/": function (result) {
        result.flag = false;
    },
    "toutiaoapi.com/magic/": function (result) {
        result.flag = false;
    },
    "jarvis": function (result) {
        result.flag = false;
    },
};

// 复制操作
function copy() {
    const url = document.URL;
    const title = document.title;
    // 变量重置
    result.flag = true;
    result.url = url;
    result.title = title;
    result.text = "";

    let is_find = false;
    for (let urlPattern in urlMap) {
        // 遍历urlMap中的所有网址
        const reg = new RegExp(urlPattern, "i"); //生成正则表达式 会自动生成'/urlPattern/i'，特殊字符需要自己转义
        if (reg.test(url)) {
            result.flag = false; // 这里先改为false
            // 匹配网址
            const handler = urlMap[urlPattern]; // 返回一个函数
            if (handler) {
                handler(result); // 如果需要removeParam，请在handler中设置result.flag为true
            }

            is_find = true;
        }
        if (is_find) break;
    }

    if (result.flag) {
        // 去掉 url 中的参数
        result.url = removeParam(result.url);
    }
    // 这里右边加一个空格是因为微信中识别md链接有bug，会把右括号也识别为链接地址的一部分
    result.text = `【参考：[${result.title}](${result.url} )】`;

    // 复制到剪贴板
    handleCopy(result.text);

    // 修改复制按钮的样式
    const copyBtn = $("#copyBtn");
    copyBtn.css("background", "red").text("复制成功");
    setTimeout(() => {
        copyBtn.css("background", "green").text("复制");
    }, 3000);
}

function addStyle() {
    //debugger;
    let layui_css = `.layui-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}
                   .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
    GM_addStyle(layui_css);
}

//创建复制按钮
function addBtn() {
    let element = $(
        `<button style="top: 150px;right:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="copyBtn">复制</button>`
  );
    $("body").append(element);
}

// 复制函数
function handleCopy(text) {
    let inputNode = document.createElement("input"); // 创建input
    inputNode.value = text; // 赋值给 input 值
    document.body.appendChild(inputNode); // 插入进去
    inputNode.select(); // 选择对象
    document.execCommand("Copy"); // 原生调用执行浏览器复制命令
    inputNode.className = "oInput";
    inputNode.style.display = "none"; // 隐藏
    console.log("复制：", text);
}

function drag_func(){
    // 官方文档：https://draggabilly.desandro.com/
    // 有一个bug：按钮移动后，点击后按钮加了一个固定的left值，导致按钮变大后部分超出屏幕
    let draggableBtn = document.getElementById('copyBtn');
    let config_draggie = {
        axis: "y", // 限制移动方向 x,y,''
    };
    let draggie = new Draggabilly(draggableBtn, config_draggie); // 初始化 Draggabilly 实例
    draggie.on( 'dragStart', function( event, pointer ) {
        console.log("dragStart");
        //$(draggableBtn).prop('disabled') // 设置按钮不可点击
        draggableBtn.disabled = true;
    })

    // 解决办法
    draggie.on("dragEnd", function () {
        console.log("dragEnd");
        // console.log($(draggableBtn));
        setTimeout(()=>{
            //$(draggableBtn).prop('disabled', false); // 设置按钮可点击
            draggableBtn.disabled = false;
        }, 1000);
        //
        if (config_draggie.axis) {
            if (config_draggie.axis == "x") {
                // 不建议使用，可能会存着属性优先级问题导致属性不生效
                // $(draggableBtn).css({ right: "" });
                $(draggableBtn).css({ right: "auto" });
            } else if (config_draggie.axis == "y") {
                $(draggableBtn).css({ left: "auto" });
            } else {
                $(draggableBtn).css({ left: "auto", right: "auto" });
            }
        } else {
            $(draggableBtn).css({ right: "auto" }); // 因为是从左上角开始计算位置的，所以只需要设置right
        }
    });
}
