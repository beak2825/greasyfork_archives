// ==UserScript==
// @name         数据采集（贴吧）
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  数据半自动化采集（贴吧）
// @author       myaijarvis
// @match        https://tieba.baidu.com/*
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @require      https://cdn.jsdelivr.net/npm/zhangsan-layui@1.0.3/layui.js
// @resource     https://www.layuicdn.com/layui-v2.6.8/css/layui.css
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481754/%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%EF%BC%88%E8%B4%B4%E5%90%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/481754/%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%EF%BC%88%E8%B4%B4%E5%90%A7%EF%BC%89.meta.js
// ==/UserScript==

// 这个点击下一页会只会刷新网页部分内容的（内容详情页点击下一页也是只刷新网页部分内容的）
// 逻辑：选取讨论数大于xx的链接，自动点击链接，进入页面详情页然后开始自动采集内容
// 代码等待后期优化精简
(function () {
    "use strict";
    addStyle();
    addBtn();
    $("#caiji").click(async function () {
        // 获取 div 元素
        let elements = document.querySelectorAll(".d_post_content ");
        const contentArray = [];
        for (let item of elements) {
            // 获取 div 元素中的文本内容（不包含子标签内的文字）
            let divTextContent = getDivTextContent(item);
            // 输出结果
            //console.log(divTextContent.trim());
            if (divTextContent.trim().length >= 10)
                // 只采集10字以上的字符
                contentArray.push(divTextContent.trim());
        }
        //拼接成一个字符串，每行一条
        const result = contentArray.join("\n");
        console.log(result);
        download(result);

        await sleep(1000); // 延迟3s
        let flag_caiji_over = true;
        // 选择所有 'li.pb_list_pager a' 元素
        var pagerLinks = document.querySelectorAll("li.pb_list_pager a");
        // 遍历 NodeList 查找包含 '下一页' 文本的元素
        for (let i = 0; i < pagerLinks.length; i++) {
            if (pagerLinks[i].textContent.includes("下一页")) {
                layer.msg("开始跳转到下一页");
                pagerLinks[i].click(); // 点击下一页
                flag_caiji_over = false;
                await sleep(3000); // 延迟3s
                layer.msg("自动点击采集按钮");
                $("#caiji").click(); // 因为网页只是部分刷新，所以可以采用自动点击的方式
                break; // 找到后跳出循环
            }
        }
        if (flag_caiji_over) {
            $("#caiji").css("background", "red").text("采集完成");
            layer.msg("已经是最后一页了");
            await sleep(3000); // 延迟3s
            window.close(); // 关闭当前标签页
        }

        // 获取 div 元素中的文本内容(不包括子标签内的内容)的函数
        function getDivTextContent(element) {
            let textContent = "";
            // 遍历子节点
            for (const node of element.childNodes) {
                // 判断节点类型
                if (node.nodeType === 3) {
                    // 文本节点，获取其文本内容
                    textContent += node.textContent;
                } else if (node.nodeType === 1 && node.tagName.toLowerCase() !== "a") {
                    // 元素节点，递归获取其文本内容（排除 'a' 标签）
                    textContent += getDivTextContent(node);
                }
            }

            return textContent;
        }
    });

    // Your code here...
})();
const sleep = (timeout) =>
new Promise((resolve) => setTimeout(resolve, timeout));

function addStyle() {
    //debugger;
    let layui_css = `.layui-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}
                   .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
    GM_addStyle(layui_css);
}

//创建复制按钮
function addBtn() {
    let element = $(
        `<button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="caiji">采集</button>`
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

function download(text) {
    // 你的字符串
    const yourString = text;
    // 创建一个 Blob 对象
    const blob = new Blob([yourString], { type: "text/plain" });
    // 创建一个链接元素
    const link = document.createElement("a");
    // 设置链接元素的属性
    link.href = window.URL.createObjectURL(blob);
    link.download = "output.txt";
    // 将链接元素添加到文档中
    document.body.appendChild(link);
    // 模拟点击链接以触发下载
    link.click();
    // 移除链接元素
    document.body.removeChild(link);
}
/*
// 下面的代码复制到 https://tieba.baidu.com/f?kw=%E5%96%B7&ie=utf-8&pn=50600 中控制台中运行
console.clear();
const sleep = (timeout) =>
new Promise((resolve) => setTimeout(resolve, timeout));
async function func(){
    document.querySelector('.pre.pagination-item').click() // 点击上一页
    await sleep(3000); // 延迟3s
    let elements=document.querySelectorAll("div > div.col2_left.j_threadlist_li_left > span")
    for (let item of elements) {
        let num=item.textContent;
        if(Number(num) > 100){
            //console.log(num);
            item.style.backgroundColor='red';
            // 获取当前元素的父节点的父节点
            let parentParentElement = item.parentElement.parentElement;
            // 在父节点的父节点下查找后续的所有<a>元素
            let nextAnchorElements = parentParentElement.querySelector('div.threadlist_title a');
            console.log(num,nextAnchorElements);
            // 模拟点击事件
            window.open(nextAnchorElements.href, '_blank','noopener'); // 后台打开，没有用
            // nextAnchorElements.click();  //只能成功点击一次时，需要浏览器设置允许 弹出窗口！！！
            await sleep(1000); // 延迟3s

        }
    }
    console.log('over!')
    return Promise.resolve();
}
for(let i=0;i<10;i++){ //一次性翻多页
    console.log(i)
    await func();
    await sleep(1000);
}

*/
