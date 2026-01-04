// ==UserScript==
// @name         您的号要寄辣
// @namespace    https://greasyfork.org/zh-CN/scripts/465440
// @version      0.2.5
// @description  纯属娱乐，请勿滥用！
// @author       huoxin
// @match        https://somept.banned
// @icon         data:image/gif;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465440/%E6%82%A8%E7%9A%84%E5%8F%B7%E8%A6%81%E5%AF%84%E8%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/465440/%E6%82%A8%E7%9A%84%E5%8F%B7%E8%A6%81%E5%AF%84%E8%BE%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //=================配置区域 按需修改=================
    const leechwarned = 1; // 小黄帽，1为开启 0为关闭
    const warned = 1;      // 小红帽，1为开启 0为关闭
    const disabled = 1;    // ban，1为开启 0为关闭
    const autoChangeUsergroup = 1; // 需与上面leechwarned或者disabled同时开启才会生效，会自动替换你个人页面的用户组图片，Banned优先级高于Peasant
    //==================================================


    // 检查页面是否使用 NexusPHP
    const isNexusPHP = document.documentElement.innerHTML.toLowerCase().includes("nexusphp");

    if (!isNexusPHP) {
        return;
    }

    // 创建一个 img 元素，并设置 class、src 和 alt 属性
    const createImageElement = ({ className, src, alt }) => {
        const img = document.createElement('img');
        img.setAttribute('class', className);
        img.setAttribute('src', src);
        img.setAttribute('alt', alt);
        img.setAttribute('style', 'margin-left: 2pt');
        return img;
    };

    // 在指定的用户链接中添加具有特定 class、src 和 alt 属性的图像
    const addImageToUserLink = (userLink, { className, src, alt }) => {
        const img = createImageElement({ className, src, alt });
        userLink.after(img);
    };

    // 获取当前用户的用户名
    const usernameElement_allPage = document.querySelector('a[href*="userdetails.php?id="][class*="_Name"], a[href*="userdetails.php?id="] b');
    let yourusername;
    if (usernameElement_allPage) {
        if (usernameElement_allPage.querySelector('b')) {
            yourusername = usernameElement_allPage.querySelector('b').textContent.trim();
        } else if (usernameElement_allPage.querySelector('span')) {
            yourusername = usernameElement_allPage.querySelector('span').textContent.trim();
        }
    }
    if (yourusername) {
        console.log('[您的号要寄辣] 说：yourusername=' + yourusername);
    } else {
        console.log('[您的号要寄辣] 说：未检测到你的用户名！')
        return;
    }



    // 匹配用户的个人资料页面
    if (window.location.href.match(/\/userdetails\.php(\?id=\d+)?$/)) {
        let mode = '';

        // 检查NP界面
        if (document.querySelector('table.main tr')) {
            mode = 'normalNP'; // 传统NP界面
        } else if (document.querySelector('.flex span')) {
            mode = 'hhNP'; // 魔改NP界面
        }

        if (mode === 'normalNP') {
            // 给个人页面左上角的用户名添加图片
            const userLinks_userdetailsPage_normalNP = document.querySelectorAll('a[href*="userdetails.php?id="][class$="_Name"], a[href*="userdetails.php?id="] b');

            // 循环遍历每个用户链接，检查用户名是否匹配 yourusername，然后添加禁用图像
            for (let i = 0; i < userLinks_userdetailsPage_normalNP.length; i++) {
                var userLink_userdetailsPage_normalNP = userLinks_userdetailsPage_normalNP[i];
                let username_userdetailsPage_normalNP;

                if (userLink_userdetailsPage_normalNP.querySelector('b')) {
                    username_userdetailsPage_normalNP = userLink_userdetailsPage_normalNP.querySelector('b').textContent.trim();
                } else if (userLink_userdetailsPage_normalNP.querySelector('span')) {
                    username_userdetailsPage_normalNP = userLink_userdetailsPage_normalNP.querySelector('span').textContent.trim();
                }

                // 检查用户名是否匹配
                if (username_userdetailsPage_normalNP === yourusername) {

                    i = userLinks_userdetailsPage_normalNP.length; // 只给匹配到第一个用户名添加图片，之后直接跳出循环

                    if (leechwarned) {
                        addImageToUserLink(userLink_userdetailsPage_normalNP, {
                            className: 'leechwarned',
                            src: 'pic/trans.gif',
                            alt: 'Leechwarned'
                        });
                    }

                    if (warned) {
                        addImageToUserLink(userLink_userdetailsPage_normalNP, {
                            className: 'warned',
                            src: 'pic/trans.gif',
                            alt: 'Warned'
                        });
                    }

                    if (disabled) {
                        addImageToUserLink(userLink_userdetailsPage_normalNP, {
                            className: 'disabled',
                            src: 'pic/trans.gif',
                            alt: 'Disabled'
                        });
                    }
                }
            }

            const headings_userdetailsPage_normalNP = document.querySelectorAll('h1');

            for (let i = 0; i < headings_userdetailsPage_normalNP.length; i++) {
                var heading_userdetailsPage_normalNP = headings_userdetailsPage_normalNP[i];
                let username_userdetailsPage_normalNP, usernameElement_userdetailsPage_imgs;

                if (heading_userdetailsPage_normalNP.querySelector('b')) {
                    username_userdetailsPage_normalNP = heading_userdetailsPage_normalNP.querySelector('b');
                } else if (heading_userdetailsPage_normalNP.querySelector('span')) {
                    username_userdetailsPage_normalNP = heading_userdetailsPage_normalNP.querySelector('span');
                }

                // 检查是否获取到用户名
                if (username_userdetailsPage_normalNP) {
                    let hasImage = false;
                    usernameElement_userdetailsPage_imgs = username_userdetailsPage_normalNP.querySelectorAll('img');

                    if (username_userdetailsPage_normalNP.textContent.trim() === yourusername) {

                        // 检查是否已经添加图像
                        usernameElement_userdetailsPage_imgs.forEach(imgElement => {
                            if (imgElement.classList.contains('leechwarned', 'warned', 'disabled')) {
                                hasImage = true;
                            }
                        });

                        if (!hasImage) {
                            if (leechwarned) {
                                addImageToUserLink(username_userdetailsPage_normalNP, {
                                    className: 'leechwarned',
                                    src: 'pic/trans.gif',
                                    alt: 'Leechwarned'
                                });
                            }

                            if (warned) {
                                addImageToUserLink(username_userdetailsPage_normalNP, {
                                    className: 'warned',
                                    src: 'pic/trans.gif',
                                    alt: 'Warned'
                                });
                            }

                            if (disabled) {
                                addImageToUserLink(username_userdetailsPage_normalNP, {
                                    className: 'disabled',
                                    src: 'pic/trans.gif',
                                    alt: 'Disabled'
                                });
                            }
                        }

                        if (autoChangeUsergroup) {
                            // 选择所有具有 "main" 类的表格中的所有行
                            const rows = document.querySelectorAll('table.main tr');

                            // 过滤包含字符串 "等级" 的行
                            const levelRows = Array.from(rows).filter((row) => {
                                return row.textContent.includes('等级');
                            });

                            // 循环遍历每个等级行
                            levelRows.forEach((row, index) => {
                                if (index !== 0) { // 跳过第一个循环

                                    // 选择行内的图像元素
                                    const img = row.querySelector('img');

                                    // 避免覆盖性别图片
                                    if (img.classList.contains('male') || img.classList.contains('female') || img.classList.contains('no_gender')) {
                                        return;
                                    }

                                    // 获取当前的 src 属性值
                                    let src = img.getAttribute('src');

                                    if (/^pic\/\w+\.gif$/.test(src)) { // 传统NexusPHP用户等级

                                        if (disabled) {
                                            // 将文件名替换为 "banned.gif"
                                            src = src.replace(/\/[^/]+\.gif$/, '/banned.gif');

                                            // 使用新值更新 src 属性
                                            img.setAttribute('src', src);

                                            return;
                                        } else if (leechwarned) {
                                            // 将文件名替换为 "peasant.gif"
                                            src = src.replace(/\/[^/]+\.gif$/, '/peasant.gif');

                                            // 使用新值更新 src 属性
                                            img.setAttribute('src', src);
                                        }
                                    }
                                    else if (/^pic\/user_class\/\w+\.png/.test(src)) { // 魔改NexusPHP用户等级 喵~

                                        //因没有找到Disabled的图片，因此这里没有替换//

                                        if (leechwarned) {
                                            // 将文件名替换为 "peasant.png"
                                            src = src.replace(/(pic\/user_class\/)\w+\.png/, "$1peasant.png");

                                            // 使用新值更新 src 属性
                                            img.setAttribute('src', src);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        } else if (mode === 'hhNP') {
            let usernameDetected = false;
            const userLinks_userdetailsPage_hhNP = document.querySelectorAll('a[href*="userdetails.php?id="][class$="_Name"], a[href*="userdetails.php?id="] b');

            // 循环遍历每个用户链接，检查用户名是否匹配 yourusername，然后添加禁用图像
            for (let i = 0; i < userLinks_userdetailsPage_hhNP.length; i++) {
                var userLink_userdetailsPage_hhNP = userLinks_userdetailsPage_hhNP[i];
                let username_userdetailsPage_hhNP;

                if (userLink_userdetailsPage_hhNP.querySelector('b')) {
                    username_userdetailsPage_hhNP = userLink_userdetailsPage_hhNP.querySelector('b').textContent.trim();
                    usernameDetected = true;
                } else if (userLink_userdetailsPage_hhNP.querySelector('span')) {
                    username_userdetailsPage_hhNP = userLink_userdetailsPage_hhNP.querySelector('span').textContent.trim();
                    usernameDetected = true;
                }

                // 检查用户名是否匹配
                if (username_userdetailsPage_hhNP === yourusername) {

                    if (leechwarned) {
                        addImageToUserLink(userLink_userdetailsPage_hhNP, {
                            className: 'leechwarned',
                            src: 'pic/trans.gif',
                            alt: 'Leechwarned'
                        });
                    }

                    if (warned) {
                        addImageToUserLink(userLink_userdetailsPage_hhNP, {
                            className: 'warned',
                            src: 'pic/trans.gif',
                            alt: 'Warned'
                        });
                    }

                    if (disabled) {
                        addImageToUserLink(userLink_userdetailsPage_hhNP, {
                            className: 'disabled',
                            src: 'pic/trans.gif',
                            alt: 'Disabled'
                        });
                    }
                }
            }

            if (autoChangeUsergroup) {
                const spans = document.querySelectorAll('.flex span');

                let img;
                spans.forEach(span => {
                    if (span.textContent.includes('等级')) {
                        img = span.nextElementSibling.querySelector('img');
                    }
                });

                // 避免覆盖性别图片
                if (img.classList.contains('male') || img.classList.contains('female') || img.classList.contains('no_gender')) {
                    return;
                }

                // 获取当前的 src 属性值
                let src = img.getAttribute('src');

                if (/^pic\/\w+\.gif$/.test(src)) { // 传统NexusPHP用户等级

                    if (disabled) {
                        // 将文件名替换为 "banned.gif"
                        src = src.replace(/\/[^/]+\.gif$/, '/banned.gif');

                        // 使用新值更新 src 属性
                        img.setAttribute('src', src);

                        return;
                    } else if (leechwarned) {
                        // 将文件名替换为 "peasant.gif"
                        src = src.replace(/\/[^/]+\.gif$/, '/peasant.gif');

                        // 使用新值更新 src 属性
                        img.setAttribute('src', src);
                    }
                }
            }
        }
    } else { // 匹配非个人用户界面
        const userLinks_allPage = document.querySelectorAll('a[href*="userdetails.php?id="][class$="_Name"], a[href*="userdetails.php?id="] b');

        // 循环遍历每个用户链接，检查用户名是否匹配 yourusername，然后添加禁用图像
        for (let i = 0; i < userLinks_allPage.length; i++) {
            var userLink_allPage = userLinks_allPage[i];
            let username_allPage;

            if (userLink_allPage.querySelector('b')) {
                username_allPage = userLink_allPage.querySelector('b').textContent.trim();
            } else if (userLink_allPage.querySelector('span')) {
                username_allPage = userLink_allPage.querySelector('span').textContent.trim();
            } else {
                username_allPage = '';
            }

            // 检查用户名是否匹配，同时匹配 用户名（等级）这种格式的
            if (username_allPage === yourusername || new RegExp(`${yourusername} \\(.+\\)`).test(username_allPage)) {

                if (leechwarned) {
                    addImageToUserLink(userLink_allPage, {
                        className: 'leechwarned',
                        src: 'pic/trans.gif',
                        alt: 'Leechwarned'
                    });
                }

                if (warned) {
                    addImageToUserLink(userLink_allPage, {
                        className: 'warned',
                        src: 'pic/trans.gif',
                        alt: 'Warned'
                    });
                }

                if (disabled) {
                    addImageToUserLink(userLink_allPage, {
                        className: 'disabled',
                        src: 'pic/trans.gif',
                        alt: 'Disabled'
                    });
                }
            }
        }
    }

})();