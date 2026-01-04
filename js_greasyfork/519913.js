// ==UserScript==
// @name         AGSV删种脚本
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  AGSV删除断种分集的脚本，配合自动翻页脚本食用更佳
// @author       Exception
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agsvpt.com
// @match        *://*.agsvpt.com/
// @match        *://*.agsvpt.cn/
// @match        *://*.agsvpt.com/*
// @match        *://*.agsvpt.cn/*
// @exclude      *://*.agsvpt.com/nexusphp/*
// @exclude      *://bbs.agsvpt.cn/*
// @exclude      *://*.agsvpt.com/nexusphp
// @exclude      *://*.agsvpt.cn/nexusphp/*
// @exclude      *://*.agsvpt.cn/nexusphp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519913/AGSV%E5%88%A0%E7%A7%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519913/AGSV%E5%88%A0%E7%A7%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window !== window.top) return;

    const wshURL = "/torrents.php?inclbookmarked=0&incldead=1&spstate=0&approval_status=2"

    const fjdzURL = "/torrents.php?inclbookmarked=0&incldead=2&spstate=0&tag_id=48"

    const fjURL = "/torrents.php?tag_id=48"

    // 创建按钮的函数
    function createButton(text, path) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.position = "fixed";
        btn.style.right = "10px";
        btn.style.width = "100px";
        btn.style.height = "60px";
        // 获取当前页面的主机名
        let host = window.location.host;
        // 生成完整的 URL
        let url = "http://" + host + path;
        btn.onclick = function () {
            window.location.href = url;
        };
        return btn;
    }

    function createButtonSelectAll(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.position = "fixed";
        btn.style.right = "10px";
        btn.style.width = "100px";
        btn.style.height = "60px";
        btn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].checkbox-del');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });
        });
        return btn;
    }

    function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function createButtonDelete(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.position = "fixed";
        btn.style.right = "10px";
        btn.style.width = "100px";
        btn.style.height = "60px";
        btn.addEventListener('click',async () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].checkbox-del');
            let selectedCount = 0;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedCount++;
                }
            });

            if (selectedCount > 0) {
                if (confirm(`你选择了 ${selectedCount} 个链接，是否继续？`)) {
                    for (const checkbox of checkboxes) {
                        if (checkbox.checked) {
                            const link = checkbox.parentElement.querySelector('a');
                            if (link) {
                                //window.open(link.href, '_blank');
                                fetch(link.href)
                                .then(response => {
                                    if (response.ok) {
                                        return response.text();
                                    } else {
                                        throw new Error('Network response was not ok.');
                                    }
                                })
                                .then(data => {
                                    console.log("删除"+link)
                                })
                                .catch(error => {
                                    console.error('There has been a problem with your fetch operation:', error);
                                });
                            }
                            //防止太快触发流控
                            await sleep(200);
                        }
                    };
                }
            } else {
                alert("没有选择任何链接。");
            }
        });
        return btn;
    }

    function createButtonReplace(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.position = "fixed";
        btn.style.right = "10px";
        btn.style.width = "100px";
        btn.style.height = "60px";
        btn.addEventListener('click', () => {
           replaceHref()
        });
        return btn;
    }


    function replaceHref() {
        const links = document.querySelectorAll('a[href^="fastdelete.php?id="]');
        links.forEach((link, index) => {
            const url = new URL(link.href);
            url.searchParams.set('sure', '1');
            link.href = url.toString();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = "checkbox-del"
            checkbox.id = `checkbox-${index}`;
            link.parentNode.insertBefore(checkbox, link);
        })
    }

    // 创建一个按钮，跳转到特定的页面
    let wsh = createButton("未审核", wshURL);
    let fjdz = createButton("分集断种", fjdzURL)
    let fj = createButton("分集", fjURL)
    let selectAll = createButtonSelectAll("全选")
    let delSelect = createButtonDelete("删除选择")
    let replace = createButtonReplace("刷新")
    // 设置按钮的位置
    wsh.style.top = "10px";
    fjdz.style.top = "100px";
    fj.style.top="190px"
    selectAll.style.top = "280px"
    delSelect.style.top = "370px"
    replace.style.top = "460px"


    // 将按钮添加到页面上
    document.body.appendChild(wsh);
    document.body.appendChild(fjdz);
    document.body.appendChild(fj)
    const url = new URL(window.location.href);
    const pathAndParams = url.pathname + url.search;
    if (pathAndParams.startsWith(fjdzURL) || pathAndParams.startsWith(wshURL) || pathAndParams.startsWith(fjURL)) {
        replaceHref()
        document.body.appendChild(selectAll);
        document.body.appendChild(delSelect);
        document.body.appendChild(replace);
    }

})();