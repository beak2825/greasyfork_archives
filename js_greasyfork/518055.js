// ==UserScript==
// @name         抖音搜索结果检测作者是否存在
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  搜索页面的高效操作
// @author       You
// @match        https://www.douyin.com/*/search/*
// @match        https://www.douyin.com/search/*
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518055/%E6%8A%96%E9%9F%B3%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%A3%80%E6%B5%8B%E4%BD%9C%E8%80%85%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518055/%E6%8A%96%E9%9F%B3%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%A3%80%E6%B5%8B%E4%BD%9C%E8%80%85%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8.meta.js
// ==/UserScript==

var aggrx_searchList = []; // document.querySelectorAll('#search-content-area ul[data-e2e="scroll-list"] li');
var aggrx_scrollListHeight = 0; //aggrx_searchList[0].clientHeight + 70;
// 复制文本
function aggrx_copyToClipboard(text, copy_success, copy_failed) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text successfully copied to clipboard');
        if (copy_success) { copy_success(text) }
    }).catch(function(err) {
        console.error('Unable to copy text to clipboard', err);
        if (copy_failed) { copy_failed(err) }
    });
}

// 添加 复制合集按钮DOM
function aggrx_addCopyCollectionButtonDom(LiElement, page_type) {
    const divBOX = document.createElement('div');
    divBOX.className = 'aggrx_buttonBox';
    //divBOX.style.width = '100%';
    divBOX.style.height = '40px';
    const button1 = document.createElement('button');
    // button1.className = 'aggrx_buttonBox_button'
    button1.classList.add('aggrx_buttonBox_button');
    button1.classList.add(`aggrx_buttonBox_button-${page_type}`);

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
    if (page_type === 'search-douyin') {
        if (window.location.href.includes('type=video')) {
            // 拦截按钮的点击事件
            button1.addEventListener('click', (event) => {
                // 阻止事件冒泡
                event.stopPropagation();

                // 获取父元素
                const parentElement = event.target.closest('li');
                let videoUrl = parentElement.querySelector('div.search-result-card a').href;

                let authorDom = parentElement.querySelectorAll("div.search-result-card > a > div > div > div > div > span > span")[1];
                if (!authorDom) {
                    console.warn(`没有找到作者节点 ${parentElement}`)
                    return;
                }
                let authorName = authorDom.innerText
                if (!authorName) {
                    console.warn(`作者名称是空`)
                    return;
                }
                authorName = authorName.replace(' 🈚️', '').replace(' 🈶', '')
                console.info(`检查 ${authorName} 视频URL:${videoUrl}`)


                // 使用正则表达式从 href 中提取视频 ID
                const regex = /\/video\/(\d+)/;
                const match = videoUrl.match(regex);

                if (!(match && match[1])) {
                    return
                }

                let videoId = match[1];
                console.log('视频 ID:', videoId);
                let collectionData = window.collectionIDObject[videoId]
                // copy_button_ref.textContent = "复制";
                let href = new URL(videoUrl);
                href.search = '';
                let hrefString = href.toString()
                if (collectionData.collectionID) {
                    aggrx_copyToClipboard(`${hrefString},1`, copy_success, copy_failed)
                } else {
                    aggrx_copyToClipboard(`${hrefString}`, copy_success, copy_failed)
                }
            });
        } else if (window.location.href.includes('type=general')) {
            divBOX.classList.add('aggrx-button-box-general')

            button1.addEventListener('click', (event) => {
                // 阻止事件冒泡
                event.stopPropagation();

                // 获取父元素
                const parentElement = event.target.closest('div[id^="waterfall_item_"]')
                let videoUrl = `https://www.douyin.com/video/${parentElement.getAttribute('id').replace('waterfall_item_', '')}`;

                let authorDom = parentElement.querySelectorAll("div.search-result-card span > span")[1];
                if (!authorDom) {
                    console.warn(`没有找到作者节点 ${parentElement}`)
                    return;
                }
                let authorName = authorDom.innerText
                if (!authorName) {
                    console.warn(`作者名称是空`)
                    return;
                }
                authorName = authorName.replace(' 🈚️', '').replace(' 🈶', '')
                console.info(`检查 ${authorName} 视频URL:${videoUrl}`)

                //let videoId = match[1];
                // console.log('视频 ID:', videoId);
                //let collectionData = window.collectionIDObject[videoId]
                // copy_button_ref.textContent = "复制";
                let href = new URL(videoUrl);
                href.search = '';
                let hrefString = href.toString()
                let hasCollection = Array.from(parentElement.querySelectorAll('div.search-result-card span')).map((item)=>item.innerText).join('').includes('合集')
                if (hasCollection) {
                    aggrx_copyToClipboard(`${hrefString},1`, copy_success, copy_failed)
                } else {
                    aggrx_copyToClipboard(`${hrefString}`, copy_success, copy_failed)
                }
            });

        } else {
            aggrx_showToast('error', '不支持的页面, 抖音支支持`视频`和`综合`页面')
        }
    } else if (page_type === 'search-bilibili') {
        // 拦截按钮的点击事件
        button1.addEventListener('click', (event) => {
            // 阻止事件冒泡
            event.stopPropagation();

            const copy_button_ref = event.currentTarget;

            // 获取父元素
            const parentElement = event.target.closest('div.bili-video-card');
            let videoUrl = parentElement.querySelector('div.bili-video-card a').href;

            let authorDom = parentElement.querySelectorAll("div.bili-video-card .bili-video-card__info--author")[0];
            if (!authorDom) {
                console.warn(`没有找到作者节点 ${parentElement}`)
                return;
            }
            let authorName = authorDom.innerText
            if (!authorName) {
                console.warn(`作者名称是空`)
                return;
            }
            authorName = authorName.replace(' 🈚️', '').replace(' 🈶', '')
            console.info(`检查 ${authorName} 视频URL:${videoUrl}`)

            // copy_button_ref.textContent = "复制";
            let href = new URL(videoUrl);
            href.search = '';
            let hrefString = href.toString()
            if (0) {
                aggrx_copyToClipboard(`${hrefString},1`, copy_success, copy_failed)
            } else {
                aggrx_copyToClipboard(`${hrefString}`, copy_success, copy_failed)
            }
        });
    } else {
        console.warn('不支持的页面类型')
    }
    divBOX.appendChild(button1);


    // 设置 li 元素的高度
    LiElement.style.height = `${aggrx_scrollListHeight}px`;
    LiElement.style.marginBottom = `50px`;
    // 添加按钮到当前 li 元素
    LiElement.appendChild(divBOX);
    // DOMUpdated()
    return true
}




// 拦截请求
function aggrx_requestInterception() {
    let page_type = aggrx_get_page_type(window.location.href)

    if (page_type !== 'search-douyin') {
        // aggrx_showToast('error', '不支持的页面, 请切换到正确的标签再使用本插件. 抖音需要切换到`视频`页面')
        return;
    }

    window.collectionIDObject = {};
    // 保存原始的 open 和 send 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    // 重写 open 方法，记录请求信息
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._requestInfo = { method, url }; // 保存请求的 URL 和方法
        return originalOpen.apply(this, arguments);
    };

    // 重写 send 方法，拦截响应数据
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;

        // 保存请求体数据
        this._requestInfo.body = body;

        // 保存原始的 onreadystatechange
        const originalOnReadyStateChange = xhr.onreadystatechange;

        // 重写 onreadystatechange
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const { url } = xhr._requestInfo;

                // 判断是否是特定接口
                if (url.includes('/aweme/v1/web/search/item/')) {
                    console.log(`Request to: ${url}`);
                    try {
                        const parsedResponse = JSON.parse(xhr.responseText);
                        parsedResponse.data.forEach(datum => {
                            let aweme_info = datum.aweme_info;
                            window.collectionIDObject[datum.aweme_info.aweme_id] = {
                                videoID: aweme_info.aweme_id,
                                authorName: aweme_info.nickname,
                                authorUID: aweme_info.author.uid,
                                desc: aweme_info.desc,
                                tag: aweme_info.text_extra
                            };
                            if (datum.aweme_info.mix_info) {
                                let collectionData = datum.aweme_info.mix_info;
                                window.collectionIDObject[datum.aweme_info.aweme_id].collectionID = collectionData.mix_id;
                                window.collectionIDObject[datum.aweme_info.aweme_id].collectionName = collectionData.mix_name;
                            }
                        })
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
// 拦截请求
aggrx_requestInterception();

function aggrx_get(url, success, failed) {
    // 创建一个新的 XMLHttpRequest 实例
    let xhr = new XMLHttpRequest();

    // 配置请求类型和目标 URL
    xhr.open('GET', url, true);

    // 设置请求头
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 定义请求体数据
    //var data = JSON.stringify({
    //    "url": `http://new_bms.yingshidq.com.cn/api/inside/author/nametoid?authorName=#{authorName}`, // 烟火中的水滴
    //    "type": "text"
    //});

    // 监听请求完成的回调
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
            return
        }
        if (xhr.status >= 200 && xhr.status < 300) {
            // 请求成功时处理响应
            // console.log('Response:', xhr.responseText);
            try {
                // 尝试将响应文本转换为 JSON
                var responseJson = JSON.parse(xhr.responseText);
                success(responseJson)
            } catch (e) {
                // 如果 JSON 解析失败，捕获并处理错误
                console.error('Error parsing JSON:', e);
                failed({ 'error': e });
            }
        } else {
            failed({ 'error': 'other Error' });
        }

    };
    // 处理网络错误
    xhr.onerror = function() {
        console.error('Network error or CORS issue');
        failed({ 'error': 'other error' });
    };

    // 发送请求
    xhr.send();
}

function aggrx_updateAuthorCheckResult(authorName, authorDom, page_type, response) {
    console.info(`response=`, response)
    try {
        let data_obj = response.data || {};
        let author_id = `${data_obj.has_author_id}` || 'false';
        if (author_id == 'true') {
            console.info(`检测作者 ${authorName} 请求成功, 🈶 数据 ${author_id}`);
            authorDom.innerText = `${authorName} 🈶`;
            authorDom.style.color = 'red';
        } else if (author_id == 'false') {
            authorDom.innerText = `${authorName} 🈚️`;
            authorDom.style.color = 'green';
            console.warn(`检测作者 ${authorName} 请求成功, 🈚️ 数据 `);
        } else {
            console.warn(`${authorName} 不支持的数据`, response);
        }
        //DOMUpdated()
    } catch (e) {
        console.error(`检测作者 ${authorName} 接口数据格式错误. ${e}`);
    }
}

let aggrx_queue = [] // 发送队列
let aggrx_queue_running = false

function aggrx_queue_start() {
    if (aggrx_queue_running) {
        return
    }
    queue_send()
    aggrx_queue_running = true;

    function queue_send() {
        let task = aggrx_queue.shift()
        if (!task) {
            aggrx_queue_running = false
            return;
        }
        aggrx_queue_running = true;

        let authorName = task[0]
        let authorDom = task[1]
        let page_type = task[2]

        console.info(`${Date()} ${authorName} 出队`)

        //const callbackName = `jsonpCallback_${crypto.randomUUID().replace(/-/g, '')}_${Date.now()}`;
        //console.info(`${authorName} callback: ${callbackName} `)
        // &callback=${callbackName}
        function startNext() {
            setTimeout(() => { queue_send() }, 100)
        }
        if (0) {
            aggrx_queue_check_user_api(authorName, authorDom, page_type, () => {
                startNext()
            }, () => {
                startNext()
            })
        } else {
            aggrx_queue_check_user_jsonp(authorName, authorDom, page_type, () => {
                startNext()
            }, () => {
                startNext()
            })
        }
    }
}

function aggrx_queue_check_user_api(authorName, authorDom, page_type, success, failed) {
    aggrx_get(`https://openapi.yingshidq.com.cn/api/sv/v1/author/list-out?authorName=${authorName}`, (response) => {
        setTimeout(() => {
            aggrx_updateAuthorCheckResult(authorName, authorDom, response)
            success()
        }, 100)
    }, (error) => {
        console.error(`检测作者 ${authorName} 请求失败`, error)
        setTimeout(() => {
            failed()
        }, 100)
    })
}

function aggrx_queue_check_user_jsonp(authorName, authorDom, page_type, success, failed) {
    // 定义全局回调函数名称，确保唯一性
    const callbackName = `jsonpCallback_${crypto.randomUUID().replace(/-/g, '')}_${Date.now()}`;
    console.info(`${authorName} callback: ${callbackName} `)

    // 创建一个全局回调函数
    window[callbackName] = function(response) {
        let timeout = window[`${callbackName}-timeout`]
        if (timeout) {
            window[`${callbackName}-timeout`] = undefined
            clearTimeout(timeout);
        }

        // 删除全局回调函数以清理空间
        delete window[callbackName];
        // 删除动态创建的 script 标签
        let script = window[`${callbackName}-script`]
        if (script) {
            window[`${callbackName}-script`] = undefined
            document.body.removeChild(script);
        }
        // 解析响应数据并调用回调
        setTimeout(() => {
            aggrx_updateAuthorCheckResult(authorName, authorDom, page_type, response)
            success()
        }, 200)
    };
    // 动态创建 script 标签
    const script = document.createElement('script');
    script.id = callbackName; // 设置 id

    script.src = `https://openapi.yingshidq.com.cn/api/sv/v1/author/list-out?authorName=${authorName}&callback=${callbackName}`;
    window[`${callbackName}-script`] = script
    // 处理加载失败的情况
    script.onerror = function() {
        // 清理回调和 script
        let timeout = window[`${callbackName}-timeout`]
        if (timeout) {
            window[`${callbackName}-timeout`] = undefined
            clearTimeout(timeout);
        }
        delete window[callbackName];
        let script = window[`${callbackName}-script`]
        if (script) {
            window[`${callbackName}-script`] = undefined
            document.body.removeChild(script);
        }
        console.error(`检测作者 ${authorName} 请求失败`);
        failed()
    };
    // 将 script 标签添加到文档中以触发请求
    document.body.appendChild(script);
    window[`${callbackName}-timeout`] = setTimeout(() => {
        console.error(`检测作者 ${authorName} 请求超时`);
        delete window[callbackName];

        let script = window[`${callbackName}-script`]
        if (script) {
            window[`${callbackName}-script`] = undefined
            document.body.removeChild(script);
        }
        failed()
    }, 5000);
}

// 检查作者是否入库
function aggrx_checkApiUserJSONP(authorName, authorDom, page_type) {
    console.info(`${Date()} ${authorName} 入队`)
    aggrx_queue.push([authorName, authorDom, page_type])
    aggrx_queue_start()
    return
}

/**
 * 检查作者
 * @param {HtmlElement} liDom
 * @param {string} page_type
 */
function aggrx_checkAuthor(liDom, page_type) {
    try {
        let authorDom = undefined
        if (page_type === 'search-douyin') {
            if (window.location.href.includes('type=video')) {
                authorDom = liDom.querySelectorAll("div.search-result-card > a > div > div > div > div > span > span")[1];
            } else if (window.location.href.includes('type=general')) {
                let parentElement = liDom
                authorDom = parentElement.querySelectorAll("div.search-result-card span > span")[1];
            } else {
                aggrx_showToast('error', '不支持的页面, 抖音支支持`视频`和`综合`页面')
            }
        } else if (page_type === 'search-bilibili') {
            authorDom = liDom.querySelectorAll("div.bili-video-card .bili-video-card__info--author")[0];
        } else {
            console.warn(`不支持的页面类型 ${page_type}`)
            return;
        }

        if (!authorDom) {
            console.warn(`没有找到作者节点 ${liDom}`)
            return;
        }
        let authorName = authorDom.innerText
        if (!authorName) {
            console.warn(`作者名称是空`)
            return;
        }
        console.info(`检查 ${authorName}`)
        if (authorName.includes("🈶")) { console.info(`${authorName} 已经检查过`); return };
        if (authorName.includes("🈚️")) { console.info(`${authorName} 已经检查过`); return };
        aggrx_checkApiUserJSONP(authorName, authorDom, page_type);
    } catch (error) {
        console.error('检查作者dom 错误!!!!', error)
    }
}

// 监听 列表dom
function aggrx_targetListNode(page_type, observer_el_selector) {
    // 监听
    const targetNode = document.querySelector(observer_el_selector);
    if (!targetNode){
        return false
    }
    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutationsList => {
        // 遍历所有的 mutations
        mutationsList.forEach(mutation => {
            // 只有子节点变动才执行
            if (mutation.type !== 'childList') {
                return
            }

            // 为每个 li 元素添加按钮
            mutation.addedNodes.forEach((li, index) => {
                // 确保每个 li 只添加一个按钮
                if (li.querySelector('div.aggrx_buttonBox')) {
                    console.info("已经处理过了")
                    return
                }
                aggrx_addCopyCollectionButtonDom(li, page_type);
                aggrx_checkAuthor(li, page_type);
            });
        });
    });
    // 配置观察器 启动观察 服务
    const config = { childList: true, subtree: false };
    observer.observe(targetNode, config);
    return true
}


let initialized = {};
// 初始化
function aggrxInitialization(event) {
    event.stopPropagation();
    let page_type = aggrx_get_page_type(window.location.href)

    if (!page_type) {
        aggrx_showToast('error', '不支持的页面, 请切换到正确的标签再使用本插件. 抖音需要切换到`视频`页面')
        return;
    }

    if (page_type === 'search-douyin') {
        let video_page_observer_el = '#search-content-area ul[data-e2e="scroll-list"]'
        if (!(initialized[video_page_observer_el] || false)) {
            initialized[video_page_observer_el] = aggrx_targetListNode(page_type,video_page_observer_el);
        }

        let general_page_observer_el = 'div#waterFallScrollContainer'
        if (!(initialized[general_page_observer_el] || false)) {
            initialized[general_page_observer_el] = aggrx_targetListNode(page_type,general_page_observer_el);
        }
    }


    // document.getElementById('aggrxInitializationButton').innerText = '初始化中';
    // 初始化遍历每个 li 元素

    if (page_type === 'search-douyin') {
        if (window.location.href.includes('type=video')) {
            aggrx_searchList = document.querySelectorAll('#search-content-area ul[data-e2e="scroll-list"] li');
        } else if (window.location.href.includes('type=general')) {
            aggrx_searchList = document.querySelectorAll('div#waterFallScrollContainer div[id^="waterfall_item_"]');
        } else {
            aggrx_showToast('error', '不支持的页面, 抖音支支持`视频`和`综合`页面')
        }
        aggrx_scrollListHeight = aggrx_searchList[0].clientHeight + 70;
    } else if (page_type == 'search-bilibili') {
        // aggrx_searchList = document.querySelectorAll('div.search-all-list > .video-list div.bili-video-card');
        aggrx_searchList = document.querySelectorAll('div.video-list div.bili-video-card')
        aggrx_scrollListHeight = aggrx_searchList[0].clientHeight + 70;
    } else {
        aggrx_showToast('error', '不支持的页面, 请切换到正确的标签再使用本插件. 抖音需要切换到`视频`页面')
    }


    aggrx_searchList.forEach((li, index) => {
        if (li.querySelector('div.aggrx_buttonBox')) {
            console.info("已经处理过了")
            return
        }
        aggrx_addCopyCollectionButtonDom(li, page_type);
        aggrx_checkAuthor(li, page_type);
    });
}
(function() {
    'use strict';
    console.info("查询作者是否入库 启动")
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerText = `
.aggrx-search-douyin {
    position: fixed;
    top: 5px;
    left: calc(50% + 300px);
    padding: 10px;
    background-color: #33333305;
    color: white;
    text-align: center;
    z-index: 1000;
}

.aggrx-search-douyin button {
    padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    background: transparent;
    color: white;
    border: 2px solid #cdcdcd;
}

.aggrx-search-bilibili {
    position: fixed;
    top: 102px;
    left: calc(50% + 330px);
    z-index: 1000;
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

.aggrx_buttonBox{
    height: 40px;
    /*top: 1px;*/
    /*margin-left: 150px;*/
    position: absolute;
    background: transparent;
    /*z-index:99999*/
}

.aggrx-button-box-general{
    /*height: 40px;*/
    /*position: absolute;*/
    /*top: 10px;*/
    /*right: 10px;*/
}

.aggrx_buttonBox_button{
    background: transparent;
    border: 2px solid #cdcdcd;
    padding: 4px;
    color: white;
    margin-right: 4px;
    cursor: pointer;
}

.aggrx_buttonBox_button-search-bilibili{
    color: #00aeec !important;
}
  `;
    document.head.appendChild(css);

    let page_type = aggrx_get_page_type(window.location.href)

    if (!page_type) {
        aggrx_showToast('error', '不支持的页面, 请切换到正确的标签再使用本插件. 抖音需要切换到`视频`页面')
        return;
    }

    const pannel = document.createElement('div');
    pannel.id = 'aggrx-pannel';
    pannel.classList.add(`aggrx-${page_type}`);
    if (page_type.includes('bilibili')) {
        pannel.innerHTML = `
    <button id="aggrxInitializationButton" class='vui_button vui_button--blue vui_button--lg search-button'>扫描</button>
    `;
    } else {
        pannel.innerHTML = `
    <button id="aggrxInitializationButton">扫描</button>
    `;
    }

    document.body.appendChild(pannel);

    document.getElementById("aggrxInitializationButton").addEventListener("click", aggrxInitialization);
})();

function aggrx_get_page_type(url) {
    let page_type = ''
    let current_url = new URL(url)
    if (current_url.hostname.match(/search.bilibili.com/)) {
        return 'search-bilibili'
    } else if (current_url.href.match(/\.douyin\.com\/root\/search\/.*type=video.*/) || current_url.href.match(/\.douyin\.com\/root\/search\/.*type=video.*/)) {
        return 'search-douyin'
    } else if (current_url.href.match(/\.douyin\.com\/search\/.*/) || current_url.href.match(/\.douyin\.com\/search\/.*/)) {
        return 'search-douyin'
    } else {
        return;
    }
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