// ==UserScript==
// @name         数据采集（中国推广网）
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  数据半自动化采集（中国推广网）
// @author       myaijarvis
// @match        https://bbs.iaozi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @require      https://cdn.jsdelivr.net/npm/zhangsan-layui@1.0.3/layui.js
// @resource     https://www.layuicdn.com/layui-v2.6.8/css/layui.css
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482012/%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%EF%BC%88%E4%B8%AD%E5%9B%BD%E6%8E%A8%E5%B9%BF%E7%BD%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/482012/%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%EF%BC%88%E4%B8%AD%E5%9B%BD%E6%8E%A8%E5%B9%BF%E7%BD%91%EF%BC%89.meta.js
// ==/UserScript==

/* 这个点击下一页会刷新整个网页的
点击下一页刷新整个网页的
方法：刷新后自动触发auto_run()
*/

(async function () {
    "use strict";
    addBtn();
    const default_num = 100; // 默认值

    $("#caiji").click(async function () {
        GM_setValue("refreshCount", default_num);
        //location.reload(true); // 强制刷新页面
        auto_run();
    });

    // 执行定时刷新
    function auto_run() {
        let num = GM_getValue("refreshCount", -1);
        if (num > 0) {
            GM_setValue("refreshCount", num - 1); // 每次减一
            let cur_num = default_num - num;
            console.log(`running...${default_num} / ${cur_num}`);

            gather(cur_num);
            //location.reload(true); // 强制刷新页面
        } else if (num == 0) {
            console.log("execute completed.");
            $("#caiji").css("background", "red").text("采集完成");
            layer.msg("采集完成");
            GM_setValue("refreshCount", -1);
        } else if (num < 0) {
            console.log("execute completed.");
        }
    }

    // 初始化
    function init() {
        auto_run();
    }
    init();
})();

async function gather(cur_num) {
    // 获取 div 元素
    let elements = document.querySelectorAll("tr > th > a.s.xst");
    const contentArray = [];
    for (let item of elements) {
        let divTextContent = item.textContent; // 获取 div 元素中的文本内容
        //console.log(divTextContent.trim()); // 输出结果
        if (divTextContent.trim().length > 10)
            // 只采集10字以上的字符
            contentArray.push(divTextContent.trim());
    }
    //拼接成一个字符串，每行一条
    const result = contentArray.join("\n");
    console.log(result);
    console.log("总条数：", contentArray.length);
    //debugger
    download(result, cur_num);

    await sleep(2000); // 延迟

    // 选择下一页
    let pagerLinks = document.querySelector("#fd_page_bottom > div > a.nxt");
    if (pagerLinks) {
        layer.msg("开始跳转到下一页");
        pagerLinks.click(); // 点击下一页
    }
}
// 下面是功能函数

// 延迟函数，调用函数需要加上async
function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

//创建复制按钮
function addBtn() {
    let element = $(
        `<button
        style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;"
        class="layui-btn layui-btn-sm"
        id="caiji">采集</button>`
  );
    $("body").append(element);
}

// 复制
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
// 下载  需要浏览器设置该网站的权限 允许自动下载
function download(text, cur_num) {
    // 你的字符串
    const yourString = text;
    // 创建一个 Blob 对象
    const blob = new Blob([yourString], { type: "text/plain" });
    // 创建一个链接元素
    const link = document.createElement("a");
    // 设置链接元素的属性
    link.href = window.URL.createObjectURL(blob);
    link.download = `output_${cur_num}_${get_timestamp()}.txt`;
    // 将链接元素添加到文档中
    document.body.appendChild(link);
    // 模拟点击链接以触发下载
    link.click();
    // 移除链接元素
    document.body.removeChild(link);
}
// 获取当前时间戳
function get_timestamp() {
    // 创建 Date 对象
    let currentDate = new Date();
    // 获取当前时间的时间戳
    let timestamp = currentDate.getTime();
    //console.log(timestamp);
    return timestamp;
}
