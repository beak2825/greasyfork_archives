// ==UserScript==
// @name         2025国家智慧中小学-暑期研修(免费，秒刷)
// @namespace    智慧中小学
// @version      2.8.8
// @description  适用2025国家智慧教育平台
// @author       zzzzzzys
// @match        *://basic.smartedu.cn/*
// @match        *://core.teacher.vocational.smartedu.cn/*
// @require      https://scriptcat.org/lib/637/1.4.6/ajaxHooker.js#sha256=FBIJAmqSt3/bUHAiAFBFd2YvGHENrBQGfe1b4c+UBYs=
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @connect      basic.smartedu.cn
// @connect      x-study-record-api.ykt.eduyun.cn
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545141/2025%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6-%E6%9A%91%E6%9C%9F%E7%A0%94%E4%BF%AE%28%E5%85%8D%E8%B4%B9%EF%BC%8C%E7%A7%92%E5%88%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545141/2025%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6-%E6%9A%91%E6%9C%9F%E7%A0%94%E4%BF%AE%28%E5%85%8D%E8%B4%B9%EF%BC%8C%E7%A7%92%E5%88%B7%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 创建悬浮按钮
        createFloatingButtons();
        // 添加样式
        addStyles();
        // 初始化刷课功能
        initStudyFeatures();
    }

    // 创建悬浮按钮
    function createFloatingButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <div id="my1" class="button-3">即刻开刷(中小学)</div>
            <div id="my2" class="button-3">使用指南</div>
        `;
        document.body.appendChild(buttonContainer);

        // 绑定事件
        document.getElementById('my1').addEventListener('click', handlePrimarySchool);
        document.getElementById('my2').addEventListener('click', showGuideDialog);
    }

    // 添加样式
    function addStyles() {
        const style = `
            .button-3 {
                position: fixed;
                background-color: #ed5822;
                border: 1px solid rgba(27, 31, 35, .15);
                border-radius: 6px;
                box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
                color: #ffffff;
                cursor: pointer;
                font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                padding: 6px 16px;
                text-align: center;
                user-select: none;
                z-index: 2147483647;
                transition: transform 0.3s;
            }
            .button-3:hover {
                background-color: #2c974b;
                transform: scale(1.05);
            }
            .button-3:disabled {
                background-color: #94d3a2;
                cursor: default;
            }
            #my1 {
                left: 10px;
                top: 280px;
            }
            #my2 {
                left: 10px;
                top: 320px;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }

    // 全局变量
    let fullDatas = null;
    let isProcessing = false;

    // 请求对象配置
    const requestObj = {
        resourceLearningPositions: {
            url: "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/",
            method: "PUT"
        },
        progress: {
            url: "https://core.teacher.vocational.smartedu.cn/p/course/services/member/study/progress",
            method: "POST"
        }
    };

    // 处理中小学刷课
    async function handlePrimarySchool() {
        if (isProcessing) {
            Swal.fire({
                title: "操作进行中",
                text: "正在刷课中，请勿重复点击！",
                icon: "warning",
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "知道了"
            });
            return;
        }

        try {
            isProcessing = true;
            const button = document.getElementById('my1');
            button.disabled = true;
            button.textContent = "刷课进行中...";

            let resId = getResourceIdFromFullData();
            const allResults = [];

            if (resId && typeof resId === 'string') {
                await setProgress(requestObj.resourceLearningPositions.url + resId + '/' + getDynamicToken().token["user_id"], getVideoTime());
                allResults.push({name: '单个课程', status: 'success'});
            } else if (Array.isArray(resId) && resId.length > 0) {
                const results = await Promise.allSettled(resId.map(async (item) => {
                    try {
                        await setProgress(requestObj.resourceLearningPositions.url + item.resource_id + '/' + getDynamicToken().token["user_id"], item.studyTime);
                        return {name: item.name, status: 'success'};
                    } catch (e) {
                        console.error(`${item.name} 失败！`, e);
                        return {name: item.name, status: 'fail', error: e};
                    }
                }));

                results.forEach(r => {
                    if (r.status === 'fulfilled') {
                        allResults.push(r.value);
                    } else {
                        allResults.push(r.reason);
                    }
                });
            }

            // 显示结果
            Swal.fire({
                title: "刷课成功！",
                html: `
                    <div style="text-align: left; max-height: 20vh; overflow-y: auto;">
                        <p>总计：${allResults.filter(r => r.status === 'success').length} 成功 / ${allResults.filter(r => r.status === 'fail').length} 失败</p>
                        <hr>
                        <ul style="padding-left: 20px; list-style-type: none;">
                            ${allResults.map(result => `
                                <li>
                                    ${result.status === 'success' ? '✅' : '❌'}
                                    <strong>${result.name}</strong>
                                    ${result.error ? `<br><code style="color:red">${result.error.message || result.error}</code>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div style="text-align: left;">
                        <p>视频只剩下最后5s，需要看完，请刷新后再观看！</p>

                    </div>
                `,
                icon: 'success',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定"
            });

        } catch (e) {
            console.error(e);
            Swal.fire({
                title: "失败！",
                text: e.toString() + "    请在视频播放页面使用！",
                icon: 'error',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定"
            });
        } finally {
            isProcessing = false;
            const button = document.getElementById('my1');
            button.disabled = false;
            button.textContent = "即刻开刷(中小学)";
        }
    }

    // 显示使用指南
    function showGuideDialog() {
        Swal.fire({
            title: `<span style="color: #FF4DAF; font-size:26px;">📚 智能刷课指南</span>`,
            html: `
                <div style="text-align: left; max-width: 720px; line-height: 1.8;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="color: red; font-weight:500; margin-bottom:10px;">
                            播放页面未正常生效请刷新页面！播放页面左侧无红色按钮请刷新页面！
                        </div>
                        <div style="color: #2c3e50; font-weight:500; margin-bottom:10px;">
                            🚀 极速操作流程
                        </div>
                        <div style="display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center;">
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">1</div>
                            <div>进入2025研修课程目录页面</div>
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">2</div>
                            <div>点击左侧“即刻开刷”按钮，等待操作完成</div>
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">3</div>
                            <div><span style="color:#FF4DAF; font-weight:bold">进入视频播放页面，开始播放后会自动跳转到最后3秒的位置，等待最后3秒结束，即刻完成本条视频</span></div>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: "已了解，开始减负之旅 →",
            confirmButtonColor: "#FF4DAF",
            showCancelButton: true,
            cancelButtonText: "不再显示此窗口",
            cancelButtonColor: "#95a5a6",
            width: 760
        });
    }

    // 初始化刷课功能
    function initStudyFeatures() {
        // 拦截XHR请求获取课程数据
        if (typeof ajaxHooker !== 'undefined') {
            ajaxHooker.filter([{url: 'fulls.json'}]);
            ajaxHooker.hook(request => {
                if (request.url.includes('fulls.json')) {
                    request.response = res => {
                        console.log('获取到课程数据:', res);
                        fullDatas = JSON.parse(res.responseText);
                    };
                }
            });
        }
    }

    // 获取视频时长
    function getVideoTime() {
        const video = document.querySelector('video');
        return video ? Math.round(video.duration) : 0;
    }

    // 从课程数据中获取资源ID
    function getResourceIdFromFullData() {
        if (!fullDatas || fullDatas.nodes?.length === 0) {
            throw Error("无法获取课程数据！");
        }

        const result = [];
        const traverse = (node) => {
            if (node.node_type === 'catalog' && node.child_nodes?.length > 0) {
                node.child_nodes.forEach(child => traverse(child));
            } else if (node.node_type === 'activity') {
                const resources = node.relations?.activity?.activity_resources || [];
                resources.forEach(resource => {
                    result.push({
                        name: node.node_name || '未命名课程',
                        resource_id: resource.resource_id || '',
                        studyTime: resource.study_time
                    });
                });
            }
        };

        fullDatas.nodes.forEach(node => traverse(node));
        return result.filter(item => item.resource_id);
    }

    // 获取动态令牌
    function getDynamicToken() {
        try {
            const pattern = /^ND_UC_AUTH-([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})&ncet-xedu&token$/;
            for (let key of Object.keys(localStorage)) {
                if (pattern.test(key)) {
                    return {
                        key: key,
                        appId: key.match(pattern)[1],
                        token: JSON.parse(JSON.parse(localStorage.getItem(key)).value)
                    };
                }
            }
            throw Error("无法获取登录信息！");
        } catch (err) {
            throw Error("获取令牌失败: " + err);
        }
    }

    // 生成MAC授权头
    function getMACAuthorizationHeaders(url, method) {
        let n = getDynamicToken().token;
        return He(url, method, {
            accessToken: n.access_token,
            macKey: n.mac_key,
            diff: n.diff
        });
    }

    // MAC签名相关函数
    function Ze(e) {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRTUVWXZYS".split("");
        let result = "";
        for (let r = 0; r < e; r++) {
            result += chars[Math.ceil(35 * Math.random())];
        }
        return result;
    }

    function Fe(e) {
        return (new Date).getTime() + parseInt(e, 10) + ":" + Ze(8);
    }

    function ze(e, t, n, r) {
        let o = {
            relative: new URL(e).pathname,
            authority: new URL(e).hostname
        };
        let i = t + "\n" + n.toUpperCase() + "\n" + o.relative + "\n" + o.authority + "\n";
        return CryptoJS.HmacSHA256(i, r).toString(CryptoJS.enc.Base64);
    }

    function He(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GET";
        let n = arguments.length > 2 ? arguments[2] : void 0;
        let r = n.accessToken, o = n.macKey, i = n.diff;
        let s = Fe(i), a = ze(e, s, t, o);
        return 'MAC id="'.concat(r, '",nonce="').concat(s, '",mac="').concat(a, '"');
    }

    // 设置学习进度
    function setProgress(url, duration) {
        const info = getDynamicToken();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                'url': url,
                method: 'PUT',
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "authorization": getMACAuthorizationHeaders(url, 'PUT'),
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "content-type": "application/json",
                    "sdp-app-id": info.appId,
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "host": "x-study-record-api.ykt.eduyun.cn",
                    "origin": "https://basic.smartedu.cn",
                    "referer": "https://basic.smartedu.cn/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
                },
                data: JSON.stringify({position: duration - 3}),
                onload: function (res) {
                    console.log('请求成功');
                    if (res.status === 200) {
                        console.log("刷课成功！");
                        resolve(res);
                    } else {
                        reject('服务器拒绝：' + res.response);
                    }
                },
                onerror: function (err) {
                    reject('请求错误！' + err.toString());
                }
            });
        });
    }

    console.log('国家智慧教育平台刷课脚本已加载！');
})();