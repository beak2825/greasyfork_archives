// ==UserScript==
// @name         pc闲鱼搜索结果监控
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  闲鱼搜索页:有新商品用xxtui通知
// @author       t.k
// @match        *://www.goofish.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540589/pc%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/540589/pc%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 过滤请求
    function addAJAXFilter(targetUrl, interfaceUrl, callback) {
        if (location.href.indexOf(targetUrl) > -1) {
            (function (open) {
                XMLHttpRequest.prototype.open = function () {
                    if (arguments[1].indexOf(interfaceUrl) > -1) {
                        this.addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                                const log = callback(this.response);
                                // 如需要公共逻辑处理log，在这写。如：复制到剪贴板
                            }
                        }, false);
                    }
                    open.apply(this, arguments);
                };
            })(XMLHttpRequest.prototype.open);
        }
    }

    let intervalId = null;

    /*** 参数，可自行配置 ***/
    // 过滤这些卖家id
    let filterSellers = JSON.parse(GM_getValue('xfy_filter_sellers') || '["1,2,3..."]');
    // xx推/钉钉/bark等webhook key
    let xxtuiKey = GM_getValue('xfy_xxtui_key') || '';
    // 轮询时间，秒
    let refreshInterval = +(GM_getValue('xfy_refresh_interval') || 30);
    let running = GM_getValue('xfy_running') === '1';
    let lastPublishedTime = +(GM_getValue('xfy_last_published_time') || 30);


    /*** 工具函数 ***/
    function saveSetting() {
        GM_setValue('xfy_filter_sellers', JSON.stringify(filterSellers));
        GM_setValue('xfy_xxtui_key', xxtuiKey);
        GM_setValue('xfy_refresh_interval', String(refreshInterval));
    }

    // 通知函数 使用xxtui.com，在界面填写xxtui的api_key即可
    function sendNotice(title, msg) {
        if (!xxtuiKey) {
            console.log("xxtui_key 为空，不推送")
            return;
        }
        fetch(`https://www.xxtui.com/xxtui/${xxtuiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: "闲鱼新商品监控",
                title: title,
                content: msg
            })
        });
    }


    // 简单UI
    function createPanel() {
        const panel = document.createElement('div');
        panel.style = `z-index:99999;position:fixed;top:30px;right:30px;width:320px;background:#fff;padding:8px 12px;border:1px solid #bbb;box-shadow:2px 2px 10px #ccc;font-size:13px;color:#333`;
        panel.innerHTML = `
            <b>闲鱼自动监控</b><br>
            过滤卖家id:
            <input id="xfy_ids" style="width:220px" value="${filterSellers.join(',')}"><br>
            通知key:
            <input id="xfy_ntf" style="width:220px" value="${xxtuiKey}" placeholder="访问xxtui.com获取"><br>
            刷新间隔(秒):
            <input id="xfy_ivl" type="number" style="width:60px" value="${refreshInterval}"><br>
            <button id="xfy_save">保存修改</button>
            <button id="xfy_run">开始</button>
            <button id="xfy_stop" style="display:none;">停止</button>
        `;
        document.body.appendChild(panel);
        panel.querySelector('#xfy_run').style.display = running ? 'none' : '';
        panel.querySelector('#xfy_stop').style.display = running ? '' : 'none';

        panel.querySelector('#xfy_save').onclick = () => {
            filterSellers = panel.querySelector('#xfy_ids').value.split(',').map(v => v.trim()).filter(Boolean);
            xxtuiKey = panel.querySelector('#xfy_ntf').value.trim();
            refreshInterval = +panel.querySelector('#xfy_ivl').value || 30;
            if(refreshInterval <= 5) refreshInterval = 5;
            saveSetting();
            alert('设置已保存');
        };
        panel.querySelector('#xfy_run').onclick = () => {
            if (!intervalId) {
                sendNotice("信息", "程序已开始运行 - 手动开始");
                running = true;
                GM_setValue('xfy_running', '1');
                run();
                panel.querySelector('#xfy_run').style.display = 'none';
                panel.querySelector('#xfy_stop').style.display = '';
            }
        };
        panel.querySelector('#xfy_stop').onclick = () => {
            if (intervalId) {
                clearInterval(intervalId);
                sendNotice("信息", "程序已结束运行 - 手动结束");
                console.log("程序已结束运行 - 手动结束")
                intervalId = null;
                running = false;
                GM_setValue('xfy_running', '0');
                panel.querySelector('#xfy_run').style.display = '';
                panel.querySelector('#xfy_stop').style.display = 'none';
            }
        };
    }

    // 主体逻辑
    const seenIds = new Set(JSON.parse(localStorage.getItem('xfy_seen_ids') || '[]')); // 避免重复通知
    function reloadPage() {
        // 刷新页面
        console.log("刷新页面")
        unsafeWindow.location.reload();
    }

    // 添加请求拦截事件
    let xy_resp;
    function addSearchUrlFilter(){
        function callback(resp){
            xy_resp = resp;
        }
        addAJAXFilter("https://www.goofish.com/search","h5api.m.goofish.com/h5/mtop.taobao.idlemtopsearch.pc.search/1.0",callback)
    }

    function run(){
        console.log("执行逻辑 - 点击最新");
        // 点击最新
        const el = document.querySelector("#content > div.search-container--eigqxPi6 > div.search-filter-up-container--IKSFALsr > div.search-filter-select-container--aC4t18zS > div:nth-child(3) > div.search-select-items-container--pWk5bY4P > div:nth-child(1)")
        if (!el){
            console.log("执行逻辑 - 没有找到可点击的标签");
            return;
        }
        el.click();
        console.log("执行逻辑 - 2秒后分析接口数据");
        setTimeout(function(){
            if (!xy_resp){
                sendNotice("异常信息", "xy_resp为空，请检查");
                return;
            }
            const json = JSON.parse(xy_resp)
            try {
                const data = json.data;
                if (!data){
                    sendNotice("异常信息", "data节点为空，请检查");
                    return;
                }
                const list = data.resultList;
                if (!data){
                    sendNotice("异常信息", "list节点为空，请检查");
                    return;
                }
                let notifyMessage = ""; // 通知文本拼接容器

                let _lastPublishTime = lastPublishedTime;
                let noticeCount = 0;

                for (let i = 0; i < list.length; i++) {
                    const item = list[i].data.item.main;

                    // 获取关键信息
                    const publishTime = Number(item.clickParam.args.publishTime); // 毫秒时间戳
                    const itemId = item.clickParam.args.id;
                    const price = item.clickParam.args.price;
                    const seller = item.exContent.userNickName;
                    const title = item.exContent.title;
                    const utParams = item.clickParam.args.serviceUtParams;
                    const url = "https://www.goofish.com/item?id=" + itemId;

                    // 过滤黑名单卖家
                    if (filterSellers.includes(seller)) {
                        continue;
                    }

                    // 解析 serviceUtParams 标签
                    let tags = "";
                    try {
                        const raw = item.clickParam.args.serviceUtParams;
                        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
                        tags = parsed.map(t => t.args?.content).filter(Boolean).join(" / ");
                    } catch (tagErr) {
                        tags = "标签解析失败";
                    }

                    // 判断是否为新商品
                    if (publishTime > _lastPublishTime) {
                        // 拼接信息（可以美化）
                        if (noticeCount++ <= 5){
                            notifyMessage += `🆕 新商品：${title}\n标签：${tags}\n价格：¥${price}\n卖家：${seller}\n商品ID：${itemId}\n发布时间：${new Date(publishTime).toLocaleString()} [去看看](${url})\n\n`;
                        }

                        // 更新记录的最新时间
                        if (publishTime > lastPublishedTime) {
                            lastPublishedTime = publishTime;
                            GM_setValue('xfy_last_published_time',lastPublishedTime)
                        }
                    }
                }

                // 有新消息就通知
                if (notifyMessage) {
                    console.log("🚨 检测到新商品，详情如下：\n" + notifyMessage);
                    sendNotice("新商品发布", notifyMessage)
                } else {
                    console.log("执行逻辑 - 没有发现新商品")
                }

            } catch (err) {
                console.log("执行逻辑 - 遇到异常");

                let errMsg = "";
                if (err instanceof Error) {
                    errMsg = `错误名称: ${err.name}\n错误信息: ${err.message}\n堆栈信息:\n${err.stack}`;
                } else {
                    errMsg = `未知错误: ${JSON.stringify(err)}`;
                }

                sendNotice("异常信息", errMsg);
            }

            if (running){
                console.log("执行逻辑 - 注册刷新事件");
                intervalId = setInterval(reloadPage, refreshInterval * 1000);
            }else{
                console.log("执行逻辑 - 程序不在运行状态，不再注册刷新事件");
            }
        }, 2000);
    }

    /*** 自动运行 ***/
    // 加载面板
    createPanel();
    addSearchUrlFilter();
    // 检测是否正在运行
    if (running) {
        console.log("程序正在运行 - 2秒后执行逻辑");
        setTimeout(run, 2000);
    }


})();
