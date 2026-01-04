// ==UserScript==
// @name         抖音作者页面复制按钮
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  抖音作者页面提效
// @author       You
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517306/%E6%8A%96%E9%9F%B3%E4%BD%9C%E8%80%85%E9%A1%B5%E9%9D%A2%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/517306/%E6%8A%96%E9%9F%B3%E4%BD%9C%E8%80%85%E9%A1%B5%E9%9D%A2%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

// 拦截请求
window.aggrx_collectionIDObject = {};
function aggrx_requestInterception() {

    // 保存原始的 open 和 send 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    // 重写 open 方法，记录请求信息
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._requestInfo = { method, url }; // 保存请求的 URL 和方法
        return originalOpen.apply(this, arguments);
    };

    // 重写 send 方法，拦截响应数据
    XMLHttpRequest.prototype.send = function (body) {
        const xhr = this;

        // 保存请求体数据
        this._requestInfo.body = body;

        // 保存原始的 onreadystatechange
        const originalOnReadyStateChange = xhr.onreadystatechange;

        // 重写 onreadystatechange
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const { url } = xhr._requestInfo;

                // 判断是否是特定接口
                if (url.includes('/aweme/v1/web/aweme/post/') || url.includes('/aweme/v1/web/locate/post/')) {
                    console.log(`Request to: ${url}`);
                    try {
                        const parsedResponse = JSON.parse(xhr.responseText);
                        parsedResponse.aweme_list.forEach(item => {
                            console.log(item);
                            window.aggrx_collectionIDObject[`${item.desc}`] = {
                                authorName: item.author.nickname,
                                authorUID: item.author.uid,
                                videoID: item.aweme_id,
                                desc: item.desc,
                                tag: item.text_extra
                            };
                        });
                    } catch (e) {
                        console.error('Error parsing response:', e);
                    }
                }
            }
            // 调用原始的回调函数
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(xhr, arguments);
            }
        };

        return originalSend.apply(this, arguments);
    };
}

aggrx_requestInterception();

(function() {
    'use strict';
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerText = `

#aggrx-pannel {
position: fixed;
    top: 5px;
    left: calc(50% + 300px);
    padding: 10px;
    background-color: #333333;
    color: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: flex-start;
    align-items: flex-start;
}

#aggrx-pannel button {
       padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    background: transparent;
    color: white;
    border: 2px solid #cdcdcd;
}
.aggrx-pannel-actions{
}


.aggrx-collections-container{
    max-width: 550px;
    max-height: 100px;
    overflow: scroll;
}

.aggrx_buttonBox{
    height: 40px;
    /*top: 1px;*/
    /*margin-left: 150px;*/
    position: absolute;
    background: transparent;
    /*z-index:99999*/
}

.aggrx_buttonBox-author-card-list{
    height: 40px;
    position: absolute;
    top: 200px;
    z-index:99999
}

.aggrx_buttonBox_button{
    background: transparent;
    border: 2px solid #cdcdcd;
    padding: 4px;
    color: white;
    margin-right: 4px;
    cursor: pointer;
}


.aggrx-toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 9999; /* 设置 z-index 为 9999 确保 toast 在最上层 */
}

.aggrx-toast.show {
    opacity: 0.8;
}

  `;
    document.head.appendChild(css);

    const pannel = document.createElement('div');
    pannel.id = 'aggrx-pannel';
    pannel.innerHTML = `
    <div class='aggrx-pannel-actions'>
          <button id="aggrx-copy" style='margin-right:8px;'>复制URL</button>
          <button id="aggrx-collection-toggle">采集专辑</button>
          <button id="aggrx-collection-copy">复制采集专辑结果</button>
    </div>
    <ul id='aggrx-collections'>

    </ul>
    `;
    // <button id="aggrx-scan">扫描</button>


    document.body.appendChild(pannel);

    document.getElementById("aggrx-copy").addEventListener("click", function() {
        // 获取当前页面的 URL
        const currentUrl = window.location.href;
        const button = this;

        button.textContent = "复制URL";
        // 将 URL 写入剪贴板
        navigator.clipboard.writeText(currentUrl).then(() => {
            // 修改按钮文字为 "已复制"
            button.textContent = "已复制";

            // 2秒后恢复按钮原始文字
            //setTimeout(() => {
            //    button.textContent = "复制当前URL";
            //}, 2000);
        }).catch(err => {
            console.error("复制失败：", err);
        });
    });

    //document.getElementById("aggrx-scan").addEventListener("click", function() {
    //
    //});

    document.getElementById("aggrx-collection-toggle").addEventListener("click", function() {
        aggrx_collection_reset()

        aggrx_scan();

    })
    document.getElementById("aggrx-collection-copy").addEventListener("click", function() {
        aggrx_collection_copy()
    })
})();

let aggrx_searchList = []
let aggrx_scrollListHeight = 0
let scaned = false

let aggrx_author_searchList = []
let aggrx_author_scrollListHeight = 0
let author_scaned = false


function aggrx_scan(){
    // div[data-e2e="user-post-list"]>
    let el_scrolls = Array.from(document.querySelectorAll('ul[data-e2e="scroll-list"]'))
    if(el_scrolls.length > 0){
        let el_scroll = el_scrolls[el_scrolls.length - 1]
        if(!scaned){
            scaned = true;
            aggrx_observerNodeChanged(el_scroll, 'user-post-list');
        }

        aggrx_searchList = el_scroll.querySelectorAll('li');
        aggrx_scrollListHeight = aggrx_searchList[0].clientHeight + 30;


        aggrx_searchList.forEach((li, index) => {
            if (li.querySelector('div.aggrx_buttonBox')) {
                console.info("已经处理过了")
                return
            }
            aggrx_addCopyCollectionButtonDom(li,'user-post-list', 'user-douyin');
        });
    }else{
        console.error('对应列表不存在')
    }


    // 侧边栏作者页面
    // data-e2e="author-card-list"
    let el_author_scrolls = Array.from(document.querySelectorAll('div[data-e2e="author-card-list"] ul'))
    if(el_author_scrolls.length > 0){
        let el_author_scroll = el_author_scrolls[el_scrolls.length - 1]
        if(!author_scaned){
            author_scaned = true;
            aggrx_observerNodeChanged(el_author_scroll, 'author-card-list');
        }
        aggrx_author_searchList = el_author_scroll.querySelectorAll('li');
        aggrx_author_scrollListHeight = aggrx_author_searchList[0].clientHeight + 30;


        aggrx_author_searchList.forEach((li, index) => {
            if (li.querySelector('div.aggrx_buttonBox')) {
                console.info("已经处理过了")
                return
            }
            aggrx_addCopyCollectionButtonDom(li, 'author-card-list', 'user-douyin');
        });
    }else{
        console.error('作者列表不存在')
    }

}
// 复制文本
function aggrx_copyToClipboard(text, copy_success, copy_failed) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('copied');
        if (copy_success) { copy_success(text) }
    }).catch(function(err) {
        console.error('copy failed', err);
        if (copy_failed) { copy_failed(err) }
    });
}

// 添加 复制合集按钮DOM
/**
 * @param {'author-card-list'|'user-post-list'} page_type 页面类型
 */
function aggrx_addCopyCollectionButtonDom(LiElement,page_type, page_site_type) {
    const divBOX = document.createElement('div');
    divBOX.className = 'aggrx_buttonBox';
    divBOX.classList.add(`aggrx_buttonBox-author-card-list`)
    if(page_type === 'author-card-list'){

    }
    //divBOX.style.width = '100%';
    divBOX.style.height = '40px';
    const button1 = document.createElement('button');
    // button1.className = 'aggrx_buttonBox_button'
    button1.classList.add('aggrx_buttonBox_button');
    button1.classList.add(`aggrx_buttonBox_button-${page_site_type}`);

    // 设置按钮的文本
    button1.textContent = '视频连接';
    // 设置按钮的宽度和高度
    //button1.style.width = '49%';
    //button1.style.height = '40px';
    //button1.style.float = 'left';

    function copy_success(msg) {
        aggrx_showToast('info', `已复制 ${msg}`)
    }

    function copy_failed(error) {
        aggrx_showToast('error', `复制失败 ${error}`)
    }

    // 拦截按钮的点击事件
    button1.addEventListener('click', (event) => {
        // 阻止事件冒泡
        event.stopPropagation();

        if(page_type === 'user-post-list'){
            // 获取父元素
            const parentElement = event.target.closest('li');
            let videoUrl = parentElement.querySelector('div>a').href;

            if (!(videoUrl.includes('www.douyin.com/video'))) {
                return
            }
            let title = parentElement.querySelector('div>a>p').innerText;

            // 使用正则表达式从 href 中提取视频 ID

            // copy_button_ref.textContent = "复制";
            let href = new URL(videoUrl);
            href.search = '';
            let hrefString = href.toString()
            //if (0) {
            //    aggrx_copyToClipboard(`${hrefString},1`, copy_success, copy_failed)
            //} else {
            //    aggrx_copyToClipboard(`${hrefString}`, copy_success, copy_failed)
            //}
            let newOrder = aggrx_collection_add(title, hrefString);
        }else if(page_type === 'author-card-list'){
            // 获取父元素
            const parentElement = event.target.closest('li');
            //let videoUrl = parentElement.querySelector('div>a').href;


            let title = parentElement.querySelector('div>a p').innerText;
            let video_id = (window.aggrx_collectionIDObject[title] || {}).videoID || '';
            let videoUrl = `https://www.douyin.com/video/${video_id}`
            if (!(videoUrl.match(/www.douyin\.com\/video\/\d+/))) {
                aggrx_showToast('error', `没有拦截到title:${title}对应的数据`)
                return
            }
            // 使用正则表达式从 href 中提取视频 ID

            // copy_button_ref.textContent = "复制";
            let href = new URL(videoUrl);
            href.search = '';
            let hrefString = href.toString()
            //if (0) {
            //    aggrx_copyToClipboard(`${hrefString},1`, copy_success, copy_failed)
            //} else {
            //    aggrx_copyToClipboard(`${hrefString}`, copy_success, copy_failed)
            //}
            let newOrder = aggrx_collection_add(title, hrefString);
        }else{
            console.error(`不支持的 ${page_type}`)
        }
    });


    divBOX.appendChild(button1);

    // 设置 li 元素的高度
    if(page_type === 'author-card-list'){
        // LiElement.style.height = `${aggrx_author_scrollListHeight}px`;
    }else{
        LiElement.style.height = `${aggrx_scrollListHeight}px`;
    }
    LiElement.style.marginBottom = `50px`;
    // 添加按钮到当前 li 元素
    LiElement.appendChild(divBOX);
    // DOMUpdated()
    return true
}

function aggrx_collection_reset(){
    let listEl = document.getElementById("aggrx-collections")
    listEl.innerHTML = ''
}

function aggrx_collection_add(title, url){
    let listEl = document.getElementById("aggrx-collections")
    let order = listEl.querySelectorAll('li').length
    if (order === 0){
        listEl.innerHTML = `<li data-link='${url}'>${title}</li>`
    }else{
        listEl.innerHTML = `${listEl.innerHTML}<li data-link='${url}'>${title}</li>`
    }

    return order
}

function aggrx_collection_copy(){
    let listEl = document.getElementById("aggrx-collections")
    let result = []
    listEl.querySelectorAll('li').forEach(li=>{
        let link = li.getAttribute('data-link')
        result.push(link)
    })

    let joined = result.join('|')
    aggrx_copyToClipboard(joined, msg=>{aggrx_showToast('info', msg);}, error=>{aggrx_showToast('error', error);});
}

// 监听 列表dom
function aggrx_observerNodeChanged(element, page_type) {

    // 监听
    //
    const targetNode = element // document.querySelector(dom_selector); // 'div[data-e2e="user-post-list"]>ul[data-e2e="scroll-list"]'
    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutationsList => {
        // 遍历所有的 mutations
        mutationsList.forEach(mutation => {
            // 只有子节点变动才执行
            if (mutation.type !== 'childList') {
                return
            }
            console.info(`${mutation}`)

            //return
            // 获取所有的 li 元素
            //const liElements = document.querySelectorAll('ul[data-e2e="scroll-list"] li');

            // 为每个 li 元素添加按钮
            mutation.addedNodes.forEach((li, index) => {
                // 确保每个 li 只添加一个按钮
                if (li.querySelector('div.aggrx_buttonBox')) {
                    console.info("已经处理过了")
                    return
                }
                aggrx_addCopyCollectionButtonDom(li, page_type);
            });
        });
    });
    // 配置观察器 启动观察 服务
    const config = { childList: true, subtree: false };
    observer.observe(targetNode, config);
}

function aggrx_showToast(type, message) {
    // 创建一个新的 toast 元素
    const toast = document.createElement('div');
    toast.classList.add('aggrx-toast');
    toast.textContent = message;
    if (type === 'info') {
        toast.style.color = 'white'
    } else {
        toast.style.color = 'red'
    }
    // 将 toast 添加到 body
    document.body.appendChild(toast);

    // 显示 toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // 等待一小段时间（确保元素已经插入 DOM）

    // 5秒后隐藏并删除 toast
    setTimeout(() => {
        toast.classList.remove('show');
        // 过渡动画结束后删除 toast 元素
        setTimeout(() => {
            toast.remove();
        }, 500); // 等待过渡动画完成
    }, 2000); // 5秒后消失
}
