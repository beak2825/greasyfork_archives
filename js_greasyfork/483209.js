// ==UserScript==
// @name         头条助手（评论Hook）
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  头条助手（评论Hook） XmlhttpRequest Hook
// @author       myaijarvis
// @match        https://www.toutiao.com/article/*
// @match        https://www.toutiao.com/w/*
// @match        https://www.toutiao.com/video/*
// @match        https://www.ixigua.com/*
// @require      https://update.greasyfork.org/scripts/455943/1186873/ajaxHooker.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @icon         https://lf3-search.searchpstatp.com/obj/card-system/favicon_5995b44.ico
// @downloadURL https://update.greasyfork.org/scripts/483209/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E8%AF%84%E8%AE%BAHook%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/483209/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E8%AF%84%E8%AE%BAHook%EF%BC%89.meta.js
// ==/UserScript==

/*

脚本必须运行在 document-start
【参考：[ajaxHooker](https://scriptcat.org/zh-CN/script-show-page/637/ )】
【参考：[ajax劫持库ajaxHooker-油猴中文网](https://bbs.tampermonkey.net.cn/thread-3284-1-1.html )】
【参考：[使用filter后导致网站 部分正常请求 出现问题 · 反馈 #769 · ajaxHooker - ScriptCat](https://scriptcat.org/zh-CN/script-show-page/637/issue/769/comment )】
评论使用1.2.4版本，主页使用1.4.1版本

*/

// === 1. 注入全局 CSS ===
GM_addStyle(`
    .tt-helper-btn {
        position: fixed;
        left: 0px;
        z-index: 9999;
        padding: 6px 12px;
        font-size: 14px;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        color: gray;
    }
    .tt-helper-btn.on {
        color: green;
    }
`);

// === 2. 初始化全局开关状态 ===
const savedSortState = localStorage.getItem('tt_helper_comment_time_sort');
unsafeWindow.SHOW_COMMENT_TIME_SORT = savedSortState === 'true';

// === 3. 封装：通用按钮生成函数 ===
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

        // 提示用户刷新生效
        console.log(`[头条助手] ${label} 已切换为 ${isNowOn}, 刷新页面或加载新数据生效`);
    };
}

// === 4. 插入按钮 ===
function initAllButtons() {
    // 按钮: 评论时间排序 (Top: 200px)
    createSideButton('tt-helper-comment-sort', '时间', 'SHOW_COMMENT_TIME_SORT', 'tt_helper_comment_time_sort', 350);
}

// 等待 DOM 加载后插入按钮
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllButtons);
} else {
    setTimeout(initAllButtons, 500);
}


//console.log(ajaxHooker);
// 只监控下面这些请求，如果不设置filter有些请求无法正常使用

ajaxHooker.filter([
    { url: '/article/v4/tab_comments/', type: 'xhr' },
    { url: '/2/comment/v4/reply_list/', type: 'xhr' },
    { url: '/api/pc/list/', type: 'xhr' },
    { url: '/mp/agw/activity/list/v2/?', type: 'xhr' },
]);

ajaxHooker.hook(request => {

    //console.log(request.url); // 注意打印出url看看，有的url没有前面的域名，【大部分情况下需要去掉前面域名来匹配】
    // url请看请求标头的':path'
    if (request.url.includes('/article/v4/tab_comments/')) {
        // xhr 请求
        // https://www.toutiao.com/article/v4/tab_comments/?aid=24&app_name=toutiao_web&offset=0&count=20&group_id=7314222655379948072&item_id=7314222655379948072
        //console.log(request.url);
        request.response = res => {
            //console.log(res);
            //res.responseText += 'test';
            //console.log(res.responseText);
            // JSON.parse:JSON字符串转换为JS对象,JSON.stringify则相反
            const responseText = JSON.parse(res.responseText);// 保存原始数据
            if (responseText.err_no != 0) {
                // 请求返回有问题
                console.log(responseText.message);
                return;
            }

            // >>> 新增：按照时间排序 <<<
            if (unsafeWindow.SHOW_COMMENT_TIME_SORT) {
                responseText.data.sort((a, b) => {
                    const timeA = Number(a.comment.create_time);
                    const timeB = Number(b.comment.create_time);
                    return timeA - timeB; // 升序：旧（最早） -> 新
                });
            }
            // <<< 新增结束 >>>

            for (let i = 0; i < responseText.data.length; i++) {
                let comment = responseText.data[i].comment;

                let publish_loc_info = comment.publish_loc_info || ''; // 优化判空

                // 为了排版 截取前9位
                let user_name = comment.user_name;
                // 为了排版 截取前9位，不足9位加入空格占位
                if (user_name.length > 9) {
                    comment.user_name = user_name.substring(0, 9);
                } else {
                    // 使用全角空格(\u3000)补齐至9位，避免普通空格在网页中被折叠导致无法对齐
                    comment.user_name = user_name.padEnd(9, '\u3000');
                }

                comment.user_name += '【' + publish_loc_info + '】'; // 修改数据

                let create_time_str = comment.create_time;
                if (create_time_str) {
                    create_time_str = timestampToTime(create_time_str);
                } else {
                    create_time_str = '';
                }
                comment.user_name += create_time_str; // 修改数据

                // 处理回复列表
                if (comment.reply_list && comment.reply_list.length > 0) {
                    //debugger;
                    for (let j = 0; j < comment.reply_list.length; j++) {
                        let reply = comment.reply_list[j];
                        let publish_loc_info_reply = reply.publish_loc_info || ''; // 优化判空

                        reply.user_name += '【' + publish_loc_info_reply + '】'; // 修改数据
                        //console.log(responseText.data[i].comment.reply_list[j].user_name)

                        let create_time_str_reply = reply.create_time;
                        if (create_time_str_reply) {
                            create_time_str_reply = timestampToTime(create_time_str_reply);
                        } else {
                            create_time_str_reply = '';
                        }
                        reply.user_name += create_time_str_reply; // 修改数据
                    }
                }
            }
            res.responseText = JSON.stringify(responseText)
            //console.log(res.responseText);
            //for(let item of data){
            //console.log(item.comment.text,item.comment.publish_loc_info);
            //}
            //res.responseText = new Promise(resolve => {
            //    resolve(responseText + 'test');
            //});
        };
    } else if (request.url.includes('/2/comment/v4/reply_list/')) {
        // xhr 请求
        // https://www.toutiao.com/2/comment/v4/reply_list/?aid=24&app_name=toutiao_web&id=7314254753981383459&offset=0&count=5&repost=0
        //console.log(request.url);
        request.response = res => {

            const responseText = JSON.parse(res.responseText);// 保存原始数据
            if (responseText.err_no != 0) {
                // 请求返回有问题
                console.log(responseText.message);
                return;
            }

            // >>> 新增：按照时间排序 (针对当前页加载的回复) <<<
            if (unsafeWindow.SHOW_COMMENT_TIME_SORT && responseText.data && responseText.data.data) {
                responseText.data.data.sort((a, b) => {
                    const timeA = Number(a.create_time);
                    const timeB = Number(b.create_time);
                    return timeA - timeB; // 升序：旧（最早） -> 新
                });
            }
            // <<< 新增结束 >>>

            for (let i = 0; i < responseText.data.data.length; i++) {
                let item = responseText.data.data[i];
                let user_name = item.user.name;

                item.user.name = user_name.substring(0, 4); // 为了排版 截取前4位

                let publish_loc_info = item.publish_loc_info || ''; // 优化判空
                item.user.name += '【' + publish_loc_info + '】'; // 修改数据

                let create_time_str = item.create_time;
                console.log(create_time_str);
                if (create_time_str) {
                    create_time_str = timestampToTime(create_time_str);
                } else {
                    create_time_str = '';
                }
                item.user.name += create_time_str; // 修改数据

            }
            res.responseText = JSON.stringify(responseText)
            //console.log(res.responseText);

        };
    }

});

function toThousands(num = 0) {
    return num.toString().replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
    });
};

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
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
    //return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
/*
// 示例使用
const timestamp = 1746284884;
console.log(timestampToTime(timestamp)); // 输出：2025-05-04 10:58:04
*/