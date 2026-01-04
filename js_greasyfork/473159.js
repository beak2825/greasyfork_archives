// ==UserScript==
// @name         图集岛侧边栏
// @namespace    http://www.tujidao09.com/
// @version      3.7
// @description  在图集岛页面中的侧边栏显示标签、人物和链接，并具备自动隐藏和迷你边栏功能
// @author       William Zhou
// @match   *://*.jimeilu*.com/*
// @match   *://*.tujidao*.com/*
// @match   *://*.sqmuying.com/*
// @include /^https?:\/\/jimeilu[0-9]*\.com\/.*$/
// @include /^https?:\/\/.*\.jimeilu[0-9]*\.com\/.*$/
// @include /^https?:\/\/tujidao[0-9]*\.com\/.*$/
// @include /^https?:\/\/.*\.tujidao[0-9]*\.com\/.*$/
// @include /^https?:\/\/sqmuying[0-9]*\.com\/.*$/
// @include /^https?:\/\/.*\.sqmuying[0-9]*\.com\/.*$/
// @icon         https://www.apple.com.cn/v/iphone/home/bp/images/overview/compare/icon_touch_id__etlcbgeryay6_large.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473159/%E5%9B%BE%E9%9B%86%E5%B2%9B%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473159/%E5%9B%BE%E9%9B%86%E5%B2%9B%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sidebarVersion = 1.0;

    // 每次输出后将版本号增加 0.1
    sidebarVersion += 0.1;
    console.log(`侧边栏版本：${sidebarVersion}`);

    // 创建并显示侧边栏的函数
    function createSidebar(tagsWithImages, tagsWithoutImages, characters, h1Links) {
        const sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'sidebar-container';
        sidebarContainer.style.position = 'fixed';
        sidebarContainer.style.top = '50%';
        sidebarContainer.style.right = '-140px'; // 初始化位置在屏幕外
        sidebarContainer.style.transform = 'translateY(-50%)';
        sidebarContainer.style.width = '120px';
        sidebarContainer.style.height = '480px';
        sidebarContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        sidebarContainer.style.backdropFilter = 'blur(10px)';
        sidebarContainer.style.borderRadius = '8px'; // 添加8px圆角
        sidebarContainer.style.color = '#ffffff';
        sidebarContainer.style.padding = '10px';
        sidebarContainer.style.zIndex = '9999';
        sidebarContainer.style.overflowY = 'auto';
        sidebarContainer.style.transition = 'right 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s'; // 添加动画效果

        const tagsList = document.createElement('ul');
        tagsList.style.listStyle = 'none';
        tagsList.style.margin = '0';
        tagsList.style.padding = '0';

        // 将带有 "[]" 的字符放在列表的前面
        characters.sort((a, b) => {
            if (a.includes('[') && a.includes(']')) {
                return -1;
            } else if (b.includes('[') && b.includes(']')) {
                return 1;
            } else {
                return 0;
            }
        });

        characters.forEach(character => {
            const characterItem = document.createElement('li');
            const characterLink = document.createElement('a');
            characterLink.href = `/sousu/?s0=${character}`;
            characterLink.textContent = `[${character}]`;
            characterLink.style.color = '#ffffff';
            characterItem.appendChild(characterLink);
            tagsList.appendChild(characterItem);
        });

        tagsWithImages.forEach(tag => {
            const tagItem = document.createElement('li');
            const tagImage = document.createElement('img');
            const tagLink = document.createElement('a');
            tagImage.src = `https://picew6d4ew.82pic.com/t/${tag.imageId}.jpg`;
            tagImage.style.maxWidth = '100%';
            tagImage.style.borderRadius = '20px'; // 添加20px圆角
            tagLink.href = tag.link;
            tagLink.textContent = tag.name;
            tagLink.style.color = '#ffffff';
            tagItem.appendChild(tagImage);
            tagItem.appendChild(tagLink);
            tagsList.appendChild(tagItem);
        });

        tagsWithoutImages.forEach(tag => {
            const tagItem = document.createElement('li');
            const tagLink = document.createElement('a');
            tagLink.href = tag.link;
            tagLink.textContent = tag.name;
            tagLink.style.color = '#ffffff';
            tagItem.appendChild(tagLink);
            tagsList.appendChild(tagItem);
        });

        h1Links.forEach(h1Link => {
            const h1Item = document.createElement('li');
            const h1LinkElement = document.createElement('a');
            h1LinkElement.href = `/sousu/?s0=${h1Link}`;
            h1LinkElement.textContent = `[${h1Link}]`;
            h1LinkElement.style.color = '#ffffff';
            h1Item.appendChild(h1LinkElement);
            tagsList.appendChild(h1Item);
        });

        sidebarContainer.appendChild(tagsList);
        document.body.appendChild(sidebarContainer);

        // 将侧边栏移动到显示位置
        setTimeout(() => {
            sidebarContainer.style.right = '0';
        }, 100);

        // 鼠标未在侧边栏操作时，30秒后隐藏侧边栏并显示倒计时状态
        let timer;
        sidebarContainer.addEventListener('mouseleave', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                sidebarContainer.style.right = '-140px';
                showMiniSidebar();
            }, 3000); // 30秒后自动隐藏侧边栏
        });

        // 显示迷你边栏
        function showMiniSidebar() {
            const miniSidebar = document.createElement('div');
            miniSidebar.id = 'mini-sidebar';
            miniSidebar.style.position = 'fixed';
            miniSidebar.style.top = '50%';
            miniSidebar.style.right = '0';
            miniSidebar.style.transform = 'translateY(-50%)';
            miniSidebar.style.width = '8px';
            miniSidebar.style.height = '100px';
            miniSidebar.style.backgroundColor = '#17a1ff';
            miniSidebar.style.borderRadius = '100px'; // 添加圆角
            miniSidebar.style.zIndex = '9998';
            miniSidebar.style.cursor = 'pointer';
            miniSidebar.addEventListener('mouseenter', () => {
                sidebarContainer.style.right = '0';
                clearTimeout(timer);
            });

            miniSidebar.style.backgroundColor = 'rgba(23, 161, 255, 0.6)'; // 半透明的蓝色背景
            // ...其他样式设置

            let opacity = 0.6; // 初始透明度
            let increasing = true; // 透明度递增标志

            const breathAnimation = setInterval(() => {
                if (increasing) {
                    opacity += 0.01;
                } else {
                    opacity -= 0.01;
                }

                if (opacity >= 0.8) {
                    increasing = false;
                } else if (opacity <= 0.6) {
                    increasing = true;
                }

                miniSidebar.style.backgroundColor = `rgba(23, 161, 255, ${opacity})`;
            }, 50); // 设置呼吸动画的时间间隔

            miniSidebar.addEventListener('mouseenter', () => {
                clearInterval(breathAnimation); // 停止呼吸动画
                sidebarContainer.style.right = '0';
                clearTimeout(timer);
            });

            miniSidebar.addEventListener('mouseleave', () => {
                breathAnimation(); // 重新开始呼吸动画
                sidebarContainer.style.right = '-140px';
                showMiniSidebar();
            });

            document.body.appendChild(miniSidebar);
        }
    }

    // 检查链接是否仅为域名
    function isDomainOnly(url) {
        const domain = window.location.hostname;
        return url === `http://${domain}/` || url === `https://${domain}/`;
    }

    // 获取图片 ID
    function getImageId(url) {
        const match = url.match(/\/t\/\?id=(\d+)/);
        return match ? match[1] : null;
    }

    // 页面加载完毕后执行
    window.addEventListener('load', () => {
        const uniqueLinks = new Set();
        const tagsWithImages = [];
        const tagsWithoutImages = [];
        const characters = [];
        const h1Links = [];
        const tagsElements = document.querySelectorAll('.tags a');
        const pElements = document.querySelectorAll('p');
        const biaotiElements = document.querySelectorAll('.biaoti');
        const h1Elements = document.querySelectorAll('h1');

        pElements.forEach(pElement => {
            const linkElement = pElement.querySelector('a');
            if (linkElement && !isDomainOnly(linkElement.href) && !uniqueLinks.has(linkElement.href)) {
                const tagName = linkElement.textContent;
                const tagLink = linkElement.href;
                const imageId = getImageId(tagLink);
                if (imageId) {
                    tagsWithImages.push({ name: tagName, link: tagLink, imageId: imageId });
                } else {
                    tagsWithoutImages.push({ name: tagName, link: tagLink });
                }
                uniqueLinks.add(tagLink);
            }
        });

        tagsElements.forEach(tagElement => {
            const tagName = tagElement.textContent;
            const tagLink = tagElement.href;
            if (!isDomainOnly(tagLink) && !uniqueLinks.has(tagLink)) {
                const imageId = getImageId(tagLink);
                if (imageId) {
                    tagsWithImages.push({ name: tagName, link: tagLink, imageId: imageId });
                } else {
                    tagsWithoutImages.push({ name: tagName, link: tagLink });
                }
                uniqueLinks.add(tagLink);
            }
        });

        biaotiElements.forEach(biaotiElement => {
            const biaotiText = biaotiElement.textContent.trim();
            const biaotiWords = biaotiText.split(' ');
            biaotiWords.forEach(word => {
                const character = word.trim();
                if (character.length > 0 && !characters.includes(character)) {
                    characters.push(character);
                }
            });
        });

        h1Elements.forEach(h1Element => {
            const h1Text = h1Element.textContent.trim();
            const h1Words = h1Text.split(' ');
            h1Words.forEach(word => {
                const linkText = word.trim();
                if (linkText.length > 0 && !h1Links.includes(linkText)) {
                    h1Links.push(linkText);
                }
            });
        });

        if (tagsWithImages.length > 0 || tagsWithoutImages.length > 0 || characters.length > 0 || h1Links.length > 0) {
            createSidebar(tagsWithImages, tagsWithoutImages, characters, h1Links);
        }
    });

    // 为侧边栏添加样式
    GM_addStyle(`
        /* 添加额外的样式 */
        /* 自定义滚动条样式 */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #414141;
            border-radius: 8px;
        }

        ::-webkit-scrollbar-track {
            background-color: #2b2b2b;
            border-radius: 8px;
        }
    `);

})();