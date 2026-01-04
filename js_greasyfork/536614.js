// ==UserScript==
// @name         审种删种辅助脚本
// @namespace    http://tampermonkey.net/
// @description:zh-CN  审种删种辅助脚本!如果未匹配成功请联系我:960487551@qq.com
// @description:en  Seed Review and Deletion Assistant Script! If the matching is unsuccessful, please contact me at: 960487551@qq.com
// @license MIT
// @author       wiiii
// @version      1.0.1
// @email        960487551@qq.com
// @copyright (c) 2025年4月12日22:04:30
// @match        *://*.cspt.top/*
// @match        *://*.cspt.cc/*
// @match        *://*.cspt.date/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536614/%E5%AE%A1%E7%A7%8D%E5%88%A0%E7%A7%8D%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/536614/%E5%AE%A1%E7%A7%8D%E5%88%A0%E7%A7%8D%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {
    'use strict';

    if (window !== window.top) return;

    // 配置类，根据不同站点设置不同的 URL
    const siteConfig = {
        "cspt.top": {
            wshURL: "/torrents.php?inclbookmarked=0&incldead=1&spstate=0&approval_status=0",
            fjdzURL: "/torrents.php?inclbookmarked=0&incldead=2&spstate=0&tag_id=21",
            fjURL: "/torrents.php?tag_id=21"
        },
        "cspt.cc": {
            wshURL: "/torrents.php?inclbookmarked=0&incldead=1&spstate=0&approval_status=0",
            fjdzURL: "/torrents.php?inclbookmarked=0&incldead=2&spstate=0&tag_id=21",
            fjURL: "/torrents.php?tag_id=21"
        },
        "cspt.date": {
            wshURL: "/torrents.php?inclbookmarked=0&incldead=1&spstate=0&approval_status=0",
            fjdzURL: "/torrents.php?inclbookmarked=0&incldead=2&spstate=0&tag_id=21",
            fjURL: "/torrents.php?tag_id=21"
        },
    };

    const host = window.location.host;
    const config = siteConfig[host];

    if (!config) {
        console.error(`没有为站点 ${host} 找到配置`);
        return;
    }

    // 创建按钮的函数
    function createButton(text, path) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.backgroundColor = '#4CAF50'; // 绿色背景
        btn.style.color = 'white'; // 白色字体
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.padding = '10px 15px';
        btn.style.margin = '5px 0'; // 上下间距
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.3s';
        btn.style.width = '100%'; // 让按钮宽度填满

        // 生成完整的 URL
        let url = "https://" + host + path;
        btn.onclick = function () {
            window.location.href = url;
        };

        // 鼠标悬停效果
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#45a049'; // 深绿色
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#4CAF50'; // 恢复原色
        };

        return btn;
    }

    function createButtonSelectAll(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.backgroundColor = '#008CBA'; // 蓝色背景
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.padding = '10px 15px';
        btn.style.margin = '5px 0';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.3s';
        btn.style.width = '100%';

        btn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].checkbox-del');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });
        });

        // 鼠标悬停效果
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#007B9E'; // 深蓝色
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#008CBA'; // 恢复原色
        };

        return btn;
    }

    function createButtonOpenSelected(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.backgroundColor = '#673AB7'; // 紫色背景
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.padding = '10px 15px';
        btn.style.margin = '5px 0';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.3s';
        btn.style.width = '100%';

        btn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].checkbox-del:checked');
            debugger;
            if (checkboxes.length > 0) {
                checkboxes.forEach(checkbox => {
                    const link = checkbox.parentElement.querySelector('a');
                    if (link) {
                        let id_value = link.href.split('id=')[1].split('&')[0]
                        // 生成完整的 URL
                        let url = "https://" + host;
                        let openUrl = `${url}/details.php?id=${id_value}&hit=1`
                        window.open(openUrl, '_blank'); // 在新标签页中打开链接
                    }
                });
            } else {
                alert("没有选择任何链接。");
            }
        });

        // 鼠标悬停效果
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#5E35B1'; // 深紫色
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#673AB7'; // 恢复原色
        };

        return btn;
    }


    function createButtonDelete(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.backgroundColor = '#f44336'; // 红色背景
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.padding = '10px 15px';
        btn.style.margin = '5px 0';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.3s';
        btn.style.width = '100%';

        btn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].checkbox-del');
            let selectedCount = 0;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedCount++;
                }
            });

            if (selectedCount > 0) {
                if (confirm(`你选择了 ${selectedCount} 个链接，是否继续？`)) {
                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked) {
                            const link = checkbox.parentElement.querySelector('a');
                            if (link) {
                                fetch(link.href)
                                    .then(response => {
                                        if (response.ok) {
                                            return response.text();
                                        } else {
                                            throw new Error('Network response was not ok.');
                                        }
                                    })
                                    .then(data => {
                                        console.log("删除" + link);
                                    })
                                    .catch(error => {
                                        console.error('There has been a problem with your fetch operation:', error);
                                    });
                            }
                        }
                    });
                }
            } else {
                alert("没有选择任何链接。");
            }
        });

        // 鼠标悬停效果
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#d32f2f'; // 深红色
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#f44336'; // 恢复原色
        };

        return btn;
    }

    function createButtonReplace(text) {
        let btn = document.createElement("button");
        btn.textContent = text;
        btn.style.backgroundColor = '#ff9800'; // 橙色背景
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.padding = '10px 15px';
        btn.style.margin = '5px 0';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.3s';
        btn.style.width = '100%';

        btn.addEventListener('click', () => {
            replaceHref();
        });

        // 鼠标悬停效果
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#fb8c00'; // 深橙色
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#ff9800'; // 恢复原色
        };

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
        });
    }

    // 创建按钮组容器
    const buttonGroup = document.createElement('div');
    buttonGroup.style.position = 'fixed';
    buttonGroup.style.right = '10px';
    buttonGroup.style.top = '10px';
    buttonGroup.style.width = '120px';
    buttonGroup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // 半透明白色背景
    buttonGroup.style.borderRadius = '8px';
    buttonGroup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    buttonGroup.style.padding = '10px';
    buttonGroup.style.zIndex = 1000;

    // 创建按钮
    let wsh = createButton("未审核", config.wshURL);
    let fjdz = createButton("分集断种", config.fjdzURL);
    let fj = createButton("分集", config.fjURL);
    let selectAll = createButtonSelectAll("全选");
    let delSelect = createButtonDelete("删除选择");
    let replace = createButtonReplace("刷新");
    let openSelect = createButtonOpenSelected("打开已勾选种子");

    // 将按钮添加到按钮组
    buttonGroup.appendChild(wsh);
    buttonGroup.appendChild(fjdz);
    buttonGroup.appendChild(fj);

    // 条件判断，添加其他按钮
    const url = new URL(window.location.href);
    const pathAndParams = url.pathname + url.search;
    // if (pathAndParams.startsWith(config.fjdzURL) || pathAndParams.startsWith(config.wshURL) || pathAndParams.startsWith(config.fjURL)) {
    replaceHref();
    buttonGroup.appendChild(selectAll);
    buttonGroup.appendChild(delSelect);
    buttonGroup.appendChild(replace);
    buttonGroup.appendChild(openSelect);
    // }

    // 将按钮组添加到页面上
    document.body.appendChild(buttonGroup);
})();
