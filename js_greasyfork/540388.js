// ==UserScript==
// @name         在贴吧用户名下方插入按钮点击后在不二查询回帖纪录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不二查询回帖纪录
// @author       Your Name
// @match        https://tieba.baidu.com/p/*
// @grant        GM.xmlHttpRequest
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/540388/%E5%9C%A8%E8%B4%B4%E5%90%A7%E7%94%A8%E6%88%B7%E5%90%8D%E4%B8%8B%E6%96%B9%E6%8F%92%E5%85%A5%E6%8C%89%E9%92%AE%E7%82%B9%E5%87%BB%E5%90%8E%E5%9C%A8%E4%B8%8D%E4%BA%8C%E6%9F%A5%E8%AF%A2%E5%9B%9E%E5%B8%96%E7%BA%AA%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/540388/%E5%9C%A8%E8%B4%B4%E5%90%A7%E7%94%A8%E6%88%B7%E5%90%8D%E4%B8%8B%E6%96%B9%E6%8F%92%E5%85%A5%E6%8C%89%E9%92%AE%E7%82%B9%E5%87%BB%E5%90%8E%E5%9C%A8%E4%B8%8D%E4%BA%8C%E6%9F%A5%E8%AF%A2%E5%9B%9E%E5%B8%96%E7%BA%AA%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetch_page(url,method = "GET") {
        return new Promise((resolve, reject) => {
            try {
                GM.xmlHttpRequest({
                    method: method,
                    url: url,
                    //data: "username=johndoe&password=xyz123",
                    //headers: {
                    //    "Content-Type": "application/x-www-form-urlencoded"
                    //},
                    onload: function(response) {
                        if(response.status == 200) {
                            resolve(response.responseText);
                        }
                        reject(Error("failed"))
                    }
                });
            } catch(e){
                reject(Error("something bad happened"))
            }
        })
    }

    async function fetch_all_pages(urls) {

        const promises = urls.map(url => fetch_page(url));

        // Promise.allSettled 会等待所有Promise完成，无论成功或失败
        const results = await Promise.allSettled(promises);

        const successfulPages = [];
        const failedRequests = [];

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                // 如果成功，result.value 是 fetch_page resolve 的值
                successfulPages.push(result.value);
            } else {
                // 如果失败，result.reason 是 fetch_page reject 的 Error 对象
                failedRequests.push({ url: urls[index], reason: result.reason.message });
            }
        });

        console.log(`抓取完成。成功: ${successfulPages.length}, 失败: ${failedRequests.length}`);
        if (failedRequests.length > 0) {
            console.error("失败的请求详情:", failedRequests);
        }

        return successfulPages;
    }
//"",
    const anqu_list = [
        "二游笑话",
        "偷玩",
        "ml游戏",
        "ml玩家",
        "鸣潮",
        "北落野",
        "梦想紫",
        "原神",
        "星穹铁道",
        "游乐场",
        "反二",
        "反尘",
        "反ml",
        "明日方舟",
        "快乐雪花",
        "雪之下",
        "dinner笑话",
        "黑猴笑话",
    ];

    const heicheng_list = [
        "插不进去",
        "茶友",
        "插友",
        "辣仙",
        "辣野",
        "辣蛆",
        "辣畜",
        "辣狗",
        "辣猪",
        "ml畜",
        "ml野",
        "ml蛆",
        "ml畜",
        "ml狗",
        "ml猪",
        "01",
        "凌一",
        "零一",
        "白蚁",

    ];

    const modal_content_style = `
        /* 浮动框主容器 */
    #gm-modal-content {
        display: none; /* 初始状态下隐藏 */
        flex-direction: column; /* 当 display:flex 时，内部元素垂直排列 */
        position: fixed;
        z-index: 9999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        width: 80%;
        height: 80%;
        overflow-y: auto; /* 仅当整个框内容超出时，这里提供滚动 */
    }

    /* 浮动框的头部区域 */
    #gm-modal-header {
        display: flex;
        justify-content: space-between; /* 标题和按钮组两端对齐 */
        align-items: center; /* 垂直居中 */
        padding-bottom: 15px;
        border-bottom: 1px solid #eee; /* 漂亮的分割线 */
        flex-shrink: 0; /* 防止Header在内容多时被压缩 */
    }

    /* 浮动框标题 */
    #gm-modal-title {
        margin: 0; /* 移除 h2 默认的上下外边距 */
        font-size: 1.25em;
    }

    /* 标题栏右侧的按钮组 */
    #gm-header-buttons {
        display: flex;
        gap: 10px; /* 按钮之间的间距 */
    }

    /* 标题栏按钮的通用样式 */
    .gm-header-btn {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 0.9em;
    }

    /* 标题栏按钮的鼠标悬停效果 */
    .gm-header-btn:hover {
        background-color: #e0e0e0;
    }

    /* 浮动框的主内容文本区域 */
    #gm-modal-text {
        margin-top: 15px;
        flex-grow: 1; /* 占据所有可用的垂直空间 */
    }

    /* 右上角的关闭按钮 'X' */
    #gm-modal-close-btn {
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        padding-left: 15px; /* 与左侧的按钮组保持一点距离 */
    }

    /* 关闭按钮的鼠标悬停效果 */
    #gm-modal-close-btn:hover {
        color: #333;
    }
    `;

    // --- 2. 将样式注入到页面 ---
    const modal_content_style_sheet = document.createElement("style");
    modal_content_style_sheet.type = "text/css";
    modal_content_style_sheet.innerText = modal_content_style;
    document.head.appendChild(modal_content_style_sheet);

    // --- 3. 创建 HTML 元素 ---

    // 创建浮动框内容区 (现在它就是唯一的容器)
    const modal_content = document.createElement('div');
    modal_content.id = 'gm-modal-content';

    // --- 新建Header容器 ---
    const modal_header = document.createElement('div');
    modal_header.id = 'gm-modal-header';

    const modal_title = document.createElement('h2');
    modal_title.id = 'gm-modal-title';

    // --- 新建Header按钮组容器 ---
    const header_buttons = document.createElement('div');
    header_buttons.id = 'gm-header-buttons';

    // 创建两个自定义按钮
    const anqu_button = document.createElement('button');
    anqu_button.className = 'gm-header-btn';
    anqu_button.textContent = '暗区';
    anqu_button.id = 'gm-anqu-btn'; // 给个ID方便绑定事件

    const heicheng_button = document.createElement('button');
    heicheng_button.className = 'gm-header-btn';
    heicheng_button.textContent = '黑称';
    heicheng_button.id = 'gm-heicheng-btn';

    // 将按钮添加到按钮组容器
    header_buttons.appendChild(anqu_button);
    header_buttons.appendChild(heicheng_button);

    // 创建关闭按钮
    const close_button = document.createElement('span');
    close_button.id = 'gm-modal-close-btn';
    close_button.innerHTML = '关闭';

    // 将标题、按钮组、关闭按钮添加到Header
    modal_header.appendChild(modal_title);
    modal_header.appendChild(header_buttons);
    modal_header.appendChild(close_button);

    // 创建主内容区
    const modal_text = document.createElement('p');
    modal_text.id = 'gm-modal-text';

    // 将Header和主内容区添加到浮动框
    modal_content.appendChild(modal_header);
    modal_content.appendChild(modal_text);

    document.body.appendChild(modal_content);

    // --- 5. 添加事件监听器 ---
    function showModal() {
        modal_content.style.display = 'block'; // 显示浮动框
    }

    function hideModal() {
        modal_content.style.display = 'none'; // 隐藏浮动框
    }

    function getXpathValue(xpath, contextNode) {
        // document.evaluate(xpath, contextNode, namespaceResolver, resultType, result)
        const result = document.evaluate(xpath, contextNode, null, XPathResult.STRING_TYPE, null);
        // trim() 用于去除可能存在的前后空白
        return result.stringValue.trim();
    }

    close_button.addEventListener('click', hideModal);

    anqu_button.addEventListener('click', async (event) => {
        modal_text.innerHTML = "";
        if (anqu_reply_list.length > 0) {
            for(const reply of anqu_reply_list){
                modal_text.innerHTML += reply.tieba_name + '吧：<br>';
                modal_text.innerHTML += reply.post_title + reply.reply + '<br>';
                modal_text.innerHTML += reply.date + '<br>';
                modal_text.innerHTML += "不二查询回复页面网址：<br>" + `https://tieba.82cat.com/tieba/reply/${tieba_id_urlcode}/${reply.page_number}<br><hr>`;

            }
        }
    });

    heicheng_button.addEventListener('click', async (event) => {
        modal_text.innerHTML = "";
        if (heicheng_reply_list.length > 0) {
            for(const reply of heicheng_reply_list){
                modal_text.innerHTML += reply.tieba_name + '吧：<br>';
                modal_text.innerHTML += reply.post_title + reply.reply + '<br>';
                modal_text.innerHTML += reply.date + '<br>';
                modal_text.innerHTML += "不二查询回复页面网址：<br>" + `https://tieba.82cat.com/tieba/reply/${tieba_id_urlcode}/${reply.page_number}<br><hr>`;

            }
        }
    });

    let anqu_reply_list = [];
    let heicheng_reply_list = [];
    let tieba_id_urlcode = '';

    for (const img_element of document.querySelectorAll('div.d_author > ul > li.icon > div > a > img')) {
        const tieba_id = img_element.getAttribute('username');
        let button = document.createElement('button');
        button.innerText = "回帖纪录";
        const ul_element = img_element.closest('div.d_author > ul');
        ul_element.appendChild(button);
        button.addEventListener("click", async (event) => {
            anqu_reply_list = [];
            heicheng_reply_list = [];
            modal_text.innerHTML = "";
            tieba_id_urlcode = encodeURI(tieba_id);
            const pages_to_fetch_urls = Array.from({length: 10}, (_, i) => `https://tieba.82cat.com/tieba/reply/${tieba_id_urlcode}/${i + 1}`);

            const pages_content = await fetch_all_pages(pages_to_fetch_urls);
            const parser = new DOMParser();

            for(let i = 0;i < 10;i++){
                const doc = parser.parseFromString(pages_content[i], "text/html");
                for (const reply_node of doc.querySelectorAll('li.mb-1')) {
                    const a1_text = getXpathValue('./a[1]/text()', reply_node);
                    const a2_text = getXpathValue('./a[2]/text()', reply_node);
                    const a2_followed_text = getXpathValue('./a[2]/following-sibling::text()[1]', reply_node);
                    const span_text = getXpathValue('.//span/text()', reply_node);

                    for(const anqu of anqu_list){
                        if(a1_text.includes(anqu)){
                            anqu_reply_list.push({tieba_name:a1_text, post_title:a2_text, reply:a2_followed_text, date:span_text, page_number:i + 1});
                        }
                    }

                    for(const heicheng of heicheng_list){
                        if(a2_followed_text.includes(heicheng)){
                            heicheng_reply_list.push({tieba_name:a1_text, post_title:a2_text, reply:a2_followed_text, date:span_text, page_number:i + 1});
                        }
                    }
                }

            }
            

            showModal();
        });
    }





})();