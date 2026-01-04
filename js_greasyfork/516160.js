// ==UserScript==
// @name         B站评论/Ip-生成词云、情绪分析、中心摘要
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  通过词云可以快速提取视频当前风向和节奏，也可分析评论者的IP分布
// @author       口吃者
// @match        https://www.bilibili.com/video/*
// @match        http://www.wenpipi.com/*
// @match        https://online.lingjoin.com/*
// @match        https://www.lzltool.cn/word-frequency
// @match        https://wordcloud.online/zh
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @require      https://update.greasyfork.org/scripts/515866/1477949/Tipyy-521.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516160/B%E7%AB%99%E8%AF%84%E8%AE%BAIp-%E7%94%9F%E6%88%90%E8%AF%8D%E4%BA%91%E3%80%81%E6%83%85%E7%BB%AA%E5%88%86%E6%9E%90%E3%80%81%E4%B8%AD%E5%BF%83%E6%91%98%E8%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/516160/B%E7%AB%99%E8%AF%84%E8%AE%BAIp-%E7%94%9F%E6%88%90%E8%AF%8D%E4%BA%91%E3%80%81%E6%83%85%E7%BB%AA%E5%88%86%E6%9E%90%E3%80%81%E4%B8%AD%E5%BF%83%E6%91%98%E8%A6%81.meta.js
// ==/UserScript==
/* 补环境参数 */
// var t = 'mode=3&oid=113402018078283&pagination_str=%7B%22offset%22%3A%22%7B%5C%22type%5C%22%3A1%2C%5C%22direction%5C%22%3A1%2C%5C%22session_id%5C%22%3A%5C%221772062350790234%5C%22%2C%5C%22data%5C%22%3A%7B%7D%7D%22%7D&plat=1&type=1&web_location=1315875&wts=1730537058ea1db124af3c7062474693fa704f4ff8';
var r = undefined;
var e ={
    "oid": "113402018078283",
    "type": 1,
    "mode": 3,
    "pagination_str": "{\"offset\":\"{\\\"type\\\":1,\\\"direction\\\":1,\\\"data\\\":{\\\"pn\\\":2}}\"}",
    "plat": 1,
    "web_location": 1315875
};
var ct = "wbi_img_urls";
var wordCloudUrl_1 = 'https://wordcloud.online/zh';
var wenPiPiCommentUrl = 'http://www.wenpipi.com/comment';
var wenPiPiZihuaUrl = 'http://www.wenpipi.com/zihua';
var wenPiPiFenxiUrl = 'http://www.wenpipi.com/fenxi';
var wenPiPiEsseUrl = 'http://www.wenpipi.com/esse';
var lztToolUrl = 'https://www.lzltool.cn/word-frequency';
var nlpirUrl = 'https://online.lingjoin.com/#/';
class CommentManager {
    constructor() {
        this.comments = []; // 存储所有的评论/评论IP
        this.isEnd = false; // 标记评论是否全部请求完毕
        this.length = 0; // 每次请求的评论/评论IP数量
        this.ids = new Set(); // 存储评论的 id，确保不重复
    }

    // 添加新的评论集合
    addComments(newComments, isEnd) {
        if (Array.isArray(newComments)) {
            newComments.forEach(comment => {
                // 检查评论的 id 是否已存在
                if (!this.ids.has(comment.id)) {
                    // 如果不存在，添加评论和 id
                    this.comments.push(comment);
                    this.ids.add(comment.id);
                    this.length++;
                } else {
                    // console.log(`Comment with id ${comment.id} already exists and will not be added.`);
                }
            });
            this.isEnd = isEnd;
        }
    }

    // 过滤评论，参数为正则表达式
    filterComments(pattern) {
        // 将字符串转换为正则表达式
        const regex = new RegExp(pattern);
        return this.getCommentsAsStrings().filter(comment => regex.test(comment));
    }

    // 获取所有评论
    getAllComments() {
        return this.comments;
    }

    // 获取评论总数
    getTotalCount() {
        return this.length;
    }

    // 检查是否所有评论都已加载
    isAllLoaded() {
        return this.isEnd;
    }

    getCommentsAsStrings() {
        return this.comments.map(comment => comment.content);
    }
}
var commentManager = new CommentManager();
var isLoadEnd = false;
var regexGlobal = '';
var targetAmountGlobal = 100;
var optionGlobal;
var wordcloudOption;
var comment_params;
var selected = '';
var firstPageData;
var firstPageUrl;
var allCountPageData = 222;
(function() {
    'use strict';
    var currentUrl = window.location.href;
    var engineUrl = [
        wordCloudUrl_1,
        wenPiPiCommentUrl,
        wenPiPiZihuaUrl,
        wenPiPiFenxiUrl,
        wenPiPiEsseUrl,
        lztToolUrl,
        nlpirUrl
    ];
    if (!(engineUrl.includes(currentUrl))) {
        window.addEventListener('load', addPanel);
    }

    /* hook 获取评论请求的基本参数 */
    const originalFetch = window.fetch;
    // 创建一个 Promise 用于监听 comment_params 赋值完成
    const commentParamsReady = new Promise((resolve) => {
        unsafeWindow.fetch = async (resource, config = {}) => {
            // 确保 headers 是一个对象
            if (!config.headers) {
                config.headers = {};
            }
            const request = new Request(resource, config);
            // 检查是否带有特殊标志,跨域请求限制，尝试使用已有的header（由浏览器最后添加的）
            if (config.headers['user-agent']) {
                // 移除标志，防止污染配置
                delete config.headers['X-Skip-Interceptor'];
                return originalFetch(resource, config);
            }
            if (resource.includes('//api.bilibili.com/x/v2/reply/wbi/main')) {
                // 发起请求
                const response = await originalFetch(resource, config);
                const clonedResponse = response.clone(); // 创建响应的副本
                const text = await clonedResponse.text();
                const data = JSON.parse(text);
                // 解析完成，resolve Promise
                resolve({ firstData: data, commentUrl: resource });
                // 返回原始响应
                return response;
            }
            // 对其他请求使用原生 fetch
            return originalFetch(request);
        };
    });

    commentParamsReady
        .then((params) => {
            var offsetString;
            var ltFucRes;
            console.log('comment_params 已经赋值完成:', params);
            firstPageData = params['firstData'];
            allCountPageData = params['firstData'].data.cursor.all_count;
            /* 
                是否结束滚动 data.data.cursor.is_end
                请求数量 data.data.replies.length
                下一次请求的参数 data.data.cursor.pagination_reply.next_offset
                全部评论数量 data.data.cursor.all_count
            */
            // oid;type;mode;pagination_str;plat;web_location;w_rid;wts;
            firstPageUrl = params['commentUrl'].toString();
            comment_params = getUrlComponent(params['commentUrl'].toString());
            e["oid"] = comment_params["oid"];
            e["web_location"] = comment_params['web_location'];
            // comment_params["sessionId"] = params['firstData'].data.cursor.session_id;
            //生成pagination_str参数
            offsetString = params['firstData'].data.cursor.pagination_reply.next_offset;
            const resultObject = {
                offset: offsetString
            };
            e["pagination_str"] = JSON.stringify(resultObject);
            ltFucRes = lt(e);
            comment_params["w_rid"] = ltFucRes["w_rid"];
            comment_params["wts"] = ltFucRes["wts"];
            comment_params["pagination_str"] = JSON.stringify(resultObject);
            return comment_params;
        })

    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("#__nuxt > div > section > textarea");
            var btnSubmit = document.querySelector(".gap-4.mb-5 > div:nth-child(2) > button");
            await changeTextareaValueAndTriggerInput(textareaEle, selected);
            await new Promise(resolve => setTimeout(resolve, 200));
            btnSubmit.click();
            await GM.setValue('wordCloudStr', '');
        } ,wordCloudUrl_1)
    });

    /* 文皮皮 -文本分析、字画、差评分析、文章摘要 */
    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("td>#content");
            textareaEle.value = selected;
            await GM.setValue('wordCloudStr', '');
        } ,wenPiPiFenxiUrl)
    });

    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("td>#contentId");
            textareaEle.value = selected;
            await GM.setValue('wordCloudStr', '');
        } ,wenPiPiZihuaUrl)
    });

    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("td>#commentContentId");
            textareaEle.value = selected;
            await GM.setValue('wordCloudStr', '');
        } ,wenPiPiCommentUrl)
    });

    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("td>#content");
            textareaEle.value = selected;
            await GM.setValue('wordCloudStr', '');
        } ,wenPiPiEsseUrl)
    });

    /* NLPIR在线演示平台 */
    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("div>#text");
            textareaEle.innerText = selected;
            await GM.setValue('wordCloudStr', '');
        } ,nlpirUrl)
    });

    /* LZL在线工具 */
    window.addEventListener('load', ()=>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('wordCloudStr', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("div>#content");
            textareaEle.value = selected;
            await GM.setValue('wordCloudStr', '');
        } ,lztToolUrl)
    });
})();
const getUrlComponent = function (targetUrl) {
    // 提取查询字符串部分
    const queryString = targetUrl.split('?')[1];
    // 定义正则表达式来匹配参数
    const regex = /([^&=]+)=([^&]*)/g;
    // 创建一个对象来存储参数
    const params = {};
    let match;
    while ((match = regex.exec(queryString)) !== null) {
        const key = decodeURIComponent(match[1]);
        const value = decodeURIComponent(match[2]);
        params[key] = value;
    }
    return params;
};

const getFinalCommentUrl = function (params) {
    // 指定参数的顺序
    const orderKeys = ["oid", "type", "mode", "plat", "web_location", "pagination_str", "w_rid", "wts"];

    // 按照指定顺序构建参数列表
    const orderedParams = orderKeys
        .filter(key => params.hasOwnProperty(key))
        .map(key => key === 'pagination_str'
            ? `${key}=${encodeURIComponent(params[key])}`
            : `${key}=${params[key]}`);

    // 构建新的URL
    const newUrl = 'https://api.bilibili.com/x/v2/reply/wbi/main?' + orderedParams.join('&');

    return newUrl;
};
/* 提取字符串省份 */
function extractProvince(str) {
    // 检查输入字符串是否符合预期格式
    if (typeof str !== 'string' || !str.includes('IP属地：')) {
        return null; // 如果不符合格式，则返回null
    }
    
    // 使用split方法分割字符串，获取省份名称
    const parts = str.split('IP属地：');
    if (parts.length > 1) {
        return parts[1].trim(); // 返回省份名称，并去除前后可能存在的空格
    }
    return null; // 如果分割结果不正确，也返回null
}
/* 模拟input事件并改变textarea值 */
async function changeTextareaValueAndTriggerInput(textarea, newValue) {
    textarea.value = newValue;
    const event = new Event('input', { bubbles: true });
    // 派发事件
    textarea.dispatchEvent(event);
}
/* 添加页面数据处理函数 */
function pageDataHandle(pageData, option, targetAmount) {
    // var commentManager = new CommentManager();
    var data_replies = pageData.data.replies;
    var is_end = pageData.data.cursor.is_end;
    if(is_end == true || commentManager.getTotalCount() >= targetAmount){
        return false;
    }
    //后续增加业务换为映射表
    var data_to_use = option === 'option1'
        ? data_replies.map(replyComment => ({ content: replyComment.content.message, id: replyComment.rpid_str }))
        : data_replies.map(replyComment => ({ content: extractProvince(replyComment.reply_control.location), id: replyComment.rpid_str }));

    commentManager.addComments(data_to_use, is_end);
    return true;
}

async function generateFinalCommentManger() {
    var pageData = await fetchNextPageData();
    while(pageDataHandle(pageData, optionGlobal, targetAmountGlobal)){
        await new Promise(resolve => setTimeout(resolve, 100));
        pageData = await fetchNextPageData();
    }
    /* 生成全部的评论集的总和字符串，并保存在缓存中 */
    isLoadEnd = true;
    await new Promise(resolve => setTimeout(resolve, 100));
    var wordCloudStr = regexGlobal === ''
                        ? commentManager.getCommentsAsStrings().join("\n")
                        : commentManager.filterComments(regexGlobal).join("\n");
    await GM.setValue('wordCloudStr', wordCloudStr);

    switch (wordcloudOption) {
        case 'fenxi':
            wenPiPiFenxiPopup();
            break;
        case 'zihua':
            wenPiPiZihuaPopup();
            break;
        case 'comment':
            wenPiPiCommentPopup();
            break;
        case 'esse':
            wenPiPiEssePopup();
            break;
        case 'wordcloudOnline':
            wordCloud1Popup();
            break;
        case 'lingJoin':
            nlpirPopup();
            break;
        case 'lzlTool':
            lztToolPopup();
            break;      
    }
    firstPageData = await fetchRestPageData();
    return true;
}

/* 词云-1 */
async function wordCloud1Popup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(wordCloudUrl_1, '词云', 1024, 800);
    } catch(error) {}
}
/* 文皮皮 */
async function wenPiPiFenxiPopup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(wenPiPiFenxiUrl, '文皮皮', 1024, 800);
    } catch(error) {}
}
async function wenPiPiZihuaPopup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(wenPiPiZihuaUrl, '文皮皮', 1024, 800);
    } catch(error) {}
}
async function wenPiPiCommentPopup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(wenPiPiCommentUrl, '文皮皮', 1024, 800);
    } catch(error) {}
}
async function wenPiPiEssePopup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(wenPiPiEsseUrl, '文皮皮', 1024, 800);
    } catch(error) {}
}
/* NLPIR在线演示平台 */
async function nlpirPopup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(nlpirUrl, 'NLPIR在线演示平台', 1024, 800);
    } catch(error) {}
}
/* LZL在线工具 */
async function lztToolPopup(){
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(lztToolUrl, 'LZL在线工具', 1024, 800);
    } catch(error) {}
}

async function fetchNextPageData(){
    const finalUrl = getFinalCommentUrl(comment_params);
    const response = await fetch(finalUrl, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
            'origin': 'https://www.bilibili.com'
        },
        credentials: 'include'  // 明确指定携带cookies
    });
    return await response.json();
}
async function fetchRestPageData() {
    const finalUrl = 'https:' + firstPageUrl;
    const response = await fetch(finalUrl, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
            'origin': 'https://www.bilibili.com'
        },
        credentials: 'include'  // 明确指定携带cookies
    });
    return await response.json();
}
/* 新窗口自动化操作 */
function checkUrlAndExecute(customFunction, targetUrl) {
    // 获取当前页面的完整URL
    const currentUrl = window.location.href;
    // 检查当前URL是否与目标URL相等
    if (currentUrl === targetUrl) {
        // 如果URL匹配，则执行自定义函数
        customFunction();
    }
}
function addPanel(){
    function genButton(text, foo, id, fooParams = {}){
        let b = document.createElement('button');
        b.textContent = text;
        b.style.verticalAlign = 'inherit';
        // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
        b.addEventListener('click', () => {
            foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
        });
        if(id){ b.id = id };
        return b;
    }
    function changeRangeDynamics() {
        const value = parseInt(this.value, 10);
        const roundedValue = Math.ceil(value / 10) * 10;
    
        targetAmountGlobal = roundedValue;
        // 只能通过 DOM 方法改变
        document.querySelector('#swal-range > output').textContent = roundedValue;
    }
    async function openPanelFunc(){
        isLoadEnd = false;
        //重置值
        targetAmountGlobal = 100;
        var swalRangeValue = 100;
        let checkInterval;
        const { value: formValues } = await Swal.fire({
            title: "Customization",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            //class="swal2-range" swalalert框架可能会对其有特殊处理，导致其内标签的id声明失效
            html: `
              <input id="swal-input1" placeholder='正则表达式过滤' class="swal2-input">
              <div class="swal2-range" id="swal-range" style="display: flex;">
                <input type="range" min="0" max="500" step="10" value="100">
                <output>${swalRangeValue}</output>
              </div>
              <div class="swal2-radio">
                <input type="radio" id="option1" name="options" value="option1" checked>
                <label for="option1"><span class="swal2-label" checked>热门评论</span></label>
                <input type="radio" id="option2" name="options" value="option2">
                <label for="option2"><span class="swal2-label">评论IP</span></label>
              </div>
              <select id="swal2-select" class="swal2-select">
                <option value="" disabled="">选择分本分析引擎</option>
                <option value="wordcloudOnline">Wordcloud Online</option>
                <option value="lzlTool">LZL工具</option>
                <option value="lingJoin">NLPIR演示平台</option>
                <optgroup label="wenpipi">
                  <option value="fenxi">文本分析</option>
                  <option value="zihua">字画</option>
                  <option value="comment">差评分析</option>
                  <option value="esse">文章摘要</option>
                </optgroup>
              </select>
            `,
            footer: `<span style="color:#6a60547a">当前评论总数:${allCountPageData}</span>`,
            focusConfirm: false,
            didOpen: () => {
                //重置状态
                commentManager = new CommentManager();
                const swalRange = document.querySelector('#swal-range input');
                swalRange.addEventListener('input', changeRangeDynamics);
                document.querySelector('.swal2-radio > input[type=radio]:nth-child(1)').checked = true;
            },
            willClose: () => {
                // 在关闭前清除事件监听器以防止内存泄漏
                const swalRange = document.querySelector('#swal-range input');
                swalRange.removeEventListener('input', changeRangeDynamics);
            },
            preConfirm: () => {
                checkInterval = setInterval(() => {
                    if (isLoadEnd) {
                        // 如果 isLoadEnd 为 true，停止定时器并隐藏加载弹窗
                        clearInterval(checkInterval);//无法正常关闭定时器
                        Swal.hideLoading();
                        Swal.close(); // 关闭弹窗
                    }
                }, 200);
                return [
                    document.getElementById("swal-input1").value,
                    targetAmountGlobal,
                    document.querySelector('.swal2-radio>input[name="options"]:checked').value,
                    document.querySelector('.swal2-select').value
                ];
            }
        });
        if (formValues) {
            // Swal.fire(JSON.stringify(formValues));
            regexGlobal = formValues[0];
            targetAmountGlobal = formValues[1];
            optionGlobal = formValues[2];
            wordcloudOption = formValues[3];
            Swal.fire({
                title: '(๑¯ω¯๑)抓取中...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    // 确保在关闭弹窗时清除定时器
                    clearInterval(checkInterval);
                }
            });
            pageDataHandle(firstPageData, optionGlobal, targetAmountGlobal);
            generateFinalCommentManger();
        }
    }

    let myButton = genButton('comment', openPanelFunc, 'myButton');
    document.body.appendChild(myButton);

    tippy('#myButton', {
        content: '⁙ὸ‿ό⁙',
        placement: 'bottom', 
        delay: [500, 0],//延迟出现500，消失0
        duration: 300,
        arrow: true,
    });

    var css_text =`
        #myButton {
            position: fixed;
            top: 50%;
            left: -20px;/* 初始状态下左半部分隐藏 */
            transform: translateY(-50%);
            z-index: 1000; /* 确保按钮在最前面 */
            padding: 10px 24px;
            border-radius: 5px;
            cursor: pointer;
            border: 0;
            background-color: white;
            box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 9px;
            transition: all 0.5s ease;
        }
        #myButton:hover {
            left: 0%; /* 鼠标悬停时完整显示 */
            letter-spacing: 3px;
            background-color: hsl(261deg 80% 48%);
            color: hsl(0, 0%, 100%);
            box-shadow: rgb(93 24 220) 0px 7px 29px 0px;
        }
        #myButton:active {
            letter-spacing: 3px;
            background-color: hsl(261deg 80% 48%);
            color: hsl(0, 0%, 100%);
            box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
            transition: 100ms;
        }
    `
    GMaddStyle(css_text);
}
/** 弹出居中窗口 */
function popupCenter(url, title = '_blank', w, h) {
    // 检查参数有效性
    if (!url || typeof url !== 'string') {
        console.error('Invalid URL provided');
        return null;
    }

    // 设置默认标题和窗口尺寸
    title = title || '_blank';
    w = Math.min(w, screen.availWidth);
    h = Math.min(h, screen.availHeight);

    // 计算居中位置
    let x = (screen.availWidth - w) / 2;
    let y = (screen.availHeight - h) / 2;

    // 确保窗口不会超出屏幕边界
    x = Math.max(x, 0);
    y = Math.max(y, 0);

    // 打开新窗口
    let win;
    try {
        win = window.open(url, title, `width=${w},height=${h},left=${x},top=${y}`);
        if (win) {
            win.focus();
            // let closeNewWindow =  window.addEventListener('focus', function() {
            //     win.close();
            //     window.removeEventListener('focus', closeNewWindow);
            // });
        } else {
            throw new Error('Failed to open the window');
        }
    } catch (e) {
        console.error('Error opening the window:', e);
    }

    return win;
}
function GMaddStyle(css){
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
}
/* 补环境 */
const t_stringToBytes = function (e) {
    return n_stringToBytes(unescape(encodeURIComponent(e)))
};
const n_stringToBytes = function (e) {
    for (var t = [], r = 0; r < e.length; r++)
        t.push(255 & e.charCodeAt(r));
    return t
};
const e_bytesToWords = function (e) {
    for (var t = [], r = 0, n = 0; r < e.length; r++,
        n += 8)
        t[n >>> 5] |= e[r] << 24 - n % 32;
    return t
};
const o_ff = function (e, t, r, n, o, i, a) {
    var u = e + (t & r | ~t & n) + (o >>> 0) + a;
    return (u << i | u >>> 32 - i) + t
};
const o_gg = function (e, t, r, n, o, i, a) {
    var u = e + (t & n | r & ~n) + (o >>> 0) + a;
    return (u << i | u >>> 32 - i) + t
};
const o_hh = function (e, t, r, n, o, i, a) {
    var u = e + (t ^ r ^ n) + (o >>> 0) + a;
    return (u << i | u >>> 32 - i) + t
};
const o_ii = function (e, t, r, n, o, i, a) {
    var u = e + (r ^ (t | ~n)) + (o >>> 0) + a;
    return (u << i | u >>> 32 - i) + t
};
const t_rotl = function (e, t) {
    return e << t | e >>> 32 - t
};
const e_endian = function (e) {
    if (e.constructor == Number)
        return 16711935 & t_rotl(e, 8) | 4278255360 & t_rotl(e, 24);
    for (var r = 0; r < e.length; r++)
        e[r] = e_endian(e[r]);
    return e
};
const o = function o(i, a) {
    i.constructor == String ? i = a && "binary" === a.encoding ? n_stringToBytes(i) : t_stringToBytes(i) : r(i) ? i = Array.prototype.slice.call(i, 0) : Array.isArray(i) || i.constructor === Uint8Array || (i = i.toString());
    for (var u = e_bytesToWords(i), s = 8 * i.length, c = 1732584193, l = -271733879, f = -1732584194, d = 271733878, p = 0; p < u.length; p++)
        u[p] = 16711935 & (u[p] << 8 | u[p] >>> 24) | 4278255360 & (u[p] << 24 | u[p] >>> 8);
    u[s >>> 5] |= 128 << s % 32,
        u[14 + (s + 64 >>> 9 << 4)] = s;
    var h = o_ff
        , y = o_gg
        , v = o_hh
        , b = o_ii;
    for (p = 0; p < u.length; p += 16) {
        var m = c
            , w = l
            , g = f
            , x = d;
        c = h(c, l, f, d, u[p + 0], 7, -680876936),
            d = h(d, c, l, f, u[p + 1], 12, -389564586),
            f = h(f, d, c, l, u[p + 2], 17, 606105819),
            l = h(l, f, d, c, u[p + 3], 22, -1044525330),
            c = h(c, l, f, d, u[p + 4], 7, -176418897),
            d = h(d, c, l, f, u[p + 5], 12, 1200080426),
            f = h(f, d, c, l, u[p + 6], 17, -1473231341),
            l = h(l, f, d, c, u[p + 7], 22, -45705983),
            c = h(c, l, f, d, u[p + 8], 7, 1770035416),
            d = h(d, c, l, f, u[p + 9], 12, -1958414417),
            f = h(f, d, c, l, u[p + 10], 17, -42063),
            l = h(l, f, d, c, u[p + 11], 22, -1990404162),
            c = h(c, l, f, d, u[p + 12], 7, 1804603682),
            d = h(d, c, l, f, u[p + 13], 12, -40341101),
            f = h(f, d, c, l, u[p + 14], 17, -1502002290),
            c = y(c, l = h(l, f, d, c, u[p + 15], 22, 1236535329), f, d, u[p + 1], 5, -165796510),
            d = y(d, c, l, f, u[p + 6], 9, -1069501632),
            f = y(f, d, c, l, u[p + 11], 14, 643717713),
            l = y(l, f, d, c, u[p + 0], 20, -373897302),
            c = y(c, l, f, d, u[p + 5], 5, -701558691),
            d = y(d, c, l, f, u[p + 10], 9, 38016083),
            f = y(f, d, c, l, u[p + 15], 14, -660478335),
            l = y(l, f, d, c, u[p + 4], 20, -405537848),
            c = y(c, l, f, d, u[p + 9], 5, 568446438),
            d = y(d, c, l, f, u[p + 14], 9, -1019803690),
            f = y(f, d, c, l, u[p + 3], 14, -187363961),
            l = y(l, f, d, c, u[p + 8], 20, 1163531501),
            c = y(c, l, f, d, u[p + 13], 5, -1444681467),
            d = y(d, c, l, f, u[p + 2], 9, -51403784),
            f = y(f, d, c, l, u[p + 7], 14, 1735328473),
            c = v(c, l = y(l, f, d, c, u[p + 12], 20, -1926607734), f, d, u[p + 5], 4, -378558),
            d = v(d, c, l, f, u[p + 8], 11, -2022574463),
            f = v(f, d, c, l, u[p + 11], 16, 1839030562),
            l = v(l, f, d, c, u[p + 14], 23, -35309556),
            c = v(c, l, f, d, u[p + 1], 4, -1530992060),
            d = v(d, c, l, f, u[p + 4], 11, 1272893353),
            f = v(f, d, c, l, u[p + 7], 16, -155497632),
            l = v(l, f, d, c, u[p + 10], 23, -1094730640),
            c = v(c, l, f, d, u[p + 13], 4, 681279174),
            d = v(d, c, l, f, u[p + 0], 11, -358537222),
            f = v(f, d, c, l, u[p + 3], 16, -722521979),
            l = v(l, f, d, c, u[p + 6], 23, 76029189),
            c = v(c, l, f, d, u[p + 9], 4, -640364487),
            d = v(d, c, l, f, u[p + 12], 11, -421815835),
            f = v(f, d, c, l, u[p + 15], 16, 530742520),
            c = b(c, l = v(l, f, d, c, u[p + 2], 23, -995338651), f, d, u[p + 0], 6, -198630844),
            d = b(d, c, l, f, u[p + 7], 10, 1126891415),
            f = b(f, d, c, l, u[p + 14], 15, -1416354905),
            l = b(l, f, d, c, u[p + 5], 21, -57434055),
            c = b(c, l, f, d, u[p + 12], 6, 1700485571),
            d = b(d, c, l, f, u[p + 3], 10, -1894986606),
            f = b(f, d, c, l, u[p + 10], 15, -1051523),
            l = b(l, f, d, c, u[p + 1], 21, -2054922799),
            c = b(c, l, f, d, u[p + 8], 6, 1873313359),
            d = b(d, c, l, f, u[p + 15], 10, -30611744),
            f = b(f, d, c, l, u[p + 6], 15, -1560198380),
            l = b(l, f, d, c, u[p + 13], 21, 1309151649),
            c = b(c, l, f, d, u[p + 4], 6, -145523070),
            d = b(d, c, l, f, u[p + 11], 10, -1120210379),
            f = b(f, d, c, l, u[p + 2], 15, 718787259),
            l = b(l, f, d, c, u[p + 9], 21, -343485551),
            c = c + m >>> 0,
            l = l + w >>> 0,
            f = f + g >>> 0,
            d = d + x >>> 0
    }
    return e_endian([c, l, f, d])
};
function ft(e) {
    return e.substring(e.lastIndexOf("/") + 1, e.length).split(".")[0]
};
const e_wordsToBytes = function (e) {
    for (var t = [], r = 0; r < 32 * e.length; r += 8)
        t.push(e[r >>> 5] >>> 24 - r % 32 & 255);
    return t
};
const e_bytesToHex = function (e) {
    for (var t = [], r = 0; r < e.length; r++)
        t.push((e[r] >>> 4).toString(16)),
            t.push((15 & e[r]).toString(16));
    return t.join("")
};
const at = function (t, r) {
    if (null == t)
        throw new Error("Illegal argument " + t);
    var i = e_wordsToBytes(o(t, r));
    return r && r.asBytes ? i : r && r.asString ? n.bytesToString(i) : e_bytesToHex(i)
};
function lt(e) {
    var t, r, n = function (e) {
        var t;
        if (e.useAssignKey)
            return {
                imgKey: e.wbiImgKey,
                subKey: e.wbiSubKey
            };
        var r = (null === (t = function (e) {
            try {
                return localStorage.getItem(e)
            } catch (e) {
                return null
            }
        }(ct)) || void 0 === t ? void 0 : t.split("-")) || []
            , n = r[0]
            , o = r[1]
            , i = n ? ft(n) : e.wbiImgKey
            , a = o ? ft(o) : e.wbiSubKey;
        return {
            imgKey: i,
            subKey: a
        }
    }(arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
        wbiImgKey: "",
        wbiSubKey: ""
    }), o = n.imgKey, i = n.subKey;
    if (o && i) {
        for (var a = (t = o + i,
            r = [],
            [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52].forEach((function (e) {
                t.charAt(e) && r.push(t.charAt(e))
            }
            )),
            r.join("").slice(0, 32)), u = Math.round(Date.now() / 1e3), s = Object.assign({}, e, {
                wts: u
            }), c = Object.keys(s).sort(), l = [], f = /[!'()*]/g, d = 0; d < c.length; d++) {
            var p = c[d]
                , h = s[p];
            h && "string" == typeof h && (h = h.replace(f, "")),
                null != h && l.push("".concat(encodeURIComponent(p), "=").concat(encodeURIComponent(h)))
        }
        var y = l.join("&");
        return {
            w_rid: at(y + a),
            wts: u.toString()
        }
    }
    return null
};