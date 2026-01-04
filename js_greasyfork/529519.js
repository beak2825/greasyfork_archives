// ==UserScript==
// @name          🚀司机社论坛自动签到-懒人必备增强版🚀
// @version       2.0.0
// @description   在任意网站下完成sijishe论坛自动签到，支持多域名切换和智能重试
// @author        追风 (优化版)
// @match         https://www.bilibili.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license       MIT
// @noframes
// @namespace https://greasyfork.org/users/1444682
// @downloadURL https://update.greasyfork.org/scripts/529519/%F0%9F%9A%80%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87%E5%A2%9E%E5%BC%BA%E7%89%88%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/529519/%F0%9F%9A%80%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87%E5%A2%9E%E5%BC%BA%E7%89%88%F0%9F%9A%80.meta.js
// ==/UserScript==

/* global Swal */

// 配置
const CONFIG = {
    // 域名列表，按优先级排序
    domains: [
        "https://xsijishe.com"
    ],
    // 请求超时时间（毫秒）
    timeout: 15000,
    // 自动签到间隔（毫秒）- 默认为1天
    checkInterval: 86400000,
    // 是否显示成功通知
    showSuccessNotice: true,
    // 通知显示时间（毫秒）
    noticeTimeout: 3000
};

// 存储键
const STORAGE_KEYS = {
    lastSignTs: 'sijishe_last_sign_ts',
    notified: 'sijishe_notified',
    activeDomain: 'sijishe_active_domain'
};

// 请求头
const REQUEST_HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
};

/**
 * 检查是否需要重新签到
 * @returns {boolean} 是否需要签到
 */
const shouldSign = () => {
    const lastSignTs = GM_getValue(STORAGE_KEYS.lastSignTs, 0);
    if (lastSignTs === 0) return true;

    const lastDate = new Date(lastSignTs);
    lastDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return currentDate.getTime() > lastDate.getTime();
};

/**
 * 获取活跃域名
 * @returns {string} 活跃域名
 */
const getActiveDomain = () => {
    const savedDomain = GM_getValue(STORAGE_KEYS.activeDomain, '');
    return CONFIG.domains.includes(savedDomain) ? savedDomain : CONFIG.domains[0];
};

/**
 * 发送HTTP请求
 * @param {Object} options 请求选项
 * @returns {Promise} 请求Promise
 */
const sendRequest = function(options) {
    return new Promise(function(resolve, reject) {
        // 合并请求头
        const headers = Object.assign({}, REQUEST_HEADERS, options.headers || {});

        // CloudFlare和WAF通常会检测请求的referer和cookie
        if (!headers.referer && options.url) {
            // 设置referer为当前域名
            const urlObj = new URL(options.url);
            headers.referer = `${urlObj.origin}/`;
        }

        GM_xmlhttpRequest({
            method: options.method || 'GET',
            url: options.url,
            headers: headers,
            timeout: options.timeout || CONFIG.timeout,
            // 添加withCredentials，保持cookie状态
            withCredentials: true,
            // 跟随重定向
            followRedirect: true,
            onload: function(response) {
                // 即使状态码不是2xx，我们也返回响应，因为可能是CloudFlare的中间页面
                resolve(response);
            },
            onerror: function(error) {
                console.error('[司机社签到] 请求错误:', error);
                reject(error);
            },
            ontimeout: function() {
                console.error('[司机社签到] 请求超时');
                reject(new Error('请求超时'));
            }
        });
    });
};

/**
 * 从页面内容中提取formhash
 * @param {string} html 页面HTML内容
 * @returns {string|null} formhash值或null
 */
const extractFormhash = function(html) {
    const formhashMatch = html.match(/name="formhash" value="([a-zA-Z0-9]+)"/);
    return formhashMatch ? formhashMatch[1] : null;
};

/**
 * 从重定向页面提取真实URL
 * @param {string} html 页面HTML内容
 * @returns {string|null} 重定向URL或null
 */
const extractRedirectUrl = function(html) {
    const redirectMatch = html.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
    return redirectMatch ? redirectMatch[1] : null;
};

/**
 * 处理签到结果
 * @param {string} responseText 响应文本
 * @param {string} domain 当前域名
 * @param {string} formhash formhash值
 */
const handleSignResult = function(responseText, domain, formhash) {
    console.log('[司机社签到] 返回结果:', responseText);

    if (responseText.includes('签到成功')) {
        GM_setValue(STORAGE_KEYS.lastSignTs, Date.now());
        GM_setValue(STORAGE_KEYS.activeDomain, domain);

        if (CONFIG.showSuccessNotice) {
            Swal.fire({
                icon: 'success',
                title: '司机社论坛自动签到',
                html: '<strong>签到成功!</strong>',
                timer: CONFIG.noticeTimeout,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    } else if (responseText.includes('今日已签')) {
        GM_setValue(STORAGE_KEYS.lastSignTs, Date.now());
        GM_setValue(STORAGE_KEYS.activeDomain, domain);

        Swal.fire({
            icon: 'info',
            title: '司机社论坛自动签到',
            text: '您今日已经签到过了!',
            timer: CONFIG.noticeTimeout,
            timerProgressBar: true,
            showConfirmButton: false
        });
    } else if (responseText.includes('请先登录')) {
        Swal.fire({
            icon: 'warning',
            title: '司机社论坛自动签到',
            text: '您需要先登录才能签到!',
            showCancelButton: true,
            confirmButtonText: '前往登录',
            cancelButtonText: '取消'
        }).then(function(result) {
            if (result.isConfirmed) {
                GM_openInTab(`${domain}/member.php?mod=logging&action=login`, { active: true });
            }
        });
    } else {
        // 未知错误，询问用户
        Swal.fire({
            icon: 'error',
            title: '司机社论坛自动签到',
            text: '签到失败，是否手动打开签到页面?',
            showCancelButton: true,
            confirmButtonText: '手动打开',
            cancelButtonText: '取消'
        }).then(function(result) {
            if (result.isConfirmed) {
                GM_openInTab(`${domain}/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${formhash}&format=empty`, { active: true });
            }
        });
    }
};

/**
 * 尝试签到（尝试所有域名）
 * @param {number} index 当前域名索引
 */
const trySign = function(index) {
    // 设置默认索引值
    index = index || 0;

    // 超出域名列表范围
    if (index >= CONFIG.domains.length) {
        Swal.fire({
            icon: 'error',
            title: '司机社论坛自动签到',
            text: '所有域名均无法访问，请获取最新域名地址',
            showCancelButton: true,
            confirmButtonText: '重试',
            cancelButtonText: '今日不再尝试'
        }).then(function(result) {
            if (result.isConfirmed) {
                setTimeout(function() {
                    trySign(0); // 重新从第一个域名开始尝试
                }, 100);
            } else {
                GM_setValue(STORAGE_KEYS.lastSignTs, Date.now()); // 今日不再尝试
            }
        });
        return;
    }

    const currentDomain = CONFIG.domains[index];
    console.log(`[司机社签到] 尝试域名: ${currentDomain}`);

    // 始终获取新的formhash
    fetchNewFormhash();

    // 处理签到请求，包含处理WAF检测
    function handleSignRequest(domain, hash) {
        sendRequest({
            url: `${domain}/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${hash}&format=empty`
        }).then(function(signResponse) {
            var responseText = signResponse.responseText;

            // 检查是否是WAF检测页面
            if (responseText.includes('检测中') || responseText.includes('跳转中')) {
                console.log('[司机社签到] 检测到WAF页面，处理重定向...');
                var redirectUrl = extractRedirectUrl(responseText);

                if (redirectUrl) {
                    // 如果找到了重定向URL，则访问该URL
                    console.log('[司机社签到] 发现重定向URL:', redirectUrl);
                    var fullRedirectUrl = redirectUrl.startsWith('http') ?
                        redirectUrl : domain + redirectUrl;

                    // 等待一段时间后再发起请求，模拟用户行为
                    setTimeout(function() {
                        sendRequest({
                            url: fullRedirectUrl
                        }).then(function(redirectResponse) {
                            // 重新提取formhash并尝试签到
                            var newFormhash = extractFormhash(redirectResponse.responseText);
                            if (newFormhash) {
                                // 再次尝试签到，但带上了新的formhash
                                setTimeout(function() {
                                    sendRequest({
                                        url: `${domain}/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${newFormhash}&format=empty`
                                    }).then(function(finalResponse) {
                                        handleSignResult(finalResponse.responseText, domain, newFormhash);
                                    }).catch(tryNextDomain);
                                }, 1000);
                            } else {
                                tryNextDomain();
                            }
                        }).catch(tryNextDomain);
                    }, 1500);
                } else {
                    // 没找到重定向URL，尝试下一个域名
                    tryNextDomain();
                }
            } else if (responseText.includes('formhash验证失败') ||
                responseText.includes('验证信息已失效')) {
                // 如果formhash验证失败，获取新的formhash
                fetchNewFormhash();
            } else {
                // 正常处理签到结果
                handleSignResult(responseText, domain, hash);
            }
        }).catch(function() {
            // 请求失败，尝试下一个域名
            tryNextDomain();
        });
    }

    // 获取新formhash的函数，增加处理WAF检测
    function fetchNewFormhash() {
        sendRequest({
            url: `${currentDomain}/plugin.php?id=k_misign:sign`
        }).then(function(response) {
            var responseText = response.responseText;

            // 检查是否是WAF检测页面
            if (responseText.includes('检测中') || responseText.includes('跳转中')) {
                console.log('[司机社签到] 获取formhash时检测到WAF页面，处理重定向...');
                var redirectUrl = extractRedirectUrl(responseText);

                if (redirectUrl) {
                    // 如果找到了重定向URL，则访问该URL
                    console.log('[司机社签到] 发现重定向URL:', redirectUrl);
                    var fullRedirectUrl = redirectUrl.startsWith('http') ?
                        redirectUrl : currentDomain + redirectUrl;

                    // 等待一段时间后再发起请求，模拟用户行为
                    setTimeout(function() {
                        sendRequest({
                            url: fullRedirectUrl
                        }).then(function(redirectResponse) {
                            var newFormhash = extractFormhash(redirectResponse.responseText);
                            if (newFormhash) {
                                handleSignRequest(currentDomain, newFormhash);
                            } else {
                                tryNextDomain();
                            }
                        }).catch(tryNextDomain);
                    }, 1500);
                } else {
                    tryNextDomain();
                }
            } else {
                // 常规处理，提取formhash
                var newFormhash = extractFormhash(responseText);
                if (newFormhash) {
                    // 发送签到请求
                    handleSignRequest(currentDomain, newFormhash);
                } else {
                    tryNextDomain();
                }
            }
        }).catch(tryNextDomain);
    }

    // 尝试下一个域名的函数
    function tryNextDomain(error) {
        if (error) {
            console.error(`[司机社签到] 域名 ${currentDomain} 操作失败:`, error);
        }
        // 尝试下一个域名
        setTimeout(function() {
            trySign(index + 1);
        }, 100);
    }
};

/**
 * 开始签到流程
 */
const startSignProcess = function() {
    // 第一次使用时显示提示
    if (!GM_getValue(STORAGE_KEYS.notified, false)) {
        Swal.fire({
            icon: 'info',
            title: '司机社论坛自动签到',
            html: '由于脚本使用了tampermonkey进行跨域请求，<br>弹出提示请选择"<strong>总是允许域名</strong>"',
            confirmButtonText: '了解了'
        }).then(function() {
            GM_setValue(STORAGE_KEYS.notified, true);
            startSignWithSavedDomain();
        });
    } else {
        startSignWithSavedDomain();
    }
};

/**
 * 使用保存的域名开始签到
 */
function startSignWithSavedDomain() {
    // 尝试从保存的活跃域名开始
    var activeDomain = getActiveDomain();
    var startIndex = CONFIG.domains.indexOf(activeDomain);
    trySign(startIndex >= 0 ? startIndex : 0);
}

/**
 * 手动触发签到
 */
const manualSign = () => {
    Swal.fire({
        icon: 'question',
        title: '司机社论坛自动签到',
        text: '确定要手动触发签到吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            startSignProcess();
        }
    });
};

// 注册菜单命令
GM_registerMenuCommand('🚀 手动签到', manualSign);
GM_registerMenuCommand('⚙️ 重置签到状态', () => {
    GM_setValue(STORAGE_KEYS.lastSignTs, 0);
    Swal.fire({
        icon: 'success',
        title: '司机社论坛自动签到',
        text: '已重置签到状态，下次访问网页将触发签到',
        timer: CONFIG.noticeTimeout,
        timerProgressBar: true,
        showConfirmButton: false
    });
});

// 脚本初始化
(function init() {
    // 如果需要签到，则执行签到流程
    if (shouldSign()) {
        // 延迟执行，避免与页面加载冲突
        setTimeout(() => {
            startSignProcess();
        }, 2000);
    }
})();