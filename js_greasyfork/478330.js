// ==UserScript==
// @name         b站笔记
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  实现功能：1、当视频全屏时让笔记面板嵌入视频页面内，不需要退出全屏，即可进行笔记记录，当视频是非全屏时让笔记面板出现在视频页面外边。2、笔记内容滚动定位：在笔记面板增加顶部直达、底部跳转及滚动条功能。3、笔记面板隐藏，隐藏后只需要将鼠标移到视频页面右侧，笔记面板便会自动显示。4、笔记截图弹出放大与面板宽度调整。5、笔记面板透明度调节。6、插入视频标题到笔记。7、截屏带时间标记。8、笔记列表快捷访问：在网页头部点击我的笔记按钮，会弹出一个面板可查看所有视频的笔记，再按钮可以关掉面板。9、将笔记以pdf导出到本地。10、电脑ctrl键快捷打开、隐藏、显示笔记面板，实现一步到位进入编辑状态。11、打开笔记后自动滚动到上次编辑位置并获取光标焦点。12、其他快捷键操作包括：调节透明度、插入当前字幕、插入当前视频标题、插入当前时间标记与视频截图、视频全屏界面调整笔记面板的位置、让笔记编辑区获取光标焦点。13、点击弹幕的复制按钮,将对应弹幕自动粘贴到笔记中。
// @author       繁星1678
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/478330/b%E7%AB%99%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/478330/b%E7%AB%99%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    let IsJbjClick = false;
    let bar;
    let selection;
    let range;
    let IsMyNote = false;
    let IsInsert = false;
   let isTmAddLisner=false
    let IsNotePcHightChange = false;
    let isClose = true;
    
    const currentUrl = window.location.href;
    let isCloseNoteList = false;
    let noteOpen=false
    let scrollH=null//前一次隐藏笔记面板前的滚动条高度
    let position=null
    let targetNode=null
    let inputNumber = ''; // 用于存储输入的数字，调整透明度使用
    let isBold = false//插入视频标题或字幕到笔记时是否加粗
    let isCtrlPressed = false; // 记录Ctrl键是否按下
    let otherKeyPressed = false; // 记录是否按下了其他键
    let isZoomed = false;
    let imgloadedCount = 0;//pdf新窗口图片加载个数
    let isdanmu = false;
    let iszimu = false;
    let 停用ctrl=false
    let 停用ctrl_c=false
    let 停用ctrl_x=false
    
    /////////////////////////////////////


    // 创建iframe,访问的网页显示在这里面，并将iframe插入到页面中
    function createIframeAndIsertDocument() {
        let iframeS = document.querySelector('.note-list-iframe')

        // 创建一个 iframe 并设置其样式
        let iframe = document.createElement('iframe');
        iframe.src = 'https://space.bilibili.com/v/note-list';
        iframe.className = 'note-list-iframe';
        iframe.style.width = '65%';
        iframe.style.height = '80%';
        iframe.style.position = 'fixed';
        iframe.style.top = '50px';
        iframe.style.left = '0px';
        iframe.style.border = 'none';
        iframe.style.zIndex = '99999';
        iframe.style.boxShadow = '0 4px 8px';
        iframe.style.borderRadius = '10px';
        if (!iframeS) {
            document.body.appendChild(iframe)
            //////////
            iframe.onload = function () {
                initDraggable(iframe)
                // 移除 onload 处理函数，避免重复执行
                iframe.onload = null;
                // 初始化拖动功能
                
            };
            //////////
        }
    }

   
    function initDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
    
        element.addEventListener('mousedown', (e) => { // 修改为在 element 上添加监听器
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
        });
    
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
            }
        });
    
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    

    // 创建笔记列表按钮并添加监听事件
    function setNoteListBtn() {
        let iframe = null

        let noteListsBtn = document.querySelector('.note-lists');
        // 如果存在就设置监听,不存在就创造一个并设置监听
        if (noteListsBtn) {
            // setNoteListsBtnListener(noteListsBtn);
            // alert('noteListsBtn存在:',noteListsBtn)
        } else {
            // alert('noteListsBtn不存在')
            function createNoteListBtnAndInsertDocument() {
                let avatar_wrap = document.querySelector('.header-avatar-wrap');
                if (avatar_wrap) {
                    noteListsBtn = document.createElement('div');
                    noteListsBtn.style.display = 'grid';
                    noteListsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="55" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"><g fill="none" stroke="#FF8C00" stroke-width="1.5"><path stroke-linecap="round" d="M18 10h-5"/><path d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77c.079.07.154.145.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14z"/></g></svg><span style="color: #FF8C00; font-size: 13px; text-shadow: 0.1px 0.1px 0.3px rgba(0, 0, 0, 0.6);">我的笔记</span>`;
                    noteListsBtn.style.cursor = 'pointer';
                    noteListsBtn.className = 'note-lists';

                    avatar_wrap.parentNode.insertBefore(noteListsBtn, avatar_wrap);
                    observer.disconnect();
                    // setNoteListsBtnListener(noteListsBtn)
                    noteListsBtn.addEventListener('click', function (e) {

                        if (isCloseNoteList) {

                            let iframe = document.querySelector('.note-list-iframe');
                            document.body.removeChild(iframe);
                            // 笔记列表被关闭，换成我的笔记的图标
                            noteListsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="55" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"><g fill="none" stroke="#FF8C00" stroke-width="1.5"><path stroke-linecap="round" d="M18 10h-5"/><path d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77c.079.07.154.145.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14z"/></g></svg><span style="color: #FF8C00; font-size: 13px; text-shadow: 0.1px 0.1px 0.3px rgba(0, 0, 0, 0.6);">我的笔记</span>`;


                        } else {
                            createIframeAndIsertDocument()

                            // 笔记列表被打开，换成关闭笔记的图标
                            noteListsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="55" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"><g fill="none" stroke="#65a30d" stroke-width="1.5"><path d="M1 15V9a6 6 0 0 1 6-6h10a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H7a6 6 0 0 1-6-6Z"/><path d="M7 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 15V9h3m2 6V9h3m-8 3h2.572M17 12h2.572"/></g></svg><span style="color: #FF8C00; font-size: 13px; text-shadow: 0.1px 0.1px 0.3px rgba(0, 0, 0, 0.6);">关闭笔记</span>`


                        }
                        isCloseNoteList = !isCloseNoteList;
                    })

                }

            }
            let observer = new MutationObserver(createNoteListBtnAndInsertDocument)
            let config = { childList: true, subtree: true }
            observer.observe(document.body, config)

        }
    }


    
    if (currentUrl.startsWith('https://www.bilibili.com/')) {
        setNoteListBtn()

    }

    if (currentUrl.indexOf('https://www.bilibili.com/video/') === 0 || currentUrl.startsWith('https://www.bilibili.com/cheese/')) {

        function isFirefox() {
            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        }
        function isEdge() {
            // 获取 User Agent 字符串
            const userAgent = navigator.userAgent;
        
            // 检查 User Agent 字符串中是否包含 "Edg" 或 "Edge"
            return userAgent.indexOf("Edg") !== -1 || userAgent.indexOf("Edge") !== -1;
        }
        

        // 以pdf格式将笔记内容保存到本地
        function saveNoteAsPdf() {
            // const note_pc = document.querySelector("div.resizable-component.note-pc");
            // if (note_pc) {
            let fullUrl = window.location.href
            let searchParams = new URLSearchParams(fullUrl.search)
            // 判断链接中是否存在'note'
            let isNote = searchParams.has('note')

            let titleElement = document.querySelector(".video-title.special-text-indent");
            let title = titleElement ? (titleElement.getAttribute('data-title').trim() || titleElement.getAttribute('title').trim() || titleElement.textContent).trim() : '';
            if (!title) {
                console.log('无法找到视频标题');
            }
            let url = window.location.href || title;

            const saveBtn = document.createElement("button");
            saveBtn.id = "saveBtn";
            saveBtn.textContent = "另存为pdf";
            saveBtn.style.width = "auto";
            saveBtn.title = "将笔记内容以pdf格式保存到本地";
            saveBtn.onclick = saveAsPDF;
            const style = document.createElement('style');
            style.textContent = `
                    #saveBtn {
                        background-color: rgba(71, 154, 199, 0.95);
                        color: white;
                        border: none;
                        padding: 2px 1px;
                        vertical-align: middle;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 10px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: background-color 0.3s ease;
                    }
                    #saveBtn:hover {
                        background-color: #112d4e;
                    }
                `;
            document.head.appendChild(style);

            
            setTimeout(() => {
                let ckbj_btn = document.querySelector('div.list-note-operation');
                        if (ckbj_btn) {
                            ckbj_btn.addEventListener("click", function (event) {
                                setTimeout(() => {
                                    const ql_save_btn = document.querySelector('.ql-save-btn');
                                    if (ql_save_btn) {
                                        ql_save_btn.parentNode.appendChild(saveBtn);
                                    } 
                                }, 5);
                                
                            })

                        } else {
                            console.log("586 没有找到ckbij按钮")
                        }
                setTimeout(() => {
                    let ql_save_btn = document.querySelector('.ql-save-btn');
                    if (ql_save_btn) {
                        ql_save_btn.parentNode.appendChild(saveBtn);
                        return
                    }
                }, 2000);
                let ql_save_btn = document.querySelector('.ql-save-btn');
                if (ql_save_btn) {
                    ql_save_btn.parentNode.appendChild(saveBtn);
                    return
                }
                
            }, 1000);
            
            let newJbjBtn = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.video-note-inner');
            let jbj_btn_title = newJbjBtn.innerText.trim()
            if (jbj_btn_title === "记笔记") {
                newJbjBtn.addEventListener("click", function (event) {
                    setTimeout(() => {
                        const ql_save_btn = document.querySelector('.ql-save-btn');
                        // ql_save_btn.parentNode.appendChild(saveBtn);
                        if (ql_save_btn) {
                            ql_save_btn.parentNode.appendChild(saveBtn);
                        }
     
                    }, 60);
                    

                    setTimeout(() => {
                        let ckbj_btn = document.querySelector('div.list-note-operation');
                        if (ckbj_btn) {
                            ckbj_btn.addEventListener("click", function (event) {
                                setTimeout(() => {
                                    const ql_save_btn = document.querySelector('.ql-save-btn');
                                    if (ql_save_btn) {
                                        ql_save_btn.parentNode.appendChild(saveBtn);
                                    }
                                }, 5);
                               
                            })

                        } else {
                            console.log("586 没有找到ckbij按钮")
                        }
                    }, 800);
                })
            } else {
                newJbjBtn.addEventListener("click", function (event) {
                    setTimeout(() => {
                        let ckbj_btn = document.querySelector('div.list-note-operation');
                        if (ckbj_btn) {
                            ckbj_btn.addEventListener("click", function (event) {
                                setTimeout(() => {
                                    const ql_save_btn = document.querySelector('.ql-save-btn');
                                    if (ql_save_btn) {
                                        ql_save_btn.parentNode.appendChild(saveBtn);
                                    }  
                                }, 5);
                                
                            })

                        } else {
                            console.log("586 没有找到ckbij按钮")
                        }
                    }, 800);

                })
            }
            
            function saveAsPDF() {
                // let imgWidth = 1920;
                let imgWidth = screen.width;
                imgWidth = imgWidth * 0.7+'px';

                let screenWidth = window.screen.width;
                let screenHeight = window.screen.height
                let newWidth = Math.floor(screenWidth * 0.46);
                let newHeight = screenHeight;

                const content = document.querySelector(".ql-editor");
                if (!content) {
                    console.error('无法找到编辑器内容');
                    return;
                }

                // 创建一个新的窗口，并设置位置
                // const printWindow = window.open('', 'Print', 'width=500,height=400,left=350,top=330');
                const printWindow = window.open('', 'Print', `width=${newWidth},height=${newHeight},left=0,top=0`);
                

                // 将内容复制到新窗口中
                printWindow.document.open();

                printWindow.document.write(`
                        <html>
                        <head>
                            <title style="color:#005691;font-size:22px;font-weight:bold">${title}</title>
                            <meta charset="UTF-8">
                            <meta name="default-title" content="${title || 'b站笔记'}">
                            <style>
                                @media print {
                                    body {                               
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        padding: 0;
                                        font-family: "Microsoft YaHei", sans-serif;
                                    }
                                        /* 页眉样式 */
                                    .play-url {
                                        background-color: rgba(211, 211, 211, 1); /* 背景色 */
                                        color: #112d4e; /* 字体颜色 */
                                        text-align: center; /* 内容居中 */
                                        align-self: flex-start;
                                        font-family: "Microsoft YaHei", sans-serif; /* 字体 */
                                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* 阴影效果 */
                                        border-radius: 100%; /* 设置圆角，单位是像素，值可以根据需要调整 */
                                        font-size: 12px; /* 字体大小 */
                                    }
                                    h1, h2, h3, h4, h5, h6 {
                                        margin: 1em 0 0.5em;
                                        font-weight: bold;
                                    }
                                    h1 { font-size: 24px; }
                                    h2 { font-size: 20px; }
                                    h3 { font-size: 18px; }
                                    h4 { font-size: 16px; }
                                    h5 { font-size: 14px; }
                                    h6 { font-size: 12px; }
                                    p {
                                        margin: auto 0;
                                        text-align: left; /* 左对齐文本 */
                                        align-self: flex-start; /* 对齐到父容器开始位置 */
                                        text-indent: 2em; /* 添加缩进样式 */   
                                        line-height: 1.7; /* 设置行间距                                      
                                        margin-bottom: 1.7em; /* 段落间距 */
                                    }
                                    a {
                                        text-decoration: none;
                                    }
                                    a:hover {
                                        
                                    }
                                    ul, ol {
                                        margin: auto 0;
                                        text-align: left; /* 左对齐文本 */
                                        align-self: flex-start; /* 对齐到父容器开始位置 */
                                        padding-left: 4em; /* 添加缩进 */
                                        
                                    }
                                    li {
                                        
                                        margin-bottom: 0.5em;
                                    }
                                    table {
                                        width: 100%;
                                        border-collapse: collapse;
                                        margin-bottom: 1em;
                                    }
                                    th, td {
                                        border: 1px solid #ddd;
                                        padding: 8px;
                                        text-align: left;
                                    }
                                    th {
                                        background-color: #f2f2f2;
                                    }
                                    .note {
                                        background-color: #f9f9f9;
                                        border-left: 4px solid #ccc;
                                        padding: 10px;
                                        margin-bottom: 1em;
                                    }
                                    .note p {
                                        text-indent: 0;
                                        margin: 0;
                                    } 
                                    .ql-image-preview,
                                    .ql-image-preview.active {
                                        margin: auto 0;
                                        align-self: stretch; /* 对齐到父容器开始位置 */
                                        width: 99vw; /* 图片宽度 */
                                        height: auto; /* 保持图片的宽高比 */  
                                    }
                                      img{
                                        width: 99vw;
                                        height: auto;
                                      }   
                                }
                                  .adjusted img {
                                        width: 100vw; /* 调整后的宽度 */
                                        height: auto; /* 保持宽高比 */
                                    }
                                    .tooltip {
                                        position: fixed;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%, -50%);
                                        background-color: rgba(0, 0, 0, 0.8);
                                        color: #ffbd39;
                                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                                        textAlign: center;
                                        fontWeight: bold;
                                        fontSize: 20px;
                                        border-radius: 5px;
                                        padding: 10px;
                                        z-index: 9999;
                                    }
                            </style>
                        </head>
                        <body>
                            <div class="tooltip">正在加载笔记中的图片,请稍等... <span id="progress">0%</span></div>
                            <div class="play-url">
                                <a href="${url}" style="border-radius:1px;font-size: 12px;">打开视频</a>
                            </div><br><br>
                            ${transformContent(content.innerHTML)}
                        </body>
                        </html>
                    `);
                printWindow.document.close();
                
                let tooltip = printWindow.document.querySelector('.tooltip')
              
                // 加载图片时显示进度百分数
                let imgs = printWindow.document.querySelectorAll('.img-preview');
                if (imgs.length > 0) {
                    let timeoutId;
                    function onTimeout() {
                        tooltip.textContent = '图片加载超时,请重试';
                        setTimeout(() => {
                            printWindow.close();
                        }, 1500);
                    }
                    imgs.forEach(img => {
                        img.onload = () => {
                            imgloadedCount++;
                            const progress = Math.floor((imgloadedCount / imgs.length) * 100);
                            tooltip.querySelector('#progress').textContent = `${progress}%`;
                            if (imgloadedCount === imgs.length) {
                                imgloadedCount = 0;
                                clearTimeout(timeoutId);
                                tooltip.querySelector('#progress').textContent = "100%";
                                setTimeout(() => {
                                    tooltip.remove();
                                    printWindow.print();
                                    setTimeout(() => {

                                        // console.log('打印完成或取消，开始调整窗口')
                                        const adjustedBody = printWindow.document.body;
                                        adjustedBody.classList.add('adjusted'); // 添加class以调整模版样式
                                        // return;
                                    }, 1100);
                                    
                                }, 50);
                                return;
                            }
                        }
                    })
                    timeoutId = setTimeout(onTimeout, 45000); // 45秒后超时,关闭窗口
                }else{
                    tooltip.remove();
                    printWindow.print();
                }
                

            }
          
            function transformContent(html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const timeTags = doc.querySelectorAll('.time-tag-item__text');

                timeTags.forEach(tag => {
                    let textToParse = tag.getAttribute('title') || tag.textContent;

                    // 提取章节编号，如 "P1"
                    const chapterMatch = textToParse.match(/P(\d+)/);
                    let chapter = chapterMatch ? Number(chapterMatch[1]) : -1; // 默认章节为1

                    if (chapter === -1 || chapter === 1) {
                        chapter = ''
                    } else {
                        chapter = '&p=' + chapter
                    }
                    // 提取时间并转换为秒数
                    const timeMatch = textToParse.match(/(\d+):(\d+):(\d+)$/) || textToParse.match(/(\d+):(\d+)$/);
                    if (timeMatch) {
                        // console.log('timeMatch:' + timeMatch);
                        // 如果匹配到的是小时:分钟:秒
                        let hours = 0, minutes = 0, seconds = 0;
                        if (timeMatch.length === 4) {
                            [, hours, minutes, seconds] = timeMatch;
                        } else if (timeMatch.length === 3) {
                            // 如果是分钟:秒
                            [, minutes, seconds] = timeMatch;
                        }

                        // 计算总秒数
                        let totalSeconds = (parseInt(hours, 10) * 3600) + (parseInt(minutes, 10) * 60) + parseInt(seconds, 10);
                        // console.log('Total seconds:', totalSeconds); // 可以用于调试输出

                        // 设置`?t=`参数
                        const timeParam = '?t=' + totalSeconds;
                        // console.log('时间参数:', timeParam);
                        totalSeconds = '?t=' + totalSeconds
                        // 跳到指定视频的指定时间进行播放 https://www.bilibili.com/video/BV1cq4y1U7sg?t=557.2&p=6
                        // 创建 URL 对象
                        const url1 = new URL(window.location.href);
                        // const queryString = url1.search.substring(1);
                        const params = new URLSearchParams(url1.search);

                        // let vdSource = params.get('vd_source');

                        // 获取基础路径部分（去掉查询字符串和片段标识符）
                        let baseUrl = url1.origin + url1.pathname;
                        if (baseUrl.endsWith('/')) {
                            baseUrl = baseUrl.slice(0, -1);
                        }
                        // console.log('baseurl:' + baseUrl);
                        // 构建新的 URL
                        const newLink = `<a href="${baseUrl}${timeParam}${chapter}" style="font-family: Arial, sans-serif; margin:0; font-size: 10px; color: #1f4e5f;"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" vertical-align="middle" viewBox="0 0 24 24"><path fill="#333333" d="M6 21V4h14l-2.096 4.27L20 12.538H7V21z"/></svg>${tag.textContent}</a>`;
                        tag.outerHTML = newLink;
                    }
                });

                // 处理p标签文字样式
                let pElements = doc.querySelectorAll('p');
                pElements.forEach(pElement => {
                    const spans = pElement.querySelectorAll('span, strong, u, s');
                    
                    spans.forEach(span => {
                        // 获取颜色和背景色的匹配结果
                        let colorMatch = span.classList.value.match(/ql-color-#([a-fA-F0-9]{6})/);
                        let bgMatch = span.classList.value.match(/ql-bg-#([a-fA-F0-9]{6})/);
                        // const cb = span.classList.value.match(/ql-color-(#[0-9a-fA-F]{6})\s+ql-bg-(#[0-9a-fA-F]{6})/);
                        // console.log('colorMatch:' + colorMatch);
                        // console.log('bgMatch:' + bgMatch);
                        
                        if (colorMatch) {
                            span.style.color = `#${colorMatch[1]}`;
                        }
                        
                        if(bgMatch){
                            span.style.background = `#${bgMatch[1]}`;
                        }
                    });
                      
                });
                // 处理ul,ol标签中的文字样式
                let liElements = doc.querySelectorAll('li');
                liElements.forEach(liElement => {
                    const lis = liElement.querySelectorAll('span, strong, u, s');
                    const lis1 = liElement.querySelectorAll('li');
                    lis.forEach(li => {
                        let colorMatch = li.classList.value.match(/ql-color-#([a-fA-F0-9]{6})/);
                        let bgMatch = li.classList.value.match(/ql-bg-#([a-fA-F0-9]{6})/);
                        // console.log('li colorMatch:' + colorMatch);
                        // console.log('li bgMatch:' + bgMatch);
                        
                        if (colorMatch) {
                            li.style.color = `#${colorMatch[1]}`;
                        }
                        if(bgMatch){
                            li.style.background = `#${bgMatch[1]}`;
                        }
                    })
                        // const cb = span.classList.value.match(/ql-color-(#[0-9a-fA-F]{6})\s+ql-bg-(#[0-9a-fA-F]{6})/);      
                })

                return doc.body.innerHTML;
            }
            // }
        }

        // 主函数，移动按钮、初始化
        function moveButtonWhenDetected() {
            let jbj_btn = document.querySelector('div.video-note-inner');
            const qxd_btn = document.querySelector('div.bpx-player-ctrl-btn.bpx-player-ctrl-quality');
            let full_btn = document.querySelector("div.bpx-player-ctrl-btn.bpx-player-ctrl-full")
            let wyqp_btn = document.querySelector("div.bpx-player-ctrl-btn.bpx-player-ctrl-web")
            let note_pc = document.querySelector("div.resizable-component.note-pc")
            if (jbj_btn && qxd_btn && full_btn && wyqp_btn && note_pc) {
               
                // 防止当笔记面板在视频页面后需要两次右键才能打开右键菜单
                // note_pc.addEventListener('contextmenu', event => {
                //     event.stopPropagation()
                // })
                close_btn_event()
              
                //使笔记始终保持在网页中固定位置,即使网页上下滚动,笔记始终都可见
                GM_addStyle(`
                    .fixed-position {
                        position: fixed !important;
                        min-width: 460px !important;
                    }
                    `);
                note_pc.classList.add('fixed-position');               
                qxd_btn.parentNode.insertBefore(jbj_btn, qxd_btn);

                full_btn.addEventListener("click", function () {

                    setTimeout(() => {
                       
                        full_btn_event()
                    }, 60);
                    // full_btn_event()
                })
                
                wyqp_btn.addEventListener("click", function () {
                    setTimeout(() => {
                       
                        wyqpBtnEvent()
                    }, 60);
                    
                })

                // 重新设置样式，确保移动后的按钮也有正确的样式
                // const newJbjBtn = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.video-note-inner');
                const newJbjBtn = document.querySelector('div.video-note-inner');
                if (newJbjBtn) {

                    // 直接修改style属性来应用样式
                    newJbjBtn.style.marginRight = '25px';
                    newJbjBtn.style.cursor = 'pointer';
                    // 注意：颜色需要确保与CSS中定义的一致，这里直接应用白色
                    newJbjBtn.style.color = 'white';
                    newJbjBtn.addEventListener("click", (e) => {
                        // jbjBtnOnclickEvent()
                        setTimeout(() => {
                            jbjBtnOnclickEvent()
                                                      
                        }, 50);
                        
                    });
                    // noteEvent()
                    setWidthDivBox()
                    // refreshOpacity()
                    setOpacity()

                    // setBtn()
                    ckbj_btn_event()

                    // saveNoteAsPdf()
                    setTimeout(() => {
                        noteEvent()
                        
                        setTimeout(() => {
                            let url = window.location.href;
                            let searchParams = new URLSearchParams(new URL(url).search);
                            // console.log('searchParams:' + searchParams)
                            noteOpen = searchParams.get('note');
                            // console.log('noteOpen:' + noteOpen)
                            if(noteOpen){
                                Screenshot()
                               
                                
                                IsJbjClick=true
                                if(note_pc.style.display != 'none'){   
                                    editorScrollToBottom()                                   
                                }
                                
                                setbar()
                                // setScrollbar()
                                refreshScrollbar()
                                setBtn()
                                setTimeout(() => {
                                    打开或关闭快捷键菜单()
                                },1000)
                                setTimeout(() => {
                                    // 打开或关闭快捷键菜单()
                                    InsertBtnEvent()
                                    editorEvent()
                                    
                                    
                                    editorScrollToLastY()
                                    let editor = document.querySelector("div.note-editor")
                                    if(editor){
                                        creatNoteImageClikEvent()
                                        
                                        
                                    }else{
                                        console.log('没有找到编辑器,无法添加图片点击事件')
                                    }
                                    
                                 }, 1200);
                                 
                            } 
                        }, 200);

                    
                        setBtn()

                        saveNoteAsPdf()
                        打开或关闭快捷键菜单()

                        
                    }, 200);


                    // ctrl打开、隐藏、显示笔记
                
                    document.addEventListener('keydown', function (event) {
                        // 检查是否按下Ctrl键
                        if (event.key === 'Control') {  
                            isCtrlPressed = true; // 标记Ctrl键已按下
                            otherKeyPressed = false; // 重置其他键的状态

                            // if(!otherKeyPressed){
                            //     isCtrlPressed = true; // 标记Ctrl键已按下
                            //     otherKeyPressed = false; // 重置其他键的状态
                            // }//ctrl打开笔记后记录后，需要按两次ctrl才能关闭笔记板                        
                            
                        } else{
                            isCtrlPressed = false;
                            // 如果Ctrl键已按下，并且按下了其他键
                            otherKeyPressed = true; // 标记按下了其他键
                        }

                        document.addEventListener('keydown', function (event) {
                            // 检查是否按下Ctrl键
                            if (event.key != 'Control') {
                                isCtrlPressed = false; // 标记Ctrl键已按下
                                otherKeyPressed = true; // 重置其他键的状态
                            }
                        });
                        
                    });

                    document.addEventListener('keyup', function (event) {
                        if(event.key != 'Control'){
                            isCtrlPressed = false;
                        }                     
                        // 检查是否释放了Ctrl键
                        if (event.key === 'Control') {
                            if(停用ctrl){return}
                            // isCtrlPressed = false;
                            if (!otherKeyPressed&&isCtrlPressed) {
                                console.log('单独按下Ctrl键并释放，执行逻辑');
                                let note_pc = document.querySelector("div.resizable-component.note-pc")
                                let jbj_btn = document.querySelector('div.video-note-inner');
                                let jbj_btn_title = newJbjBtn.innerText.trim()
                                if (jbj_btn) {
                                    if (note_pc && note_pc.style.display === 'none' && !IsJbjClick) {
                                        jbj_btn.click()
                                        
                                        setTimeout(() => {
                                            let ckbj_btn = document.querySelector('div.list-note-operation');
                                            let editor = document.querySelector("div.note-editor")
                                            if (ckbj_btn && !editor) {
                                                ckbj_btn.click()
                                            }
                                        }, 50);
                                    } else if (note_pc && note_pc.style.display === 'none' && IsJbjClick) {
                                        // console.log('按下了菜单键,笔记被显示') 
   
                                        note_pc.style.display = 'block'

                                        setTimeout(() => {
                                            editorScrollToLastY()
                                            setTimeout(() => {
                                                let editor=document.querySelector('.ql-editor')
                                                if(editor){
                                                    // if(editor.scrollTop<=300||editor.scrollHeight-editor.scrollTop<=500){
                                                    //     editor.scrollTop = editor.scrollHeight
                                                    // }
                                                    if(scrollH<=300||editor.scrollHeight-scrollH<=700){
                                                        editor.scrollTop = editor.scrollHeight
                                                    }
                                                }
                                            }, 5);
                                           
                                        }, 500);


                                        let bfy = document.querySelector('div.bpx-player-video-perch');
                                        let bfyHeight = bfy.getBoundingClientRect().height;
                                        let wh = window.innerHeight;
                                        // 全屏时bfyHeight>=1080，网页全屏时bfyHeight=wh
                                        let isqp = bfyHeight === wh || bfyHeight >= 1080;
                                        if (isqp) {
                                            // 如果是全屏，将笔记显示在页面中间
                                            // note_pc.style.left = "780px";
                                            // note_pc.style.top = "180px";
                                            if (note_pc.style.left != 0 && note_pc.style.right != 0||note_pc.style.left>=1487) {
                                                
                                                note_pc.style.left = "1006px"

                                            }
                                            note_pc.style.top = "139px"
                                            note_pc.style.width = "460px"
                                            note_pc.style.height = "600px"
                                            // let 笔记在视频页内=bfy.querySelector("div.resizable-component.note-pc")
                                            // if (!笔记在视频页内) {
                                            //     setNotePanel()
                                            // }
                                            
                                        } else {
                                            note_pc.style.top = '120px'
                                            note_pc.style.left = '855px'
                                            note_pc.style.width = "460px"
                                            note_pc.style.height = "600px"
                                        }

                                    } else if (note_pc && note_pc.style.display != 'none') {
                                        // console.log('按下了菜单键,笔记被隐藏') 
                                        let editor = document.querySelector('.ql-editor');                      
                                        selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                                        if(selection){
                                            range = selection.getRangeAt(0);
                                        }
                                        // console.log("点击的range", range);
                                        // scrollH = document.querySelector('.ql-editor').scrollTop
                                        if(editor.scrollTop>=200){
                                            scrollH = editor.scrollTop
                                        }
                                        
                                        getCursorPositionInEditor(editor)
                                        note_pc.style.display = 'none'
                                        
                                      

                                    }

                                } else { console.log('未找到jbj_btn') }

                            }
                            // 重置状态
                            isCtrlPressed = false; // 标记Ctrl键已释放
                            otherKeyPressed = false; // 重置其他键按下状态
                        }
                    });
                  
            

                    // ctrl+左/下/右键移动笔记面板左、中、右
                    document.addEventListener('keydown', function (event) {
                        
                        if (event.ctrlKey) {
                            let bfy = document.querySelector('div.bpx-player-video-perch');
                            let bfyHeight = bfy.getBoundingClientRect().height;
                            let wh = window.innerHeight;
                            let isqp = bfyHeight === wh || bfyHeight >= 1080;
                        
                            let note_pc = document.querySelector("div.resizable-component.note-pc");
                    
                            if (event.key === 'ArrowLeft') {
                                event.preventDefault();
                                if (!note_pc || note_pc.style.display === 'none') return; // 如果找不到或隐藏，直接返回
                                note_pc.style.left = '0'; // 或者根据实际需要调整
                                note_pc.style.right = ''; // 清除 right 属性
                                note_pc.style.width = "460px"
                                note_pc.style.height = "600px"

                            } else if (event.key === 'ArrowRight') {
                                event.preventDefault();
                                if (!note_pc || note_pc.style.display === 'none') return; // 如果找不到或隐藏，直接返回
                                note_pc.style.right = '0'; // 或者根据实际需要调整                                
                                note_pc.style.left = ''; // 清除 left 属性
                                note_pc.style.width = "460px"
                                note_pc.style.height = "600px"

                            }else if(event.key === 'ArrowDown'){
                                event.preventDefault();
                                if (!note_pc || note_pc.style.display === 'none') return; // 如果找不到或隐藏，直接返回
                                note_pc.style.left = "1006px"
                                note_pc.style.top = "139px" 
                                note_pc.style.width = "460px"
                                note_pc.style.height = "600px"
                            }
                        }
                    });



                    // ctrl+上键插入当前字幕
                    document.addEventListener('keydown', async function (event) {
                        if (event.ctrlKey && event.key == "ArrowUp") {
                            isBold = false
                            event.preventDefault();
                            try {

                                let subtitle = document.querySelector('.bpx-player-subtitle-panel-text')?.textContent
                                if(!subtitle){return}
                                // subtitle = '字幕: '+ subtitle
                                iszimu=true
                                if (subtitle) {
                                    pasteTextToEditor(subtitle)
                                }
                            } catch (err) {
                                console.error('从剪贴板读取文本时出错:', err);
                            }

                        }
                    })

                    // ctrl+c键插入当前视频标题
                    document.addEventListener('keydown', function (event) {
                        if (event.ctrlKey && (event.key === 'c'||event.key === 'C')) {
                            if(停用ctrl_c){return}
                            let editor = document.querySelector('.ql-editor'); // 替换为实际的编辑器元素
                            // if(editor){
                            //     editor.focus();
                            // }
                            
                            // 检查是否选中了文本或图片
                            let selection1 = editor.ownerDocument.defaultView.getSelection().toString().trim();
                            let selectedImages = note_pc.querySelectorAll(".ql-image-preview.active"); // 如果图片有 selected 类，那么该图片是被选中状态
                            if (selection1 === "" && selectedImages.length === 0) {
                                event.preventDefault();
                                let text = copyVideoTitleToClipboard(); // 使用await等待Promise解析
                                 pasteTextToEditor(text)
                              
                            }
                    
                            // 获取当前的选择对象
                            let selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection
                            if (selection && selection.rangeCount > 0) {
                                range = selection.getRangeAt(0);
                            }
                        }
                    });

                     // ctrl+x快捷键插入截图
            document.addEventListener('keydown', function (event) {
                if (event.ctrlKey && (event.key === 'x'||event.key === 'X')) {
                    if(停用ctrl_x){return}
                   let editor = document.querySelector('.ql-editor'); // 替换为实际的编辑器元素
                    
                   // 检查是否选中了文本或图片
                    // selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                    selection = window.getSelection().toString().trim(); // 更安全地获取selection，考虑editor所在的文档上下文
                    
                    let selectedImages = note_pc.querySelectorAll(".ql-image-preview.active"); // 假设图片有 selected 类表示被选中
                    if (selection === "" && selectedImages.length === 0) {
                        event.preventDefault();
                        let tp = document.querySelector("span.ql-capture-btn.ql-bar");
                        if (tp) { 
                            if (selection != undefined && selection > 0 && editor.contains(range.startContainer) || editor.contains(range.endContainer))
                                {
                                    tp.click();
                                }else{
                                    setCursorAtBottom(editor)
                                    tp.click();
                                }                          
                            // tp.click();

                            setTimeout(() => {
                                creatNoteImageClikEvent()
                                // scrollH = editor.scrollTop
                                getCursorPositionInEditor(editor)
                                
                                // editor.scrollTo(0, scrollH);
                            }, 50);
                            
                        }
                        selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                        if(selection){
                            range = selection.getRangeAt(0);
                        }
                    }
                    // scrollH = document.querySelector('.ql-editor').scrollTop
                }
            });
                    // 点击弹幕的复制按钮后，自动粘贴到笔记中
                    // let bfy = document.querySelector('div.bpx-player-video-perch');
                    document.addEventListener('copy', async (event) => {
                        // console.log('弹幕被复制')
                        let copyEl = event.target;
                        if (copyEl.parentNode.classList.contains("bpx-player-container")) {
                            isBold = false
                            // let textNode
                            let dmText
                            // let editor = document.querySelector('.ql-editor');
                            try {
                                dmText = await navigator.clipboard.readText(); // 从剪贴板读取文本
                                if(!dmText){return}
                                isdanmu=true

                                // dmText = "弹幕:" + dmText
                                pasteTextToEditor(dmText)
                                
                                // console.log('已复制-', dmText)
                            } catch (err) {
                                console.error('读取剪贴板内容失败:', err);
                            }
                        }
                    })
                    // 分p视频播放另一个视频时，将笔记面宽高和位置调整为默认状态
                    let videoEl = document.querySelector("div.bpx-player-video-wrap > video");
                    videoEl.addEventListener('loadeddata', function () {
                        let close_btn = document.querySelector("div.close-note")
                        if(close_btn){
                            close_btn.click()
                        }
                        setTimeout(() => {
                            let note_pc = document.querySelector("div.resizable-component.note-pc")
                            if(note_pc){
                                note_pc.style.left = "1006px"
                                note_pc.style.top = "139px"
                                note_pc.style.width = "460px"
                                note_pc.style.height = "600px"
                            }
                            let bfy = document.querySelector('div.bpx-player-video-perch');
                            bfy.querySelector("div.resizable-component.note-pc")
                            let bfyHeight = bfy.getBoundingClientRect().height;
                            let wh = window.innerHeight;
                            let 笔记在视频页内=bfy.querySelector("div.resizable-component.note-pc")

                            // 全屏时bfyHeight>=1080，网页全屏时bfyHeight=wh
                            let isqp = bfyHeight === wh || bfyHeight >= 1080;
                            if (isqp&&!笔记在视频页内) {
                                setNotePanel()
                            }
                            
                            
                        },500)
                    })

                }
                observer.disconnect();


            }

        }
        // 创建MutationObserver实例
        const observer = new MutationObserver(moveButtonWhenDetected);

        // 配置观察选项：子节点变化
        const config = { childList: true, subtree: true };

        // 开始观察body（或其它合适的容器）
        observer.observe(document.body, config);

        // 确保DOMContentLoaded后也尝试执行一次，以防元素一开始就存在
        window.addEventListener('DOMContentLoaded', moveButtonWhenDetected);



         // 获取视频帧地址
         function getVideoFrameUrl() {
            let videoEl = document.querySelector('video');
            let currentPlayUrl;
            let pUrl = window.location.href;
        
            let currentTime = videoEl.currentTime;
            // 四舍五入，小数点保留一位
            currentTime = Math.round(currentTime * 10) / 10;
            // console.log('当前时间:' + currentTime);
        
            // 计算小时、分钟、秒
            let hours = Math.floor(currentTime / 3600); // 小时
            let minutes = Math.floor((currentTime % 3600) / 60); // 分钟
            let seconds = Math.floor(currentTime % 60); // 秒
        
            // 创建一个 URL 对象
            let url = new URL(pUrl);
            let 视频序号 =""
            let vTitle = copyVideoTitleToClipboard()
            try {
                视频序号  = vTitle.match(/^\d+(\.\d+)+/)[0];
            } catch (error) {
                视频序号="0"
                console.log("匹配视频序号出错,或不存在" ,error);
            }
            
            // 获取基础URL（不包括查询参数）
            let baseUrl = url.origin + url.pathname; // https://www.bilibili.com/video/BV1RL411T7Ai
            // console.log('baseUrl:' + baseUrl);
        
            // 获取查询参数中的 p 值
            let pValue = url.searchParams.get('p'); // '2'
            if(pValue!=null&&pValue!=undefined){
                if (pValue > 1) {
                    currentPlayUrl = baseUrl + '?' + 't=' + currentTime + '&p=' + pValue;
                } else {
                    currentPlayUrl = baseUrl + '?' + 't=' + currentTime;
                }
            }else{
                currentPlayUrl = baseUrl + '?' + 't=' + currentTime;
            }
           
            
            // console.log('951currentPlayUrl:' + currentPlayUrl);
            
            // 返回当前播放URL和格式化时间
            return {
                url: currentPlayUrl,
                time: hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`,
                // p: pValue!=null&&pValue!=undefined?'P'+pValue:''
                p: 视频序号!=null&&视频序号!=undefined?视频序号:''
            };
        }
        
        // 删除时间戳与图片之间的空格br元素
        function deleteBr() {
            ////////////////////////////////////////////
            // 获取所有匹配 .ql-image-preview 类的元素
            let images = document.querySelectorAll(".ql-image-preview");

            // 初始化变量以存储最大数字和对应的元素
            let maxNumber = -1;
            let maxImageElement = null;

            // 遍历每个元素
            images.forEach(image => {
                // 获取 data-id 属性的值
                const dataId = image.getAttribute('data-id');
                // 提取数字部分
                const number = parseInt(dataId.match(/\d+/)[0], 10);

                // 比较数字，更新最大数字和对应的元素
                if (number > maxNumber) {
                    maxNumber = number;
                    maxImageElement = image;
                }
            });

            let currentImage = maxImageElement.previousElementSibling;
            // let currentImage = lastImage.previousElementSibling;
            if (currentImage && currentImage.tagName === 'P') {
                // 检查当前 <p> 元素的子元素
                if (currentImage.children.length === 1 && currentImage.children[0].tagName === 'BR') {
                    currentImage.parentNode.removeChild(currentImage);
                } else {
                    console.log('当前 <p> 元素中有其他子元素，不会移除');
                }
            } else {
                console.log('没有找到匹配的元素');
            }

        }

        // 插入截屏的同时也插入时间标记
        function Screenshot() {
           
            // 插入截屏按钮
            setTimeout(() => {
                let tp = document.querySelector("span.ql-capture-btn.ql-bar");
                // 插入时间标记按钮
                let tm = document.querySelector("span.ql-tag-btn.ql-bar-btn");
                let note_editor = document.querySelector("div.note-editor")
    
    
                if (tp && tm) {
                    tp.removeEventListener("click", (e) => {
                        tm.click()
                        creatNoteImageClikEvent();
                        // tm.click()
                        setTimeout(() => {
                            deleteBr()
                        }, 2500)
                    })
                    tp.addEventListener("click", (e) => {
                        tm.click()
                        creatNoteImageClikEvent();
                        // tm.click()
                        setTimeout(() => {
                            deleteBr()
                        }, 2500)
                    });

                    let observerActive = false;

                   
                    tm.addEventListener("click", () => {

                        if (observerActive) return;

                        if (IsInsert) return;
                        const insert = () => {
                            let tm_qd = document.querySelector("div.dialog-btn.tag-dialog__btn--confirm");
                            if (tm_qd) {
                                tm_qd.click();
                                setTimeout(() => {
                                
                                    let editor=document.querySelector('.ql-editor')
                                    if(editor){
                                        if(editor.scrollHeight-editor.scrollTop<=900){
                                            // editor.scrollTo(0, editor.scrollHeight);
                                            editor.scrollTop = editor.scrollHeight
                                            scrollH = editor.scrollHeight
                                            
                                        }
                                        selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                                        if(selection){
                                            range = selection.getRangeAt(0);
                                        }else{
                                            console.log('无法获取选择区')
                                        }
                                        
                                    // 获取当前光标位置并存储在变量中,下次打开笔记同步光标位置
                                        getCursorPositionInEditor(editor)
    
                                    }   
                                }, 700);
                                observer.disconnect();
                                observerActive = false;
                            }
                        };

                        const observer = new MutationObserver(insert);
                        const config = { childList: true, subtree: true };
                        observer.observe(note_editor, config);
                        observerActive = true;


                    });
                } else {
                    console.log("无法找到截屏按钮或时间标记按钮");
                }
            }, 1000);
            
        }

        function full_btn_event() {
            // let bfy = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch');
            // let bfyHeight = bfy.getBoundingClientRect().height;
            let note_pc = document.querySelector("div.resizable-component.note-pc")
            // let bfy = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch');
            let bfy = document.querySelector('div.bpx-player-video-perch');


            // 防止按菜单键时,焦点在电脑任务栏上取用默认操作
            // bfy.focus()

            let bfyHeight = bfy.getBoundingClientRect().height;
            // let wh = window.innerHeight;
            
            if (note_pc && bfyHeight != 1080 && IsJbjClick) {
                setNotePanel()
                

            } else if (note_pc && bfyHeight == 1080 && IsJbjClick) {
                let infoflow = document.querySelector("#__infoflow_commercial")
                let biliMainHeader = document.querySelector("#biliMainHeader")
                if (infoflow) {
                    infoflow.parentNode.insertBefore(note_pc, infoflow)
                } else if (biliMainHeader) {
                    biliMainHeader.parentNode.insertBefore(note_pc, biliMainHeader)
                } else {
                    console.log("没有找到infoflow和biliMainHeader节点")
                }
              
                setTimeout(() => {
                    note_pc.style.left = "1006px"
                    note_pc.style.top = "139px" 
                }, 10);
                
                
            }

            setTimeout(() => {
                let editor = document.querySelector('.ql-editor');
                if(editor&&editor.style.display!="none"){
                    editorScrollToLastY()
                }
                
            }, 1);
          
        }

        // 滚动到原来位置函数
       

        function wyqpBtnEvent() {
            let bfy = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch');
            let wh = window.innerHeight;
            let bfyHeight = bfy.getBoundingClientRect().height;

            let note_pc = document.querySelector("div.resizable-component.note-pc")

            // 防止按菜单键时,焦点在电脑任务栏上取用默认操作
            // bfy.focus()

            if (bfyHeight == wh && IsJbjClick) {
                setNotePanel()
            } else {
                if (note_pc && IsJbjClick) {
                    let infoflow = document.querySelector("#__infoflow_commercial")
                    let biliMainHeader = document.querySelector("#biliMainHeader")

                    if (infoflow) {
                        infoflow.parentNode.insertBefore(note_pc, infoflow)
                        

                    } else if (biliMainHeader) {
                        biliMainHeader.parentNode.insertBefore(note_pc, biliMainHeader)
                        

                    } else {
                        console.log("没有找到infoflow和biliMainHeader节点")
                    }
                   
                    
                    setTimeout(() => {
                        note_pc.style.left = "1006px"
                        note_pc.style.top = "139px"  
                    }, 10);
                   
                }
                

            }

            setTimeout(() => {
                let editor = document.querySelector('.ql-editor');
                if(editor&&editor.style.display!="none"){
                    editorScrollToLastY()
                }
                
            }, 1);
            
            
        }
        ////////////////////////////////////////////


        function MyNoteBtnClick() {
            const userNames = document.querySelectorAll('.user-name');

            // 统计这些元素的数量
            const count = userNames.length;

            // 输出结果
            // console.log(`user-name 的个数是: ${count}`);

            for (let i = 0; i < count; i++) {
                let note_card_container = document.querySelector(`div.note-card-container > div:nth-child(${i + 1})`);
                if (note_card_container) {

                    note_card_container.addEventListener('click', function () {
                        IsMyNote = false;
                        // creatNoteImageClikEvent()
                        let MyNoteBtn = document.querySelector("div.note-operation.detail");
                        if (MyNoteBtn) {
                            MyNoteBtn.addEventListener('click', handleMyNoteBtnClick);
                        } else {
                            console.log('没有找到MyNoteBtn');
                        }
                    });
                }
            }

        }

        function OnNoteListWheel() {
            let NoteList = document.querySelector("div.note-content > div")
            if (NoteList) {
                NoteList.addEventListener('wheel', e => {
                    let MyNoteBtn = document.querySelector("div.note-operation");
                    if (MyNoteBtn) {
                        MyNoteBtn.addEventListener('click', handleMyNoteBtnClick);
                    } else {
                        console.log('没有找到MyNoteBtn');
                    }
                });
            } else {
                console.log('没有找到NoteList');
            }

        }
        function handleMyNoteBtnClick() {
            setTimeout(() => {
                refreshBtn();
                back_note_btn_event();
            }, 0);
        }

        function close_btn_event() {
            let close_btn = document.querySelector("div.close-note")
            if (!close_btn) return;
            close_btn.addEventListener("click", (e) => {
                isClose = true
                IsJbjClick = false
                isTmAddLisner = false

            })
        }


        // 查看笔记按钮事件
        function ckbj_btn_event() {
            // let note_pc = document.querySelector("resizable-component.note-pc")
            // note_pc.style.width = "460px"
            
            let thumb = document.querySelector("div.ZDscrollbar.custom-scrollbar > div > div")
            if (thumb) { thumb.style.top = "0" }
            range = ""
            let ckbj_btn = document.querySelector('div.list-note-operation');
            if (ckbj_btn) {

                ckbj_btn.addEventListener('click', function () {
                    IsMyNote = true
                   setTimeout(() => {
                        let ql_editor = document.querySelector(".ql-editor")
                        if (ql_editor) {
                            ql_editor.style.overflowY = "auto"
                            ql_editor.style.overflowX = "hidden"
                        } else {
                            console.log("没有找到ql_editor,无法修改滚动条样式")
                        }
                        let note_editor = document.querySelector("div.note-editor")
                        note_editor.style.height = "97.5%"
                        setTimeout(() => {
                            editorScrollToBottom()
                        }, 50);

                        // 打开或关闭快捷键菜单()
                        // editorScrollToBottom()
                        creatNoteImageClikEvent()//点击笔记中图片触发事件

                        Screenshot()
                        isTmAddLisner = true
                        InsertBtnEvent()
                        refreshScrollbar()
                        
                        back_note_btn_event()

                        editorEvent()
                        setTimeout(() => {
                            InsertBtnEvent()

                            editorScrollToBottom()

                            
                        }, 65);

                   }, 5);

                })
            }
        }

        // 从笔记页面后退按钮的事件
        function back_note_btn_event() {

            let back_note_btn = document.querySelector("div.back-note-list")
            if (back_note_btn) {
                back_note_btn.addEventListener("click", function () {
                    // IsNotePcHightChange=false
                    isTmAddLisner = false
                    // 打开或关闭快捷键菜单()
                    scrollbarDisplay("hide")
                    // BtnDisplay("hide")
                    let note_pc = document.querySelector("div.resizable-component.note-pc")

                    if (note_pc.style.opacity != 1) { note_pc.style.opacity = 1 }
                    // 重置透明度值
                    let opacitySlider = document.querySelector("div.sliderContainer > input")
                    if (opacitySlider) { opacitySlider.value = 0 }

                    let label2 = document.querySelector("div.sliderContainer > label2")
                    if (label2) { label2.textContent = '0%' }
                    // ckbj_btn_event()

                })
            } else {
                console.log("没有找到back_note_btn")
            }

        }

        // 添加各种点击记笔记的监听事件
        function jbjBtnOnclickEvent() {
            let thumb = document.querySelector("div.ZDscrollbar.custom-scrollbar > div > div")
            if (thumb) { thumb.style.top = "0" }

            if(!isClose){
                let note_pc = document.querySelector("div.resizable-component.note-pc")
                if(note_pc&&note_pc.style.display==='none'){
                    note_pc.style.display = 'block'
                }  
            }
            range = ""
            isClose = false
            IsJbjClick = true
            let opacitySlider = document.querySelector("div.sliderContainer > input")
            if (opacitySlider) { opacitySlider.value = 0 }

            let label2 = document.querySelector("div.sliderContainer > label2")
            if (label2) { label2.textContent = '0%' }

            let note_list = document.querySelector("div.note-list")
            if (note_list) { note_list.style.height = '97.5%'; }

            let bfy = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch');

            let ql_editor = document.querySelector(".ql-editor")
            if (ql_editor) {
                ql_editor.style.overflowY = "auto"
                ql_editor.style.overflowX = "hidden"
            }
            let bfyHeight = bfy.getBoundingClientRect().height;
            let wh = window.innerHeight;
            if (bfyHeight == wh) {
                setNotePanel()

            }

            noteEvent()

            refreshBar()

            // 笔记宽度
            // refreshWidthDivBox()

            // 笔记透明度
            // refreshOpacity()
            close_btn_event()

            let newJbjBtn = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.video-note-inner');
            let jbj_btn_title = newJbjBtn.innerText.trim()
            let note_pc = document.querySelector("div.resizable-component.note-pc");
            if (note_pc) {
                note_pc.style.width = "460px"
                note_pc.style.height = '600px'
                
                note_pc.addEventListener('mouseover', (e) => {
                    note_pc.addEventListener('wheel', (e) => {
                        e.stopPropagation();

                    })
                })
                note_pc.addEventListener('mousedown', (e) => {
                    note_pc.addEventListener('wheel', (e) => {
                        e.stopPropagation();

                    })
                })
                note_pc.addEventListener('mouseup', (e) => {
                    note_pc.addEventListener('wheel', (e) => {
                        e.stopPropagation();

                    })
                })
            } else {
                console.log("1028:没有找到note_pc")
            }

            if (note_pc.style.opacity != 1) { note_pc.style.opacity = 1 }
            if (jbj_btn_title === "记笔记") {
                console.log("1 if (jbj_btn_title == 记笔记)执行")
                IsMyNote = true
                isTmAddLisner = true
                setTimeout(() => {
                    let note_editor = document.querySelector("div.note-editor")
                    if(note_editor){
                        note_editor.style.height = "97.5%" 
                        editorEvent()
                        back_note_btn_event()
                        // 给笔记中图片添加点击事件,点击图片弹出
                        creatNoteImageClikEvent()
                        // 插入截屏的同时插入时间标记
                        Screenshot()
                        
                        // editorEvent()
                        InsertBtnEvent()

                        editorScrollToBottom()
                       
                        refreshScrollbar()
                        
                    }
                }, 100);
                
                

            } else {
                OnNoteListWheel()
                MyNoteBtnClick()
                scrollbarDisplay("hide")
                
                
            }

            let bar = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div.custom-bar-class")
            // let bfyHeight = bfy.getBoundingClientRect().height;
            if (bfyHeight >= 1080) {
                bar.style.display = "block"
            }

           


        }



        //  1.笔记面板宽度控制条相关
        // 判断WidthDivBoxExist是否存在如果不存在则添加宽度控制条,存在则删除后重新添加才能不出错保持监听事件有效
        function refreshWidthDivBox() {

            let widthDivBox = document.querySelector("div.width-control-box")
            if (!widthDivBox) { setWidthDivBox() }
        }



        //  设置宽度控制条
        function setWidthDivBox() {
            let note_pc = document.querySelector("div.resizable-component.note-pc")
            note_pc.style.width = "460px"
            //使笔记始终保持在网页中固定位置,即使网页上下滚动,笔记始终都可见
            GM_addStyle(`
                    .fixed-position {
                        position: fixed !important;
                    }
                `);
            note_pc.classList.add('fixed-position');
            // 创建一个新的div来容纳滑块和标签，并添加类名
            let widthDivBox = document.createElement('div');
            widthDivBox.className = 'width-control-box';
            widthDivBox.style.width = '405px';
            widthDivBox.style.marginLeft = '25px';
            // widthDivBox.style.height = '15px';

            widthDivBox.style.height = '1.5%';
            // widthDivBox.style.marginBottom = '1.4%';

            // 创建并设置宽度滑块左侧标签，并添加类名
            let widthLab1 = document.createElement('label');
            widthLab1.className = 'width-slider-label';
            widthLab1.textContent = '宽度';
            widthLab1.style.fontSize = '15px';
            widthLab1.style.borderRadius = "10px";
            widthLab1.style.marginRight = '2.5px';
            widthLab1.style.color = "rgb(19, 72, 87)";

            // 创建并设置宽度滑块右侧标签，并添加类名
            let widthLab2 = document.createElement('label');
            widthLab2.className = 'width-slider-value';
            // widthLab2.textContent = '800px';
            widthLab2.textContent = '460px';
            widthLab2.style.borderRadius = "10px";
            widthLab2.style.color = "rgb(19, 72, 87)";
            widthLab1.style.marginRight = '2.5px';
            widthLab2.style.fontSize = '15px';
            // widthLab2.style.right = '0';

            // 创建宽度滑块，并添加类名
            let widthSlider = document.createElement('input');
            widthSlider.className = 'width-slider';
            widthSlider.type = 'range';
            widthSlider.min = '460';
            widthSlider.max = '1912';
            widthSlider.step = '1';
            // widthSlider.value = note_pc.offsetWidth.toString(); // 初始值为当前宽度
            widthSlider.value = '460'; // 初始值为当前宽度

            // 设置宽度滑块样式
            widthSlider.style.marginRight = '2.5px';
            widthSlider.style.height = "8px";
            widthSlider.style.width = "300px";
            widthSlider.style.outline = "none";
            widthSlider.style.backgroundColor = "#003300";
            // widthSlider.style.backgroundColor = "skyblue";
            widthSlider.style.opacity = "1";
            widthSlider.style.cursor = "pointer";

            widthLab1.addEventListener('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
            widthLab2.addEventListener('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })

            setTimeout(() => {
                // 添加事件监听器来响应滑块的变化
                // 笔记中有图片时,图片宽度也需要单独调节
                const img = document.getElementsByClassName('ql-image-preview');


                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.attributeName === 'style') {
                            const width = parseInt(note_pc.style.width.replace('px', ''), 10);
                            widthSlider.value = width;
                            widthLab2.textContent = width + 'px';
                            // widthLab2.textContent = 460 + 'px';
                        }
                    });
                });

                // 观察note_pc的style属性
                observer.observe(note_pc, { attributes: true, attributeFilter: ['style'] });

                widthSlider.addEventListener("input", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let value = widthSlider.value;
                    note_pc.style.width = value + 'px';
                    if (img) {
                        for (let i = 0; i < img.length; i++) {
                            // 为当前元素设置宽度
                            img[i].style.width = value + 'px';
                        }
                    }

                    widthLab2.textContent = value + 'px';
                });
            }, 50);
            
            // 将元素添加到DOM中
            widthDivBox.appendChild(widthLab1);
            widthDivBox.appendChild(widthSlider);
            widthDivBox.appendChild(widthLab2);
            
            let note_content = document.querySelector("div.note-content")
            if (note_content) {
                note_content.parentNode.insertBefore(widthDivBox, note_content);
            } else {
                console.log("note_content元素不存在")
            }


        }

        // 2.笔记内容高度控制条
        // 刷新笔记面板内容高度控制条
        function refreshScrollbar() {
            // 类名:ZDscrollbar
            if (isFirefox()) {
                // console.log('这是火狐浏览器,不需要添加滚动条');
                return;
            } 
            if(isEdge()){
                // console.log('这是Edge浏览器,不需要添加滚动条');
                return;
            }
            let note_pc = document.querySelector("div.resizable-component.note-pc")
            if (!note_pc) return;

            let scrollbar = document.querySelector("div.ZDscrollbar.custom-scrollbar")

            if (scrollbar && scrollbar.style.display == "none") {
                scrollbarDisplay("show")

                refreshScrollBarListener(scrollbar)

            } else if (!scrollbar) {
                setScrollbar()
            }


            function refreshScrollBarListener(s) {
                function alteration() {
                    let contentHeight;
                    let scrollbar = s;

                    let isDragging = false;
                    let dragStartPos = 0;
                    // dragStartPos = 0;

                    let editor = document.querySelector('.ql-editor');
                    if (!editor) {
                        // console.log("1246:未找到 editor 元素")
                    }

                    let track = document.querySelector("div.ZDscrollbar.custom-scrollbar > div")
                    let thumb = document.querySelector("div.ZDscrollbar.custom-scrollbar > div > div")

                    if (!IsNotePcHightChange) {
                        thumb.style.top = '0';
                    }

                    // thumb.style.top = '0';
                    let scrollbarHeight;
                    let note_pcHeight;
                    track.addEventListener('mouseover', () => {
                        contentHeight = editor.scrollHeight;
                        note_pcHeight = editor.clientHeight;
                        scrollbarHeight = scrollbar.clientHeight;

                    });

                    editor.addEventListener('mouseover', () => {
                        contentHeight = editor.scrollHeight;
                        note_pcHeight = editor.clientHeight;
                        scrollbarHeight = scrollbar.clientHeight;
                    });

                    editor.addEventListener('mouseover', () => {
                        contentHeight = editor.scrollHeight;
                        note_pcHeight = editor.clientHeight;
                        scrollbarHeight = scrollbar.clientHeight;
                    });


                    editor.addEventListener('scroll', () => {
                        // contentHeight = editor.scrollHeight;
                        // scrollbarHeight = scrollbar.clientHeight;
                        // note_pcHeight = editor.clientHeight;
                        let scrollTop = editor.scrollTop;
                        let thumbTop = (scrollTop / (contentHeight - note_pcHeight)) * (scrollbarHeight - thumb.clientHeight);
                        thumb.style.top = `${thumbTop}px`;
                    });

                    // let isDragging = false;
                    // let dragStartPos = 0;
                    // dragStartPos = 0;

                    thumb.addEventListener('mousedown', (e) => {
                        e.preventDefault();  // 取消默认操作，阻止链接跳转
                        e.stopPropagation(); // 阻止事件冒泡到其他监听器
                        isDragging = true;
                        dragStartPos = e.clientY - thumb.offsetTop;
                    });

                    thumb.addEventListener('mouseover', (e) => {

                        thumb.style.opacity = '1';
                    });

                    thumb.addEventListener('mouseout', (e) => {

                        thumb.style.opacity = '0.3';
                    });

                    document.addEventListener('mouseup', () => {
                        isDragging = false;
                    });

                    document.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;
                        let newTop = Math.max(0, Math.min(scrollbarHeight - thumb.clientHeight, e.clientY - dragStartPos));
                        thumb.style.top = `${newTop}px`;
                        let scrollFraction = newTop / (scrollbarHeight - thumb.clientHeight);
                        editor.scrollTop = scrollFraction * (contentHeight - note_pcHeight);
                    });

                }
                const ro = new ResizeObserver(entries => {
                    IsNotePcHightChange = true
                    entries.forEach(entry => {
                        alteration();
                        // console.log(`note_pc高度发生变化 ${entry.contentRect.height}`);
                    });


                });
                ro.observe(note_pc);
            }



        }


        function scrollbarDisplay(displayState) {
            if (isFirefox()) {
                // console.log('这是火狐浏览器');
                return;
            } 
            if(isEdge()){
                // console.log('这是Edge浏览器');
                return;
            }

            let scrollbar = document.querySelector("div.ZDscrollbar.custom-scrollbar")
            if (scrollbar === null) {
                console.error(" Scrollbar element not found.");
                return;
            }

            if (displayState === "hide") {

                scrollbar.style.display = "none";
            } else if (displayState === "show") {

                scrollbar.style.display = "block";
            } else {
                console.warn("Invalid display state. Expected 'hide' or 'show'.");
            }
        }
        // 设置笔记内容高度控制条
        function setScrollbar() {

            if (isFirefox()) {
                // console.log('这是火狐浏览器');
                return;
            } 
            if(isEdge()){
                // console.log('这是Edge浏览器');
                return;
            }
            
            let note_pc = document.querySelector("div.resizable-component.note-pc")
            if (note_pc === null) {
                console.error("没有找到note_pc");
                return;
            }
            
            const scrollbar = document.createElement('div');
            scrollbar.className = 'ZDscrollbar';
            scrollbar.classList.add('custom-scrollbar');
            scrollbar.style.position = 'absolute';
            // scrollbar.style.top = note_pc.style.top;
            scrollbar.style.top = '0';
            scrollbar.style.width = '12px';
            scrollbar.style.height = '100%';
            scrollbar.style.right = '-13px';


            const track = document.createElement('div');
            track.className = 'track';
            track.style.width = '100%';
            track.style.height = '100%';
            track.style.backgroundColor = "#f0f0f0";
            track.style.borderRadius = '3px';


            const thumb = document.createElement('div');
            thumb.className = 'thumb';
            thumb.style.position = 'relative';
            thumb.style.width = '100%';
            thumb.style.backgroundColor = "#888";
            thumb.style.borderRadius = '5px';
            thumb.style.opacity = '0.3';
            thumb.style.height = '49px';


            // 鼠标移到thumb后光标变成小手:
            thumb.style.cursor = 'pointer';

            track.appendChild(thumb);
            scrollbar.appendChild(track);
            // bjk_box.parentNode.appendChild(scrollbar);
            note_pc.appendChild(scrollbar);

            // alteration()
            setTimeout(() => {
                
                let ckbj_btn = document.querySelector('div.list-note-operation');
                if(ckbj_btn){
                    ckbj_btn.addEventListener('click',()=>{
                        note_pc.style.width = '460px'
                        alteration()

                    })
                }else{
                    note_pc.style.width = '460px'
                    alteration()
                }
            }, 3000);
           



            function alteration() {
                if (isFirefox()) {
                    // console.log('这是火狐浏览器');
                    return;
                } 
                if(isEdge()){
                    // console.log('这是Edge浏览器');
                    return;
                }
                let editor = document.querySelector('.ql-editor');

                let contentHeight;
                let scrollbarHeight;
                let note_pcHeight;
                if (!IsNotePcHightChange) {
                    thumb.style.top = '0';
                }
                // thumb.style.top = '0';
                track.addEventListener('mouseover', () => {
                    contentHeight = editor.scrollHeight;
                    note_pcHeight = editor.clientHeight;
                    scrollbarHeight = scrollbar.clientHeight;

                });

                editor.addEventListener('mouseover', () => {
                    contentHeight = editor.scrollHeight;
                    note_pcHeight = editor.clientHeight;
                    scrollbarHeight = scrollbar.clientHeight;
                });

                editor.addEventListener('scroll', () => {
                    let scrollTop = editor.scrollTop;
                    let thumbTop = (scrollTop / (contentHeight - note_pcHeight)) * (scrollbarHeight - thumb.clientHeight);
                    thumb.style.top = `${thumbTop}px`;
                });

                let isDragging = false;
                let dragStartPos = 0;
                isDragging = false;
                dragStartPos = 0;

                thumb.addEventListener('mousedown', (e) => {
                    e.preventDefault();  // 取消默认操作，阻止链接跳转
                    e.stopPropagation(); // 阻止事件冒泡到其他监听器
                    isDragging = true;
                    dragStartPos = e.clientY - thumb.offsetTop;
                });

                thumb.addEventListener('mouseover', (e) => {

                    thumb.style.opacity = '1';
                });

                thumb.addEventListener('mouseout', (e) => {

                    thumb.style.opacity = '0.3';
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    let newTop = Math.max(0, Math.min(scrollbarHeight - thumb.clientHeight, e.clientY - dragStartPos));
                    thumb.style.top = `${newTop}px`;
                    let scrollFraction = newTop / (scrollbarHeight - thumb.clientHeight);
                    editor.scrollTop = scrollFraction * (contentHeight - note_pcHeight);
                });

            }
            note_pc = document.querySelector("div.resizable-component.note-pc")

            const ro = new ResizeObserver(entries => {
                IsNotePcHightChange = true
                entries.forEach(entry => {
                    alteration();
                    // console.log(`note_pc高度发生变化 ${entry.contentRect.height}`);
                });

            });
            ro.observe(note_pc);

        }


        // 3.透明度控制条
        // 刷新笔记面板内容高度控制条
        function refreshOpacity() {

            let OpacityBox = document.querySelector("div.sliderContainer")
            if (OpacityBox) {
                return
            } else {
                setOpacity()
            }
        }

        function setOpacity() {

            let opacitySliderBox = document.createElement('div');
            opacitySliderBox.className = 'sliderContainer'; // 添加类名
            opacitySliderBox.style.width = '405px';
            opacitySliderBox.style.marginLeft = '25px';
            // opacitySliderBox.style.height = '15px';
            opacitySliderBox.style.height = '3%';
            opacitySliderBox.style.marginTop = '10px';
            // opacitySliderBox.style.marginBottom = '1%';
            opacitySliderBox.style.marginBottom = '10px';
            // opacitySliderBox.style.backgroundColor = '#000000';
            let lab1 = document.createElement('label');//////
            lab1.className = 'sliderLabel1'; // 添加类名
            lab1.textContent = '透明';
            lab1.style.fontSize = '15px';
            lab1.style.borderRadius = "10px";
            lab1.style.marginRight = '2.5px';
            // lab1.style.color = "#000000";
            lab1.style.color = "#020205";

            let lab2 = document.createElement('label');
            lab2.className = 'sliderLabel2'; // 添加类名
            lab2.textContent = '0%';
            lab2.style.borderRadius = "10px";
            // lab2.style.color = "#000000";
            lab2.style.color = "#020205";
            // lab2.style.background = '#663366';
            lab2.style.right = '50px'; // 可能需要调整，因为right属性通常与position属性一起使用

            lab2.style.fontSize = '15px';
            lab2.style.fontWeight = "bold";

            let opacitySlider = document.createElement('input');
            opacitySlider.className = 'opacitySlider'; // 添加类名
            opacitySlider.type = 'range';
            opacitySlider.min = '0';
            opacitySlider.max = '0.99';
            opacitySlider.step = '0.01';
            opacitySlider.value = '0';

            // 滑块样式
            opacitySlider.style.marginRight = '2.5px';
            opacitySlider.style.height = "8px";
            opacitySlider.style.width = "300px";
            opacitySlider.style.outline = "none";
            opacitySlider.style.backgroundColor = "#000000";
            opacitySlider.style.color = "#000000";
            opacitySlider.style.opacity = "1";
            opacitySlider.style.cursor = "pointer";
            // 将元素添加到DOM中
            opacitySliderBox.appendChild(lab1);
            opacitySliderBox.appendChild(opacitySlider);
            opacitySliderBox.appendChild(lab2);

            let note_pc = document.querySelector("div.resizable-component.note-pc");

            // 透明度滑动调整
            opacitySlider.addEventListener("input", function (e) {
                e.preventDefault();
                e.stopPropagation();
                let value = opacitySlider.value;
                note_pc.style.opacity = 1 - value; // 调整透明度
                let text_value = Math.round(value * 100);
                lab2.textContent = text_value + '%';
            });

            // 鼠标移入透明度调节滑块时，弹窗提示鼠标所x在位置透明度数值
            opacitySlider.addEventListener('mousemove', function (event) {
                // 获取滑块的宽度和鼠标的位置
                let rect = opacitySlider.getBoundingClientRect();
                let offsetX = event.clientX - rect.left;
                let sliderWidth = rect.width;

                // 计算滑块的值
                let value = (offsetX / sliderWidth) * (opacitySlider.max - opacitySlider.min) + opacitySlider.min;
                value = Math.round(value * 100); // 保留两位小数

                opacitySlider.title = '透明度调整为: ' + value + "%";
            });
            // 将组件添加到页面中
            let width_control_box = document.querySelector("div.width-control-box");
            width_control_box.insertAdjacentElement('afterend', opacitySliderBox);
        }

        // 监听键盘事件
        document.addEventListener('keydown', function (event) {
            if (event.altKey && (event.key >= '0' && event.key <= '9')) {
                event.preventDefault(); // 阻止在其他输入区域的默认行为
                event.stopPropagation();
                

                let note_pc = document.querySelector("div.resizable-component.note-pc")
                let opacitySlider = document.querySelector('.opacitySlider')
                let editor = document.querySelector("div.ql-editor")
                if(editor){
                    editor.blur()                        
                }
                // 添加输入的数字
                inputNumber += event.key;

                  // 如果输入的第一个数字是 0，直接设置透明度为 0 
                if (inputNumber.length === 1 && inputNumber[0] === '0') {
                    note_pc.style.opacity = 1; // 设置为 0% 透明度
                    document.querySelector('.sliderLabel2').textContent = '0%'; // 更新显示
                    opacitySlider.value=0
                    inputNumber = ''; // 重置输入
                    return; // 结束事件处理
                }

                
                // 限制输入为两位数字
                if (inputNumber.length === 2) {
                    // 让笔记面板失去焦点，避免调整透明度时在笔记面板输入字符
                    // if(editor){
                    //     editor.blur()                        
                    // }
                    
                    inputNumber = inputNumber.slice(-2); // 保留最后两位                    
                    let opacityValue = parseFloat(inputNumber) / 100; // 将输入值转换为 0-1 范围的透明度
                    if (opacityValue >= 0 && opacityValue <= 1) {
                        note_pc.style.opacity = 1 - opacityValue; // 设置透明度
                        document.querySelector('.sliderLabel2').textContent = inputNumber + '%'; // 更新显示
                        opacitySlider.value = opacityValue; // 同步更新滑块的值
                        inputNumber = ''; 
                       
                    }    

                }
                   
            }
        });

     

        //静态 仅适用于笔记面板未隐藏状态，按alr键设置editor光标焦点
        function setEditorFocus(editor){
            if(editor){
                
                if(!isEditorFocused(editor)){
                    if(targetNode!=null&&targetNode!=undefined&&position!=null&&position!=undefined&&position!=-1){
                        if(editor.scrollHeight-editor.scrollTop<=900){
                            setCursorAtBottom(editor)
                            editor.scrollTop=editor.scrollHeight                                   
                        }else{
                            setCursorAtNodePosition(editor, targetNode, position) 
                            
                        }
                                                      
                    }else{
                        
                        editor.scrollTop=editor.scrollHeight
                        // setCursorAtBottom(editor)
                    }
                }else{  
                    let bfy = document.querySelector('div.bpx-player-video-perch');
                    scrollH = editor.scrollTop
                    
                    editor.blur()
                    bfy.focus()
                }
                // editor.focus()
                scrollH = editor.scrollTop
                getCursorPositionInEditor(editor)
            }  
        }
        // 清空输入状态
        document.addEventListener('keyup', function (event) {
            if (event.key === 'Alt') {
                // 清空输入数字
                let editor = document.querySelector("div.ql-editor")
                
                inputNumber = '';
                setTimeout(() => {
                    setEditorFocus(editor)
                    setTimeout(() => {
                        if(editor.scrollTop<=300||editor.scrollHeight-editor.scrollTop<=700){
                            editor.scrollTop=editor.scrollHeight
                        }
                    }, 0); 
                }, 50)    
            }

        });
        


/////////////////////////////////测试线////////////////////////////////////
        // 4.到顶部/到底部按钮

        function refreshBtn() {
            let BtnBox = document.querySelector("div.note-header.drag-el > div.scrollButtonWrapper")


            if (BtnBox) {
                BtnDisplay('show')
                refreshBtnlistener()
                return;
            }
            else {
                setBtn()
                
            }
            // 打开或关闭快捷键菜单()
        }


        function BtnDisplay(displayState) {

            let BtnBox = document.querySelector("div.scrollButtonWrapper")


            if (!BtnBox) { return; }
            if (displayState == "hide") {
                BtnBox.style.display = "none";
            } else if (displayState == "show") {
                BtnBox.style.display = "block";

            }

        }

        function 打开或关闭快捷键菜单() {
            let hideBtn = document.querySelector(".hide");
            let 菜单 = document.getElementById("dropdownMenu")
            hideBtn.addEventListener("click", () => {
                let 打开菜单按钮被点击 = true
                if (菜单.style.display === "none") {
                    打开菜单按钮被点击 = true
                    let bfy = document.querySelector('div.bpx-player-video-perch');
                    let bfyHeight = bfy.getBoundingClientRect().height;
                    let wh = window.innerHeight;
                    let isqp = bfyHeight === wh || bfyHeight >= 1080;
                    if (isqp) {
                        bfy.appendChild(菜单);

                    } else {
                        document.body.appendChild(菜单);
                    }
                    setTimeout(() => {
                        // 获取隐藏按钮的位置
                        let hideBtnRect = hideBtn.getBoundingClientRect();
                        // 设置菜单的位置
                        菜单.style.display = 'block'
                        菜单.style.left = (hideBtnRect.left - 33) + 'px';
                        菜单.style.top = (hideBtnRect.top - 107) + 'px'; // 调整菜单的位置
                        菜单.addEventListener('mouseleave', () => {
                            菜单.style.display = 'none'
                        })
                        document.addEventListener('click', (e) => {
                            if(e.target.id!="dropdownMenu"){
                                菜单.style.display = 'none'
                            }
                        })

                        let editor = document.querySelector("div.ql-editor")
                        if(editor){
                            editor.addEventListener('click', (e) => {
                                菜单.style.display = 'none'
                            })
                        }
                    }, 0);
                }
            })

        }
       
       function setBtn() {

            let btnContainer = document.createElement('div');
            btnContainer.className = 'scrollButtonWrapper'; // 添加类名
            btnContainer.style.left = "150px";
            btnContainer.style.position = "absolute";
            btnContainer.style.backgroundColor = "transparent"; // 设置背景为透明

            // 创建到顶部按钮
            let toTopBtn = document.createElement("button");
            toTopBtn.className = 'scrollToTopBtn'; // 添加类名
            toTopBtn.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNjY2NjY2IiBkPSJNNSA1VjRoMTR2MXptNi41IDE1VjkuNjA4bC0zLjEgMy4xTDcuNjkyIDEyTDEyIDcuNjkyTDE2LjMwOCAxMmwtLjcwOC43MDhsLTMuMS0zLjFWMjB6Ii8+PC9zdmc+')"; // 使用 Base64 编码的图片
            toTopBtn.style.backgroundSize = "cover"; // 使背景图片覆盖整个按钮
            toTopBtn.style.width = "22px"; // 设置按钮宽度
            toTopBtn.style.height = "25px"; // 设置按钮高度
            toTopBtn.style.border = "none"; // 移除按钮边框
            toTopBtn.style.cursor = "pointer"; // 设置鼠标悬停样式
            toTopBtn.title = '到顶部';
            toTopBtn.style.marginRight = "5px"
            toTopBtn.style.backgroundColor = "transparent";

            // 创建到底部按钮
            let toBottomBtn = document.createElement("button");
            toBottomBtn.className = 'scrollToBottomBtn'; // 添加类名
            toBottomBtn.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNjY2NjY2IiBkPSJNNSAyMHYtMWgxNHYxem03LTMuNjkyTDcuNjkyIDEybC43MDgtLjcwOGwzLjEgMy4xVjRoMXYxMC4zOTJsMy4xLTMuMWwuNzA4LjcwOHoiLz48L3N2Zz4=')"; // 使用 Base64 编码的图片
            toBottomBtn.style.backgroundSize = "cover"; // 使背景图片覆盖整个按钮
            toBottomBtn.style.width = "22px"; // 设置按钮宽度
            toBottomBtn.style.height = "25px"; // 设置按钮高度
            toBottomBtn.style.border = "none"; // 移除按钮边框
            toBottomBtn.style.cursor = "pointer"; // 设置鼠标悬停样式
            toBottomBtn.title = '到底部';
            toBottomBtn.style.marginRight = "5px"
            toBottomBtn.style.backgroundColor = "transparent";


            // 创建隐藏按钮
            let hideBtn = document.createElement("button");
            hideBtn.className = 'hide'; // 添加类名
            // hideBtn.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNjY2NjY2IiBkPSJtOS44MDggMTQuODhsLTQuNzQgNC43NDdxLS4xNDcuMTQ2LS4zNDUuMTU2dC0uMzYzLS4xNTZ0LS4xNjYtLjM1N3QuMTY2LS4zNTZsNC43NC00Ljc0MUg2LjU1OHEtLjIxMyAwLS4zNTYtLjE0NHEtLjE0NC0uMTQ0LS4xNDQtLjM1N3QuMTQ0LS4zNTZ0LjM1Ni0uMTQzSDEwcS4zNDMgMCAuNTc2LjIzMnQuMjMyLjU3NnYzLjQ0MnEwIC4yMTMtLjE0NC4zNTZ0LS4zNTcuMTQ0dC0uMzU2LS4xNDR0LS4xNDMtLjM1NnpNMTQuOSA5Ljc5aDIuNTQycS4yMTMgMCAuMzU3LjE0NHEuMTQzLjE0My4xNDMuMzU2dC0uMTQzLjM1NnQtLjM1Ny4xNDRIMTRxLS4zNDMgMC0uNTc1LS4yMzN0LS4yMzMtLjU3NVY2LjUzOXEwLS4yMTMuMTQ0LS4zNTd0LjM1Ny0uMTQzdC4zNTYuMTQzdC4xNDMuMzU3VjkuMDhsNC43NC00Ljc0NnEuMTQ3LS4xNDYuMzQ1LS4xNTZ0LjM2NC4xNTZxLjE2NS4xNjUuMTY1LjM1NnEwIC4xOTItLjE2Ni4zNTd6Ii8+PC9zdmc+')"; // 使用 Base64 编码的图片
            hideBtn.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0zLjUgMy41bDkgOW0yLTQuNWE2LjUgNi41IDAgMSAxLTEzIDBhNi41IDYuNSAwIDAgMSAxMyAwWiIvPjwvc3ZnPg==')"; // 使用 Base64 编码的图片
            hideBtn.style.backgroundSize = "cover"; // 使背景图片覆盖整个按钮
            hideBtn.style.width = "22px"; // 设置按钮宽度
            hideBtn.style.height = "25px"; // 设置按钮高度
            hideBtn.style.border = "none"; // 移除按钮边框
            hideBtn.style.cursor = "pointer"; // 设置鼠标悬停样式
            hideBtn.title = '停用/启用快捷键';
            hideBtn.style.backgroundColor = "transparent";
            ///////////////////////////////////////////////////////////////////////
            let 菜单0 = document.getElementById('dropdownMenu');
            if(!菜单0){
                let 菜单 = document.createElement('div');
                菜单.id = 'dropdownMenu';
                菜单.className = 'dropdown-menu';
                菜单.style.position="fixed"
                菜单.style.zIndex="10000000000"
                // 菜单.style.backgroundColor="#defcf9"
                // 菜单.style.backgroundColor="#479AC7"
                菜单.style.backgroundColor="rgba(71, 154, 199, 0.4)"
                菜单.style.fontSize="15px"
                菜单.style.borderRadius="5px"
                菜单.style.width="100px"
                菜单.style.display="none"
                菜单.style.padding="5px"
    
                document.body.appendChild(菜单);
                               
                var 选项 = ['停用ctrl', '停用ctrl+c', '停用ctrl+x',"停用全部"];
                选项.forEach(function(选项) {
                    var 菜单项 = document.createElement('div');
                    var 复选框 = document.createElement('input');
                    复选框.type = 'checkbox';
                    复选框.id = 选项.toLowerCase().replace(' ', '_');
                    复选框.setAttribute('data-action', 选项.toLowerCase().replace(' ', '_'));
    
                    var 标签 = document.createElement('label');
                    标签.htmlFor = 选项.toLowerCase().replace(' ', '_');
                    标签.textContent = 选项;
                    标签.style.color="white"
                    标签.style.cursor="pointer"
                    // 标签.style.backgroundColor="rgba(71, 154, 199, 0.9)"
                    标签.style.backgroundColor="rgb(71, 154, 199"
                    标签.style.borderRadius="5px"
                    // 标签.style.padding="5px"
                    // 标签.style.margin="8px"
                    标签.style.marginTop="5px"
                    标签.style.fontSize="16px"
                    标签.style.width="95px"
    
                    菜单项.appendChild(复选框);
                    菜单项.appendChild(标签);
                    菜单.appendChild(菜单项);
                    菜单.addEventListener('click', function(e) {
                        
                        
                        e.stopPropagation()
                    })
                    // 设置菜单的位置
                   
                    // 处理复选框状态变化
                    复选框.addEventListener('change', function() {
                        var 动作 = this.getAttribute('data-action');
                        if (this.checked) {
                            处理选中动作(动作);
                        } else {
                            处理未选中动作(动作);
                        }
                        setTimeout(() => {
                            let 菜单 = document.getElementById('dropdownMenu')
                            菜单.style.display="none"
                        }, 8500);
                    });
                });
    
                // 停用全部更新复选框状态
                function 停用全部更新复选框状态(是否勾选) {
                    let 复选框列表 = document.querySelectorAll('input[type="checkbox"]');
                    复选框列表.forEach(function(复选框) {
                        if (复选框.id !== '停用全部') {
                            复选框.checked = 是否勾选;
                        }
                    });
                }
                // 处理选中时的逻辑
                function 处理选中动作(动作) {
                    switch (动作) {
                        case '停用ctrl':
                            // alert('你选中了选项停用ctrl');
                            停用ctrl = true
                            break;
                        case '停用ctrl+c':
                            停用ctrl_c = true
                            break;
                        case '停用ctrl+x':
                            停用ctrl_x = true
                            break;
                        case '停用全部':
                            停用ctrl = true
                            停用ctrl_c = true
                            停用ctrl_x = true
                            停用全部更新复选框状态(true)
                            break;
                    }
                }
                // 处理未选中时的逻辑
                function 处理未选中动作(动作) {
                    switch (动作) {
                        case '停用ctrl':
                            // alert('你取消了停用ctrl');
                            停用ctrl = false
                            break;
                        case '停用ctrl+c':
                            停用ctrl_c = false
                            break;
                        case '停用ctrl+x':
                            停用ctrl_x = false
                            break;
                        case '停用全部':
                            停用ctrl = false
                            停用ctrl_c = false
                            停用ctrl_x = false
                            停用全部更新复选框状态(false)
                            break;

                    }
                }
            }else{
                打开或关闭快捷键菜单()
            }
          
            ///////////////////////////////////////////////////////////////////////

            // 将按钮添加到容器中
            btnContainer.appendChild(toTopBtn);
            btnContainer.appendChild(toBottomBtn);
            btnContainer.appendChild(hideBtn);
            
            
            let newJbjBtn = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.video-note-inner');
            let jbj_btn_title = newJbjBtn.innerText.trim()
            if (jbj_btn_title === "记笔记") {
                newJbjBtn.addEventListener("click", (e) => {
                    setTimeout(() => {
                        let note_message = document.querySelector("div.status-bar.note-message")
                        // let close_note = document.querySelector("div.close-note")
                        // 将容器添加到gkbj_btn的父节点中
                        if (note_message) {
                            // alert('找到了公开笔记按钮')
                            note_message.parentNode.insertBefore(btnContainer, note_message);
                            setTimeout(() => {
                                setBtnEvent();
                                // 打开或关闭快捷键菜单()
                            }, 0);
                            // setBtnEvent();
                        } else {
                            console.log('没找到公开笔记按钮')
                        }  
                    }, 100);
                   
                })


            } else {
                newJbjBtn.addEventListener("click", (e) => {

                    let ckbj_btn = document.querySelector('div.list-note-operation');
                    if (ckbj_btn) {
                        ckbj_btn.addEventListener("click", (e) => {
                            setTimeout(() => {
                                let note_message = document.querySelector("div.status-bar.note-message")
                                // let close_note = document.querySelector("div.close-note")
                                // 将容器添加到gkbj_btn的父节点中
                                if (note_message) {
                                    // alert('找到了公开笔记按钮')
                                    note_message.parentNode.insertBefore(btnContainer, note_message);
                                    setTimeout(() => {
                                        setBtnEvent();
                                        // 打开或关闭快捷键菜单()
                                    }, 0);
                                    // setBtnEvent();
                                } else {
                                    console.log('没找到公开笔记按钮')
                                }
                            }, 5);
                           
                        })
                    } else {
                        console.log('1648 没找到公开笔记按钮')
                    }

                })
            }

            setTimeout(() => {
                let ckbj_btn = document.querySelector('div.list-note-operation');
                ckbj_btn.addEventListener("click", (e) => {
                    let note_message = document.querySelector("div.status-bar.note-message")
                    // let close_note = document.querySelector("div.close-note")
                    // 将容器添加到gkbj_btn的父节点中
                    if (note_message) {
                        // alert('找到了公开笔记按钮')
                        note_message.parentNode.insertBefore(btnContainer, note_message);
                        setTimeout(() => {
                            setBtnEvent();
                            // 打开或关闭快捷键菜单()
                        }, 0);
                        // setBtnEvent();
                    } else {
                        console.log('没找到公开笔记按钮')
                    }
                    
                })
                setTimeout(() => {
                    let note_message = document.querySelector("div.status-bar.note-message")
                    if(note_message){
                        note_message.parentNode.insertBefore(btnContainer, note_message);
                        setTimeout(() => {
                            setBtnEvent();
                            // 打开或关闭快捷键菜单()
                        }, 0);
                    }
                }, 3000);
                let note_message = document.querySelector("div.status-bar.note-message")
                if(note_message){
                    note_message.parentNode.insertBefore(btnContainer, note_message);
                    setTimeout(() => {
                        setBtnEvent();
                        // 打开或关闭快捷键菜单()
                    }, 0);
                }
            }, 300);
            // 设置事件监听器
            function setBtnEvent() {
                let editor = document.querySelector("div.ql-editor")

                toBottomBtn.addEventListener("click", (e) => {
                    editor.scrollTo(0, editor.scrollHeight);
                    // scrollH = document.querySelector('.ql-editor').scrollTop
                    // scrollH = document.querySelector('.ql-editor').scrollTop
                    let thumb = document.querySelector("div.ZDscrollbar.custom-scrollbar > div > div")
                    let scrollbar = document.querySelector("div.ZDscrollbar.custom-scrollbar")
                    if (thumb) {
                        thumb.style.top = scrollbar.clientHeight - thumb.clientHeight + "px"
                        // refreshScrollBarListener(scrollbar)

                    }
                   
                    setCursorAtBottom(editor)
                    e.stopPropagation();
                });

                toTopBtn.addEventListener("click", (e) => {
                    editor.scrollTo(0, 0);
                    // scrollH = document.querySelector('.ql-editor').scrollTop
                    let scrollbar = document.querySelector("div.ZDscrollbar.custom-scrollbar")

                    let thumb = document.querySelector("div.ZDscrollbar.custom-scrollbar > div > div")
                    if (thumb) {
                        thumb.style.top = "0px"
                        // refreshScrollBarListener(scrollbar)
                    }
                    
                    setCursorAtTop(editor)
                    e.stopPropagation();
                });


               
                打开或关闭快捷键菜单() 
                // hideBtn.addEventListener('click', (e) => {
                //     打开或关闭快捷键菜单()                          
                // });
                editor.addEventListener('click', (e) => {
                    // e.preventDefault();
                    e.stopPropagation();
                });

            }

        };
      
        function refreshBtnlistener() {
            let editor = document.querySelector("div.ql-editor")
            let toBottomBtn = document.querySelector("button.scrollToBottomBtn")
            let toTopBtn = document.querySelector("button.scrollToTopBtn")

            // function setMenuPosition() {
            //     // 获取隐藏按钮的位置
            //     var hideBtnRect = hideBtn.getBoundingClientRect();
            //     // 设置菜单的位置
            //     菜单.style.left = hideBtnRect.left + 'px';
            //     菜单.style.top = (hideBtnRect.top - 35) + 'px'; // 调整菜单的位置
            // }

            toBottomBtn.addEventListener("click", (e) => {
                editor.scrollTo(0, editor.scrollHeight);
                // scrollH = document.querySelector('.ql-editor').scrollTop
                let scrollbar = document.querySelector("div.ZDscrollbar.custom-scrollbar")
                if (scrollbar) {
                    // refreshScrollBarListener(scrollbar)
                }
                editor.stopPropagation();
            });


            toTopBtn.addEventListener("click", (e) => {
                editor.scrollTo(0, 0);
                // scrollH = document.querySelector('.ql-editor').scrollTop
                let scrollbar = document.querySelector("div.ZDscrollbar.custom-scrollbar")
                if (scrollbar) {
                    // refreshScrollBarListener(scrollbar)
                }
                e.stopPropagation();
            });

            editor.addEventListener('click', (e) => {
                // e.preventDefault();
                e.stopPropagation();
            });

            


        }


        // 5.移动笔记面板：

        // 此函数的作用是点击jbj_btn时设置，当视频全屏状态点击记笔记按钮时将笔记面板放到视频播放页里面
        function setNotePanel() {
            let bfy = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch');
            let NotePanel = document.querySelector("div.resizable-component.note-pc");           
            NotePanel.style.background = "rgba(0, 0, 100, 0.1)";           
            NotePanel.style.left = "1006px"
            NotePanel.style.top = "139px" 
            NotePanel.style.width = "460px"
            NotePanel.style.height = "600px"
            bfy.appendChild(NotePanel)
            NotePanel.addEventListener('click', function (event) {
                // event.preventDefault();
                event.stopPropagation();

            })
            NotePanel.addEventListener('dblclick', function (event) {
                // event.preventDefault();
                event.stopPropagation();
            });
            // editorScrollToBottom()
            //  鼠标移到NotePanel里面设置监听事件阻止滚轮事件冒泡,防止鼠标滚轮影响视频的音量
            NotePanel.addEventListener('mouseenter', () => { NotePanel.addEventListener('wheel', (e) => { e.stopPropagation(); }) })
            

        };



        // 6.弧形按钮；
        function refreshBar() {
            let bar = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div.custom-bar-class")
            if (bar && bar.style.display == "none") {
                // return;
                bar.style.display = "block";
                refreshBarListener()

            } else { setbar() }

        }

        function refreshBarListener() {
            let note_pc = document.querySelector("div.resizable-component.note-pc")

            bar.addEventListener('mouseover', (e) => {
                // bar.title = "鼠标移开可显示笔记"

                setTimeout(() => {
                    let NotePanel = document.querySelector("div.resizable-component.note-pc")
                    // NotePanel.style.left = NotePanel_x
                    if (NotePanel.style.display == "none") {
                        NotePanel.style.display = "block"
                    }

                }, 0)


            })

            bar.addEventListener('click', (e) => {
                // e.preventDefault();
                e.stopPropagation();

                if (isClose) {
                    let newJbjBtn = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.video-note-inner');
                    newJbjBtn.click();
                }


            });
        }

        // 滚动到底部函数
        function editorScrollToBottom() {
            setTimeout(() => {
                let ql_editor = document.querySelector(".ql-editor");
        
                if (ql_editor) {
                    // 将滚动位置设置为内容的底部
                    // ql_editor.scrollTo(0, ql_editor.scrollHeight);
                    ql_editor.scrollTop = ql_editor.scrollHeight
                    // 将焦点设置到 ql_editor
                    // 创建一个范围并将光标移动到末尾
                    setTimeout(() => {
                        setCursorAtBottom(ql_editor) 
                    }, 5);
                    
                    // getCursorPositionInEditor(ql_editor)
                    
                } else {
                    console.log("没有找到 ql_editor");
                }
                
            }, 180); 
        }
        
        
        //滚动到上次编辑时的位置函数    
        function editorScrollToLastY() {
            // console.log("2262:scrollH:",scrollH)
            if(scrollH!=null&&scrollH!=undefined){
                let editor=document.querySelector('.ql-editor')
                // document.querySelector('.ql-editor').focus()
                // console.log("editorScrollToLastY 上中scrollH:",scrollH)
                if(!editor){
                    
                    return
                }
                
                if(editor.scrollHeight-scrollH<=200){
                    // editor.scrollTop=editor.scrollHeight-900
                    editorScrollToBottom()
                    // setTimeout(() => {
                    //     editorScrollToBottom()
                    // }, 100);
                    // editorScrollToBottom()
                }else if(scrollH<=200){
                    editorScrollToBottom()
                    // editorScrollToTop() 
                }else{
                    
                    editor.scrollTop = scrollH
                    setTimeout(() => {
                        setCursorAtNodePosition(editor, targetNode, position)
                    }, 5);
                    
                    // editor.focus()   
                }
                
            }else{
                
                editorScrollToBottom()
            }
        }
            

        function setbar() {
            let bfy = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch');
            // if (bfy.clientHeight < 1076) { return }
            let bar0 = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div.custom-bar-class")
            if (bar0) return;

            let bar = document.createElement('div');

            // 添加类名到bar元素
            bar.classList.add('custom-bar-class'); // 你可以将'custom-bar-class'替换为你想要的任何类名

            bar.style.cursor = 'pointer';
            bar.style.borderRadius = "100% 0 0 100%";
            bar.style.width = '60px';
            bar.style.height = '80%';
            bar.style.background = "rgba(33, 55, 61, 0.07)";
            // bar.style.background = "#1C1C1C";
            // bar.style.opacity = "0";
            bar.style.position = 'absolute';
            bar.style.right = '0';
            bar.style.top = '0';
            // bar.style.opacity = "0.05"

            bfy.appendChild(bar);
            let isBarClicked = false;

            bar.addEventListener('mouseover', (e) => {
                setTimeout(() => {
                    let NotePanel = document.querySelector("div.resizable-component.note-pc")

                    if (NotePanel.style.display == "none" && IsJbjClick) {

                        NotePanel.style.display = "block"
                        bar.title =''

                        editorScrollToLastY()
                        setTimeout(() => {
                            let editor = document.querySelector('.ql-editor')
                            if (editor) {
                                if (editor.scrollTop <= 300 || editor.scrollHeight - editor.scrollTop <= 700) {
                                    editor.scrollTop = editor.scrollHeight
                                }
                            }
                        }, 5);


                        
                        // 滚动到上一次隐藏笔记面板时的位置

                        let bfy = document.querySelector('div.bpx-player-video-perch');
                        let bfyHeight = bfy.getBoundingClientRect().height;
                        let wh = window.innerHeight;
                        // 全屏时bfyHeight>=1080，网页全屏时bfyHeight=wh
                        let isqp = bfyHeight === wh || bfyHeight >= 1080;
                        if (isqp) {
                            // 如果是全屏，将笔记显示在页面中间
                            // NotePanel.style.left = "780px";
                            // NotePanel.style.top = "180px";

                            if (NotePanel.style.left != 0 && NotePanel.style.right != 0 || NotePanel.style.left >= 1487) {
                                NotePanel.style.left = "1006px"

                            }

                            NotePanel.style.top = "139px"
                            NotePanel.style.width = "460px"
                            NotePanel.style.height = "600px"

                        } else {
                            NotePanel.style.top = '120px'
                            NotePanel.style.left = '855px'
                            NotePanel.style.height = "600px"
                            NotePanel.style.width = "460px"
                        }

                    }
                    if(!IsJbjClick){
                        bar.title = "点击打开笔记"
                    }
                    

                }, 0)

            })

            ////////////////////////////////////

            
            //////////////////////////////////////

            bar.addEventListener('click', (e) => {

                e.stopPropagation();
                // if (isClose) {
                //     let newJbjBtn = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.video-note-inner');
                //     newJbjBtn.click();

                // }
                if (isClose) {
                    let jbj_btn = document.querySelector('div.video-note-inner');

                    if (jbj_btn) {

                        jbj_btn.click()

                        setTimeout(() => {
                            let ckbj_btn = document.querySelector('div.list-note-operation');
                            let editor = document.querySelector("div.note-editor")
                            if (ckbj_btn && !editor) {
                                ckbj_btn.click()
                            }

                        }, 50);

                    }
                }



            });


        }// function setbar() {


// 7.插入标题按钮及相关事件

        // 粘贴标题文本到笔记编辑指定区
        function pasteTextToEditor(text) {
            if(text==null||text==undefined){
                return
            }
            let editor = document.querySelector('.ql-editor'); // 替换为实际的编辑器元素

            let textNode
            let strongNode
            // 创建一个 <strong> 元素，并将文本设置为加粗内容
            if (isBold) {
                // 创建一个 <strong> 元素，视频标题专用
                let pUrl = window.location.href
                strongNode = document.createElement('strong')           
                let aEl = document.createElement('a');
                aEl.className = 'video-title-link'
                // aEl.href = '#';
                aEl.href = pUrl
                aEl.textContent = text
                aEl.target = '_self'
                strongNode.appendChild(aEl);
                textNode = strongNode
                
            } else {
                // 创建一个普通的文本节点  字幕、弹幕专用的
                let aEl1 = document.createElement('a');
                // let currentPlayUrl,time = getVideoFrameUrl()
                let { p,url: currentPlayUrl, time } = getVideoFrameUrl()
                // console.log('粘贴函数currentPlayUrl:',currentPlayUrl)
                aEl1.href = currentPlayUrl
                if(isdanmu){
                    // p!=''&&p!=null&&p!=undefined?aEl1.textContent = text+'('+'弹幕:'+p+'/'+time+')':aEl1.textContent = text+'('+'弹幕:'+time+')'
                    p!=null&&p!=undefined?aEl1.textContent = text+'('+'弹幕:'+p+'/'+time+')':aEl1.textContent = text+'('+'弹幕:'+time+')'
                    isdanmu=false
                }else if(iszimu){
                    // p!=''&&p!=null&&p!=undefined?aEl1.textContent = text+'('+'字幕:'+p+'/'+time+')':aEl1.textContent = text+'('+'字幕:'+time+')'
                    p!=null&&p!=undefined?aEl1.textContent = text+'('+'字幕:'+p+'/'+time+')':aEl1.textContent = text+'('+'字幕:'+time+')'
                    iszimu=false
                }
                // p!=''&&p!=null&&p!=undefined?aEl1.textContent = text+'('+p+'-'+time+')':aEl1.textContent = text+'('+time+')'
                // aEl1.textContent = p+'-'+time+'-'+text
                aEl1.target = '_self'
                
                aEl1.className = 'zdm-link'
                textNode = aEl1
     
            }         
           
            
            // 插入该节点到范围中
           
            if (selection != undefined && selection > 0 && editor.contains(range.startContainer) || editor.contains(range.endContainer)) {
                range.insertNode(textNode);
                // 调整范围的位置
               
                setTimeout(() => {
                    // 直接将光标移到新插入内容的末尾
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    // 清除之前的选择，并重新设置选择范围
                    selection.removeAllRanges();
                    selection.addRange(range);  
                }, 50);
                
            } else {
                // setCursorAtBottom(editor)
                setTimeout(() => {
                    editor.appendChild(textNode);
                    // 尝试设置光标到末尾
                    const lastChild = editor.lastChild;
                    if (lastChild) {
                        const lastRange = document.createRange();
                        lastRange.setStartAfter(lastChild);
                        lastRange.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(lastRange);
                    }

                }, 150);
                
            }
                // setCursorAtBottom(editor)
            
            // 确保编辑器有焦点
            
        
            // 异步操作以确保 DOM 更新完成
            setTimeout(() => {

 
                if(editor.scrollHeight-editor.scrollTop<=600){
                    // editor.scrollTo(0, editor.scrollHeight);
                    editor.scrollTop = editor.scrollHeight
                    scrollH = editor.scrollHeight
                }
                // selection = window.getSelection();
                setTimeout(() => {                   
                    // 获取当前光标位置并存储在变量中
                    // scrollH = editor.scrollTop;
                    getCursorPositionInEditor(editor); // 假设这是自定义函数
                }, 0);
               
                
            }, 50);
        }
        
        // 复制视频标题文本到剪贴板
        // async function copyVideoTitleToClipboard()
        // b站官方分p视频，标题从p1修改为了1.1
        // 获取标题函数
        function copyVideoTitleToClipboard() {
            let title='';
            isBold=true

            // let multi_page = document.querySelector("#multi_page")
            let multi_list = document.querySelector(".video-pod__list.multip.list")
            if (!multi_list) {
                title = document.querySelector("#viewbox_report > div.video-info-title > div > h1")?.getAttribute('title').trim();
            } else {
                
                let playingItem=document.querySelector('.simple-base-item.video-pod__item.active.normal')
                
                let titleDiv = playingItem.querySelector('.title');
                title = titleDiv.getAttribute('title');
            }
            return title         
        }

        // 设置插入标题按钮
        function InsertBtnEvent() {
            let insertBox = document.querySelector("#web-toolbar > div > div")
            if (insertBox) {
                insertBox.style.display = 'inline-block';
                return;
            }
            let bcBtn = document.querySelector("span.ql-save-btn");
            if (!bcBtn) return;

            let bcBtnBox = document.querySelector("#web-toolbar > div")

            GM_addStyle(`
                .styled-button {
                  background-color: #007bff;
                  color: #393e46;
                  // padding: 10px 20px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
        
                }
              `);



            let insertBtn = document.createElement('button');
            //   let insertBox = document.createElement('div');
            insertBox = document.createElement('div');
            insertBox.className = 'insert-box';

            insertBtn.className = 'styled-button';
            //   insertBtn.id = 'insert-btn';
            insertBtn.style.top = '0'
            insertBtn.innerText = 'P';
            // insertBtn.style.color = '#393e46'; // 设置字体颜色为黑色
            insertBtn.style.fontWeight = 'bold'; // 设置字体加粗
            insertBtn.style.fontSize = "20px"
            insertBox.style.display = 'inline-block';
            insertBox.style.position = 'relative';
            // insertBtn.classList.add('custom-button-insert'); // 假设类名为 'custom-button'
            insertBtn.title = "插入视频标题"

            insertBox.appendChild(insertBtn);
            
            bcBtnBox.insertBefore(insertBox, bcBtn)


            insertBtn.removeEventListener('click', insertTitleInEditor);
            insertBtn.addEventListener('click', async function () {
                insertTitleInEditor()


            });

            async function insertTitleInEditor(){
                
                try {
                    let text = await copyVideoTitleToClipboard(); // 使用await等待Promise解析
                    setTimeout(() => {
                        pasteTextToEditor(text); // 确保pasteTextToEditor接收实际的文本内容
                       
                    }, 0);
                    // pasteTextToEditor(text); // 确保pasteTextToEditor接收实际的文本内容
                } catch (err) {
                    console.error('从剪贴板读取文本时出错:', err);
                }
            }


        }

        // 获取光标在editor的位置
        function getCursorPositionInEditor(editor) {
            let selection = window.getSelection();
        
            // 检查是否有选中内容
            if (selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
                // 获取起始节点
                let startNode = range.startContainer;
                let startOffset = range.startOffset;
        
                // 如果光标在editor内部
                if (editor.contains(startNode)) {
                    // let position = 0;
                    position = 0;
        
                    // 计算光标相对于editor开头的位置
                    if (startNode.nodeType === Node.TEXT_NODE) {
                        position = Array.from(startNode.parentNode.childNodes).slice(0, Array.prototype.indexOf.call(startNode, startNode)).reduce((acc, node) => acc + (node.nodeType === Node.TEXT_NODE ? node.length : 0), 0) + startOffset;
                    }
        
                    targetNode = startNode
                   
                    return {
                        position: position,
                        node: startNode // 返回光标所在的节点
                    };
                }
            }
        
            return {
                position: -1, // 如果没有选中内容或光标不在editor中，返回-1
                node: null // 如果光标不在editor中，返回null
            };
        }
       

        
        // 将光标设置到 editor 的指定位置
        function setCursorAtNodePosition(editor, targetNode, offset) {
            // let range = document.createRange();
            // let selection = window.getSelection();
        
            // // 清空当前选择
            // selection.removeAllRanges();
            // 确保目标节点存在，并且偏移量在该节点的有效范围内
            if (targetNode!=null&&targetNode!=undefined&&offset!=null&&offset!=undefined&&offset!=-1) {
                // editor.focus(); // 将焦点设置到编辑器
                // 设置光标位置
                range.setStart(targetNode, offset); // 设置光标起始位置
                if(editor.scrollHeight-scrollH<=700){
                    range.collapse(false); // 将光标设在末尾
                }
                
                selection.addRange(range); // 添加新的光标位置
                editor.focus();
            } else {
                console.log("无法设置光标位置：目标节点不存在或偏移量无效。");
                setCursorAtBottom(editor);
            }
        }
        


        // 判断editor是否失去焦点
        function isEditorFocused(editor) {
            return editor === document.activeElement;
        }
        
        // 将光标设置到 editor 底部
        function setCursorAtBottom(editor) {
            
            // let range1 = editor.createRange();
            let range1 = document.createRange();
            // let selection1 = window.getSelection();
            let selection1 = editor.ownerDocument.defaultView.getSelection()
            // let range1 = selection.getRangeAt(0);;
            // 选择 editor 内容的开始位置
            range1.selectNodeContents(editor);
            range1.collapse(false); // 设为 false，光标移到底部
            selection1.removeAllRanges(); // 移除当前选择
            selection1.addRange(range1); // 添加新的光标位置
            editor.focus(); // 将焦点设置到编辑器
            getCursorPositionInEditor(editor)
        }

         // 将光标设置到 editor 顶部
        function setCursorAtTop(editor) {
            let range1 = document.createRange();
            // let selection1 = window.getSelection();
            let selection1 = editor.ownerDocument.defaultView.getSelection()

            // 选择 editor 内容的开始位置
            range1.selectNodeContents(editor);
            range1.collapse(true); // 设为 false，光标移到顶部
            selection1.removeAllRanges(); // 移除当前选择
            selection1.addRange(range1); // 添加新的光标位置
            editor.focus(); // 将焦点设置到编辑器
            getCursorPositionInEditor(editor)
            
        }


        // 在笔记编辑器中添加滚动监听器,鼠标事件，鼠标滚轮滚动，键盘按下事件
        function editorEvent() {

            // let editor = document.querySelector('.ql-editor[contenteditable="true"]');
            let editor = document.querySelector('.ql-editor');
            let note_pc = document.querySelector("div.resizable-component.note-pc")
            // console.log("editor", editor);
            if (!editor) {
                console.log("editorEvent没有找到 editor");
                return
            }
            // 如果粘贴内容是图片,设置图片点击事件
            editor.addEventListener("paste", async (event) => {
                // event.preventDefault(); // 阻止默认的粘贴行为
                const clipboardItems = event.clipboardData.items;
                for (const item of clipboardItems) {
                    // 检查是否为文件类型且为图片
                    if (item.kind === "file" && item.type.startsWith("image/")) {
                        // const file = item.getAsFile(); // 获取文件对象
                        // 当粘贴内容,设置点击事件
                        setTimeout(() => {
                            creatNoteImageClikEvent()
                        }, 100);
                    }
                }
            });

            // 当editor失去焦点时,鼠标移入后自动获取焦点，并设置光标到之前的位置
            editor.addEventListener('mouseenter', function (event) {
               
                    if(!isEditorFocused(editor)){
                        if(targetNode!=null&&targetNode!=undefined&&position!=null&&position!=undefined&&position!=-1){
                            if(editor.scrollHeight-editor.scrollTop<=700){
                                setCursorAtBottom(editor)
                                editor.scrollTop=editor.scrollHeight                                   
                            }else{
                                setCursorAtNodePosition(editor, targetNode, position)                            
                            }                                                     
                        }else{
                            editor.scrollTop=editor.scrollHeight
                            // setCursorAtBottom(editor)
                        }
                    }
                    // setTimeout(() => {
                    //     if(editor.scrollTop<=300||editor.scrollHeight-editor.scrollTop<=700){
                    //         editor.scrollTop=editor.scrollHeight
                    //     }
                    // }, 0);      
                
                       
            })


            editor.addEventListener('mouseleave', function (event) {

                scrollH = editor.scrollTop
                selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                if(selection){
                    range = selection.getRangeAt(0);
                }
                // console.log("document被点击", scrollH)
                getCursorPositionInEditor(editor)
            })

            editor.addEventListener('scroll', function () {
               
                getCursorPositionInEditor(editor)
                if (editor.scrollTop + editor.clientHeight >= editor.scrollHeight) {
                    // 在内容到底部时设置光标在底
                    setCursorAtBottom(editor);

                } else if (editor.scrollTop === 0) {
                    setCursorAtTop(editor)
                }
                if (editor.scrollTop != 0) {
                    scrollH = editor.scrollTop

                }
                selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                if (selection) {
                    range = selection.getRangeAt(0);
                }
            });

            editor.addEventListener("click", function (event) {
                event.stopPropagation()
                // selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                // if(selection){
                //     range = selection.getRangeAt(0);
                // }
                // console.log("点击的range", range);
                // scrollH = document.querySelector('.ql-editor').scrollTop
                if(editor.scrollTop>=200){
                    scrollH = editor.scrollTop
                }
                
                getCursorPositionInEditor(editor)
                // editor.scrollTo(0, scrollH);

            })

            document.addEventListener("click", function (event) {
                event.stopPropagation()
                scrollH = editor.scrollTop
               
            });


            editor.addEventListener('keydown', function (event) {
                
                if(!event.altKey){

                    // setTimeout(() => {
                    //     scrollH = editor.scrollTop 
                    //     editor.scrollTo(0, scrollH);                       
                    //     selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                    //     if(selection){
                    //         range = selection.getRangeAt(0);
                    //     }
                    //     getCursorPositionInEditor(editor)

                    // }, 50);
                    scrollH = editor.scrollTop 
                        editor.scrollTo(0, scrollH);                       
                        selection = editor.ownerDocument.defaultView.getSelection(); // 更安全地获取selection，考虑editor所在的文档上下文
                        if(selection){
                            range = selection.getRangeAt(0);
                        }
                        getCursorPositionInEditor(editor)
                }  

            })

        }

        // 笔记面板鼠标监听事件双击隐藏

        function noteEvent() {
            let note_pc = document.querySelector("div.resizable-component.note-pc");
            if (note_pc) {
                 // 左键双击隐藏
                 function hideNote(){
                    note_pc.addEventListener("dblclick", function (event) {
                        
                        // 阻止冒泡
                        isClose=false
                        event.stopPropagation();
                        event.preventDefault();
                        // 检查是否选中了文本或图片
                        let selection = window.getSelection().toString().trim();
                        let selectedImages = note_pc.querySelectorAll(".ql-image-preview.active"); // 假设图片有 selected 类表示被选中
                        if (selection === "" && selectedImages.length === 0) {
                           
                            // 如果没有选中文本或图片，隐藏 note_pc
                            note_pc.style.display = "none";
                            
                        }
                    });
                 }
                 hideNote()

               
               
            }
        }


        // 点进笔记列表后获取笔记列表中的所有图片元素,为每个图片元素添加点击事件
        function creatNoteImageClikEvent() {

            setTimeout(() => {

                let imgElements
                let zoomedImage = document.querySelector('.zoomed-image');
                let bpx = document.querySelector('.bpx-player-container');

                // bfx 非全屏 data-screen="normal"     全屏data-screen="full"  网页全屏data-screen="web"
                let data_screen = bpx.getAttribute('data-screen')
                function imageClickListener() {
                    // 获取所有图片元素
                    imgElements = document.querySelectorAll('.ql-image-preview .img-preview');
                    for (let i = 0; i < imgElements.length; i++) {
                        const image = imgElements[i];
                        image.style.cursor = 'pointer';
                        image.title = "弹出"
                       
                        image.addEventListener('mousedown', handleImageClick);

                    }

                    let isDragging = false;
                    let offsetX, offsetY;
                    // 是否放大
                    
                    function handleImageClick(event) {

                        const image = event.currentTarget;
                       
                        zoomedImage.src = image.src; // 动态设置 zoomedImage 的 src
                        if(parseInt(image.style.height) <= 720){
                            zoomedImage.style.height = '720px'
                            zoomedImage.style.width = 'auto'
                            // isZoomed=true
                       }
                        const rect = image.getBoundingClientRect();
                        const originalWidth = image.offsetWidth;
                        const originalHeight = image.offsetHeight;
                        const offsetX = 120;
                        const offsetY = 300;
                        const x = rect.left + window.scrollX + (originalWidth / 2) + offsetX;
                        const y = rect.top + window.scrollY + (originalHeight / 2) - offsetY;
                        // 设置放大图片的位置
                        // zoomedImage.style.left = `${x - (originalWidth * 0.5)}px`; // 根据原始图片的宽度调整位置
                        // zoomedImage.style.top = `${y - (originalHeight * 0.5)}px`; // 根据原始图片的高度调整位置
                        // zoomedImage.style.left = '-380'; // 根据原始图片的宽度调整位置
                        // zoomedImage.style.top = '80px'; // 根据原始图片的高度调整位置
                        zoomedImage.style.display = 'block';
                        zoomedImage.style.opacity = '1';


                        // 添加鼠标悬停和离开事件监听器
                        zoomedImage.addEventListener('mouseover', handleZoomedImageMouseOver);
                        zoomedImage.addEventListener('dblclick', handleZoomedImageDblclick);

                        // 添加拖动事件监听器
                        zoomedImage.addEventListener('mousedown', startDrag);
                        document.addEventListener('mousemove', drag);
                        document.addEventListener('mouseup', endDrag);
                        let data_screen = bpx.getAttribute('data-screen')
                        if (data_screen == 'full' || data_screen == 'web') {
                            document.body.removeChild(zoomedImage);
                            bpx.appendChild(zoomedImage);

                        } else {
                            bfx.removeChild(zoomedImage);
                            document.body.appendChild(zoomedImage);

                        }
                        
                       
                    }

                    function handleZoomedImageMouseOver() {
                        
                        // zoomedImage.style.transform = 'scale(1.5)'; // 初始放大比例
                        zoomedImage.title = '双击关闭';
                        setTimeout(() => {
                            let zoomedImage = document.querySelector('.zoomed-image');
                            if(zoomedImage&&parseInt(zoomedImage.style.height) <= 750){
                                zoomedImage.style.transform = 'scale(1.5)'
                            }
                       }, 50);
                    }

                    function handleZoomedImageDblclick() {
                        zoomedImage.style.opacity = '0';
                        setTimeout(() => {
                            zoomedImage.style.display = 'none';
                            zoomedImage.removeEventListener('mouseover', handleZoomedImageMouseOver);
                            zoomedImage.removeEventListener('mouseout', handleZoomedImageDblclick);

                        }, 300); // 与 transition 时间一致
                    }

                    function startDrag(event) {
                        isDragging = true;
                        offsetX = event.clientX - zoomedImage.offsetLeft;
                        offsetY = event.clientY - zoomedImage.offsetTop;
                    }

                    function drag(event) {
                        if (isDragging) {
                            zoomedImage.style.left = `${event.clientX - offsetX}px`;
                            zoomedImage.style.top = `${event.clientY - offsetY}px`;
                        }
                    }

                    function endDrag() {
                        isDragging = false;
                    }
                }
                if (!zoomedImage) {
                    // let bfy = document.getElementsByClassName("bpx-player-video-area")[0]
                    // 创建一个新的图片元素，用于显示放大后的图片
                    zoomedImage = document.createElement('img');
                    zoomedImage.className = 'zoomed-image';
                    zoomedImage.style.position = 'fixed';
                    zoomedImage.style.left='40px';
                    zoomedImage.style.top='20px';
                    zoomedImage.style.display = 'none';
                    zoomedImage.style.zIndex = 1000;
                    zoomedImage.style.cursor = 'pointer';
                    zoomedImage.style.maxWidth = 'none'; // 确保图片不受容器限制
                    zoomedImage.style.maxHeight = 'none'; // 确保图片不受容器限制
                    zoomedImage.style.minWidth = '385px'; // 
                    zoomedImage.style.minHeight = '210px'; //
                    // if(parseInt(zoomedImage.style.height) <= 205){
                    //     zoomedImage.style.transform = 'scale(1.5)'
                    // }else{
                    //     zoomedImage.style.transform = 'scale(0.7)'; // 初始放大比例
                    // }
                    zoomedImage.style.transform = 'scale(0.7)'

                   
                   
                    


                    zoomedImage.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

                    // alert("首次加载图片放大插件:" + data_screen)
                    if (data_screen == 'full' || data_screen == 'web') {
                        bpx.appendChild(zoomedImage);
                        imageClickListener()
                    } else {
                        document.body.appendChild(zoomedImage);
                        imageClickListener()
                    }
                    setTimeout(() => {
                        let zoomedImage = document.querySelector('.zoomed-image');
                        if(zoomedImage&&parseInt(zoomedImage.style.height) <= 750){
                            zoomedImage.style.transform = 'scale(1.5)'
                            // zoomedImage.style.height='750px'
                            // zoomedImage.style.width='auto'
                        }
                   }, 2000);
                    // imageClickListener()
                } else {
                    // alert("非首次加载图片放大插件:" + data_screen)
                    if (data_screen == 'full' || data_screen == 'web') {
                        bpx.appendChild(zoomedImage);
                    }
                    imageClickListener()
                }
            }, 1800);
        }

    }//是183行这个结束括号 if (currentUrl.indexOf('https://www.bilibili.com/video/') === 0 || currentUrl.startsWith('https://www.bilibili.com/cheese/')

    // Your code here...
})();