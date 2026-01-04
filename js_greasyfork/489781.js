// ==UserScript==
// @name         Jenkins多分支流水线展开显示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  检查并打印多分支流水线的URL
// @author       tangyujun
// @match        http://*/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489781/Jenkins%E5%A4%9A%E5%88%86%E6%94%AF%E6%B5%81%E6%B0%B4%E7%BA%BF%E5%B1%95%E5%BC%80%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489781/Jenkins%E5%A4%9A%E5%88%86%E6%94%AF%E6%B5%81%E6%B0%B4%E7%BA%BF%E5%B1%95%E5%BC%80%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.paixu = window.onload;

    function buildProject(img) {
        console.log(img.parentNode.href);
        new Ajax.Request(img.parentNode.href);
        return false;
    }
    window.onload = function() {
        // 获取所有tr元素
        const trElements = document.querySelectorAll('#projectstatus > tbody > tr');

        trElements.forEach(tr => {
            // 获取第一个td元素
            const firstTd = tr.querySelector('td:first-child');
            // 检查第一个td的innerHTML是否包含“多分支流水线”文本
            if (firstTd && firstTd.innerHTML.includes('多分支流水线')) {
                // 获取第三个td元素#job_samps-fmc-planflight-bak > td:nth-child(3)
                const aTag = tr.querySelector('td:nth-child(3) > a');
                const nameTd = tr.querySelector('td:nth-child(3) > a');
                const projectName = nameTd.innerText;
                // 如果a标签存在且有href属性，则打印其值
                if (aTag && aTag.href) {
                    // 发送fetch请求获取目标URL的HTML内容
                    fetch(aTag.href)
                        .then(response => response.text()) // 将响应体解析为文本
                        .then(htmlString => {
                        // 使用DOMParser解析HTML字符串
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlString, 'text/html');

                        // 查询目标选择器下的所有元素
                        const elements = doc.querySelectorAll("#projectstatus > tbody > tr");
                        // 遍历这些元素，提取内容并添加到当前页面的td元素后面
                        elements.forEach(element => {
                            if (!element.classList.contains("header")) {
                                // 获取parentElement下的所有a标签
                                const aElements = element.querySelectorAll("a");
                                const otherNameTd = element.querySelector('td:nth-child(3) > a');
                                if(otherNameTd){
                                    console.log(projectName + "/" + otherNameTd.innerText);
                                    otherNameTd.innerHTML = projectName + "/" + otherNameTd.innerText;
                                }else{

                                    const master = element.querySelector('td:nth-child(3) > strong > a');
                                    if(master){
                                        console.log(projectName + "/" + master.innerText);
                                        master.innerHTML = projectName + "/" + master.innerText;
                                    }
                                }
                                // 遍历a标签并修改它们的href属性
                                aElements.forEach(aElement => {
                                    // 获取当前a标签的href属性值
                                    const currentHref = aElement.getAttribute("href");

                                    // 检查currentHref是否为空或者是否是一个有效的URL
                                    if (currentHref) {
                                        // 在href前增加/api前缀
                                        const newHref = aTag.getAttribute("href") + currentHref;

                                        // 设置新的href属性
                                        aElement.href = newHref;
                                    }
                                });
                                element.style.backgroundColor =  "#e3e3e3";
                                // 将新元素添加到td元素的后面
                                tr.parentNode.insertBefore(element, tr.nextSibling);

                                // 修正构建按钮的事件
                                const buildElements = element.querySelectorAll("a > img");
                                console.log(buildElements)
                                buildElements.forEach(build => {
                                    build.onclick = null;
                                    build.addEventListener('click', function(event) {
                                        buildProject(build);
                                        event.preventDefault();
                                        // 延迟1秒（1000毫秒）刷新
                                        setTimeout(function() {
                                            location.reload();
                                        }, 500);

                                    });
                                })
                            }
                        });
                    }).catch(error => {
                        console.error('获取页面内容时出现错误：', error);
                    });
                }
            }
        });
        // 执行原来的排序函数
        window.paixu();
    };
})();