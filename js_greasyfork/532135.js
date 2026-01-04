// ==UserScript==
// @name           豆瓣TMDB直达助手
// @description    在豆瓣电影页面添加TMDB跳转按钮
// @author         Mobius
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @include        https://movie.douban.com/*
// @version        1.1.1
// @icon           https://47bt.com/favicon.ico
// @run-at         document-end
// @namespace      doveboy_js
// @downloadURL https://update.greasyfork.org/scripts/532135/%E8%B1%86%E7%93%A3TMDB%E7%9B%B4%E8%BE%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532135/%E8%B1%86%E7%93%A3TMDB%E7%9B%B4%E8%BE%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const DEFAULT_TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_MOVIE_URL = 'https://www.themoviedb.org/movie';
const TMDB_TV_URL = 'https://www.themoviedb.org/tv';

let TMDB_API_KEY = GM_getValue('TMDB_API_KEY', '');
let autoSearch = GM_getValue('autoSearch', false);
let useCustomDomain = GM_getValue('useCustomDomain', false);
let customDomain = GM_getValue('customDomain', '');

function normalizeApiBase(val) {
    let base = (val || '').trim();
    if (!base) return '';
    if (!/^https?:\/\//i.test(base)) base = 'https://' + base;
    base = base.replace(/\/+$/,'');
    if (!/\/3$/i.test(base)) base = base + '/3';
    return base;
}

function getTMDBApiBase() {
    const normalized = useCustomDomain ? normalizeApiBase(customDomain) : '';
    return normalized || DEFAULT_TMDB_API_BASE;
}

// 注册设置菜单
GM_registerMenuCommand('设置TMDB API密钥', () => {
    const newApiKey = prompt('请输入TMDB API密钥：', TMDB_API_KEY);
    if (newApiKey !== null) {
        TMDB_API_KEY = newApiKey;
        GM_setValue('TMDB_API_KEY', newApiKey);
        // 创建一个临时元素来显示提示
        const notification = document.createElement('div');
        notification.textContent = 'API密钥已保存！';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
});

GM_registerMenuCommand('切换自动搜索', () => {
    autoSearch = !autoSearch;
    GM_setValue('autoSearch', autoSearch);
    // 创建一个临时元素来显示提示
    const notification = document.createElement('div');
    notification.textContent = autoSearch ? '已开启自动搜索' : '已关闭自动搜索';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
});

GM_registerMenuCommand('切换自定义API域名', () => {
    useCustomDomain = !useCustomDomain;
    GM_setValue('useCustomDomain', useCustomDomain);
    const notification = document.createElement('div');
    notification.textContent = useCustomDomain ? '已启用自定义域名' : '已禁用自定义域名';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
});

GM_registerMenuCommand('设置自定义API域名', () => {
    const newDomain = prompt('请输入自定义域名或完整URL：', customDomain);
    if (newDomain !== null) {
        customDomain = newDomain;
        GM_setValue('customDomain', newDomain);
        const notification = document.createElement('div');
        notification.textContent = '自定义域名已保存：' + normalizeApiBase(customDomain);
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
});

// 主函数
function init() {
    // 获取资源标题
    const titleElement = document.querySelector("h1");
    if (!titleElement) return;

    // 获取所有文本内容，包括中文名、英文名和年份
    const titleText = titleElement.textContent.trim();
    const rawTitle = titleText.replace(/复制标题$/, "").trim();
    
    // 检测是否为剧集（包含"第x季"字样）
    const isTVShow = /第\s*[一二三四五六七八九十\d]+\s*季/.test(rawTitle);

    // 解析标题中的中文名、英文名和年份
    const yearMatch = rawTitle.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : "";

    // 移除年份，然后分割中英文名称
    let titleWithoutYear = rawTitle.replace(/\s*\d{4}\s*/, "").trim();
    titleWithoutYear = titleWithoutYear.replace(/\s*\(\s*\)\s*/g, "");
    
    // 处理剧集标题，移除"第x季"部分以获得更准确的基本剧名
    if (isTVShow) {
        titleWithoutYear = titleWithoutYear.replace(/第\s*[一二三四五六七八九十\d]+\s*季/, "").trim();
    }
    
    let [chineseName, englishName] = titleWithoutYear.split(/\s+/).reduce((acc, part) => {
        if (/[\u4e00-\u9fa5]/.test(part)) {
            acc[0] = (acc[0] ? acc[0] + " " : "") + part;
        } else if (part.trim()) {
            acc[1] = (acc[1] ? acc[1] + " " : "") + part;
        }
        return acc;
    }, ["", ""]);

    const infoElement = document.querySelector('#info');
    let imdbId = '';
    if (infoElement) {
        const label = Array.from(infoElement.querySelectorAll('.pl')).find(el => /IMDb/i.test(el.textContent));
        if (label && label.parentNode) {
            const containerText = label.parentNode.textContent;
            const textMatch = containerText && containerText.match(/tt\d+/);
            if (textMatch) {
                imdbId = textMatch[0];
            } else {
                const link = label.parentNode.querySelector('a[href*="imdb.com/title/tt"]');
                if (link) {
                    const hrefMatch = link.getAttribute('href').match(/tt\d+/);
                    if (hrefMatch) imdbId = hrefMatch[0];
                }
            }
        }
    }

    // 创建TMDB按钮
    const tmdbButton = document.createElement("button");
    tmdbButton.textContent = "TMDB";
    tmdbButton.style.marginLeft = "10px";
    tmdbButton.style.padding = "4px 12px";
    tmdbButton.style.backgroundColor = "#01b4e4";
    tmdbButton.style.color = "white";
    tmdbButton.style.border = "none";
    tmdbButton.style.borderRadius = "4px";
    tmdbButton.style.cursor = "pointer";
    tmdbButton.style.fontSize = "14px";
    tmdbButton.style.transition = "background-color 0.2s";
    tmdbButton.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif";

    // 如果开启了自动搜索，立即执行搜索
    if (autoSearch) {
        searchTMDB();
    }

    tmdbButton.onmouseover = function() {
        tmdbButton.style.backgroundColor = "#0099c6";
    };

    tmdbButton.onmouseout = function() {
        tmdbButton.style.backgroundColor = "#01b4e4";
    };

    // 搜索TMDB函数
    function searchTMDB() {
        const originalText = tmdbButton.textContent;
        if (!TMDB_API_KEY) {
            tmdbButton.textContent = "请设置API密钥";
            tmdbButton.style.backgroundColor = "#e74c3c";
            setTimeout(() => {
                tmdbButton.textContent = originalText;
                tmdbButton.style.backgroundColor = "#01b4e4";
            }, 2000);
            return;
        }

        if (!imdbId) {
            tmdbButton.textContent = "请手动搜索tmdb";
            tmdbButton.style.backgroundColor = "#e67e22";
            tmdbButton.disabled = false;
            return;
        }

        tmdbButton.textContent = "匹配中...";
        tmdbButton.style.backgroundColor = "#666";
        tmdbButton.disabled = true;

        const findUrl = `${getTMDBApiBase()}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: findUrl,
            onload: function(response) {
                let matched = false;
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.movie_results && data.movie_results.length > 0) {
                        lastFoundMovieId = data.movie_results[0].id;
                        lastFoundType = 'movie';
                        matched = true;
                        if (!autoSearch) {
                            window.open(`${TMDB_MOVIE_URL}/${lastFoundMovieId}`, '_blank');
                        }
                    } else if (data.tv_results && data.tv_results.length > 0) {
                        lastFoundMovieId = data.tv_results[0].id;
                        lastFoundType = 'tv';
                        matched = true;
                        if (!autoSearch) {
                            window.open(`${TMDB_TV_URL}/${lastFoundMovieId}`, '_blank');
                        }
                    } else {
                        tmdbButton.textContent = "请手动搜索tmdb";
                        tmdbButton.style.backgroundColor = "#e67e22";
                    }
                } catch (e) {
                    tmdbButton.textContent = "搜索出错";
                    tmdbButton.style.backgroundColor = "#e74c3c";
                    setTimeout(() => {
                        tmdbButton.textContent = originalText;
                        tmdbButton.style.backgroundColor = "#01b4e4";
                    }, 2000);
                }

                if (matched && autoSearch) {
                    tmdbButton.textContent = "TMDB直达";
                    tmdbButton.style.backgroundColor = "#01b4e4";
                }
                tmdbButton.disabled = false;
            },
            onerror: function() {
                tmdbButton.textContent = "网络错误";
                tmdbButton.style.backgroundColor = "#e74c3c";
                setTimeout(() => {
                    tmdbButton.textContent = originalText;
                    tmdbButton.style.backgroundColor = "#01b4e4";
                }, 2000);
                tmdbButton.disabled = false;
            }
        });
    };

    // 设置按钮点击事件
    tmdbButton.onclick = function() {
        if (autoSearch && tmdbButton.textContent === "TMDB直达") {
            // 如果已经搜索到结果，直接跳转
            const targetUrl = lastFoundType === 'tv' ? TMDB_TV_URL : TMDB_MOVIE_URL;
            window.open(`${targetUrl}/${lastFoundMovieId}`, '_blank');
        } else {
            searchTMDB();
        }
    };

    // 将按钮添加到页面
    titleElement.appendChild(tmdbButton);
}

// 用于存储最后一次搜索到的电影ID和类型
let lastFoundMovieId = null;
let lastFoundType = 'movie'; // 默认为电影

// 页面加载完成后执行初始化
init();
