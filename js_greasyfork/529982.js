// ==UserScript==
// @name         百度贴吧点赞数据显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在百度贴吧显示主题帖、楼层的点赞数据
// @author       noahacgn
// @match        *://tieba.baidu.com/p/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      tiebac.baidu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529982/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%82%B9%E8%B5%9E%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/529982/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%82%B9%E8%B5%9E%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息
    const config = {
        BDUSS: '', // 用户手动填写BDUSS
        CLIENT_INFO: {
            _client_version: "12.64.1.1",
            _client_type: "2"
        },
        BASE_URL: "http://tiebac.baidu.com",
        lastUrl: location.href, // 记录上一次处理的URL
        postDataCache: {}, // 缓存帖子数据
        isProcessing: false // 是否正在处理数据
    };

    // 初始化
    function init() {
        console.log("百度贴吧点赞数据显示脚本初始化...");
        // 从GM存储中获取BDUSS
        config.BDUSS = GM_getValue('BDUSS', '');
        
        // 如果没有BDUSS，则提示用户设置
        if (!config.BDUSS) {
            showBDUSSPrompt();
        } else {
            // 获取当前帖子ID
            const tid = getTidFromUrl();
            if (tid) {
                console.log("获取到帖子ID:", tid);
                // 获取帖子点赞数据
                getPostData(tid);
            } else {
                console.error("无法从URL获取帖子ID");
            }
        }
    }

    // 显示BDUSS设置提示
    function showBDUSSPrompt() {
        const userBDUSS = prompt("请输入您的BDUSS值以获取点赞数据:", "");
        if (userBDUSS) {
            config.BDUSS = userBDUSS;
            GM_setValue('BDUSS', userBDUSS);
            
            // 获取当前帖子ID
            const tid = getTidFromUrl();
            if (tid) {
                // 获取帖子点赞数据
                getPostData(tid);
            }
        }
    }

    // 从URL获取帖子ID
    function getTidFromUrl() {
        const match = window.location.href.match(/p\/(\d+)/);
        return match ? match[1] : null;
    }

    // 获取当前页码
    function getCurrentPage() {
        const match = window.location.href.match(/pn=(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }

    // 加密签名函数
    function generateSign(params) {
        // 先排序参数
        const sortedParams = new URLSearchParams(params);
        sortedParams.sort();
        
        // 构建签名字符串
        const signStr = Array.from(sortedParams.entries())
            .map(entry => entry.join('='))
            .join('') + "tiebaclient!!!";
        
        // 计算MD5
        return md5(signStr).toUpperCase();
    }

    // 打包请求参数，添加签名
    function packRequest(params) {
        const reqParams = { ...params, ...config.CLIENT_INFO };
        
        // 添加BDUSS
        if (!reqParams.BDUSS) {
            reqParams.BDUSS = config.BDUSS;
        }
        
        // 生成签名
        const sign = generateSign(reqParams);
        reqParams.sign = sign;
        
        return new URLSearchParams(reqParams).toString();
    }

    // 使用GM_xmlhttpRequest调用百度贴吧API
    function fetchAPI(url, data, method = "GET") {
        return new Promise((resolve, reject) => {
            let apiUrl = config.BASE_URL + url;
            const fetchOptions = {
                method: method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const responseData = JSON.parse(response.responseText);
                            resolve(responseData);
                        } catch (error) {
                            reject(new Error("API返回数据解析失败: " + error.message));
                        }
                    } else {
                        reject(new Error(`HTTP错误! 状态: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("API请求失败: " + error.message));
                }
            };

            // 根据方法添加不同的参数
            if (method === "GET") {
                if (data) {
                    apiUrl += `?${data}`;
                }
            } else if (method === "POST") {
                fetchOptions.data = data;
            }

            GM_xmlhttpRequest({
                ...fetchOptions,
                url: apiUrl
            });
        });
    }

    // 获取帖子数据（包含点赞信息）
    async function getPostData(tid) {
        try {
            if (config.isProcessing) {
                console.log("正在处理数据，稍后再试");
                return;
            }

            config.isProcessing = true;
            const currentPage = getCurrentPage();
            console.log(`开始获取帖子数据，帖子ID: ${tid}，页码: ${currentPage}`);
            
            // 构造请求参数
            const params = {
                kz: tid,
                pn: currentPage,
                rn: 30, // 每页回复数量
                r: 3,   // 排序方式: 3为时间正序
                BDUSS: config.BDUSS
            };
            
            // 发起请求
            const data = await fetchAPI("/c/f/pb/page", packRequest(params), "POST");
            
            console.log("获取到帖子数据:", data);
            
            if (!data || data.error) {
                throw new Error(`获取帖子数据失败: ${data?.error_msg || '未知错误'}`);
            }
            
            // 缓存帖子数据
            const cacheKey = `${tid}_${currentPage}`;
            config.postDataCache[cacheKey] = data;
            
            // 使用智能延迟处理显示
            setTimeout(() => {
                processPostData(tid, currentPage);
            }, 500);
            
            return data;
        } catch (error) {
            console.error("获取帖子点赞数据失败:", error);
            config.isProcessing = false;
            return null;
        }
    }

    // 处理帖子数据并显示点赞信息
    function processPostData(tid, page) {
        const cacheKey = `${tid}_${page}`;
        const data = config.postDataCache[cacheKey];
        
        if (!data) {
            console.error("缓存中找不到帖子数据:", cacheKey);
            config.isProcessing = false;
            return;
        }
        
        try {
            // 只在第一页显示主题帖点赞数据
            if (page === 1 && data.thread) {
                displayThreadLikeCount(data.thread);
            }
            
            // 检查页面是否已经加载完成
            const postsLoaded = checkPostsLoaded(data);
            
            if (postsLoaded) {
                console.log("页面已加载完成，显示点赞数据");
                // 显示回复的点赞数据
                if (data.post_list && Array.isArray(data.post_list) && data.post_list.length > 0) {
                    data.post_list.forEach(post => {
                        if (!post) return;
                        displayPostLikeCount(post);
                    });
                }
                
                // 处理完成
                config.isProcessing = false;
            } else {
                console.log("页面尚未加载完成，500ms后重试");
                // 如果页面未加载完，延迟重试
                setTimeout(() => {
                    processPostData(tid, page);
                }, 500);
            }
        } catch (error) {
            console.error("处理帖子数据出错:", error);
            config.isProcessing = false;
        }
    }

    // 检查页面是否加载完成
    function checkPostsLoaded(data) {
        if (!data.post_list || !Array.isArray(data.post_list) || data.post_list.length === 0) {
            return true; // 没有回复，认为加载完成
        }
        
        // 检查页面是否已加载数据中的第一个和最后一个帖子
        const firstPost = data.post_list[0];
        const lastPost = data.post_list[data.post_list.length - 1];
        
        if (!firstPost || !lastPost || !firstPost.id || !lastPost.id) {
            return false;
        }
        
        const firstPostElement = document.querySelector(`.l_post[data-pid="${firstPost.id}"]`);
        const lastPostElement = document.querySelector(`.l_post[data-pid="${lastPost.id}"]`);
        
        return firstPostElement && lastPostElement;
    }

    // 显示主题帖点赞数
    function displayThreadLikeCount(thread) {
        const titleElement = document.querySelector('.core_title_txt.pull-left.text-overflow');
        if (titleElement) {
            const likeCount = thread.agree?.agree_num || 0;
            // 检查是否已经添加了点赞计数
            const existingLikeElement = document.querySelector('.thread-like-count');
            if (existingLikeElement) {
                return;
            }
            
            const likeElement = document.createElement('span');
            likeElement.className = 'thread-like-count';
            likeElement.innerHTML = `<span style="color: #E74C3C; margin-left: 10px;"><i style="font-size: 14px; margin-right: 3px;">❤</i>${likeCount}</span>`;
            titleElement.after(likeElement);
            
            console.log("已显示主题帖点赞数:", likeCount);
        }
    }

    // 显示楼层点赞数
    function displayPostLikeCount(post) {
        if (!post || !post.id) {
            console.warn("无效的回复数据:", post);
            return;
        }
        
        const postElement = document.querySelector(`.l_post[data-pid="${post.id}"]`);
        if (postElement) {
            const tailElement = postElement.querySelector('.core_reply_tail');
            if (tailElement) {
                // 检查是否已经添加了点赞计数
                const existingLikeElement = tailElement.querySelector('.post-like-count');
                if (existingLikeElement) {
                    return;
                }
                
                const likeCount = post.agree?.agree_num || 0;
                const likeElement = document.createElement('span');
                likeElement.className = 'post-like-count';
                likeElement.innerHTML = `<span class="tail-info" style="color: #E74C3C;"><i style="font-size: 12px; margin-right: 3px;">❤</i>${likeCount}</span>`;
                
                const timeElement = tailElement.querySelector('.tail-info:last-of-type');
                if (timeElement) {
                    timeElement.after(likeElement);
                } else {
                    const postTailWrap = tailElement.querySelector('.post-tail-wrap');
                    if (postTailWrap) {
                        postTailWrap.appendChild(likeElement);
                    }
                }
                
                console.log("已显示楼层点赞数，回复ID:", post.id, "点赞数:", likeCount);
            }
        } else {
            console.warn("未找到对应的楼层元素，回复ID:", post.id);
        }
    }

    // 检查URL变化
    function checkUrlChange() {
        if (config.lastUrl !== location.href) {
            console.log("URL已变化，从", config.lastUrl, "变为", location.href);
            config.lastUrl = location.href;
            
            // 清除处理中状态
            config.isProcessing = false;
            
            // 获取当前帖子ID
            const tid = getTidFromUrl();
            if (tid) {
                console.log("URL变化后重新获取点赞数据，帖子ID:", tid);
                // 给页面一些时间加载
                setTimeout(() => {
                    // 获取帖子点赞数据
                    getPostData(tid);
                }, 1000);
            }
        }
    }

    // MD5算法实现
    function md5(string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
    
        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
    
        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }
    
        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
    
        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
    
        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
    
        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
    
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }
    
        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }
    
        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
    
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
    
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
    
            return utftext;
        }
    
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    
        string = Utf8Encode(string);
    
        x = ConvertToWordArray(string);
    
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    
        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
    
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    
        return temp.toLowerCase();
    }

    // 添加样式
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .thread-like-count, .post-like-count {
                display: inline-block;
                animation: fadeIn 0.5s;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // 注册油猴菜单
    GM_registerMenuCommand("设置BDUSS", () => {
        const currentBDUSS = GM_getValue('BDUSS', '');
        const userBDUSS = prompt("请输入您的BDUSS值以获取点赞数据:", currentBDUSS || "");
        if (userBDUSS) {
            config.BDUSS = userBDUSS;
            GM_setValue('BDUSS', userBDUSS);
            
            // 刷新点赞数据
            const tid = getTidFromUrl();
            if (tid) getPostData(tid);
        }
    });

    // 初始化函数
    function runScript() {
        addCustomStyles();
        init();
        
        // 由于贴吧页面有时会动态加载内容，需要监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // 如果有新的楼层添加，尝试显示点赞数据
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1 && node.classList.contains('l_post')) {
                            const tid = getTidFromUrl();
                            const currentPage = getCurrentPage();
                            const cacheKey = `${tid}_${currentPage}`;
                            
                            // 如果有缓存数据，尝试直接使用缓存的数据为新加载的楼层添加点赞数
                            if (config.postDataCache[cacheKey] && !config.isProcessing) {
                                const cachedData = config.postDataCache[cacheKey];
                                const postId = node.getAttribute('data-pid');
                                
                                if (postId && cachedData.post_list) {
                                    const post = cachedData.post_list.find(p => p && p.id === postId);
                                    if (post) {
                                        displayPostLikeCount(post);
                                    }
                                }
                            } else if (tid && !config.isProcessing) {
                                // 如果没有缓存数据或正在处理，则重新获取
                                getPostData(tid);
                            }
                            break;
                        }
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // 监听URL变化（针对翻页）
        // 方法1：使用事件监听（适用于单页应用）
        window.addEventListener('popstate', () => {
            checkUrlChange();
        });
        
        // 方法2：周期性检查URL（适用于任何情况）
        setInterval(checkUrlChange, 1000);
        
        // 方法3：监听贴吧的翻页事件（适用于贴吧特定实现）
        document.addEventListener('click', (e) => {
            // 检查是否点击了翻页链接
            if (e.target && (e.target.classList.contains('pagination-item') || 
                             e.target.closest('.pagination-item'))) {
                // 给点击翻页一些时间来改变URL和加载内容
                setTimeout(checkUrlChange, 500);
            }
        });
    }

    // 确保脚本在页面加载后运行
    if (document.readyState === "loading") {
        window.addEventListener('DOMContentLoaded', runScript);
    } else {
        runScript();
    }
})();