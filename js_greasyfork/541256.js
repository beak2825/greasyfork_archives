// ==UserScript==
// @name         PT 影视预告片/豆瓣，快速搜索插件
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在HHCLUB、CHDBits、HDSky、Audiences、PTerClub、SSD、HDBits、BeyondHD和BroadcastheNet站点种子列表中，添加YouTube、抖音和豆瓣图标，点击后可即时在小窗口中搜索预告片
// @author       Gemini & User
// @match        *://hhanclub.top/torrents.php*
// @match        *://hhan.club/torrents.php*
// @match        *://ptchdbits.co/torrents.php*
// @match        *://hdsky.my/torrents.php*
// @match        *://audiences.me/torrents.php*
// @match        *://pterclub.com/torrents.php*
// @match        *://springsunday.net/torrents.php*
// @match        *://hdbits.org/browse.php*
// @match        *://beyond-hd.me/torrents*
// @match        *://broadcasthe.net/torrents.php*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://p-f-rc.byteimg.com/tos-cn-i-b4xunb0e52/f8f047395c37492c902a24d55233d403~tplv-b4xunb0e52-image.image
// @downloadURL https://update.greasyfork.org/scripts/541256/PT%20%E5%BD%B1%E8%A7%86%E9%A2%84%E5%91%8A%E7%89%87%E8%B1%86%E7%93%A3%EF%BC%8C%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/541256/PT%20%E5%BD%B1%E8%A7%86%E9%A2%84%E5%91%8A%E7%89%87%E8%B1%86%E7%93%A3%EF%BC%8C%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // 站点配置区域
    // =================================================================================
    const getSiteConfig = () => {
        const hostname = location.hostname;

        // --- 通用函数 ---
        const removeExcludedContent = (text) => {
            const chineseBracketIndex = text.indexOf('【');
            if (chineseBracketIndex !== -1) text = text.substring(0, chineseBracketIndex).trim();
            const squareBracketIndex = text.indexOf('[');
            if (squareBracketIndex !== -1) text = text.substring(0, squareBracketIndex).trim();
            return text;
        };

        const englishSiteTitleExtractor = (text) => {
            let title = text;
            const yearMatch = text.match(/\b(\d{4})\b/);
            const year = yearMatch ? yearMatch[1] : '';
            const seasonMatch = title.match(/\bS(\d{1,2})(E\d{1,2})?\b/i);
            if (seasonMatch) {
                title = title.substring(0, seasonMatch.index).trim();
            } else if (year) {
                const yearIndex = title.indexOf(year);
                if (yearIndex > 0) title = title.substring(0, yearIndex).trim();
            } else {
                const techPatterns = ['Hybrid', '2160p', '1080p', '720p', '480p', 'Remux', 'DoVi', 'HDR10+', 'HEVC', 'TrueHD', 'DTS-HD', 'MA', 'AVC', 'WEB-DL', 'WEBDL', 'BluRay', 'Blu-Ray', 'DD+', 'DDP', 'H.264', 'H.265', 'x264', 'x265', 'REPACK'];
                let titleEndIndex = -1;
                for (const tag of techPatterns) {
                    const tagIndex = title.toUpperCase().lastIndexOf(tag.toUpperCase());
                    if (tagIndex > 0 && (titleEndIndex === -1 || tagIndex < titleEndIndex)) {
                        titleEndIndex = tagIndex;
                    }
                }
                if (titleEndIndex !== -1) title = title.substring(0, titleEndIndex).trim();
            }
            title = title.replace(/[.\-]/g, ' ').replace(/\s+/g, ' ').trim();
            return { title, year };
        };


        // --- 站点具体配置 ---

        // 1. 原始站点组 (有中英文副标题)
        if (/hhan(club\.top|\.club)/.test(hostname)) {
            return {
                name: 'HHCLUB',
                selectors: { row: '.torrent-table-sub-info', title: 'a.torrent-info-text-name', subtitle: '.torrent-info-text-small_name', rating: 'img[src*="icon-imdb-new.svg"], img[src*="icon-douban.svg"]', table: '.torrents-table' },
                buttonSize: '19px',
                extractChineseTitle: (text) => {
                    text = removeExcludedContent(text);
                    const slashIndex = text.indexOf('/');
                    if (slashIndex !== -1) text = text.substring(0, slashIndex).trim();
                    return text.split('|')[0].trim();
                }
            };
        } else if (hostname.includes('ptchdbits.co')) {
            return {
                name: 'CHDBits',
                selectors: { row: 'table.torrents tr', title: 'a[href*="details.php"] b', subtitle: 'font.subtitle', rating: 'img[src*="imdb.gif"]', table: 'table.torrents' },
                buttonSize: '16px',
                extractChineseTitle: (text) => {
                    let content = text.trim();
                    // 步骤一：循环排除所有已知的副标题前置标签
                    const tags = ['官方','独占','DIY','国语','中字','繁体','简体','字幕','双语','原版','特效','限转','首发','杜比','DTS','HD','MA','TrueHD','内嵌','外挂','英字','日字','韩字','4K','1080p','720p','2160p','UHD','HDR','重编码','重制','修复','收藏','蓝光','原盘','压制'];
                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (const tag of tags) {
                            if (content.startsWith(tag)) {
                                content = content.substring(tag.length).trim();
                                changed = true;
                                break;
                            }
                        }
                    }

                    // 步骤二：排除标签后，截取到第一个“/”、“ ”或“[”为止
                    const delimiters = ['/', ' ', '['];
                    let endIndex = -1;
                    for (const delimiter of delimiters) {
                        const index = content.indexOf(delimiter);
                        if (index !== -1 && (endIndex === -1 || index < endIndex)) {
                            endIndex = index;
                        }
                    }
                    if (endIndex !== -1) {
                        content = content.substring(0, endIndex).trim();
                    }

                    return content && /[\u4e00-\u9fa5]/.test(content) ? content : null;
                }
            };
        } else if (hostname.includes('hdsky.my')) {
            return {
                name: 'HDSky',
                selectors: { row: 'table.torrents tr', title: 'a[href*="details.php"] b span, a[href*="details.php"] b', subtitle: 'td.embedded', rating: 'img[src*="icon-imdb.png"], img[src*="icon-douban.png"]', table: 'table.torrents' },
                buttonSize: '16px',
                extractChineseTitle: (text) => {
                    text = removeExcludedContent(text);
                    const tags = ['官组', '禁转', 'DIY', '国语', '中字', '繁体', '简体', '字幕', '双语', '原版', '特效', '限转', '首发', '杜比', 'DTS', 'HD', 'MA', 'TrueHD', '内嵌', '外挂', '英字', '日字', '韩字', '4K', '1080p', '720p', '2160p', 'UHD', 'HDR', '重编码', '重制', '修复', '收藏', '蓝光', '原盘', '压制', 'DoVi+HDR', 'Dolby Vision', 'HDR10', 'Atmos', '次世代国语', 'DIY纯净版', 'DTS-X', '全景声国语', '粤语', '去头尾广告纯净版'];
                    let content = text.trim();
                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (let tag of tags) {
                            if (content.startsWith(tag)) {
                                content = content.substring(tag.length).trim();
                                changed = true;
                                break;
                            }
                        }
                    }
                    content = content.split('|')[0].trim();
                    const match = content.match(/^([^/]*?)(?=\s*[/第全]|\s*h[357]|$)/i);
                    const result = (match ? match[1] : content).replace(/\s*h[357]\s*$/i, '').trim();
                    return result && /[\u4e00-\u9fa5]/.test(result) && result.length >= 2 ? result : null;
                }
            };
        } else if (hostname.includes('audiences.me')) {
            return {
                name: 'Audiences',
                selectors: { row: 'table.torrents tr', title: 'a[href*="details.php"] b', subtitle: 'span[style*="padding: 2px"]', table: 'table.torrents' },
                buttonSize: '16px',
                extractChineseTitle: (text) => {
                    text = removeExcludedContent(text);
                    const alsoKnownIndex = text.indexOf('又名');
                    if (alsoKnownIndex !== -1) text = text.substring(0, alsoKnownIndex).trim();
                    const asteriskIndex = text.indexOf('*');
                    if (asteriskIndex !== -1) text = text.substring(0, asteriskIndex).trim();
                    const tags = ['官方', '中字', '完结', 'Dolby Vision', '应求', 'HDR10', 'HDR10+', '官字组', '禁转', '动画', 'DIY', '限转', '国语', '粤语'];
                    let content = text.trim();
                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (let tag of tags) {
                            if (content.startsWith(tag)) {
                                content = content.substring(tag.length).trim();
                                changed = true;
                                break;
                            }
                        }
                    }
                    content = content.split('|')[0].trim();
                    let match = content.match(/^([^\s第]*[\u4e00-\u9fa5][^\s第]*?)(?:\s+第\d+集)?/);
                    if (!match) match = content.match(/^([^/]*?)(?=\s*[/第全]|\s*h[357]|$)/i);
                    const result = (match ? match[1] : content).replace(/\s*h[357]\s*$/i, '').trim();
                    return result && /[\u4e00-\u9fa5]/.test(result) && result.length >= 2 ? result : null;
                }
            };
        } else if (hostname.includes('pterclub.com')) {
            return {
                name: 'PTerClub',
                selectors: { row: 'table.torrents tr', title: 'a[href*="details.php"] b', subtitle: 'div[style*="margin-top: 4px"]', table: 'table.torrents' },
                buttonSize: '16px',
                extractChineseTitle: (text) => {
                    text = removeExcludedContent(text);
                    const alsoKnownIndex = text.indexOf('又名');
                    if (alsoKnownIndex !== -1) text = text.substring(0, alsoKnownIndex).trim();
                    const asteriskIndex = text.indexOf('*');
                    if (asteriskIndex !== -1) text = text.substring(0, asteriskIndex).trim();
                    const tags = ['官方', '中字', '完结', 'Dolby Vision', '应求', 'HDR10', 'HDR10+', '官字组', '禁转', '动画', 'DIY', '限转', '国语', '粤语', '杜比', 'DTS', 'HD', 'MA', 'TrueHD'];
                    let content = text.trim();
                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (let tag of tags) {
                            if (content.startsWith(tag)) {
                                content = content.substring(tag.length).trim();
                                changed = true;
                                break;
                            }
                        }
                    }
                    content = content.split('|')[0].trim();
                    let match = content.match(/^([^\s第]*[\u4e00-\u9fa5][^\s第]*?)(?:\s+第\d+.*)?/);
                    if (!match) match = content.match(/^([^/]*?)(?=\s*[/第全]|\s*h[357]|$)/i);
                    const result = (match ? match[1] : content).replace(/\s*h[357]\s*$/i, '').trim();
                    return result && /[\u4e00-\u9fa5]/.test(result) && result.length >= 2 ? result : null;
                }
            };
        } else if (hostname.includes('springsunday.net')) {
            return {
                name: 'SSD',
                selectors: { row: 'table.torrents tr', title: 'a[href*="details.php"]', subtitle: 'div.torrent-smalldescr', table: 'table.torrents' },
                buttonSize: '16px',
                extractChineseTitle: (text) => {
                    text = removeExcludedContent(text);
                    const slashIndex = text.indexOf('/');
                    if (slashIndex !== -1) text = text.substring(0, slashIndex).trim();
                    const asteriskIndex = text.indexOf('*');
                    if (asteriskIndex !== -1) text = text.substring(0, asteriskIndex).trim();
                    const tags = ['CMCTV', '官方', '国配', '中字', '动画', '特效', '原生', '自购', '合集', '禁转', '驻站', 'CatEDU', 'HDR10', 'CMCTA', 'DIY', 'DoVi', 'HDR10+', '杜比', 'DTS', 'HD', 'MA', 'TrueHD', '内嵌', '外挂', '英字', '日字', '韩字', '4K', '1080p', '720p', '2160p', 'UHD', 'HDR', '重编码', '重制', '修复', '收藏', '蓝光', '原盘', '压制', 'Dolby Vision', '菁彩HDR', 'HLG', 'CC', '3D', '应求', '活动', '国语', '粤语'];
                    let content = text.trim();
                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (let tag of tags) {
                            if (content.startsWith(tag)) {
                                content = content.substring(tag.length).trim();
                                changed = true;
                                break;
                            }
                        }
                    }
                    content = content.split('|')[0].trim();
                    let match = content.match(/^([^\s第]*[\u4e00-\u9fa5][^\s第]*?)(?:\s+第\d+.*)?/);
                    if (!match) match = content.match(/^([^/]*?)(?=\s*[/第全]|\s*h[357]|$)/i);
                    const result = (match ? match[1] : content).replace(/\s*h[357]\s*$/i, '').trim();
                    return result && /[\u4e00-\u9fa5]/.test(result) && result.length >= 2 ? result : null;
                },
                extractEnglishTitleForYouTube: (englishTitle) => {
                    let title = englishTitle;
                    const yearMatch = title.match(/\.(\d{4})\./);
                    const year = yearMatch ? yearMatch[1] : '';
                    title = title.replace(/\.S\d+E\d+(-E\d+)?/gi, '.').replace(/\.S\d+/gi, '.');
                    if (year) {
                        const yearIndex = title.indexOf(`.${year}.`);
                        if (yearIndex !== -1) title = title.substring(0, yearIndex);
                    } else {
                        const techPatterns = [/\.\d{3,4}p\./i, /\.BluRay\./i, /\.Blu-ray\./i, /\.WEB-DL\./i, /\.HDTV\./i, /\.ATVP\./i, /\.H26[45]\./i, /\.x26[45]\./i];
                        let cutIndex = title.length;
                        for (let pattern of techPatterns) {
                            const match = title.match(pattern);
                            if (match && match.index < cutIndex) cutIndex = match.index;
                        }
                        title = title.substring(0, cutIndex);
                    }
                    title = title.replace(/\.(CEE|JPN|USA|GBR|FRA|GER|ITA|ESP|KOR|CHN|TWN|HKG|IND|RUS)\./gi, '.');
                    title = title.replace(/\.+/g, '.').replace(/^\.|\.$/g, '').replace(/\./g, ' ').trim().replace(/\s+/g, ' ');
                    return { title: title, year: year };
                }
            };
        }

        // 2. 新站点组 (纯英文)
        else if (hostname.includes('hdbits.org')) {
            return { name: 'HDBits', type: 'englishOnly', selectors: { row: '#torrent-list tr[id^="t"]', title: 'a[href*="details.php?id="]', table: '#torrent-list' }, buttonSize: '16px', extractEnglishTitle: englishSiteTitleExtractor };
        } else if (hostname.includes('beyond-hd.me')) {
            return { name: 'BeyondHD', type: 'englishOnly', selectors: { row: 'div.table-torrents tbody tr[id^="torrentposter"]', title: 'a.torrent-name', table: 'div.table-torrents' }, buttonSize: '14px', extractEnglishTitle: englishSiteTitleExtractor };
        } else if (hostname.includes('broadcasthe.net')) {
            return { name: 'BroadcastheNet', type: 'englishOnly', selectors: { row: 'tr.torrent', title: 'a[title="View Series"]', table: '#torrent_table' }, buttonSize: '16px' };
        }

        return null;
    };


    // =================================================================================
    // 脚本核心功能区
    // =================================================================================
    const config = getSiteConfig();
    if (!config) return;

    const processedClass = `${config.name.toLowerCase()}-processed`;
    const icons = {
        youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: #ff0000;"><path d="M21.582,6.186c-0.23-0.854-0.908-1.532-1.762-1.762C18.254,4,12,4,12,4S5.746,4,4.18,4.424 c-0.854,0.23-1.532,0.908-1.762,1.762C2,7.754,2,12,2,12s0,4.246,0.418,5.814c0.23,0.854,0.908,1.532,1.762,1.762 C5.746,20,12,20,12,20s6.254,0,7.82-0.424c0.854-0.23,1.532-0.908,1.762-1.762C22,16.246,22,12,22,12S22,7.754,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"></path></svg>`,
        douyin: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
        douban: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: #00b600;"><path d="M17.9 3H6.1C4.39 3 3 4.39 3 6.1v11.8C3 19.61 4.39 21 6.1 21h11.8c1.71 0 3.1-1.39 3.1-3.1V6.1C21 4.39 19.61 3 17.9 3zM18 6v1H6V6h12zm-1 8h-1v1h1v1H7v-1h1v-1H7v-3h1v-1H7V9h1V8h8v1h1v1h-1v1h1v3zM7 18v-1h10v1H7z"/><path d="M9 11h6v2H9z"/></svg>`
    };

    GM_addStyle(`
        .trailer-btn { display: inline-flex !important; align-items: center; justify-content: center; height: ${config.buttonSize}; width: ${config.buttonSize}; margin: 0 4px 0 0; cursor: pointer; vertical-align: middle; }
        .trailer-btn:hover { opacity: 0.7; } .trailer-douyin { color: #000; } .trailer-douban { color: #00b600; }
        #torrent-list .trailer-btn, .browse_td_name_cell .trailer-btn { margin-right: 4px; margin-left: 2px; }
        .meta-stat > .trailer-btn { margin-left: 3px; margin-right: 3px; }
        #torrent_table .trailer-btn { margin-right: 3px; }
        tr.torrent > td > span > .trailer-btn { margin-right: 3px !important; } /* for BroadcastheNet */
    `);

    const createButton = (type, term, displayTitle) => {
        const btn = document.createElement('a');
        btn.className = `trailer-btn trailer-${type}`;
        btn.title = `在${type === 'youtube' ? 'YouTube' : type === 'douyin' ? '抖音' : '豆瓣'}中搜索: ${displayTitle}`;
        let url;
        if (type === 'youtube') {
            url = `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`;
        } else if (type === 'douyin') {
            url = `https://www.douyin.com/search/${encodeURIComponent(term)}`;
        } else if (type === 'douban') {
            url = `https://search.douban.com/movie/subject_search?search_text=${encodeURIComponent(term)}`;
        }
        btn.innerHTML = icons[type];
        btn.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            window.open(url, `${type}_search`, 'width=800,height=600,resizable=yes,scrollbars=yes');
        };
        return btn;
    };

    // 为原始站点组生成YouTube搜索词的函数 (来自v1.2)
    const getOriginalYouTubeSearch = (title, mainTitle) => {
        if (config.name === 'SSD' && config.extractEnglishTitleForYouTube) {
            const { title: englishTitle, year } = config.extractEnglishTitleForYouTube(mainTitle);
            return year ? `${englishTitle} ${year} Trailer` : `${englishTitle} Trailer`;
        }
        const tvMatch = title.match(/^(.*?)\s+(S\d{1,2})\s+(\d{4})/);
        if (tvMatch) return `${tvMatch[1].trim()} ${tvMatch[2]} ${tvMatch[3]} Trailer`;
        const movieMatch = title.match(/^(.*?)\s+(\d{4})/);
        return movieMatch ? `${movieMatch[1].trim()} ${movieMatch[2]} Trailer` : `${title} Trailer`;
    };


    const processRow = row => {
        if (row.classList.contains(processedClass) || row.querySelector('td.colhead') || row.querySelector('.trailer-btn')) return;

        const titleEl = row.querySelector(config.selectors.title);
        if (!titleEl) return;

        const mainTitle = titleEl.textContent.trim();
        row.classList.add(processedClass);

        // =========================================================================
        // A. 新站点组 (纯英文) 的处理逻辑
        // =========================================================================
        if (config.type === 'englishOnly') {
            let extractedTitle, year;

            if (config.name === 'BroadcastheNet') {
                extractedTitle = mainTitle;
                year = '';
            } else { // HDBits, BeyondHD
                const extracted = config.extractEnglishTitle(mainTitle);
                extractedTitle = extracted.title;
                year = extracted.year;
            }

            if (extractedTitle) {
                const youtubeSearchTerm = year ? `${extractedTitle} ${year} Trailer` : `${extractedTitle} Trailer`;
                const doubanSearchTerm = year ? `${extractedTitle} ${year}` : extractedTitle;
                const ytBtn = createButton('youtube', youtubeSearchTerm, extractedTitle);
                const dbBtn = createButton('douban', doubanSearchTerm, extractedTitle);

                // 各站点的按钮插入逻辑
                if (config.name === 'HDBits') {
                    const titleCell = row.querySelector('.browse_td_name_cell');
                    const downloadLink = titleCell?.querySelector('a[href*="/download.php"]');
                    if (downloadLink) {
                        titleCell.insertBefore(dbBtn, downloadLink);
                        titleCell.insertBefore(ytBtn, downloadLink);
                    }
                } else if (config.name === 'BeyondHD') {
                    const metaStatSpan = row.querySelector('span.meta-stat');
                    if (metaStatSpan) {
                        metaStatSpan.insertBefore(dbBtn, metaStatSpan.firstChild);
                        metaStatSpan.insertBefore(ytBtn, metaStatSpan.firstChild);
                    }
                } else if (config.name === 'BroadcastheNet') {
                    const downloadLink = row.querySelector('a[title="Download"]');
                    if (downloadLink) {
                        const parent = downloadLink.parentElement;
                        parent.insertBefore(dbBtn, downloadLink);
                        parent.insertBefore(ytBtn, downloadLink);
                    }
                }
            }
        }
        // =========================================================================
        // B. 原始站点组 (中英文混合) 的处理逻辑 (源自 v1.2)
        // =========================================================================
        else {
            const subtitleEl = row.querySelector(config.selectors.subtitle);
            if (!subtitleEl) return;

            let subtitleText = '';
            // 特殊站点副标题提取
            if (config.name === 'HDSky') {
                const spans = subtitleEl.querySelectorAll('span');
                for (let span of spans) {
                    const text = span.textContent.trim();
                    if (/[\u4e00-\u9fa5]/.test(text) && !span.classList.contains('optiontag')) { subtitleText = text; break; }
                }
            } else if (config.name === 'PTerClub') {
                const span = subtitleEl.querySelector('span');
                if (span) subtitleText = span.textContent || '';
            } else if (config.name === 'SSD') {
                const spans = subtitleEl.querySelectorAll('span');
                for (let i = spans.length - 1; i >= 0; i--) {
                    const span = spans[i], text = span.textContent.trim();
                    if (span.hasAttribute('title') && /[\u4e00-\u9fa5]/.test(text)) { subtitleText = text; break; }
                }
            } else {
                subtitleText = subtitleEl.textContent || '';
            }

            // 提取中文标题，并据此创建按钮
            const chTitle = config.extractChineseTitle(subtitleText);
            const ytSearchTerm = getOriginalYouTubeSearch(mainTitle, mainTitle);
            const ytBtn = createButton('youtube', ytSearchTerm, mainTitle);
            const dyBtn = chTitle ? createButton('douyin', `${chTitle} 预告片`, chTitle) : null;
            const dbBtn = chTitle ? createButton('douban', chTitle, chTitle) : null;

            // 各站点按钮插入逻辑 (源自 v1.2)
            if (config.name === 'HHCLUB') {
                const ratingEl = row.querySelector(config.selectors.rating);
                if (ratingEl) {
                    const container = ratingEl.parentElement.parentElement;
                    const ratingSpan = ratingEl.parentElement;
                    if (dbBtn) container.insertBefore(dbBtn, ratingSpan);
                    if (dyBtn) container.insertBefore(dyBtn, ratingSpan);
                    container.insertBefore(ytBtn, ratingSpan);
                }
            } else if (config.name === 'HDSky') {
                const firstSpan = subtitleEl.querySelector('span.optiontag') || subtitleEl.firstChild;
                if(firstSpan){
                    if (dbBtn) subtitleEl.insertBefore(dbBtn, firstSpan);
                    if (dyBtn) subtitleEl.insertBefore(dyBtn, firstSpan);
                    subtitleEl.insertBefore(ytBtn, firstSpan);
                }
            } else if (config.name === 'Audiences') {
                const container = subtitleEl.parentElement;
                if (dbBtn) container.insertBefore(dbBtn, container.firstChild);
                if (dyBtn) container.insertBefore(dyBtn, container.firstChild);
                container.insertBefore(ytBtn, container.firstChild);
            } else if (['PTerClub', 'SSD'].includes(config.name)) {
                if (dbBtn) subtitleEl.insertBefore(dbBtn, subtitleEl.firstChild);
                if (dyBtn) subtitleEl.insertBefore(dyBtn, subtitleEl.firstChild);
                subtitleEl.insertBefore(ytBtn, subtitleEl.firstChild);
            } else { // CHDBits
                const tagContainer = subtitleEl.querySelector('div[style*="display:inline-block"]');
                const insertBefore = tagContainer || subtitleEl.firstChild;
                if (dbBtn) subtitleEl.insertBefore(dbBtn, insertBefore);
                if (dyBtn) subtitleEl.insertBefore(dyBtn, insertBefore);
                subtitleEl.insertBefore(ytBtn, insertBefore);
            }
        }
    };

    const processAll = () => document.querySelectorAll(config.selectors.row).forEach(processRow);

    const init = () => {
        setTimeout(processAll, 500);
        const targetNode = document.querySelector(config.selectors.table);
        if (targetNode) {
            new MutationObserver(mutations => {
                const hasNewRows = mutations.some(m => Array.from(m.addedNodes).some(n =>
                    n.nodeType === 1 && (n.matches?.(config.selectors.row) || n.querySelector?.(config.selectors.row))
                ));
                if (hasNewRows) setTimeout(processAll, 300);
            }).observe(targetNode, { childList: true, subtree: true });
        } else {
            setInterval(processAll, 1000);
        }
    };

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();