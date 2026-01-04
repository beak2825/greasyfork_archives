// ==UserScript==
// @name         Pixiv 小说屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  按照pixiv小说的文章简介，系列标题，文章标题，作者，tag来屏蔽小说的一个脚本
// @author       DeanShaw
// @match        https://www.pixiv.net/tags/*/novels?*s_mode=s_tag*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chrxw.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489555/Pixiv%20%E5%B0%8F%E8%AF%B4%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/489555/Pixiv%20%E5%B0%8F%E8%AF%B4%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

var author_select = 'a.gtm-novel-searchpage-result-user.sc-fbe982d0-2.sc-20001e98-15.caPKbc.iuEkBA';
var title_select = 'a.sc-38ec486e-7.sc-20001e98-14.dnxTdm.fypmvV.gtm-novel-searchpage-result-title';
var title_series_select = 'a.sc-20001e98-16.kryCS.gtm-novel-searchpage-result-series-title';
var content_select = 'div.sc-22094ca2-0.eJMcqc';

var tag_select1 = 'ul.sc-20001e98-18.fVGoAQ';
var tag_select2 = 'a.gtm-novel-searchpage-result-tag span';

(function() {
    'use strict';

    const ContentStorageKey = 'blockedContentList';
    const authorStorageKey = 'blockedAuthorsList';
    const titleStorageKey = 'blockedTitlesList';
    const seriesStorageKey = 'blockedSeriesList';
    const TagsStorageKey = 'blockedTagsList';
    let buttonsGenerated = 0;
    let currentPageUrl = window.location.href;

     // Function to get the blocked Tag list from storage
     function getBlockedTags() {
        return GM_getValue(TagsStorageKey, "").split(/[,，]/).filter(tag => tag.trim() !== "");
    }

    // Function to set the blocked Tag list in storage
    function setBlockedTags(list) {
        GM_setValue(TagsStorageKey, list.join(','));
    }

     // Function to get the blocked Content list from storage
    function getBlockedContents() {
        return GM_getValue(ContentStorageKey, "").split(/[,，]/).filter(content => content.trim() !== "");
    }

    // Function to set the blocked Content list in storage
    function setBlockedContents(list) {
        GM_setValue(ContentStorageKey, list.join(','));
    }

    // Function to get the blocked authors list from storage
    function getBlockedAuthors() {
        return GM_getValue(authorStorageKey, "").split(/[,，]/).filter(author => author.trim() !== "");
    }

    // Function to set the blocked authors list in storage
    function setBlockedAuthors(list) {
        GM_setValue(authorStorageKey, list.join(','));
    }

    // Function to get the blocked titles list from storage
    function getBlockedTitles() {
        return GM_getValue(titleStorageKey, "").split(/[,，]/).filter(title => title.trim() !== "");
    }

    // Function to set the blocked titles list in storage
    function setBlockedTitles(list) {
        GM_setValue(titleStorageKey, list.join(','));
    }

    // Function to get the blocked series list from storage
    function getBlockedSeries() {
        return GM_getValue(seriesStorageKey, "").split(/[,，]/).filter(series => series.trim() !== "");
    }

    // Function to set the blocked series list in storage
    function setBlockedSeries(list) {
        GM_setValue(seriesStorageKey, list.join(','));
    }

    // Function to create the "Edit List" button with border, background color, and smaller size
    function createEditButton(text, storageKey, buttonText, position) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = position;
        button.style.transform = 'translateX(-50%)';
        button.style.zIndex = 1000;
        button.style.fontFamily = '微软雅黑'; // 设置字体为微软雅黑

        // 设置灰色背景、边框以及更小的按钮尺寸
        button.style.border = '2px solid #6c757d'; // 设置边框颜色为灰色
        button.style.backgroundColor = '#6c757d'; // 设置背景颜色为灰色
        button.style.color = '#fff'; // 设置文字颜色为白色
        button.style.padding = '6px 12px'; // 设置按钮的内边距为较小的值
        button.style.borderRadius = '5px'; // 设置圆角
        button.style.fontSize = '14px'; // 设置字体大小为14px，较小
        button.style.cursor = 'pointer'; // 鼠标悬停时变成手型

        // 鼠标悬停时改变背景颜色
        button.onmouseover = () => {
            button.style.backgroundColor = '#5a6268'; // 设置鼠标悬停时的背景颜色
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#6c757d'; // 恢复默认背景颜色
        };

        button.onclick = () => editList(storageKey, buttonText);
        document.body.appendChild(button);
        return button;
    }



    // Function to edit the blocked authors, titles, or series list
    function editList(storageKey, buttonText) {
        const currentList = storageKey === authorStorageKey ? getBlockedAuthors().join(',') :
                            storageKey === titleStorageKey ? getBlockedTitles().join(',') :
                            storageKey === ContentStorageKey ? getBlockedContents().join(',') :
                            storageKey === TagsStorageKey ? getBlockedTags().join(',') :
                            getBlockedSeries().join(',');
        const newList = prompt(`编辑${buttonText}（用逗号分隔）:`, currentList);
        if (newList !== null) {
            storageKey === authorStorageKey ? setBlockedAuthors(newList.split(/[,，]/)) :
            storageKey === titleStorageKey ? setBlockedTitles(newList.split(/[,，]/)) :
            storageKey === ContentStorageKey ? setBlockedContents(newList.split(/[,，]/)) :
            storageKey === TagsStorageKey ? setBlockedTags(newList.split(/[,，]/)) :
            setBlockedSeries(newList.split(/[,，]/));
            location.reload();
        }
    }


    // Function to hide blocked authors' content
    function hideBlockedAuthorsContent() {
        const blockedAuthors = getBlockedAuthors();
        const authorElements = document.querySelectorAll(author_select);
        authorElements.forEach(el => {
            const authorName = el.innerText;
            if (blockedAuthors.includes(authorName)) {
                el.closest('li').style.display = 'none';
            }
        });
    }

    // Function to hide blocked titles
    function hideBlockedTitles() {
        const blockedTitles = getBlockedTitles();
        const titleElements = document.querySelectorAll(title_select);
        titleElements.forEach(el => {
            const title = el.innerText;
            if (blockedTitles.some(keyword => title.includes(keyword))) {
                el.closest('li').style.display = 'none';
            }
        });
    }

    // Function to hide blocked series
    function hideBlockedSeries() {
        const blockedSeries = getBlockedSeries();
        const seriesElements = document.querySelectorAll(title_series_select);
        seriesElements.forEach(el => {
            const series = el.innerText;
            if (blockedSeries.some(keyword => series.includes(keyword))) {
                el.closest('li').style.display = 'none';
            }
        });
    }

    function hideBlockedContent() {
        const blockedContents = getBlockedContents();
        const contentElements = document.querySelectorAll(content_select);

        contentElements.forEach(el => {
            const content = el.innerText;
            if (blockedContents.some(keyword => content.includes(keyword))) {
                const articleElement = el.closest('li'); // 获取包含该正文的最接近的 <li> 元素
                if (articleElement) {
                    articleElement.style.display = 'none';
                }
            }
        });
    }

    function hideBlockedTags() {
        const blockedTags = getBlockedTags(); // 获取屏蔽标签列表
        const articleElements = document.querySelectorAll(tag_select1); // 选择每篇文章的标签元素

        articleElements.forEach(article => {
            let tags = [];
            // 提取每篇文章中的标签文本
            article.querySelectorAll(tag_select2).forEach(tagElement => {
                tags.push(tagElement.innerText);
            });

            // 检查标签是否包含屏蔽标签列表中的任意元素
            if (tags.some(tag => blockedTags.some(blockedTag => tag.includes(blockedTag)))) {
                article.closest('li').style.display = 'none'; // 隐藏整篇文章
            }
        });
    }



    // Function to add a "Block" button next to each author name
    function addBlockButtons() {
        const authorElements = document.querySelectorAll(author_select);
        authorElements.forEach(el => {
            const authorName = el.innerText;
            if (!el.nextSibling || el.nextSibling.innerText !== '屏蔽该作者') {
                const blockButton = document.createElement('button');
                blockButton.innerText = '屏蔽该作者';
                blockButton.style.padding = '5px 10px'; // 设置按钮大小
                blockButton.style.fontSize = '12px'; // 设置字体大小
                blockButton.style.fontFamily = '微软雅黑'; // 设置字体为微软雅黑
                blockButton.style.marginLeft = '10px'; // 添加左边距
                blockButton.style.cursor = 'pointer'; // 设置鼠标指针样式
                blockButton.style.border = '1px solid #ccc'; // 设置边框样式
                blockButton.style.borderRadius = '5px'; // 设置边框圆角
                blockButton.style.backgroundColor = '#f0f0f0'; // 设置背景颜色
                blockButton.style.color = '#333'; // 设置文字颜色
                blockButton.onclick = () => {
                    const blockedAuthors = getBlockedAuthors();
                    if (!blockedAuthors.includes(authorName)) {
                        blockedAuthors.push(authorName);
                        setBlockedAuthors(blockedAuthors);
                        alert(`${authorName} 已加入屏蔽列表`);
                        location.reload();
                    } else {
                        alert(`${authorName} 已在屏蔽列表中`);
                    }
                };
                el.parentNode.insertBefore(blockButton, el.nextSibling); // 插入到作者名后面
            }
        });
    }


    // Function to add a "Block" button next to each series name
    function addBlockSeriesButtons() {
        const seriesElements = document.querySelectorAll(title_series_select);
        seriesElements.forEach(el => {
            const seriesName = el.innerText;
            if (!el.nextSibling || el.nextSibling.innerText !== '屏蔽该系列') {
                const blockButton = document.createElement('button');
                blockButton.innerText = '屏蔽该系列';
                blockButton.style.padding = '5px 10px'; // 设置按钮大小
                blockButton.style.fontSize = '12px'; // 设置字体大小
                blockButton.style.fontFamily = '微软雅黑'; // 设置字体为微软雅黑
                blockButton.style.marginLeft = '10px'; // 添加左边距
                blockButton.style.cursor = 'pointer'; // 设置鼠标指针样式
                blockButton.style.border = '1px solid #ccc'; // 设置边框样式
                blockButton.style.borderRadius = '5px'; // 设置边框圆角
                blockButton.style.backgroundColor = '#f0f0f0'; // 设置背景颜色
                blockButton.style.color = '#333'; // 设置文字颜色
                blockButton.onclick = () => {
                    const blockedSeries = getBlockedSeries();
                    if (!blockedSeries.includes(seriesName)) {
                        blockedSeries.push(seriesName);
                        setBlockedSeries(blockedSeries);
                        alert(`${seriesName} 已加入屏蔽列表`);
                        location.reload();
                    } else {
                        alert(`${seriesName} 已在屏蔽列表中`);
                    }
                };
                el.parentNode.insertBefore(blockButton, el.nextSibling); // 插入到系列名后面
            }
        });
    }


    // Function to create and add the "Edit Title List" button next to each title
    function addEditTitleListButtons() {
        const titleElements = document.querySelectorAll(title_select);
        titleElements.forEach(el => {
            if (!el.nextSibling || el.nextSibling.innerText !== '编辑标题屏蔽关键词列表') {
                const editButton = document.createElement('button');
                editButton.innerText = '编辑标题屏蔽关键词列表';
                editButton.style.padding = '5px 10px'; // 设置按钮大小
                editButton.style.fontSize = '12px'; // 设置字体大小
                editButton.style.fontFamily = '微软雅黑'; // 设置字体为微软雅黑
                editButton.style.marginLeft = '10px'; // 添加左边距
                editButton.style.cursor = 'pointer'; // 设置鼠标指针样式
                editButton.style.border = '1px solid #ccc'; // 设置边框样式
                editButton.style.borderRadius = '5px'; // 设置边框圆角
                editButton.style.backgroundColor = '#f0f0f0'; // 设置背景颜色
                editButton.style.color = '#333'; // 设置文字颜色
                editButton.onclick = () => editList(titleStorageKey, '标题屏蔽关键词');
                el.parentNode.insertBefore(editButton, el.nextSibling); // Insert the button next to the title element
            }
        });
    }

    // Function to add a "Block" button next to each content element
    function addBlockContentButtons() {
        const contentElements = document.querySelectorAll(content_select);
        contentElements.forEach(el => {
            // Check if the parent element has the correct class name to avoid adding button next to title elements
            const parentElement = el.closest('li');
            if (parentElement && parentElement.querySelector(content_select)) {
                // Check if the button already exists to avoid duplication
                if (!el.nextSibling || el.nextSibling.innerText !== '编辑正文描述屏蔽关键词列表') {
                    const blockButton = document.createElement('button');
                    blockButton.innerText = '编辑正文描述屏蔽关键词列表';
                    blockButton.style.padding = '5px 10px'; // 设置按钮大小
                    blockButton.style.fontSize = '12px'; // 设置字体大小
                    blockButton.style.fontFamily = '微软雅黑'; // 设置字体为微软雅黑
                    blockButton.style.marginLeft = '10px'; // 添加左边距
                    blockButton.style.cursor = 'pointer'; // 设置鼠标指针样式
                    blockButton.style.border = '1px solid #ccc'; // 设置边框样式
                    blockButton.style.borderRadius = '5px'; // 设置边框圆角
                    blockButton.style.backgroundColor = '#f0f0f0'; // 设置背景颜色
                    blockButton.style.color = '#333'; // 设置文字颜色
                    blockButton.onclick = () => editList(ContentStorageKey, '屏蔽正文');
                    el.parentNode.insertBefore(blockButton, el.nextSibling); // Insert the button after the content element
                }
            }
        });
    }


    // Function to add a "Block Tag" button next to each author name
    function addBlockTagButton() {
        const blockButtons = document.querySelectorAll('button');
        blockButtons.forEach(button => {
            if (button.innerText === '屏蔽该作者') {
                if (!button.nextSibling || button.nextSibling.innerText !== '编辑Tag屏蔽列表') {
                    const blockTagButton = document.createElement('button');
                    blockTagButton.innerText = '编辑Tag屏蔽列表';
                    blockTagButton.style.padding = '5px 10px'; // 设置按钮大小
                    blockTagButton.style.fontSize = '12px'; // 设置字体大小
                    blockTagButton.style.fontFamily = '微软雅黑'; // 设置字体为微软雅黑
                    blockTagButton.style.marginLeft = '10px'; // 添加左边距
                    blockTagButton.style.cursor = 'pointer'; // 设置鼠标指针样式
                    blockTagButton.style.border = '1px solid #ccc'; // 设置边框样式
                    blockTagButton.style.borderRadius = '5px'; // 设置边框圆角
                    blockTagButton.style.backgroundColor = '#f0f0f0'; // 设置背景颜色
                    blockTagButton.style.color = '#333'; // 设置文字颜色
                    blockTagButton.onclick = () => editList(TagsStorageKey, '屏蔽Tag');
                    button.parentNode.insertBefore(blockTagButton, button.nextSibling); // Insert after the "Block" button
                }
            }
        });
    }



    // Function to repeatedly execute the script to ensure it remains active
    function repeatExecution() {
        setInterval(() => {
            if (currentPageUrl !== window.location.href) {
                buttonsGenerated = 0; // Reset the flag when the URL changes
                currentPageUrl = window.location.href; // Update the current URL
            }
            if (buttonsGenerated === 0) {
                addBlockButtons();
                addEditTitleListButtons();
                addBlockSeriesButtons();
                addBlockTagButton();
                addBlockContentButtons();
                buttonsGenerated = 1; // Set the flag to indicate buttons have been generated
            }
            hideBlockedAuthorsContent();
            hideBlockedTitles();
            hideBlockedSeries();
            hideBlockedContent();
            hideBlockedTags();
        }, 3000); // Repeat every 3 seconds
    }

    // Initialize the script
    function init() {
        createEditButton('编辑正文描述屏蔽列表', ContentStorageKey, '屏蔽正文描述', '10%');
        createEditButton('编辑作者屏蔽列表', authorStorageKey, '屏蔽作者', '25%');
        createEditButton('编辑标题屏蔽关键词列表', titleStorageKey, '屏蔽标题', '42%');
        createEditButton('编辑系列屏蔽关键词列表', seriesStorageKey, '屏蔽系列', '60%');
        createEditButton('编辑Tag屏蔽关键词列表', TagsStorageKey, '屏蔽Tag', '78%');

        addBlockButtons();
        addEditTitleListButtons();
        addBlockSeriesButtons();
        addBlockTagButton();
        addBlockContentButtons();

        hideBlockedAuthorsContent();
        hideBlockedTitles();
        hideBlockedSeries();
        hideBlockedContent();
        hideBlockedTags();

        repeatExecution(); // Start the repeating execution
    }

    // Run the script on page load
    window.addEventListener('load', init);

})();