// ==UserScript==
// @license      MIT
// @name         Link Validity Checker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  增强版链接检测器：强制样式应用，改进DOM选择，支持表格内外所有链接的标记
// @author       Axin & gemini 2.5 pro & Claude
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/534338/Link%20Validity%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/534338/Link%20Validity%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const CHECK_TIMEOUT = 7000;
    const CONCURRENT_CHECKS = 5;
    const MAX_RETRIES = 1;
    const RETRY_DELAY = 500;
    const BROKEN_LINK_CLASS = 'link-checker-broken';
    const CHECKED_LINK_CLASS = 'link-checker-checked';

    // --- 内联 Toastify JS ---
    const Toastify = (function(t){
        var o = function(t){return new o.lib.init(t)};
        function i(t,o){return o.offset[t]?isNaN(o.offset[t])?o.offset[t]:o.offset[t]+"px":"0px"}
        function s(t,o){return!(!t||"string"!=typeof o)&&!!(t.className&&t.className.trim().split(/\s+/gi).indexOf(o)>-1)}
        return o.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},o.lib=o.prototype={toastify:"1.12.0",constructor:o,init:function(t){return t||(t={}),this.options={},this.toastElement=null,this.options.text=t.text||o.defaults.text,this.options.node=t.node||o.defaults.node,this.options.duration=0===t.duration?0:t.duration||o.defaults.duration,this.options.selector=t.selector||o.defaults.selector,this.options.callback=t.callback||o.defaults.callback,this.options.destination=t.destination||o.defaults.destination,this.options.newWindow=t.newWindow||o.defaults.newWindow,this.options.close=t.close||o.defaults.close,this.options.gravity="bottom"===t.gravity?"toastify-bottom":o.defaults.gravity,this.options.positionLeft=t.positionLeft||o.defaults.positionLeft,this.options.position=t.position||o.defaults.position,this.options.backgroundColor=t.backgroundColor||o.defaults.backgroundColor,this.options.avatar=t.avatar||o.defaults.avatar,this.options.className=t.className||o.defaults.className,this.options.stopOnFocus=void 0===t.stopOnFocus?o.defaults.stopOnFocus:t.stopOnFocus,this.options.onClick=t.onClick||o.defaults.onClick,this.options.offset=t.offset||o.defaults.offset,this.options.escapeMarkup=void 0!==t.escapeMarkup?t.escapeMarkup:o.defaults.escapeMarkup,this.options.ariaLive=t.ariaLive||o.defaults.ariaLive,this.options.style=t.style||o.defaults.style,t.backgroundColor&&(this.options.style.background=t.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var t=document.createElement("div");for(var o in t.className="toastify on "+this.options.className,this.options.position?t.className+=" toastify-"+this.options.position:!0===this.options.positionLeft?(t.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):t.className+=" toastify-right",t.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.'),this.options.style)t.style[o]=this.options.style[o];if(this.options.ariaLive&&t.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)t.appendChild(this.options.node);else if(this.options.escapeMarkup?t.innerText=this.options.text:t.innerHTML=this.options.text,""!==this.options.avatar){var s=document.createElement("img");s.src=this.options.avatar,s.className="toastify-avatar","left"==this.options.position||!0===this.options.positionLeft?t.appendChild(s):t.insertAdjacentElement("afterbegin",s)}if(!0===this.options.close){var e=document.createElement("button");e.type="button",e.setAttribute("aria-label","Close"),e.className="toast-close",e.innerHTML="&#10006;",e.addEventListener("click",function(t){t.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}.bind(this));var n=window.innerWidth>0?window.innerWidth:screen.width;("left"==this.options.position||!0===this.options.positionLeft)&&n>360?t.insertAdjacentElement("afterbegin",e):t.appendChild(e)}if(this.options.stopOnFocus&&this.options.duration>0){var a=this;t.addEventListener("mouseover",(function(o){window.clearTimeout(t.timeOutValue)})),t.addEventListener("mouseleave",(function(){t.timeOutValue=window.setTimeout((function(){a.removeElement(t)}),a.options.duration)}))}if(void 0!==this.options.destination&&t.addEventListener("click",function(t){t.stopPropagation(),!0===this.options.newWindow?window.open(this.options.destination,"_blank"):window.location=this.options.destination}.bind(this)),"function"==typeof this.options.onClick&&void 0===this.options.destination&&t.addEventListener("click",function(t){t.stopPropagation(),this.options.onClick()}.bind(this)),"object"==typeof this.options.offset){var l=i("x",this.options),r=i("y",this.options),p="left"==this.options.position?l:"-"+l,d="toastify-top"==this.options.gravity?r:"-"+r;t.style.transform="translate("+p+","+d+")"}return t},showToast:function(){var t;if(this.toastElement=this.buildToast(),!(t="string"==typeof this.options.selector?document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||"undefined"!=typeof ShadowRoot&&this.options.selector instanceof ShadowRoot?this.options.selector:document.body))throw"Root element is not defined";var i=o.defaults.oldestFirst?t.firstChild:t.lastChild;return t.insertBefore(this.toastElement,i),o.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout(function(){this.removeElement(this.toastElement)}.bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(t){t.className=t.className.replace(" on",""),window.setTimeout(function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),t.parentNode&&t.parentNode.removeChild(t),this.options.callback.call(t),o.reposition()}.bind(this),400)}},o.reposition=function(){for(var t,o={top:15,bottom:15},i={top:15,bottom:15},e={top:15,bottom:15},n=document.getElementsByClassName("toastify"),a=0;a<n.length;a++){t=!0===s(n[a],"toastify-top")?"toastify-top":"toastify-bottom";var l=n[a].offsetHeight;t=t.substr(9,t.length-1);(window.innerWidth>0?window.innerWidth:screen.width)<=360?(n[a].style[t]=e[t]+"px",e[t]+=l+15):!0===s(n[a],"toastify-left")?(n[a].style[t]=o[t]+"px",o[t]+=l+15):(n[a].style[t]=i[t]+"px",i[t]+=l+15)}return this},o.lib.init.prototype=o.lib,o
    })();

    // --- 内联 Toastify CSS ---
    const toastifyCSS = `.toastify{padding:12px 20px;color:#fff;display:inline-block;box-shadow:0 3px 6px -1px rgba(0,0,0,.12),0 10px 36px -4px rgba(77,96,232,.3);background:-webkit-linear-gradient(315deg,#73a5ff,#5477f5);background:linear-gradient(135deg,#73a5ff,#5477f5);position:fixed;opacity:0;transition:all .4s cubic-bezier(.215, .61, .355, 1);border-radius:2px;cursor:pointer;text-decoration:none;max-width:calc(50% - 20px);z-index:2147483647}.toastify.on{opacity:1}.toast-close{background:0 0;border:0;color:#fff;cursor:pointer;font-family:inherit;font-size:1em;opacity:.4;padding:0 5px}.toastify-right{right:15px}.toastify-left{left:15px}.toastify-top{top:-150px}.toastify-bottom{bottom:-150px}.toastify-rounded{border-radius:25px}.toastify-avatar{width:1.5em;height:1.5em;margin:-7px 5px;border-radius:2px}.toastify-center{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content;max-width:-moz-fit-content}@media only screen and (max-width:360px){.toastify-left,.toastify-right{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content}}`;
    GM_addStyle(toastifyCSS);

    // 增强CSS规则，使用更高优先级确保样式应用，但移除叉号标记
    GM_addStyle(`
        .toastify.on.toastify-center { margin-left: auto; margin-right: auto; transform: translateX(0); }

        /* 强化样式应用 - 使用更高特异性选择器和!important，仅保留红色和删除线 */
        a.${BROKEN_LINK_CLASS},
        table a.${BROKEN_LINK_CLASS},
        div a.${BROKEN_LINK_CLASS},
        span a.${BROKEN_LINK_CLASS},
        li a.${BROKEN_LINK_CLASS},
        td a.${BROKEN_LINK_CLASS},
        th a.${BROKEN_LINK_CLASS},
        *[class] a.${BROKEN_LINK_CLASS},
        *[id] a.${BROKEN_LINK_CLASS} {
            color: red !important;
            text-decoration: line-through !important;
            background-color: rgba(255,200,200,0.2) !important;
            padding: 0 2px !important;
            border-radius: 2px !important;
        }

        #linkCheckerButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            line-height: 60px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: background-color 0.3s, transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #linkCheckerButton:hover {
            background-color: #0056b3;
            transform: scale(1.1);
        }

        #linkCheckerButton:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            transform: none;
        }
    `);

    // --- 全局状态 ---
    let isChecking = false;
    let totalLinks = 0;
    let checkedLinks = 0;
    let brokenLinksCount = 0;
    let linkQueue = [];
    let activeChecks = 0;
    let brokenLinkDetailsForConsole = [];

    // --- 创建按钮 ---
    const button = document.createElement('button');
    button.id = 'linkCheckerButton';
    button.innerHTML = '🔗';
    button.title = '点击开始检测页面链接';
    document.body.appendChild(button);

    // --- 工具函数 ---
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function showToast(text, type = 'info', duration = 3000) {
        let backgroundColor;
        switch (type) {
            case 'success':
                backgroundColor = "linear-gradient(to right, #00b09b, #96c93d)";
                break;
            case 'error':
                backgroundColor = "linear-gradient(to right, #ff5f6d, #ffc371)";
                break;
            case 'warning':
                backgroundColor = "linear-gradient(to right, #f7b733, #fc4a1a)";
                break;
            default:
                backgroundColor = "#0dcaf0";
        }
        Toastify({
            text: text,
            duration: duration,
            gravity: "bottom",
            position: "center",
            style: { background: backgroundColor },
            stopOnFocus: true
        }).showToast();
    }

    // --- 强制应用样式函数 (简化为仅应用红色和删除线) ---
    function forceApplyBrokenStyle(element) {
        // 确保样式被应用，通过直接操作DOM元素的style属性，但不添加叉号图标
        element.style.setProperty('color', 'red', 'important');
        element.style.setProperty('text-decoration', 'line-through', 'important');
        element.style.setProperty('background-color', 'rgba(255,200,200,0.2)', 'important');
    }

    // --- 核心链接检测函数 (处理405、404，带重试) ---
    async function checkLink(linkElement, retryCount = 0) {
        const url = linkElement.href;

        // 初始过滤和标记 (仅在第一次尝试时)
        if (retryCount === 0) {
            if (!url || !url.startsWith('http')) {
                return { element: linkElement, status: 'skipped', url: url, message: '非HTTP(S)链接' };
            }
            // 不添加CSS类，避免改变正常链接外观
        }

        // --- 内部函数：执行实际的 HTTP 请求 ---
        const doRequest = (method) => {
            return new Promise((resolveRequest) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    timeout: CHECK_TIMEOUT,
                    onload: function(response) {
                        // 如果是 HEAD 且返回 405 或 404 或 403，则尝试 GET
                        if (method === 'HEAD' && (response.status === 405 || response.status === 404 || response.status === 403 || (response.status >= 500 && response.status < 600))) {
                            console.log(`[链接检测] HEAD 收到 ${response.status}: ${url}, 尝试使用 GET...`);
                            resolveRequest({ status: 'retry_with_get' });
                            return; // 不再处理此 onload
                        }

                        // 其他情况，根据状态码判断
                        if (response.status >= 200 && response.status < 400) {
                            resolveRequest({ status: 'ok', statusCode: response.status, message: `方法 ${method}` });
                        } else {
                            resolveRequest({ status: 'broken', statusCode: response.status, message: `方法 ${method} 错误 (${response.status})` });
                        }
                    },
                    onerror: function(response) {
                        resolveRequest({ status: 'error', message: `网络错误 (${response.error || 'Unknown Error'}) using ${method}` });
                    },
                    ontimeout: function() {
                        resolveRequest({ status: 'timeout', message: `请求超时 using ${method}` });
                    }
                });
            });
        };

        // --- 主要逻辑：先尝试 HEAD，处理结果 ---
        let result = await doRequest('HEAD');

        // 如果 HEAD 失败 (网络错误或超时) 且可以重试
        if ((result.status === 'error' || result.status === 'timeout') && retryCount < MAX_RETRIES) {
            console.warn(`[链接检测] ${result.message}: ${url} (尝试 ${retryCount + 1}/${MAX_RETRIES}), 稍后重试 (HEAD)...`);
            await delay(RETRY_DELAY);
            return checkLink(linkElement, retryCount + 1); // 返回重试的 Promise
        }

        // 如果 HEAD 返回 405，则尝试 GET
        if (result.status === 'retry_with_get') {
            result = await doRequest('GET'); // 等待 GET 请求的结果

            // 如果 GET 失败 (网络错误或超时) 且可以重试
            if ((result.status === 'error' || result.status === 'timeout') && retryCount < MAX_RETRIES) {
                console.warn(`[链接检测] ${result.message}: ${url} (尝试 ${retryCount + 1}/${MAX_RETRIES}), 稍后重试 (GET)...`);
                await delay(RETRY_DELAY);
                // 直接标记为失败
                return { element: linkElement, status: 'broken', url: url, message: `${result.message} (GET 重试 ${MAX_RETRIES} 次后失败)` };
            }
        }

        // --- 返回最终结果 ---
        if (result.status === 'ok') {
            return { element: linkElement, status: 'ok', url: url, statusCode: result.statusCode, message: result.message };
        } else {
            // 所有其他情况都视为 broken
            return { element: linkElement, status: 'broken', url: url, statusCode: result.statusCode, message: result.message || '未知错误' };
        }
    }

    // --- 处理检测结果 ---
    function handleResult(result) {
        checkedLinks++;
        const reason = result.message || (result.statusCode ? `状态码 ${result.statusCode}` : '未知原因');

        if (result.status === 'broken') {
            brokenLinksCount++;
            brokenLinkDetailsForConsole.push({ url: result.url, reason: reason });

            // 使用CSS类和强制样式应用双重保障，但不添加叉号图标
            result.element.classList.add(BROKEN_LINK_CLASS);
            forceApplyBrokenStyle(result.element); // 强制应用样式

            result.element.title = `链接失效: ${reason}\nURL: ${result.url}`;
            console.warn(`[链接检测] 失效 (${reason}): ${result.url}`);
            showToast(`失效: ${result.url.substring(0,50)}... (${reason})`, 'error', 5000);
        } else if (result.status === 'ok') {
            console.log(`[链接检测] 正常 (${reason}, 状态码: ${result.statusCode}): ${result.url}`);
            if (result.element.title.startsWith('链接失效:')) {
                result.element.title = '';
            }
        } else if (result.status === 'skipped') {
            console.log(`[链接检测] 跳过 (${result.message}): ${result.url || '空链接'}`);
        }

        // 更新进度
        const progressText = `检测中: ${checkedLinks}/${totalLinks} (失效: ${brokenLinksCount})`;
        button.innerHTML = totalLinks > 0 ? `${Math.round((checkedLinks / totalLinks) * 100)}%` : '...';
        button.title = progressText;

        // 处理下一个
        activeChecks--;
        processQueue();

        // 检查完成
        if (checkedLinks === totalLinks) {
            finishCheck();
        }
    }

    // --- 队列处理 ---
    function processQueue() {
        while (activeChecks < CONCURRENT_CHECKS && linkQueue.length > 0) {
            activeChecks++;
            const linkElement = linkQueue.shift();
            checkLink(linkElement).then(handleResult); // 异步执行
        }
    }

    // --- 开始检测 ---
    function startCheck() {
        if (isChecking) return;
        isChecking = true;

        // 重置状态
        checkedLinks = 0;
        brokenLinksCount = 0;
        linkQueue = [];
        activeChecks = 0;
        brokenLinkDetailsForConsole = [];

        // 清理之前的标记
        document.querySelectorAll(`a.${BROKEN_LINK_CLASS}`).forEach(el => {
            el.classList.remove(BROKEN_LINK_CLASS);
            if (el.title.startsWith('链接失效:')) el.title = '';

            // 重置内联样式
            el.style.removeProperty('color');
            el.style.removeProperty('text-decoration');
            el.style.removeProperty('background-color');
        });

        button.disabled = true;
        button.innerHTML = '0%';
        button.title = '开始检测...';
        showToast('开始检测页面链接...', 'info');
        console.log('[链接检测] 开始...');

        // 使用更全面的选择器获取所有链接
        const links = document.querySelectorAll('a[href]');
        let validLinksFound = 0;

        links.forEach(link => {
            // 跳过锚链接或非HTTP协议
            if (!link.href || link.getAttribute('href').startsWith('#') || !link.protocol.startsWith('http')) return;

            // 加入队列
            linkQueue.push(link);
            validLinksFound++;
        });

        totalLinks = validLinksFound;

        if (totalLinks === 0) {
            showToast('页面上没有找到有效的 HTTP/HTTPS 链接。', 'warning');
            finishCheck();
            return;
        }

        showToast(`发现 ${totalLinks} 个有效链接，开始检测...`, 'info', 5000);
        button.title = `检测中: 0/${totalLinks} (失效: 0)`;
        processQueue();
    }

    // --- 结束检测 ---
    function finishCheck() {
        isChecking = false;
        button.disabled = false;
        button.innerHTML = '🔗';
        let summary = `检测完成！共 ${totalLinks} 个链接。`;

        if (brokenLinksCount > 0) {
            summary += ` ${brokenLinksCount} 个失效链接已在页面上用红色删除线标记。`;
            showToast(summary, 'error', 10000);
            console.warn("----------------------------------------");
            console.warn(`检测到 ${brokenLinksCount} 个失效链接 (详细原因):`);
            console.group("失效链接详细列表 (控制台)");
            brokenLinkDetailsForConsole.forEach(detail => console.warn(`- ${detail.url} (原因: ${detail.reason})`));
            console.groupEnd();
            console.warn("----------------------------------------");
        } else {
            summary += " 所有链接均可访问！";
            showToast(summary, 'success', 5000);
        }
        button.title = summary + '\n点击重新检测';
        console.log(`[链接检测] ${summary}`);
        activeChecks = 0;
    }

    // --- 为动态加载的链接增加观察器 ---
    function setupMutationObserver() {
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(mutations => {
            // 仅在非检测过程中处理
            if (!isChecking) return;

            // 处理DOM变化
            let newLinks = [];
            mutations.forEach(mutation => {
                // 对于添加的节点，查找其中的链接
                mutation.addedNodes.forEach(node => {
                    // 检查节点是否是元素节点
                    if (node.nodeType === 1) {
                        // 如果节点本身是链接
                        if (node.tagName === 'A' && node.href &&
                            !node.getAttribute('href').startsWith('#') &&
                            node.protocol.startsWith('http') &&
                            !node.classList.contains(BROKEN_LINK_CLASS)) {
                            newLinks.push(node);
                        }

                        // 或者包含链接
                        const childLinks = node.querySelectorAll('a[href]:not(.${BROKEN_LINK_CLASS})');
                        childLinks.forEach(link => {
                            if (link.href &&
                                !link.getAttribute('href').startsWith('#') &&
                                link.protocol.startsWith('http') &&
                                !link.classList.contains(BROKEN_LINK_CLASS)) {
                                newLinks.push(link);
                            }
                        });
                    }
                });
            });

            // 如果找到新链接，将它们加入检测队列
            if (newLinks.length > 0) {
                console.log(`[链接检测] 检测到 ${newLinks.length} 个新动态加载的链接，加入检测队列`);
                totalLinks += newLinks.length;
                newLinks.forEach(link => linkQueue.push(link));

                // 更新按钮显示
                button.title = `检测中: ${checkedLinks}/${totalLinks} (失效: ${brokenLinksCount})`;

                // 如果当前没有活跃检查，启动队列处理
                if (activeChecks === 0) {
                    processQueue();
                }
            }
        });

        // 配置观察选项
        const config = {
            childList: true,
            subtree: true
        };

        // 开始观察文档主体的所有变化
        observer.observe(document.body, config);

        return observer;
    }

    // --- 添加按钮事件 ---
    button.addEventListener('click', startCheck);

    // 初始化动态链接观察器
    const observer = setupMutationObserver();

    console.log('[链接检测器] 脚本已加载 (v1.5 仅红色删除线版)，点击右下角悬浮按钮开始检测。');

})();