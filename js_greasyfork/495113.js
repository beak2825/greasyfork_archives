// ==UserScript==
// @name         头条助手（主页Hook）
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  头条助手（主页Hook） XmlhttpRequest Hook
// @author       myaijarvis
// @match        https://www.toutiao.com/c/user/token/*
// @match        https://mp.toutiao.com/profile_v4/activity/task-list
// @require      https://update.greasyfork.org/scripts/483208/1377351/ajaxHooker_myaijarvis.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @icon         https://lf3-search.searchpstatp.com/obj/card-system/favicon_5995b44.ico
// @downloadURL https://update.greasyfork.org/scripts/495113/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E4%B8%BB%E9%A1%B5Hook%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/495113/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E4%B8%BB%E9%A1%B5Hook%EF%BC%89.meta.js
// ==/UserScript==

/*

脚本必须运行在 document-start
【参考：[ajaxHooker](https://scriptcat.org/zh-CN/script-show-page/637/ )】
【参考：[ajax劫持库ajaxHooker-油猴中文网](https://bbs.tampermonkey.net.cn/thread-3284-1-1.html )】
【参考：[使用filter后导致网站 部分正常请求 出现问题 · 反馈 #769 · ajaxHooker - ScriptCat]
(https://scriptcat.org/zh-CN/script-show-page/637/issue/769/comment )】
评论使用1.2.4版本，主页使用1.4.1版本

*/

// === 1. 注入全局 CSS ===
GM_addStyle(`
    /* 通用按钮样式 */
    .tt-helper-btn {
        position: fixed;
        left: 0px;
        z-index: 9999;
        padding: 6px;
        font-size: 14px;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        color: gray;

        text-align: center;
    }
    .tt-helper-btn.on {
        color: green;
    }

    /* 加载提示框 */
    #tt-helper-loading, #tt-helper-loading-time {
        position: fixed;
        top: 215px;
        left: 10%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 16px;
        z-index: 99999;
        pointer-events: none;
    }
    #tt-helper-loading-time {
        top: 265px;
    }

    /* >>> 修改：搜索容器样式 <<< */
    #tt-helper-search-container {
        position: fixed;
        left: 0px;
        top: 350px;
        z-index: 9999;
        display: flex;
        align-items: center;
        background-color: #fff; /* 整体背景 */
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    /* 输入框的包装容器：用于定位 X */
    .tt-helper-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    /* 输入框样式 */
    #tt-helper-search-input {
        width: 100px; /* 稍微宽一点容纳内容 */
        padding: 5px 15px 5px 5px; /* 右侧留出一点给 X 按钮 */
        font-size: 13px;
        border: 1px solid #ddd;
        border-radius: 2px;
        outline: none;
    }
    #tt-helper-search-input:focus {
        border-color: #aaa;
    }

    /* X 清除按钮样式：绝对定位在输入框右侧 */
    #tt-helper-search-clear {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%); /* 垂直居中 */
        cursor: pointer;
        color: #999;
        font-size: 14px;
        line-height: 1;
        user-select: none;
        background: transparent;
        padding: 2px;
    }
    #tt-helper-search-clear:hover {
        color: #f00;
        font-weight: bold;
    }

    /* 搜索按钮样式 */
    #tt-helper-search-trigger {
        cursor: pointer;
        padding: 4px 8px;
        font-size: 13px;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 2px;
        margin-left: 5px;
        white-space: nowrap;
    }
    #tt-helper-search-trigger:hover {
        background-color: #e6e6e6;
    }
`);

// 初始化全局开关状态（默认关闭）
// 从 localStorage 读取开关状态，若无则默认 false

// 数量开关
const savedState = localStorage.getItem('tt_helper_show_filter');
unsafeWindow.SHOW_FILTER = savedState === 'true';

// 时间开关
const savedState_time = localStorage.getItem('tt_helper_show_filter_time');
unsafeWindow.SHOW_FILTER_TIME = savedState_time === 'true';

// 转发开关
const savedState_repost = localStorage.getItem('tt_helper_show_filter_repost');
unsafeWindow.SHOW_FILTER_REPOST = savedState_repost === 'true';

// 搜索关键词 (默认为 '')
const savedSearchKeyword = localStorage.getItem('tt_helper_search_keyword') || '';
//unsafeWindow.SHOW_FILTER = false;

// === 封装：通用按钮生成函数 ===
/**
 * 创建侧边栏开关按钮
 * @param {string} id - 按钮的DOM ID
 * @param {string} label - 按钮显示的文本前缀
 * @param {string} globalVarStr - unsafeWindow下的变量名（字符串格式）
 * @param {string} storageKey - localStorage存储的key
 * @param {number} topPos - CSS top 属性的值（数字，单位px）
 */
function createSideButton(id, label, globalVarStr, storageKey, topPos) {
    if (document.getElementById(id)) return;

    const isOn = unsafeWindow[globalVarStr];
    // 使用内联样式设置 top，通用类设置其他样式
    document.body.insertAdjacentHTML('beforeend', `
        <button id="${id}" class="tt-helper-btn ${isOn ? 'on' : ''}" style="top: ${topPos}px;">
            ${label} ${isOn ? 'ON' : 'OFF'}
        </button>
    `);

    document.getElementById(id).onclick = () => {
        // 切换状态
        unsafeWindow[globalVarStr] = !unsafeWindow[globalVarStr];
        localStorage.setItem(storageKey, String(unsafeWindow[globalVarStr]));

        const btn = document.getElementById(id);
        const isNowOn = unsafeWindow[globalVarStr];
        btn.textContent = `${label} ${isNowOn ? 'ON' : 'OFF'}`;
        btn.className = `tt-helper-btn ${isNowOn ? 'on' : ''}`;
    };
}

// === 插入所有按钮 ===
function initAllButtons() {
    // 按钮1: 数量过滤 (Top: 200px)
    createSideButton('tt-helper-toggle', '数量', 'SHOW_FILTER', 'tt_helper_show_filter', 200);

    // 按钮2: 时间过滤 (Top: 250px)
    createSideButton('tt-helper-toggle-time', '时间', 'SHOW_FILTER_TIME', 'tt_helper_show_filter_time', 250);

    // 按钮3: 转发过滤 (Top: 300px)
    createSideButton('tt-helper-toggle-repost', '转发', 'SHOW_FILTER_REPOST', 'tt_helper_show_filter_repost', 300);

    // 插入搜索功能组件
    insertSearchUI();
}


// 主页
if (window.location.href.includes('www.toutiao.com/c/user/token/')) {
    // 等待 DOM 加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllButtons);
    } else {
        setTimeout(initAllButtons, 500); // 给页面一点加载时间
    }
}


//console.log(ajaxHooker);
// 只监控下面这些请求，如果不设置filter有些请求无法正常使用

ajaxHooker.filter([
    { url: '/api/pc/list/', type: 'xhr' },
    { url: '/mp/agw/activity/list/v2/?', type: 'xhr' },
]);

ajaxHooker.hook(request => {

    //console.log(request.url); // 注意打印出url看看，有的url没有前面的域名，【大部分情况下需要去掉前面域名来匹配】
    // url请看请求标头的':path'
    if (request.url.includes('/api/pc/list/user/feed?')  // 主页
        || request.url.includes('/api/pc/list/feed?token=')  // 主页搜索 但搜索结果不是按照日期来展示的，时间是随机的
    ) {

        // 显示 loading（如果还没显示）
        const LOADING_ID = 'tt-helper-loading';
        if (!document.getElementById(LOADING_ID)) {
            document.body.insertAdjacentHTML('beforeend', `<div id="${LOADING_ID}">正在加载...</div>`);
        }

        // xhr 请求
        // https://www.toutiao.com/api/pc/list/user/feed?category=profile_all&token=MS4wLjABAAAA9DSZ_CjujU-CN4_tHwNxwEPt4FeWSnhDBfDy97_IJXI&max_behot_time=0&aid=24&app_name=toutiao_web
        // category 请查看 https://www.toutiao.com/api/pc/user/tabs_info?
        // category：profile_all(全部),pc_profile_article(文章),pc_profile_ugc(微头条),pc_profile_video(视频),pc_profile_short_video(小视频) 等
        // console.log(request.url);
        // const over_w=false; // 阅读过万才显示 展现量、阅读量等数据，未使用
        request.response = res => {

            // 移除 loading 提示
            document.getElementById(LOADING_ID)?.remove();

            const responseText = JSON.parse(res.responseText);// 保存原始数据
            //console.log(responseText);
            if (responseText.message != 'success') {
                // 请求返回有问题
                console.log(responseText.message);
                return;
            }

            if (request.url.includes('/api/pc/list/feed?token=')) {
                // 主页搜索 但搜索结果不是按照日期来展示的，时间是随机的  这里按照时间逆序排列（时间早的在前面）
                responseText.data = responseText.data.sort((a, b) => {
                    // 如果 publish_time 是字符串数字，可先转 Number；如果是时间戳（秒或毫秒），确保统一
                    const timeA = Number(a.publish_time);
                    const timeB = Number(b.publish_time);
                    return timeB - timeA; // 降序：新 → 旧
                });
            }

            let show_time = unsafeWindow.SHOW_FILTER_TIME; // 从全局读取开关状态
            if (show_time) {
                // 剔除时间超过xx天的
                const now = Date.now(); // 当前时间（毫秒）
                const oneMonthAgo = now - 40 * 24 * 60 * 60 * 1000; // 40天前的毫秒时间戳

                responseText.data = responseText.data.filter(item => {
                    // 将 publish_time（秒）转为毫秒
                    const publishTimeMs = (Number(item.publish_time) || 0) * 1000;
                    return publishTimeMs >= oneMonthAgo; // 保留一个月内的数据
                });
                // 判断过滤后是否为空
                if (responseText.data.length === 0) {
                    console.log('警告：没有找到最近一个月内的数据');
                    // 显示 loading（如果还没显示）
                    const LOADING_ID_TIME = 'tt-helper-loading-time';
                    if (!document.getElementById(LOADING_ID_TIME)) {
                        document.body.insertAdjacentHTML('beforeend', `<div id="${LOADING_ID_TIME}">没有找到最近一个月内的数据</div>`);
                    }
                    // 3s 后关闭
                    setTimeout(() => {
                        document.getElementById(LOADING_ID_TIME)?.remove();
                    }, 3000)
                }
            }
            // 数量
            let show = unsafeWindow.SHOW_FILTER; // 从全局读取开关状态
            if (show) {
                responseText.data = responseText.data.filter(item => {
                    if (item.hasOwnProperty('aggr_type')) {
                        // article
                        const ic = item.itemCell?.itemCounter;
                        return ic && ic.readCount > 10000;
                    } else if (item.hasOwnProperty('comment_base')) {
                        // 转发内容
                        return true;
                    } else if (item.hasOwnProperty('video_duration')) {
                        // video
                        const ic = item.itemCell?.itemCounter;
                        return ic && ic.readCount > 10000;
                    } else {
                        // wtt
                        const ic = item.itemCell?.itemCounter;
                        return ic && (ic.showCount > 50000 || ic.readCount > 5000);
                    }
                });
            }

            // 过滤转发
            let show_repost = unsafeWindow.SHOW_FILTER_REPOST;
            if (show_repost) {
                // 剔除包含 comment_base 的项
                responseText.data = responseText.data.filter(item => !item.hasOwnProperty('comment_base'));
            }

            let response_data = responseText.data;
            for (let i = 0; i < response_data.length; i++) {
                try {
                    let text = '';
                    if (response_data[i].hasOwnProperty('aggr_type')) {
                        // article:aggr_type=2
                        let itemCounter = response_data[i].itemCell.itemCounter;
                        if (!itemCounter) continue;
                        //console.log(itemCounter);
                        text += `【${toThousands(itemCounter.showCount)} | ${toThousands(itemCounter.readCount)}】`;
                        if (itemCounter.readCount > 10000) {
                            text += '【W】'; // 用于搜索W关键字
                        }
                        if (response_data[i]['control_meta']['modify']['tips'].length > 20) {
                            text += '【XT】'; // "已确认的星图内容无法修改\n请联系客户开启编辑权限"
                        }
                        //let is_original=response_data[i]['is_original']? '原创':'非原创'; // 这个不准确
                        //text +=`【${is_original}】`+text
                        let timestamp = response_data[i].publish_time; // 时间戳
                        let time_str = timestampToTime(timestamp);
                        text += ` | ${time_str} | ${timestamp} `;
                        let share = response_data[i].control_meta.share.permission;
                        let text2 = '';
                        if (!share) {
                            text2 += `【不可见】`;
                            //response_data[i].comment_count=-1;
                            //response_data[i].publish_time='不可见'
                        }
                        // 无法解析`<span style='color:red'>${text}</span>`
                        responseText.data[i].title = text2 + responseText.data[i].title + text; // 修改数据
                        //response_data[i].itemCell.itemCounter.commentCount +=`<span style='color:red'>【测试1】</span>`;
                        //console.log(response_data[i].itemCell.itemCounter.commentCount);
                        // 只能接受数字 如果不可见 就设置为-1吧
                        //response_data[i].comment_count +=`<span style='color:red'>【测试2】</span>`; // 前端显示的是这个 但显示在 <a aria-label=''>34评论<a>
                        //response_data[i].comment_count='测试2';
                        //console.log(response_data[i].comment_count);
                    } else if (response_data[i].hasOwnProperty('comment_base')) {
                        // 转发内容
                        continue
                    } else if (response_data[i].hasOwnProperty('video_duration')) {
                        // video
                        let share = response_data[i].control_meta.share.permission;
                        if (!share) {
                            text += `<span style='color:blue'>【不可见】</span>`;
                        }
                        let itemCounter = response_data[i].itemCell.itemCounter;
                        text += `【${toThousands(itemCounter.showCount)} | ${toThousands(itemCounter.readCount)}】`;
                        if (itemCounter.readCount > 10000) {
                            text += '【W】'; // 用于搜索W关键字
                        }
                        let timestamp = response_data[i].publish_time; // 时间戳
                        let time_str = timestampToTime(timestamp);
                        text += ` | ${time_str} | ${timestamp} `;
                        responseText.data[i].title = String(responseText.data[i].title) + text; // 修改数据
                    } else {
                        // wtt
                        let share = response_data[i].control_meta.share.permission;
                        // console.log(share);
                        //debugger
                        if (!share) {
                            text += `<span style='color:blue'>【不可见】</span>`;
                        }
                        let itemCounter = response_data[i].itemCell.itemCounter;
                        if (!itemCounter) continue;
                        // console.log(itemCounter);
                        if (itemCounter.showCount > 50000 || itemCounter.readCount > 5000) { // 筛选条件
                            text += `【<span style='color:red'>${toThousands(itemCounter.showCount)} | ${toThousands(itemCounter.readCount)}</span>】`;
                            text += '【W】';
                        } else {
                            text += `【<span>${toThousands(itemCounter.showCount)} | ${toThousands(itemCounter.readCount)}</span>】`;
                        }
                        if (response_data[i]['control_meta']['modify']['tips'].length > 20) {
                            text += '【XT】'; // "已确认的星图内容无法修改\n请联系客户开启编辑权限"
                        }
                        let forum = response_data[i].forum; // wtt,zw 标签
                        if (forum) {
                            text += response_data[i].forum.forum_name;
                        }
                        let publish_loc_info = response_data[i].publish_loc_info || ''; // 只有wtt能看到IP
                        text += ` ${publish_loc_info}`;
                        let content_len = response_data[i].content.length;
                        text += ` | ${content_len}字`;
                        let timestamp = response_data[i].publish_time; // 时间戳
                        let time_str = timestampToTime(timestamp);
                        text += ` | ${time_str} | ${timestamp} `;
                        // console.log(text);
                        // 网页显示rich_content字段内容，但rich_content可能会有前端代码，这里使用content
                        responseText.data[i].rich_content = String(responseText.data[i].content.replace(/[a-zA-Z]/g, "")).substring(0, 28) + '<br/>' + text; // 修改数据
                    }
                }
                catch (err) {
                    //debugger
                    console.log(err)
                    console.log(response_data[i])
                }
            }
            
            res.responseText = JSON.stringify(responseText)
            //console.log(responseText);
        };
    }
    else if (request.url.includes('/mp/agw/activity/list/v2/?')) {
        // xhr 请求  头条后台 活动页面
        // https://www.toutiao.com/article/v4/tab_comments/?aid=24&app_name=toutiao_web&offset=0&count=20&group_id=7314222655379948072&item_id=7314222655379948072
        console.log(request.url);
        request.response = res => {
            //console.log(res); // 这个请求返回的数据在res.responseText
            //res.responseText += 'test';
            //console.log(res.responseText);
            // JSON.parse:JSON字符串转换为JS对象,JSON.stringify则相反
            const responseText = JSON.parse(res.responseText);// 保存原始数据
            if (responseText.err_no != 0) {
                // 请求返回有问题
                console.log(responseText.message);
                return;
            }
            for (let i = 0; i < responseText.data.activity_list.length; i++) {
                let activity_time = responseText.data.activity_list[i].activity_time;
                responseText.data.activity_list[i].introduction = '【' + activity_time + '】' + responseText.data.activity_list[i].introduction; // 修改数据
            }
            res.responseText = JSON.stringify(responseText)
        };
    }

});

// === 4. 封装：搜索 UI 生成函数 ===
function insertSearchUI() {
    if (document.getElementById('tt-helper-search-container')) return;

    document.body.insertAdjacentHTML('beforeend', `
        <div id="tt-helper-search-container">
            <div class="tt-helper-input-wrapper">
                <input id="tt-helper-search-input" type="text" value="${savedSearchKeyword}" placeholder="关键字">
                <span id="tt-helper-search-clear" title="清空内容">×</span>
            </div>
            <button id="tt-helper-search-trigger" title="执行搜索">🔍</button>
        </div>
    `);

    const input = document.getElementById('tt-helper-search-input');
    const clearBtn = document.getElementById('tt-helper-search-clear');
    const searchBtn = document.getElementById('tt-helper-search-trigger');

    // 定义统一的搜索触发逻辑
    const handleSearch = () => {
        const keyword = input.value.trim();
        if (!keyword) {
            alert('请输入搜索内容');
            return;
        }
        autoSearch(keyword);
    };

    // 监听输入，实时保存
    input.addEventListener('input', (e) => {
        localStorage.setItem('tt_helper_search_keyword', e.target.value);
    });

    // 监听回车键
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // 回车触发搜索
        }
    });

    // 清除按钮逻辑
    clearBtn.onclick = () => {
        input.value = '';
        localStorage.setItem('tt_helper_search_keyword', '');
        input.focus();
    };

    // 搜索按钮逻辑
    searchBtn.onclick = handleSearch; // 点击触发搜索
}

// === 5. 核心逻辑：React 兼容的自动搜索 (页面是 React 写的) ===
function autoSearch(keyword) {
    console.log(`[头条助手] 开始自动搜索: ${keyword}`);

    let searchBtn = document.querySelector('.search-btn[aria-label="搜索"]');
    if (searchBtn) {
        searchBtn.click();
    } else {
        console.error("未找到搜索图标，请确认页面加载完毕");
        return;
    }

    setTimeout(() => {
        let input = document.querySelector('.profile-search-input input[type="text"]');

        if (input) {
            // --- React 穿透赋值 ---
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, keyword);

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(() => {
                // 模拟回车
                input.focus();
                let enterEvent = new KeyboardEvent('keydown', {
                    bubbles: true, cancelable: true, keyCode: 13, key: 'Enter', code: 'Enter'
                });
                input.dispatchEvent(enterEvent);

                // 点击提交按钮
                let submitBtn = document.querySelector('.profile-search-input .search-submit');
                if (submitBtn) {
                    if (submitBtn.disabled) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('disable');
                    }
                    submitBtn.click();

                    // >>> 修改：点击后页面下滑三次，最后回到顶部 <<<
                    console.log("👉 搜索提交成功，准备执行下滑...");
                    let scrollCount = 0;
                    const maxScrolls = 3;

                    function doScroll() {
                        if (scrollCount < maxScrolls) {
                            // 执行下滑
                            window.scrollBy({ top: 600, behavior: 'smooth' });
                            scrollCount++;
                            console.log(`⬇️ 执行第 ${scrollCount} 次下滑`);

                            // 1秒后继续尝试
                            setTimeout(doScroll, 1000);
                        } else {
                            // 下滑完成，等待1秒后回到顶部
                            setTimeout(() => {
                                console.log("⬆️ 下滑结束，回到页面顶部");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 1000);
                        }
                    }

                    // 首次执行等待 1s (等待搜索结果加载)
                    setTimeout(doScroll, 1000);
                }

            }, 300);
        } else {
            console.error("未找到搜索输入框");
        }
    }, 500);
}

function toThousands(num = 0) {
    return num.toString().replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
    });
}

function timestampToTime(timestamp) {
    // 如果时间戳是10位（以秒为单位），需要乘以1000转换为毫秒
    const date = new Date(timestamp * 1000);

    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 返回格式化后的字符串
    return `${month}-${day} ${hours}时`;
    //return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
/*
// 示例使用
const timestamp = 1746284884;
console.log(timestampToTime(timestamp)); // 输出：2025-05-04 10:58:04
*/