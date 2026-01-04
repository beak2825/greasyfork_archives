// ==UserScript==
// @name         NightTalkMore
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  提升 NightTalks 论坛体验的用户脚本，提供快捷按钮、自动回复、离线下载推送等多种实用功能。Enhance the NightTalks forum experience with quick access buttons, an auto-reply feature, ed2k copy and 115 download, and more.
// @author       Your name
// @match        https://nightalks.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/514831/NightTalkMore.user.js
// @updateURL https://update.greasyfork.org/scripts/514831/NightTalkMore.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define the categories and their corresponding URLs
    const categories = [
        { name: '國產', prefix: 1 },
        { name: '日本', prefix: 2 },
        { name: '亞洲', prefix: 3 },
        { name: '歐美', prefix: 4 }
    ];

    const replyTexts = [
        "感谢楼主分享！太喜欢这样的内容了！",
        "哇塞，这影片质量真不错，感谢大大！",
        "楼主真是大神，每次分享都不一样！",
        "帅哥真的赏心悦目，感谢楼主精心挑选～",
        "支持楼主，内容很棒，辛苦了！",
        "感谢分享，楼主辛苦了，影片好看！",
        "这次的内容超赞，果然楼主出品，必属精品！",
        "大爱这种影片，谢谢楼主的热心分享！",
        "好片收藏，楼主真有眼光！感谢感谢～",
        "太喜欢这种题材了，楼主发了宝藏啊，感谢！"
    ];

    const config = {
        webDownloadFolderId: GM_getValue("webDownloadFolderId", ""),
        signUrl: "https://115.com/?ct=offline&ac=space&_=", // 获取115 token签名接口
        addTaskUrl: "https://115.com/web/lixian/?ct=lixian&ac=add_task_url", // 添加115离线任务接口
    };

    // Function to send ed2k links to 115 offline download
    function addEd2kTo115(urls) {
        return new Promise((resolve, reject) => {
            const timeout = new Date().getTime();
            GM_xmlhttpRequest({
                method: "GET",
                url: config.signUrl + timeout,
                onload: (responseDetails) => {
                    if (responseDetails.responseText.indexOf("html") >= 0) {
                        window.open("https://115.com/", "_blank");
                        reject("还没有登录115");
                        return;
                    }
                    let signData;
                    try {
                        signData = JSON.parse(responseDetails.response);
                    } catch (error) {
                        reject("获取签名失败: 无效的JSON数据");
                        return;
                    }

                    const { sign } = signData;
                    const encodedUrls = `url=${encodeURIComponent(urls[0])}`;
                    const url = config.addTaskUrl;
                    const addConfig = {
                        method: "POST",
                        url: url,
                        data: `${encodedUrls}&savepath=&wp_path_id=${config.webDownloadFolderId}&sign=${sign}&time=${timeout}`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        },
                        onload: (res) => {
                            let resData;
                            try {
                                resData = JSON.parse(res.response);
                            } catch (error) {
                                reject("添加任务失败: 无效的JSON数据");
                                return;
                            }
                            if (resData.state === false) {
                                reject(resData.error_msg || "添加任务失败");
                            } else {
                                resolve("添加成功！");
                            }
                        },
                        onerror: () => reject("请求添加离线任务失败"),
                    };
                    GM_xmlhttpRequest(addConfig);
                },
                onerror: () => reject("获取签名失败"),
            });
        });
    }




    // Function to create a category button
    function createCategoryButton(category) {
        const span = document.createElement('span');
        span.className = 'label label--lightGreen';
        span.style.marginRight = '5px';
        span.style.cursor = 'pointer';
        span.textContent = category.name;

        // Add click event
        span.addEventListener('click', () => {
            window.location.href = `?prefix_id[0]=${category.prefix}`;
        });

        return span;
    }

    // Add "Open All" button
    function createOpenAllButton() {
        const button = document.createElement('span');
        button.className = 'label label--error';
        button.style.marginRight = '5px';
        button.style.cursor = 'pointer';
        button.textContent = '打开所有帖子';

        // Add click event to open all links that do not contain "page" in the URL
        button.addEventListener('click', () => {
            document.querySelectorAll('.structItem-title a[href^="https://nightalks.com/threads/"]').forEach(link => {
                if (!link.href.includes('page')) {
                    window.open(link.href, '_blank');
                }
            });
        });

        return button;
    }


    // Main function to add the buttons
    function addCategoryButtons() {
        const filterBar = document.querySelector('.filterBar');
        if (!filterBar) return;

        if (!window.location.pathname.startsWith('/forums/16/') && !window.location.pathname.startsWith('/forums/18/') ) return;

        // Create container for our buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'inline-block';
        buttonContainer.style.marginRight = '10px';

        // Add all category buttons
        categories.forEach(category => {
            buttonContainer.appendChild(createCategoryButton(category));
        });

        // Add "Open All" button
        buttonContainer.appendChild(createOpenAllButton());


        // Insert at the beginning of filterBar
        filterBar.insertBefore(buttonContainer, filterBar.firstChild);
    }


    // function to go back to top
    function addBackToTopButton() {
        const sidebar = document.querySelector('.p-body-sidebar');
        if (!sidebar) return;

        // Create the button
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'button';
        backToTopButton.style.marginTop = '10px';
        backToTopButton.style.width = '100%';
        backToTopButton.textContent = '回顶部';

        // Add click event to scroll to top
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Append the button to the sidebar
        sidebar.appendChild(backToTopButton);
    }

    // Function to automatically fill and submit the reply form
    function addAutoReplyButton() {
        const sidebar = document.querySelector('.p-body-sidebar');
        if (!sidebar) return;
        if (!window.location.pathname.startsWith('/threads/')) return;
        // Create the "Auto Reply" button
        const autoReplyButton = document.createElement('button');
        autoReplyButton.className = 'button';
        autoReplyButton.style.marginTop = '10px';
        autoReplyButton.style.width = '100%';
        autoReplyButton.textContent = '随机回复';

        // Add click event to fill and submit the reply form
        autoReplyButton.addEventListener('click', () => {
            autoReply();

            // Change button color to green and text to "已回复" (Replied)
            autoReplyButton.style.backgroundColor = 'green';
            autoReplyButton.textContent = '已回复';

            // Wait 1 second, then hide the button
            setTimeout(() => {
                autoReplyButton.style.display = 'none';
            }, 1000);
        });


        // Append the button to the sidebar
        sidebar.appendChild(autoReplyButton);
    }

    // Function to automatically fill and submit the reply form
    function autoReply() {
        const replyDiv = document.querySelector('.fr-element[contenteditable="true"]');
        const replyButton = document.querySelector('button.button--icon--reply');
        if (replyDiv && replyButton) {
            // Randomly select a reply text
            const randomReply = replyTexts[Math.floor(Math.random() * replyTexts.length)];

            // Set the content of the editable div
            replyDiv.innerHTML = `<p>${randomReply}</p>`;

            // Wait a bit to make sure the content is set, then click reply button
            setTimeout(() => {
                replyButton.click();
            }, 500);
        }
    }

    // Function to remove "/unread" from all <a> tag hrefs
    function removeUnreadFromLinks() {
        const links = document.querySelectorAll('a[href*="/unread"]');
        links.forEach(link => {
            link.href = link.href.replace('/unread', '');
        });
    }


    // Function to add "Copy" buttons below each ed2k link
    function addCopyButtonToEd2kLinks() {
        // Find all ed2k links within expandable bbCode blocks
        document.querySelectorAll('.bbCodeBlock-content .bbCodeBlock-expandContent').forEach(content => {
            const ed2kLink = content.textContent.trim();
            if (ed2kLink.startsWith("ed2k://")) {
                // Check if a button has already been added
                if (content.querySelector('.copy-ed2k-button')) return;

                // Parse the ed2k link for file name and file size
                const ed2kParts = ed2kLink.split('|');
                const fileName = decodeURIComponent(ed2kParts[2] || "未知文件"); // Part 2 is the file name
                const fileSize = ed2kParts[3] ? `${(parseInt(ed2kParts[3]) / (1024 ** 2)).toFixed(2)} MB` : "未知大小"; // Part 3 is the file size in bytes, converted to MB

                // Display the file name and size above the link
                const fileInfo = document.createElement('div');
                fileInfo.innerHTML = `文件名: ${fileName}<br>大小: ${fileSize}`;
                fileInfo.style.marginBottom = '2px';
                fileInfo.style.fontSize = '1.1em';
                fileInfo.style.color = 'white';


                // Wrap the original ed2k link in a span and hide it
                const ed2kLinkSpan = document.createElement('span');
                ed2kLinkSpan.textContent = ed2kLink;
                ed2kLinkSpan.style.display = 'none';
                content.textContent = ''; // Clear the content
                content.appendChild(ed2kLinkSpan); // Add the hidden ed2k link


                // Create the "Copy" button
                const copyButton = document.createElement('button');
                copyButton.textContent = `复制链接 (${fileSize})`;
                copyButton.className = 'button button--link copy-ed2k-button';
                copyButton.style.marginTop = '5px';
                copyButton.style.cursor = 'pointer';

                // Add copy functionality
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(ed2kLink).then(() => {
                        copyButton.textContent = '已复制!';
                        setTimeout(() => copyButton.textContent = `复制链接 (${fileSize})`, 2000);
                    }).catch(() => {
                        copyButton.textContent = '复制失败';
                        setTimeout(() => copyButton.textContent = `复制链接 (${fileSize})`, 2000);
                    });
                });


            // Create the "Push to 115 Download" button
            const pushButton = document.createElement('button');
            pushButton.textContent = '推送到115下载';
            pushButton.className = 'button button--link push-115-button';
            pushButton.style.marginTop = '5px';
            pushButton.style.marginLeft = '5px';
            pushButton.style.cursor = 'pointer';

            // Add push functionality
            pushButton.addEventListener('click', () => {
                addEd2kTo115([ed2kLink])
                    .then(response => {
                        pushButton.textContent = response;
                        setTimeout(() => pushButton.textContent = '推送到115下载', 2000);
                    })
                    .catch(error => {
                        pushButton.textContent = error;
                        setTimeout(() => pushButton.textContent = '再次尝试推送到115下载', 2000);
                    });
            });


                // Append file info and the button below the ed2k link
                content.prepend(fileInfo);
                content.appendChild(copyButton);
                content.appendChild(pushButton);
            }
        });
    }



    // Wait for page to load and add buttons
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeUnreadFromLinks();
            addCategoryButtons();
            addBackToTopButton();
            addAutoReplyButton();
        });
    } else {
        removeUnreadFromLinks();
        addCategoryButtons();
        addBackToTopButton();
        addAutoReplyButton();
    }


    // Set up a MutationObserver to monitor for new ed2k links
    const observer = new MutationObserver(addCopyButtonToEd2kLinks);

    // Start observing the document for changes in the subtree
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add buttons to existing links
    addCopyButtonToEd2kLinks();

})();