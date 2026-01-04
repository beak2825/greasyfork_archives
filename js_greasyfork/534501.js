// ==UserScript==
// @name         复制抖音信息
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  显示复制按钮并获取当前视频信息，支持 SPA 跳转
// @match        https://www.douyin.com/video/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534501/%E5%A4%8D%E5%88%B6%E6%8A%96%E9%9F%B3%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/534501/%E5%A4%8D%E5%88%B6%E6%8A%96%E9%9F%B3%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentId = getIdFromURL();
    let videoData = null;
    let uiInited = false;
    let lastApiUpdateTime = 0;

    // —— 样式 ——
    GM_addStyle(`
        .copy-button {display:block;padding:5px 10px;margin:5px;background:#ff5c5c;color:#fff;border-radius:5px;cursor:pointer;width:90px;text-align:center}
        .copy-button:hover{background:#ff3b3b}
        #dy-copy-container{position:fixed;top:80px;left:110px;z-index:99999;display:flex;flex-direction:column}
        .copy-toast{position:fixed;bottom:20px;left:20px;padding:10px;background:#28a745;color:#fff;border-radius:5px;z-index:100000;display:none;opacity:0;transition:opacity .5s}
        .copy-toast.show{display:block;opacity:1}
    `);

    // —— SPA 跳转处理 ——
    hookHistory();
    window.addEventListener('popstate', onUrlChange);
    function onUrlChange() {
        const id = getIdFromURL();
        if (id && id !== currentId) {
            currentId = id;
            videoData = null;
            lastApiUpdateTime = 0;
            console.log('🔄 URL变更，等待接口数据:', currentId);
        }
    }
    function hookHistory() {
        const ps = history.pushState, rs = history.replaceState;
        history.pushState = function() { const r = ps.apply(this, arguments); setTimeout(onUrlChange, 0); return r; };
        history.replaceState = function() { const r = rs.apply(this, arguments); setTimeout(onUrlChange, 0); return r; };
    }
    function getIdFromURL() {
        return (location.pathname.match(/\/video\/(\d+)/) || [])[1] || null;
    }

    // —— 拦截 fetch/XHR ——
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
        const req = args[0];
        const url = typeof req === 'string' ? req : (req?.url || '');
        const res = await origFetch(...args);
        try {
            const type = res.headers.get('content-type') || '';
            if(type.includes('application/json') && maybeDouyinAPI(url)) {
                res.clone().json().then(json => handleJSON(url, json)).catch(()=>{});
            }
        } catch{}
        return res;
    }

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return origOpen.apply(this, arguments);
    }
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            try {
                const ct = this.getResponseHeader('content-type') || '';
                if(ct.includes('application/json') && maybeDouyinAPI(this._url)) {
                    const json = JSON.parse(this.responseText);
                    handleJSON(this._url, json);
                }
            } catch{}
        });
        return origSend.apply(this, arguments);
    }

    function maybeDouyinAPI(url='') {
        // 扩展匹配规则，确保能捕获所有相关API
        return /aweme|video\/data|item\/detail/.test(url);
    }

    function handleJSON(url, data) {
        if(!data || !currentId) return;
        const found = pickCurrentAweme(data, currentId);
        if(!found) return;

        videoData = found.aweme || found;
        lastApiUpdateTime = Date.now();
        console.log('✅ 捕获视频数据:', { url, aweme_id: videoData.aweme_id, videoData });

        // 自动更新 UI 内容
        updateUI();
    }

    function pickCurrentAweme(data, id) {
        // 增强匹配逻辑，处理更多可能的数据结构
        const lists = [
            get(data,'aweme_list'),
            get(data,'data'),
            get(data,'aweme_details'),
            get(data,'aweme_detail_list'),
            get(data,'item_list'),
            get(data,'aweme.item_list')
        ].filter(Array.isArray);

        for(const arr of lists) {
            const hit = arr.find(a => {
                const awemeId = String(get(a,'aweme_id') || get(a,'aweme.aweme_id') || get(a,'id') || '');
                return awemeId === String(id);
            });
            if(hit) return hit;
        }

        // 直接对象匹配，增加更多可能的路径
        const possiblePaths = [
            'aweme',
            '',
            'aweme_detail',
            'aweme_detail.aweme',
            'item',
            'item.aweme',
            'detail',
            'detail.aweme'
        ];

        for(const path of possiblePaths) {
            const obj = path ? get(data, path) : data;
            if(obj && String(get(obj, 'aweme_id') || get(obj, 'id') || '') === String(id)) {
                return obj;
            }
        }

        return null;
    }

    function get(obj, path) {
        try { return path.split('.').reduce((o,k)=>o?.[k], obj); } catch{return undefined;}
    }

    // —— DOM选择器备选方案 ——
    // 获取博主昵称
    const getDomNickName = () => {
        // 直接使用选择器
        const nicknameElement = document.querySelector('.j5WZzJdp');
        if (nicknameElement && nicknameElement.textContent.trim()) {
            const text = nicknameElement.textContent.trim();
            if (text.length < 50) return text;
        }

        // 备选方案：使用图片的 alt 属性
        const imgElements = document.querySelectorAll('img.RlLOO79h');
        for (const img of imgElements) {
            if (img.alt && img.alt.trim() && img.alt.length < 50) {
                return img.alt.trim();
            }
        }

        // 其他备选方案
        const selectors = [
            '[class*="nickname"]',
            '[class*="author-name"]',
            '[class*="user-name"]'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.textContent && el.textContent.trim() && el.textContent.length < 50) {
                    return el.textContent.trim();
                }
            }
        }

        return null;
    };

    // 获取粉丝数
    const getDomFollowCount = () => {
        const followElements = document.querySelectorAll('.JWilT3lH');
        if (followElements.length > 0) {
            let followText = followElements[0].textContent.trim();
            if (followText.includes('万')) {
                let followNum = parseFloat(followText.replace('万', '').replace(',', ''));
                followNum *= 10000;
                return String(Math.round(followNum));
            }
            return String(parseInt(followText.replace(/,|\s/g, '')));
        }
        return null;
    };

    // 获取点赞数
    const getDomLikeCount = () => {
        const likeElement = document.querySelector('.ofo4bP_8');
        if (likeElement && likeElement.textContent.trim()) {
            const likeText = likeElement.textContent.trim();
            if (likeText.includes('万')) {
                let likeNum = parseFloat(likeText.replace('万', '').replace(',', ''));
                likeNum *= 10000;
                return String(Math.round(likeNum));
            }
            return String(parseInt(likeText.replace(/,|\s/g, '')));
        }
        return null;
    };

    // 获取评论数
    const getDomCommentCount = () => {
        const commentElements = document.querySelectorAll('.ofo4bP_8');
        if (commentElements.length > 1) {
            const commentText = commentElements[1].textContent.trim();
            if (commentText.includes('万')) {
                let commentNum = parseFloat(commentText.replace('万', '').replace(',', ''));
                commentNum *= 10000;
                return String(Math.round(commentNum));
            }
            return String(parseInt(commentText.replace(/,|\s/g, '')));
        }
        return null;
    };

    // 获取收藏数
    const getDomFavoriteCount = () => {
        const favoriteElements = document.querySelectorAll('.ofo4bP_8');
        if (favoriteElements.length > 2) {
            const favoriteText = favoriteElements[2].textContent.trim();
            if (favoriteText.includes('万')) {
                let favoriteNum = parseFloat(favoriteText.replace('万', '').replace(',', ''));
                favoriteNum *= 10000;
                return String(Math.round(favoriteNum));
            }
            return String(parseInt(favoriteText.replace(/,|\s/g, '')));
        }
        return null;
    };

    // 获取转发数
    const getDomShareCount = () => {
        const shareElement = document.querySelector('.njfMvuRG');
        if (shareElement && shareElement.textContent.trim()) {
            const shareText = shareElement.textContent.trim();
            if (shareText.includes('万')) {
                let shareNum = parseFloat(shareText.replace('万', '').replace(',', ''));
                shareNum *= 10000;
                return String(Math.round(shareNum));
            }
            return String(parseInt(shareText.replace(/,|\s/g, '')));
        }

        const shareDiv = document.querySelector('.MQXEGdYW');
        if (shareDiv && shareDiv.textContent.trim()) {
            const shareText = shareDiv.textContent.trim();
            if (shareText.includes('万')) {
                let shareNum = parseFloat(shareText.replace('万', '').replace(',', ''));
                shareNum *= 10000;
                return String(Math.round(shareNum));
            }
            return String(parseInt(shareText.replace(/,|\s/g, '')));
        }
        return null;
    };

    // 获取日期
    const getDomDate = () => {
        const dateElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const text = el.textContent.trim();
            return /\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}/.test(text);
        });

        if (dateElements.length > 0) {
            let dateText = dateElements[0].textContent.trim();
            const match = dateText.match(/(\d{4})[-\/\.]?(\d{1,2})[-\/\.]?(\d{1,2})/);
            if (match) {
                return `${match[1]}.${match[2]}.${match[3]}`;
            }
        }
        return null;
    };

    // —— 字段提取（结合API和DOM） ——
    const getNickName = () => {
        // 优先使用API数据
        const apiValue = videoData?.author?.nickname;
        if (apiValue) return apiValue;

        // 备选使用DOM
        const domValue = getDomNickName();
        return domValue || '无法获取昵称';
    };

    const getFollowCount = () => {
        // 优先使用API数据
        const apiValue = videoData?.author?.follower_count;
        if (typeof apiValue === 'number' && !isNaN(apiValue)) return String(apiValue);

        // 备选使用DOM
        const domValue = getDomFollowCount();
        return domValue || '无法获取粉丝数';
    };

    const getLikeCount = () => {
        // 优先使用API数据
        const apiValue = videoData?.statistics?.digg_count;
        if (typeof apiValue === 'number' && !isNaN(apiValue)) return String(apiValue);

        // 备选使用DOM
        const domValue = getDomLikeCount();
        return domValue || '无法获取点赞数';
    };

    const getCommentCount = () => {
        // 优先使用API数据
        const apiValue = videoData?.statistics?.comment_count;
        if (typeof apiValue === 'number' && !isNaN(apiValue)) return String(apiValue);

        // 备选使用DOM
        const domValue = getDomCommentCount();
        return domValue || '无法获取评论数';
    };

    const getFavoriteCount = () => {
        // 优先使用API数据
        const apiValue = videoData?.statistics?.collect_count;
        if (typeof apiValue === 'number' && !isNaN(apiValue)) return String(apiValue);

        // 备选使用DOM
        const domValue = getDomFavoriteCount();
        return domValue || '无法获取收藏数';
    };

    const getShareCount = () => {
        // 优先使用API数据
        const apiValue = videoData?.statistics?.share_count;
        if (typeof apiValue === 'number' && !isNaN(apiValue)) return String(apiValue);

        // 备选使用DOM
        const domValue = getDomShareCount();
        return domValue || '无法获取转发数';
    };

    const getVideoURL = () => location.href;

    const getUserProfileURL = () => {
        // 优先使用API数据
        if (videoData?.author?.sec_uid) {
            return `https://www.douyin.com/user/${videoData.author.sec_uid}`;
        }
        return '无法获取主页URL';
    };

    const getDate = () => {
        // 优先使用API数据
        if (videoData?.create_time) {
            return formatDate(new Date(videoData.create_time*1000));
        }

        // 备选使用DOM
        const domValue = getDomDate();
        return domValue || '无法获取日期';
    };

    function n(v,fallback){return typeof v==='number'&&!isNaN(v)?String(v):fallback;}
    function pad2(x){return x<10?'0'+x:x;}
    function formatDate(d){return `${d.getFullYear()}.${pad2(d.getMonth()+1)}.${pad2(d.getDate())}`;}

    // —— UI ——
    function initUI() {
        if(document.getElementById('dy-copy-container')) return;
        const c = document.createElement('div');
        c.id = 'dy-copy-container';
        c.append(
            btn('昵称',getNickName),
            btn('粉丝',getFollowCount),
            btn('日期',getDate),
            btn('主页',getUserProfileURL),
            btn('URL',getVideoURL),
            btn('点赞',getLikeCount),
            btn('收藏',getFavoriteCount),
            btn('转发',getShareCount),
            btn('评论',getCommentCount),
            btn('全部',getAll)
        );
        document.body.appendChild(c);
        uiInited = true;
    }

    function updateUI(){
        if(!uiInited) initUI();
    }

    function btn(label,fn){
        const b=document.createElement('button');
        b.className='copy-button';
        b.textContent=label;
        b.onclick=()=>{
            const t=fn();
            navigator.clipboard.writeText(t).then(()=>toast(`${label} 复制成功: ${t}`)).catch(()=>toast(`${label} 复制失败`));
        }
        return b;
    }

function getAll(){
    return [
        // 第一部分
        `${getNickName()}`,
        `${getFollowCount()}`,
        `${getDate()}`,
        "",
        "",
        "",
        "",
        // 第二部分
        `${getUserProfileURL()}`,
        `${getVideoURL()}`,
        "",
        "",
        "",
        "",
        "",
        // 第三部分
        `${getLikeCount()}`,
        "",
        `${getFavoriteCount()}`,
        `${getShareCount()}`,
        `${getCommentCount()}`
    ].join('\n');
}


    function toast(msg){
        const t=document.createElement('div');
        t.className='copy-toast';
        t.textContent=msg;
        document.body.appendChild(t);
        setTimeout(()=>t.classList.add('show'),100);
        setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),500); },3000);
    }

    // —— 确保 body 可用后初始化 UI ——
    function waitForBody(callback){
        if(document.body) return callback();
        new MutationObserver((mutations,obs)=>{
            if(document.body){ obs.disconnect(); callback(); }
        }).observe(document.documentElement,{childList:true,subtree:true});
    }

    // 定期检查，如果API数据长时间未更新，则使用DOM方法
    function checkDataSource() {
        if (!videoData && document.readyState === 'complete') {
            console.log('⚠️ API数据未获取，使用DOM方法');
            updateUI();
        }
        setTimeout(checkDataSource, 3000); // 每3秒检查一次
    }

    waitForBody(()=>{
        if(!uiInited) initUI();
        console.log('🛰️ 按钮初始化完成，等待接口数据更新内容...');
        checkDataSource(); // 启动数据源检查
    });

})();