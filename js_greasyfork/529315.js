// ==UserScript==
// @name         前程无忧(51job)增强工具
// @namespace    http://tampermonkey.net/
// @version      2.5.5
// @description  在前程无忧(51job)职位列表中显示学历、工作经验年限、发布时间、职位区域和关键词，个人简历页面优化样式，导航可隐藏，岗位页面显示竞争力分析
// @author       johnchan1017
// @match        https://we.51job.com/*
// @match        https://jobs.51job.com/*
// @match        https://i.51job.com/*
// @run-at       document-idle
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529701/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%2851job%29%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529701/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%2851job%29%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取路径并移除 .html 后的查询参数
    let currentpath = window.location.pathname;
    if (currentpath.includes('.html')) {
        currentpath = currentpath.split('.html')[0] + '.html';
    }
    console.log('处理后的路径:', currentpath);

    // 显示附加信息的函数（适用于职位列表页面）
    function displayAttachInfo() {
        if (currentpath.startsWith('/users/') || currentpath.match(/^\/(guangzhou(-[a-z]{2,3})?|all)\/\d+\.html/)) return;
        for (let i = 1; i <= 20; i++) {
            let sensorsElement = null;
            if (currentpath === "/pc/search") {
                sensorsElement = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.joblist > div:nth-child(${i}) > div > div[sensorsname]`);
            } else if (currentpath === "/applysuccess.php") {
                sensorsElement = document.querySelector(`#similar > div.j_joblist > div:nth-child(${2*i-1}) > a > div[sensorsname]`);
            }

            if (!sensorsElement) {
                console.log("没有找到带数据的节点");
                continue;
            }

            let jsonObject = JSON.parse(sensorsElement.getAttribute("sensorsdata"));
            let jobListItemTopElements = null;
            if (currentpath === "/pc/search") {
                jobListItemTopElements = sensorsElement.querySelector('.joblist-item-top');
            } else if (currentpath === "/applysuccess.php") {
                jobListItemTopElements = document.querySelector(`#similar > div.j_joblist > div:nth-child(${2*i-1}) > a > p`);
            }

            if (!jobListItemTopElements) {
                continue;
            }

            let attachInfoSpan = jobListItemTopElements.querySelector('.custom-attach-span');
            if (!attachInfoSpan) {
                let attachInfoSpan = document.createElement('span');
                attachInfoSpan.classList.add('custom-attach-span');
                let displayContent = "";

                if (jsonObject.jobDegree) displayContent += jsonObject.jobDegree + " | ";
                if (jsonObject.jobYear) displayContent += jsonObject.jobYear + " | ";
                if (jsonObject.jobTime) displayContent += jsonObject.jobTime + " | ";
                if (jsonObject.jobArea) displayContent += jsonObject.jobArea + " | ";
                if (jsonObject.keyword) displayContent += jsonObject.keyword;

                attachInfoSpan.textContent = displayContent;
                attachInfoSpan.style.color = '#2AC08E';
                attachInfoSpan.style.fontSize = '13px';
                attachInfoSpan.style.fontWeight = 600;
                attachInfoSpan.style.marginLeft = '16px';
                jobListItemTopElements.appendChild(attachInfoSpan);
            }
        }
    }

    // 处理简历页面样式优化（适用于 i.51job.com）
    function handleResumePage() {
        if (!currentpath.startsWith('/users/')) return;

        const nav = document.querySelector('.nav');
        if (nav) {
            nav.style.transition = 'all 0.3s ease';
            nav.style.display = 'block';
            nav.dataset.hidden = 'false';
            console.log('导航元素 (.nav) 已找到，正在应用隐藏功能');
        } else {
            console.warn('未找到导航元素 (.nav)，隐藏功能无法应用');
        }

        const mainContent = document.querySelector('#maincontent');
        if (mainContent) {
            const columns = mainContent.querySelectorAll('.column');
            if (columns.length > 0) {
                columns.forEach(column => {
                    column.style.float = 'none';
                    console.log('已移除 .column 的 float: right 样式');
                });
            } else {
                console.warn('未在 #maincontent 中找到 .column 元素');
            }
        } else {
            console.warn('未找到 #maincontent 元素，无法调整样式');
        }

        const top = document.querySelector('#top');
        if (top) {
            const innerDiv = top.querySelector('.in');
            if (innerDiv && !document.querySelector('#toggleStyleBtn')) {
                const button = document.createElement('button');
                button.id = 'toggleStyleBtn';
                button.innerHTML = '隐藏导航';
                button.style.position = 'fixed';
                button.style.right = '20px';
                button.style.top = '10px';
                button.style.zIndex = '9999';
                button.style.backgroundColor = '#2AC08E';
                button.style.borderRadius = '4px';
                button.style.color = 'white';
                button.style.padding = '4px 8px';

                button.addEventListener('click', () => {
                    if (nav) {
                        if (nav.dataset.hidden === 'false') {
                            nav.style.display = 'none';
                            nav.dataset.hidden = 'true';
                            button.innerHTML = '显示导航';
                            console.log('导航已隐藏');
                        } else {
                            nav.style.display = 'block';
                            nav.dataset.hidden = 'false';
                            button.innerHTML = '隐藏导航';
                            console.log('导航已显示');
                        }
                    } else {
                        console.warn('导航元素 (.nav) 未找到，无法切换');
                    }
                });

                innerDiv.appendChild(button);
                console.log('样式切换按钮已添加到 #top 的 .in 中');
            } else if (!innerDiv) {
                console.warn('未找到 #top 中的 .in 元素，按钮无法添加');
            }
        } else {
            console.warn('未找到 #top 元素，无法添加切换按钮');
        }
    }

    // 获取岗位页面竞争力分析信息
    function fetchCompetitivenessInfo() {
        if (!currentpath.match(/^\/(guangzhou(-[a-z]{2,3})?|all)\/\d+\.html/)) {
            console.log('路径不匹配岗位页面:', currentpath);
            return;
        }
        console.log('路径匹配成功，执行竞争力分析:', currentpath);

        const link = document.querySelector('a.icon_b.i_upline');
        if (!link) {
            console.warn('未找到竞争力分析链接 a.icon_b.i_upline');
            return;
        }

        let href = link.getAttribute('href');
        if (!href) {
            console.warn('竞争力分析链接缺少 href 属性');
            return;
        }

        href = href.startsWith('//') ? 'https:' + href : (href.startsWith('/') ? 'https://i.51job.com' + href : href);
        console.log('请求的竞争力分析 URL:', href);

        GM_xmlhttpRequest({
            method: 'GET',
            url: href,
            responseType: 'blob',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9',
            },
            onload: function(response) {
                const reader = new FileReader();
                reader.onload = function() {
                    const text = reader.result;
                    console.log('解码后响应（前200字符）:', text.substring(0, 200));

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const h2Element = doc.querySelector('.h2');
                    const displayText = h2Element ? h2Element.textContent.trim() : '未找到 h2 元素';
                    console.log('提取的竞争力分析文本:', displayText);

                    // 追加到 class="msg ltype" 中并应用样式
                    const msgElement = document.querySelector('.msg.ltype');
                    if (msgElement) {
                        if (!msgElement.querySelector('#competitiveness-info')) {
                            const competitivenessSpan = document.createElement('span');
                            competitivenessSpan.id = 'competitiveness-info';
                            competitivenessSpan.textContent = ` | 竞争力分析: ${displayText}`;
                            competitivenessSpan.style.color = '#ff6000';
                            competitivenessSpan.style.overflow = 'hidden';
                            competitivenessSpan.style.margin = '0 10px 10px 0';
                            competitivenessSpan.style.padding = '0 5px';
                            competitivenessSpan.style.backgroundColor = '#FFF2E3';

                            msgElement.appendChild(competitivenessSpan);
                            console.log('竞争力分析信息已追加到 .msg.ltype:', displayText);
                        } else {
                            console.log('竞争力分析信息已存在，不重复追加');
                        }
                    } else {
                        console.warn('未找到 .msg.ltype 元素，无法追加竞争力分析信息');
                    }
                };
                reader.onerror = function() {
                    console.warn('FileReader 读取失败');
                };
                reader.readAsText(response.response, 'gbk');
            },
            onerror: function() {
                console.warn('获取竞争力分析页面失败，可能需要登录或存在跨域限制');
            }
        });
    }

    // MutationObserver 监听 DOM 变化并延迟执行
    function runWithDelay() {
        setTimeout(() => {
            displayAttachInfo();
            handleResumePage();
            fetchCompetitivenessInfo();
        }, 1000); // 延迟 1 秒，确保动态内容加载
    }

    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                console.log('DOM has been modified');
                runWithDelay();
            }
        });
    });

    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);

    // 初次执行
    runWithDelay();
})();