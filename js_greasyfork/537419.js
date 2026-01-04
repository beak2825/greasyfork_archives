// ==UserScript==
// @name           SexInSex管理评分辅助
// @namespace      sexinsex.phygelus.second
// @version        1.0.1.20250527
// @description    管理员评分辅助
// @author         phygelus
// @include        *://*sexinsex.net/*
// @include        *://*sis.xxx/*
// @include        *://*bluerockcafe.com/*
// @include        *://174.127.195*/*
// @include        *://*1*2*3*.com/*
// @include        *://*3d3d3d.net/*
// @include        *://*9dizhi.com/*
// @include        *://*bluerocks.cc/*
// @include        *://*bobo123.one/*
// @include        *://*btnihao.com/*
// @include        *://*catsis.info/*
// @include        *://*d44.icu/*
// @include        *://*easygo1.net/*
// @include        *://*fastspeedtank.net/*
// @include        *://*gapipi.com/*
// @include        *://*goeasyspeed.net/*
// @include        *://*happybar8.net/*
// @include        *://*joyplacetobe.com/*
// @include        *://*nihao*.net/*
// @include        *://*pinktechmate.net/*
// @include        *://*popopo.me/*
// @include        *://*relaxhappylife.com/*
// @include        *://*sis*.net/*
// @include        *://*solc.one/*
// @include        *://*stepncafe.com/*
// @include        *://*swimtoofast.com/*
// @include        *://*t*t*t*.com/*
// @include        *://*thatsucks.info/*
// @include        *://*twinai.xyz/*
// @include        *://*v2r.club/*
// @include        *://*vr1p.com/*
// @include        *://*whereismy*.com/*
// @include        *://*win4you.net/*
// @include        *://*yaayaa.net/*
// @grant          none
// @license        MIT License  //共享规则
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/537419/SexInSex%E7%AE%A1%E7%90%86%E8%AF%84%E5%88%86%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/537419/SexInSex%E7%AE%A1%E7%90%86%E8%AF%84%E5%88%86%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pageInfo = {
        domain: '未检测到有效域名'
    };

    const tid = (() => {
        const urlTid = new URLSearchParams(window.location.search).get('tid');
        if (urlTid) return urlTid;
        const pathMatch = window.location.pathname.match(/\/thread-(\d+)/);
        return pathMatch ? pathMatch[1] : null;
    })();
    if (document.querySelector(`a[onclick^="ajaxget('thanks.php?tid=${tid}"]`)) {
        ajaxget('thanks.php?tid=' + tid, 'thanksdiv');
    }

    let urlTxtPage = '0';
    const currentUrl = new URL(window.location.href);
    const isQueryFormat = currentUrl.searchParams.has('tid') && currentUrl.searchParams.has('page');
    const isPathFormat = /-\d+-/.test(currentUrl.pathname);
    if (isQueryFormat || isPathFormat) {
        urlTxtPage = isQueryFormat
            ? currentUrl.searchParams.get('page')
            : currentUrl.pathname.match(/-\d+-(\d+)-/)[1];;
    }

    async function fetchPMData() {
        if (!pageInfo.domain || pageInfo.domain === '未检测到有效域名') {
            console.log('缺少域名信息，无法检测私信');
            return;
        }

        const pmUrl = `https://${pageInfo.domain}/bbs/pm.php`;

        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const loadPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('私信页面加载超时（10秒）'));
                    document.body.removeChild(iframe);
                }, 10000);

                iframe.onload = () => {
                    clearTimeout(timeout);
                    resolve(iframe.contentDocument);
                };

                iframe.onerror = (e) => {
                    clearTimeout(timeout);
                    reject(e);
                };
            });

            iframe.src = pmUrl;
            const iframeDoc = await loadPromise;

            const unreadSpan = iframeDoc.querySelector('#pm_unread');

            if (unreadSpan) {
                const unreadCount = parseInt(unreadSpan.textContent.trim(), 10);
                const noticeCountEl = document.getElementById('noticeCount');

                if (unreadCount > 0) {
                    noticeBlock.style.display = 'flex';
                    noticeCountEl.textContent = unreadCount;
                } else {
                    noticeBlock.style.display = 'none';
                    noticeCountEl.textContent = '0';
                }
            } else {
                console.warn('未找到未读私信计数器');
                noticeBlock.style.display = 'none';
            }

            document.body.removeChild(iframe);
        } catch (error) {
            console.error('私信检测失败:', error);
            noticeBlock.style.display = 'none';
        }
    }

    let firstPageDataCache = null;
    async function fetchFirstPageData() {
        if (firstPageDataCache) return firstPageDataCache;

        if (!tid || pageInfo.domain === '未检测到有效域名') {
            console.log('缺少必要参数，无法获取第一页数据');
            return;
        }

        const targetUrl = `https://${pageInfo.domain}/bbs/thread-${tid}-1-1.html`;

        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const loadPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('页面加载超时（10秒）'));
                    document.body.removeChild(iframe);
                }, 10000);

                iframe.onload = () => {
                    clearTimeout(timeout);
                    resolve(iframe.contentDocument);
                };

                iframe.onerror = (e) => {
                    clearTimeout(timeout);
                    reject(e);
                };
            });

            iframe.src = targetUrl;

            const iframeDoc = await loadPromise;

            const extractedData = extractPostDataFromDoc(iframeDoc, true);

            if (extractedData.length === 0) {
                console.log('第一页未检测到有效帖子数据');
                return;
            }

            window.firstPageData = extractedData;

            console.groupCollapsed(`%c[静默获取] 第一页数据（2楼起，共${extractedData.length}条）`, 'color: #1E90FF; font-weight: bold;');
            extractedData.forEach(([floor, details]) => {
                console.log(`%c${floor}楼`, 'color: #006400;');
                console.log('TID:', details.tid);
                console.log('页码:', details.page);
                console.log('作者ID:', details.authorid);
                console.log('来源ID:', details.fromuid);
                console.log('帖子ID:', details.pid);
                console.log('内容:', details.content);
                console.log('评分:', details.ratings);
                console.log('----------');
            });
            console.groupEnd();

        } catch (error) {
            console.error('静默获取失败:', error);
        } finally {
            document.body.removeChild(iframe);
        }
        firstPageDataCache = extractedData;
    }

    function extractPostDataFromDoc(doc, skipFirstFloor = false) {
        const posts = doc.querySelectorAll('td.postcontent');
        const results = [];

        posts.forEach((postContainer, index) => {
            if (skipFirstFloor && index === 0) return;

            const postInfo = postContainer.querySelector('.postinfo');
            const postContent = postContainer.querySelector('.postmessage.defaultpost');
            const authorTd = postContainer.closest('tr').querySelector('.postauthor');

            if (!postInfo || !postContent || !authorTd) return;

            const strongElement = postInfo.querySelector('strong');
            const floorText = strongElement?.textContent?.replace('楼', '') || '未知楼层';

            const params = new Map();

            const parseHashParams = (url) => {
                const hash = url.hash;
                const params = {};
                const pidMatch = hash.match(/#pid(\d+)/);
                if (pidMatch) params.pid = pidMatch[1];
                new URLSearchParams(hash.replace(/^#/, '')).forEach((v, k) => {
                    params[k] = v;
                });
                return params;
            };

            const primaryLink = postInfo.querySelector('strong[onclick*="fromuid="]');
            if (primaryLink) {
                try {
                    const rawUrl = primaryLink.getAttribute('onclick')
                        .match(/setcopy\('(.*?)',/)[1]
                        .replace(/&amp;/g, '&');

                    const url = new URL(rawUrl, window.location.origin);

                    const hashParams = parseHashParams(url);

                    ['tid', 'page', 'fromuid', 'pid'].forEach(key => {
                        if (hashParams[key] !== undefined) {
                            params.set(key, hashParams[key]);
                        }
                        else if (url.searchParams.has(key)) {
                            params.set(key, url.searchParams.get(key));
                        }
                    });
                } catch (error) {
                    console.warn('主链接解析失败:', primaryLink, error);
                }
            }

            postInfo.querySelectorAll('a').forEach(link => {
                try {
                    const href = link.href;
                    const url = new URL(link.href, window.location.origin);
                    const searchParams = new URLSearchParams(url.search);
                    const hashParams = parseHashParams(url);

                    ['tid', 'page', 'authorid', 'fromuid', 'pid'].forEach(key => {
                        if (searchParams.has(key)) {
                            params.set(key, searchParams.get(key));
                        } else if (hashParams[key] !== undefined) {
                            params.set(key, hashParams[key]);
                        }
                    });
                } catch (error) {
                    console.warn('链接解析失败:', link.href, error);
                }
            });

            const getParam = (key) => {
                const value = params.get(key) || '未知' + key;
                return value;
            };

            let contentText = '未知内容';
            let emojiCount = 0;
            const mainContent = postContent.querySelector('[id^="postmessage_"]');

            if (mainContent) {
                const clonedContent = mainContent.cloneNode(true);

                ['.quote', 'blockquote', 'div.notice', 'img', 'fieldset', 'table'].forEach(selector => {
                    clonedContent.querySelectorAll(selector).forEach(el => el.remove());
                });

                let processedContent = clonedContent.innerHTML
                    .replace(/<br>/g, '\n')
                    .replace(/<\/?div[^>]*>/gi, '')
                    .replace(/^[\s&nbsp;]*|[\s&nbsp;]*$/g, '')
                    .replace(/\[<i> 本帖最后由 .*? <\/i>\]/gs, '')
                    .replace(/\[<i> Last edited by .*? <\/i>\]/gs, '')
                    .replace(/\n+/g, '\n')
                    .replace(/[ \t\u3000]+/g, ' ')
                    .replace(/^\n+|\n+$/g, '')
                    .replace(/\n$/, '\n')
                    .trim();

                processedContent = processedContent.replace(
                    /(\n{4})?\[<i> 本帖最后由 .*? <\/i>\]/g,
                    ''
                ).replace(/\n{4}$/, '');
                contentText = processedContent;
            }

            let ratings = [];
            const ratingLegend = postContent.querySelector('fieldset legend a');
            const ratingItems = postContent.querySelectorAll('fieldset ul li');

            if (ratingLegend) {
                ratings.push(ratingLegend.title);
            }

            ratingItems.forEach(item => {
                const user = item.querySelector('cite a')?.textContent?.trim();
                const amount = item.querySelector('strong')?.textContent?.trim();
                const reason = item.querySelector('em')?.textContent?.trim();
                if (user && amount) {
                    ratings.push(`${user} ${amount}${reason ? `(${reason})` : ''}`);
                }
            });

            const postAuthorTd = postContainer.closest('tr').querySelector('.postauthor');

            let username = '';
            const authorCite = postContainer.closest('tr').querySelector('.postauthor cite a.dropmenu');
            if (authorCite) {
                username = authorCite.textContent.trim();
            }

            let avatarHtml = '';
            let userLevel = '';
            const processedUserInfo = {};
            let postDate = '';

            let deletedUser = null;
            if (postAuthorTd?.textContent?.trim().includes('该用户已被删除')) {
                deletedUser = '该用户已被删除';
            } else {
                const avatarDiv = postAuthorTd ? postAuthorTd.querySelector(':scope > .avatar') : null;
                if (avatarDiv) {
                    const imgTag = avatarDiv.querySelector(':scope > img:first-child');
                    if (imgTag) avatarHtml = imgTag.outerHTML;
                }

                if (postAuthorTd) {
                    const avatarDiv = postAuthorTd.querySelector('.avatar');
                    if (avatarDiv) {
                        const targetP = avatarDiv.nextElementSibling;
                        if (targetP && targetP.tagName === 'P') {
                            const levelFont = targetP.querySelector('em > font');
                            if (levelFont) userLevel = levelFont.textContent.trim().replace(/\s+/g, ' ');
                        }
                    }
                }

                const userInfo = {
                    posts: '',
                    digests: '',
                    credits: '',
                    coins: '',
                    originals: '',
                    prestige: '',
                    supports: '',
                    thanks: '',
                    contributions: '',
                    sponsors: '',
                    promotions: '',
                    readPerm: '',
                    regDate: ''
                };

                if (postAuthorTd) {
                    const profileDl = postAuthorTd.querySelector('.profile');
                    if (profileDl) {
                        profileDl.querySelectorAll('dt').forEach(dt => {
                            const key = dt.textContent.trim();
                            const value = dt.nextElementSibling?.textContent.trim().replace(/[\s\u00A0]+/g, '');
                            if (key.includes('帖子')) userInfo.posts = extractValue(value);
                            if (key.includes('精华')) userInfo.digests = extractValue(value);
                            if (key.includes('积分')) userInfo.credits = extractValue(value);
                            if (key.includes('金币')) userInfo.coins = extractValue(value);
                            if (key.includes('原创')) userInfo.originals = extractValue(value);
                            if (key.includes('威望')) userInfo.prestige = extractValue(value);
                            if (key.includes('支持')) userInfo.supports = extractValue(value);
                            if (key.includes('感谢')) userInfo.thanks = extractValue(value);
                            if (key.includes('贡献')) userInfo.contributions = extractValue(value);
                            if (key.includes('赞助')) userInfo.sponsors = extractValue(value);
                            if (key.includes('推广')) userInfo.promotions = extractValue(value);
                            if (key.includes('阅读权限')) userInfo.readPerm = extractValue(value);
                            if (key.includes('注册时间')) userInfo.regDate = formatRegDate(value);
                        });
                    }
                    processedUserInfo.digests = formatUserValue(userInfo.digests);
                    processedUserInfo.coins = formatUserValue(userInfo.coins);
                    processedUserInfo.originals = formatUserValue(userInfo.originals);
                    processedUserInfo.prestige = formatUserValue(userInfo.prestige);
                    processedUserInfo.contributions = formatUserValue(userInfo.contributions);
                    processedUserInfo.sponsors = formatUserValue(userInfo.sponsors);
                    processedUserInfo.regDate = formatRegDate(userInfo.regDate);
                }

                const postInfoDiv = postContainer.closest('tr').querySelector('.postinfo');

                if (postInfoDiv) {
                    const textContent = postInfoDiv.textContent;
                    const dateMatch = textContent.match(/发表于\s+([\d-：:\s]+)/);
                    if (dateMatch) postDate = dateMatch[1].replace(/[\s&nbsp;]+$/, '').trim();
                }
            }
            results.push([
                floorText,
                {
                    tid: getParam('tid'),
                    page: getParam('page'),
                    authorid: getParam('authorid'),
                    fromuid: getParam('fromuid'),
                    pid: getParam('pid'),
                    content: contentText,
                    ratings: ratings.length > 0 ? ratings.join(' | ') : '无评分记录',
                    avatarHtml: avatarHtml,
                    userLevel: userLevel,
                    userInfo: processedUserInfo,
                    postDate: postDate,
                    username: username,
                    deletedUser: deletedUser
                }
            ]);
        });

        return results;
    }

    function detectDuplication(currentContent, firstPageContents) {
        const cacheKey = `${currentContent.slice(0, 20)}...`;
        if (detectDuplication.cache.has(cacheKey)) {
            return detectDuplication.cache.get(cacheKey);
        }

        const currentSegments = segmentContent(currentContent);
        let maxMatch = 0;
        let matchedSegments = [];
        let fullMatch = false;
        let matchedFloors = [];

        firstPageContents.forEach((content, floor) => {
            const segments = segmentContent(content);
            currentSegments.forEach((segment, index) => {
                if (segments.includes(segment) && !matchedSegments.includes(segment)) {
                    matchedSegments.push(segment);
                    maxMatch = Math.max(maxMatch, segments.filter(s => s === segment).length);
                    if (!matchedFloors.includes(floor)) matchedFloors.push(floor);
                }
            });
        });

        if (matchedSegments.length < 2) {
            firstPageContents.forEach((content, floor) => {
                if (content.includes(currentContent)) {
                    fullMatch = true;
                    matchedFloors = [floor];
                }
            });
        }

        if (matchedSegments.length < 2 && !fullMatch) {

            const rawKeywords = currentContent.match(/[\u4e00-\u9fa5]{2,}/g) || [];
            const stopwords = new Set(["哈哈", "呵呵", "啊啊"]);
            const filteredKeywords = rawKeywords.filter(kw => !stopwords.has(kw));

            const corePhrases = filteredKeywords.join('').match(/[\u4e00-\u9fa5]{5,}/g) || [];
            const generateNGrams = (text, n) => Array.from({ length: text.length - n + 1 }, (_, i) => text.slice(i, i + n));
            const phrases = corePhrases.flatMap(phrase => generateNGrams(phrase, 5));

            let currentScore = 0;
            const matchedFloorsSet = new Set(matchedFloors);
            const phraseCounts = new Map();

            phrases.forEach(phrase => {
                firstPageContents.forEach((content, floor) => {
                    if (content.includes(phrase) && !matchedFloorsSet.has(floor)) {
                        if (!phraseCounts.has(phrase)) {
                            currentScore += 5;
                            phraseCounts.set(phrase, true);
                            matchedSegments.push(`${phrase}`);
                        }
                        matchedFloorsSet.add(floor);
                    }
                });
            });

            const scoreThreshold = 1;

            if (currentScore >= scoreThreshold) {
                matchedFloors = Array.from(matchedFloorsSet);
                maxMatch = Math.max(maxMatch, 5);
            }

            console.groupEnd();
        }


        const result = {
            segments: [...new Set(matchedSegments)],
            fullMatch,
            score: Math.max(maxMatch, fullMatch ? 1 : 0),
            matchedFloors
        };

        detectDuplication.cache.set(cacheKey, result);
        if (detectDuplication.cache.size > 100) {
            detectDuplication.cache.delete(
                [...detectDuplication.cache.keys()].sort(() => 0.5 - Math.random())[0]
            );
        }

        return result;
    }
    detectDuplication.cache = new Map();

    function segmentContent(content) {
        const splitters = /[。！？，、；：“”‘’（）【】《》…！？.,;:"'()\[\]\{\}\-—]/;
        return content.split(splitters)
            .filter(segment => segment.trim().length > 5)
            .map(segment => segment.trim());
    }

    const btn = document.createElement('button');
    btn.id = 'smartButton';
    btn.innerHTML = '查';

    const menu = document.createElement('div');
    menu.id = 'smartMenu';
    ['管理员查水评分辅助', '功能暂定1', '功能暂定2'].forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.textContent = item;
        menu.appendChild(menuItem);
    });

    document.body.appendChild(btn);
    document.body.appendChild(menu);

    const detailPanel = document.createElement('div');
    detailPanel.id = 'smartDetailPanel';
    detailPanel.innerHTML = `
        <div class="detail-header">
            <span class="code-author" title="反馈BUG">@phygelus派大星</span>
            <span class="detail-title">管理员查水评分辅助 - 详细界面</span>
            <button class="close-btn" title="关闭">×</button>
        </div>
        <div class="detail-content">
            <div class="floor-list"></div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* 基础按钮样式 */
        #smartButton {
            position: fixed;
            right: 20px;
            top: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #FFD700;
            color: #B8860B;
            border: 3px solid #FF4500;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            text-shadow: 0 0 12px rgba(255,255,255,0.8),
                         0 0 24px rgba(255,255,255,0.5);
            user-select: none;
        }

        #smartNoticeBlock {
            position: fixed;
            right: 80px;
            top: 20px;
            width: 160px;
            height: 48px;
            border-radius: 24px;
            background: #FF4500;
            color: white;
            border: 3px solid #FFD700;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: none;
            align-items: center;
            justify-content: center;
            text-shadow: 0 0 12px rgba(255,255,255,0.8),
                         0 0 24px rgba(255,255,255,0.5);
            user-select: none;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        #smartNoticeBlock:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        #smartNoticeBlock:active {
            transform: scale(0.95) rotate(-2deg);
            transition: transform 0.1s;
        }

        #noticeText {
            margin-right: 8px;
        }

        #noticeCount {
            background: white;
            color: #FF4500;
            padding: 4px 8px;
            border-radius: 12px;
            min-width: 32px;
            text-align: center;
            font-size: 1.2em;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        #smartButton.active-state {
            background: #90EE90;
            border-color: #1E90FF;
            color: #006400;
            text-shadow: 0 0 20px rgba(255,255,255,1),
                         0 0 40px rgba(255,255,255,0.6);
        }

        #smartButton:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        #smartButton:active {
            transform: scale(0.95);
        }

        #smartMenu {
            position: fixed;
            right: 28px;
            top: 80px;
            background: #90EE90;
            border: 2px solid #1E90FF;
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
            display: none;
            z-index: 9998;
            overflow: hidden;
            backdrop-filter: blur(4px);
            transition: opacity 0.2s, transform 0.2s;
            transform: scale(0.95);
            padding: 8px 24px;
            min-width: auto;
            white-space: nowrap;
        }

        #smartMenu.show {
            display: block;
            transform: scale(1);
            animation: menuSlide 0.3s ease-out;
        }

        .menu-item {
            padding: 12px 24px;
            color: #006400;
            cursor: pointer;
            transition: all 0.2s;
            border-bottom: 2px solid rgba(30,144,255,0.2);
            position: relative;
            overflow: visible;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            min-width: 80px;
            border-radius: 6px;
            user-select: none;
        }

        .menu-item:hover {
            transform: translateX(8px);
            background: rgba(30,144,255,0.1);
            border-radius: 8px;
        }

        .menu-item:hover::after {
            content: ">>";
            position: absolute;
            right: 12px;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .menu-item:active {
            text-shadow: 0 0 20px rgba(255,255,255,1),
                         0 0 40px rgba(255,255,255,0.6);
            transform: scale(0.98);
            color: #FF4500 !important;
        }

        .menu-item.selected {
            background: #1E90FF !important;
            color: white !important;
            text-shadow: 0 0 16px rgba(255,255,255,0.8),
                         0 0 32px rgba(255,255,255,0.4);
            transform: scale(0.98);
            border-radius: 8px;
            margin: 0 4px;
            padding: 12px 24px;
        }

        @keyframes menuSlide {
            from {
                opacity: 0;
                transform: translateY(-10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        #smartDetailPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 75vw;
            height: 75vh;
            background: #90EE90;
            border: 3px solid #1E90FF;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 9999;
            display: none;
            backdrop-filter: blur(8px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        #smartDetailPanel.show {
            display: block;
            transform: translate(-50%, -50%) scale(1);
            animation: panelSlide 0.3s ease-out;
        }

        .detail-header {
            position: relative;
            background: rgba(30,144,255,0.1);
            padding: 8px 16px;
            min-height: auto;
            border-bottom: none;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: space-between; 
        }

        .code-author {
            background: #00640030;
            color: #006400;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.95em;
            font-weight: 600;
            white-space: nowrap;
            
            flex-shrink: 0;
            margin-right: 12px;
            
            cursor: pointer !important;
            transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
            border: 1px solid #00640020;
        }
        
        .code-author:hover {
            background: #00640020;
            transform: scale(1.03);
            box-shadow: 0 2px 4px #00640010;
        }

        .detail-title {
            flex: 1;
            text-align: center;
            color: #006400;
            font-weight: bold;
            user-select: none;
            pointer-events: none;
            white-space: nowrap;
            font-size: 16px;
            line-height: 1.2;
            margin: 0 4px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .close-btn {
            position: static;
            transform: none;
            background: none;
            border: 2px solid #FF4500;
            color: #FF4500;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-left: auto;
        }

        .close-btn:hover {
            background: #FF4500;
            color: white;
            transform: scale(1.1);
        }

        @keyframes panelSlide {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .detail-content {
            padding: 24px 16px 40px !important;
            height: calc(100% - 56px);
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #1E90FF transparent;
        }

        .detail-content {
            padding: 16px;
            height: calc(100% - 56px);
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color:rgb(5, 79, 153) transparent;
        }

        .detail-content::-webkit-scrollbar {
            width: 12px;
            background-color: transparent;
        }

        .detail-content::-webkit-scrollbar-track {
            background-color: transparent;
            border-radius: 4px;
        }

        .detail-content::-webkit-scrollbar-thumb {
            background-color: #1E90FF;
            border-radius: 4px;
            visibility: hidden;
        }

        .detail-content:hover::-webkit-scrollbar-thumb {
            visibility: visible;
        }

        .floor-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: -24px;
        }

        .floor-item {
            background: rgba(255,255,255,0.8);
            border-radius: 8px;
            padding: 12px;
            backdrop-filter: blur(4px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            border: 1px solid rgba(30,144,255,0.3);
        }

        .detail-content::after {
            content: '';
            display: block;
            height: 54px;
        }

        .duplication-warning {
            margin: 12px 0 4px;
            padding: 8px;
            background: #FFF5F5;
            border: 1px solid #FF4444;
            border-left: 6px solid #FF4444;
            border-radius: 4px;
            font-size: 1em;
            color: #CC0000;
            animation: shake 0.5s;
        }

        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
            100% { transform: translateX(0); }
        }

        .source-link-btn {
            margin-top: 12px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #1E90FF 0%, #006400 100%);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 24px;
            cursor: pointer;
            font-size: 1em;
            align-self: flex-start;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            min-width: 140px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .source-link-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s;
            z-index: 1;
        }

        .source-link-btn:hover::before {
            left: 100%;
        }

        .source-link-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(30,144,255,0.3);
            border-color: rgba(255,255,255,0.5);
        }

        .source-link-btn:active {
            transform: scale(0.98);
            background: linear-gradient(135deg, #006400 0%, #1E90FF 100%);
        }

        .loading-indicator {
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            color: #1E90FF;
            padding: 24px;
            background: rgba(255,255,200,0.9);
            border-radius: 8px;
            width: fit-content;
            margin: 24px auto;
            min-width: 200px;
            animation: blink 1.5s infinite;
            position: relative;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        @keyframes blink {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }

        @media (max-width: 768px) {
            .loading-indicator {
                font-size: 1.1em;
                padding: 16px;
                min-width: 160px;
            }
        }

        .floor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            color: #006400;
            border-bottom: 1px solid rgba(30,144,255,0.3);
            padding-bottom: 4px;
            gap: 12px;
        }

        .floor-number {
            font-weight: bold;
            background: #1E90FF;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }

        .topic-info {
            flex-grow: 1;
            text-align: center;
            background: #1E90FF;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            white-space: nowrap;
        }

        .post-id {
            background: #90EE90;
            color: #006400;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            white-space: nowrap;
            position: relative !important;
            z-index: 2 !important;
            pointer-events: auto !important;
            touch-action: manipulation !important;
        }

        .post-content {
            color: #2F4F4F;
            line-height: 1.4;
            white-space: normal;
            text-align: left;
            word-break: break-word;
            display: flex;
            gap: 12px;
        }

        .user-left {
            width: 160px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .user-right {
            flex-grow: 1;
            min-width: 0;
        }

        .avatar-container {
            display: block;
            margin: 0 auto;
            line-height: 0 !important;
            overflow: visible !important;
            width: 120px !important;
            min-width: 120px !important;
            margin-bottom: 12px;
        }

        .avatar-container .avatar,
        .avatar-container img { 
            width: auto !important;
            height: auto !important;
            max-width: 120px !important;
            max-height: none !important;
            display: block !important;
            margin: 0 auto !important;
            object-fit: contain !important;
        }

        .avatar-container img[src*="images/avatars/"] {
            width: 120px !important;
            max-width: 120px !important;
            height: auto !important;
        }

        .avatar-container img:not([class]) {
            width: 120px !important;
            max-width: 120px !important;
            height: auto !important;
        }

        .user-info-stack {
            background: #f8f9fa;
            border: 1px solid rgb(28, 233, 240);
            border-radius: 6px;
            padding: 4px;
            margin: 3px 0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .user-info-stack > div {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 4px 0;
            line-height: 1.1;
            justify-content: space-between;
            font-size: 13px;
        }

        .user-info-stack .info-label {
            font-weight: 700;
            color: #2a52be;
            white-space: nowrap;
            flex-shrink: 0;
            font-size: 1.1em; 
        }

        .user-info-stack .info-value {
            font-weight: 600; 
            color: #006400; 
            text-align: right;
            min-width: 80px; 
            word-break: break-word;
            font-size: 1.05em; 
            transition: transform 0.1s;
        }

        .user-info-stack .info-value:empty {
            display: none;
        }

        .user-name .info-value:hover,
        .user-info-authorid .info-value:hover {
            color:rgb(34, 185, 34) !important;
            text-shadow: 0 0 4px rgba(0,255,0,0.4);
            cursor: pointer;
            transition: all 0.15s ease-in;
        }

        .user-info-regdate .info-value:hover {
            color: #006400;
        }

        .user-level {
            background: #2c54c5;
            border-radius: 12px;
            padding: 6px 8px;
            margin-top: 1px;
            margin-bottom: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: table;
            margin-left: auto;
            margin-right: auto;
            white-space: nowrap;
        }

        .user-level-value {
            color: white;
            font-size: 14px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0,0,0,0.15);
            display: block;
            text-align: center;
            padding: 0 4px;
            min-width: 28px;
        }

        .user-info {
            background: #ffffff;
            border: 1px solid rgb(28, 233, 240);
            border-radius: 8px;
            padding: 8px;
            margin: 6px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .user-info > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px dashed #f1f3f5;
        }

        .user-info > div:last-child {
            border-bottom: none;
        }

        .user-info .info-label {
            color: #0d2b4e;
            font-size: 15px;
            font-weight: 600;
            min-width: 60px;
            text-align: left;
        }

        .user-info .info-value {
            color: #ffae00;
            font-size: 16px;
            font-weight: 700;
            text-align: right;
            transition: color 0.2s ease;
        }

        .user-info .info-value:hover {
            color: #dc3545;
            cursor: pointer;
        }

        .user-post-date {
            background: #ffffff;
            border: 1px solid rgb(71, 145, 22);
            border-left: 5px solid rgb(71, 145, 22);
            border-radius: 0 6px 6px 0;
            padding: 4px 8px;
            margin: 4px 0;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .info-postDate-label {
            color: #6c757d;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-postDate-value {
            color: #212529;
            font-size: 14px;
            font-weight: 600;
            font-feature-settings: "tnum";
        }

        @media (max-width: 768px) {
            .user-post-date {
                padding: 4px 8px;
                gap: 8px;
                margin: 6px 0;
            }

            .info-postDate-label {
                font-size: 12px;
                letter-spacing: 0;
            }

            .info-postDate-value {
                font-size: 13px;
            }
        }

        .info-content-value {
            display: block;
            white-space: pre-line;
            word-break: break-word;
            color: #212529;
            font-family: "SimHei", "Microsoft YaHei", sans-serif;
            font-size: 16px;
            font-weight: 700;
            line-height: 1.8;
            text-align: left;
            margin: 12px 0;
            word-wrap: break-word;
            overflow-wrap: break-word;

            > p:not(:last-child) {
                margin-bottom: 1em;
            }
        }

        @media (max-width: 768px) {
            .info-content-value {
                font-size: 15px;
                line-height: 1.6;
                margin: 8px 0;
            }
        }

        .user-right {
            background: #fffdf7;
            border: 1px solid rgb(119, 240, 38);
            border-radius: 12px;
            padding: 16px;
            margin: 6px 0;
            box-shadow: 0 4px 12px rgba(149,222,100,0.3);
            position: relative;

            &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 12px;
                right: 12px;
                height: 4px;
                background: linear-gradient(90deg,
                rgba(149,222,100,0) 0%,
                rgb(119, 240, 38) 50%,
                rgba(149,222,100,0) 100%
                );
            }
        }

        @media (max-width: 768px) {
            .user-right {
                padding: 16px;
                margin: 6px 0;
                border-radius: 10px;
                border-width: 1.5px;
            }

            .user-right::after {
                height: 3px;
                bottom: -1.5px;
            }
        }

        .user-right > * {
            margin: 12px 0;
        }

        .user-right > *:first-child {
            margin-top: 0;
        }

        .user-right > *:last-child {
            margin-bottom: 0;
        }

        .user-info-ratings {
            margin: 16px 0;
            padding: 12px 16px;
            background: #FFF8E1;
            border-left: 4px solid #FFA000;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .user-info-ratings:hover::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(253, 115, 23, 0.3),
                transparent
            );
            animation: shine 1.2s infinite;
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 150%; }
        }
        
        .info-ratings-label {
            color: #757575;
            font-weight: 500;
            font-size: 0.95em;
            white-space: nowrap;
        }
        
        .info-ratings-value {
            color: #FF6F00;
            font-weight: 600;
            font-size: 1.1em;
            background: linear-gradient(135deg, #FFD180 0%, #FFAB40 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            padding: 0 4px;
        }
        
        .info-ratings-value::before {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #FFA000;
            border-radius: 2px;
            opacity: 0.4;
        }

        .floor-header > span.floor-number:hover {
            transform: scale(1.05);
            filter: drop-shadow(0 0 2px #2196F3);
            cursor: pointer;
            transition: all 0.15s ease;
            contain: none !important;
            overflow: visible !important;
            isolation: isolate !important;
        }
        
        .floor-header > span.floor-number:active {
            transform: scale(0.98);
            filter: drop-shadow(0 0 1px #1976D2);
        }

        .floor-header > span.topic-info:hover {
            transform: scale(1.005) !important;
            filter: drop-shadow(0 0 1px #2196F380) !important;
            text-shadow: 0 0 1px #2196F340 !important;
            letter-spacing: 0.5px !important;
            transition: all 0.12s cubic-bezier(0.4,0,0.2,1) !important;
        }
        
        .floor-header > span.topic-info:active {
            transform: scale(0.995) !important;
            filter: drop-shadow(0 0 0.5px #1976D280) !important;
            text-shadow: none !important;
            transition: all 0.08s ease-out !important;
        }
        
        .post-content > .user-right > .user-post > span.:hover {
            transform: scale(1.05) !important;
            filter: drop-shadow(0 0 2px #33F321) !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
            display: inline-block !important;
            z-index: 99 !important; 
        }
        
        .post-content > .user-right > .user-post > span.:active {
            transform: scale(0.98) !important;
            filter: drop-shadow(0 0 1px #19D238) !important;
        }

        .avatar-wrapper > .avatar-container:hover {
            transform: scale(0.95) rotate(3deg);
        }
        
        .user-left .user-name > span.info-value:hover {
            background:rgb(154, 245, 154);
            color: #212121;
            padding: 0 4px;
            margin: 0 -4px;
            border-radius: 3px;
            transition: all 0.15s ease;
        }
        
        .user-left .user-info-authorid > span.info-value:hover {
            background:rgb(154, 245, 154);
            color: #212121;
            padding: 0 4px;
            margin: 0 -4px;
            border-radius: 3px;
            transition: all 0.15s ease;
        }
        
        .user-post-date:hover {
            animation: shake 0.5s ease;
            animation-iteration-count: 1;
            cursor: pointer !important;
            pointer-events: auto !important;
        }
        
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
            100% { transform: translateX(0); }
        }
        
        .floor-header > span.floor-number,
        .floor-header > span.topic-info,
        .post-content > .user-right > .user-post > span.post-id,
        .avatar-wrapper > .avatar-container,
        .user-left .user-name > span.info-value,
        .user-left .user-info-authorid > span.info-value,
        .user-post-date > span.info-postDate-label {
            cursor: pointer !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 1 !important;
        }
    `;
    document.head.appendChild(style);

    const noticeBlock = document.createElement('div');
    noticeBlock.id = 'smartNoticeBlock';
    noticeBlock.innerHTML = '<span id="noticeText">未读消息 : </span><span id="noticeCount">0</span>';

    noticeBlock.addEventListener('click', function (e) {
        e.stopPropagation();

        if (!pageInfo.domain || pageInfo.domain === '未检测到有效域名') {
            alert('错误：无法获取有效域名信息');
            return;
        }

        const pmUrl = `https://${pageInfo.domain}/bbs/pm.php`;
        window.open(pmUrl, '_blank');
    });

    document.body.appendChild(noticeBlock);

    let selectedItem = null;
    let isMenuVisible = false;
    let isDetailVisible = false;

    function extractGlobalInfo() {
        try {
            const currentUrl = new URL(window.location.href);
            let hostname = currentUrl.hostname.split(':')[0].replace(/^\[(.*)\]$/, '$1');
            pageInfo.domain = hostname;

            if (hostname !== '未检测到有效域名' && tid) {
                fetchFirstPageData();
            }
        } catch (error) {
            console.error('域名提取失败:', error);
            pageInfo.domain = '未检测到有效域名';
        }
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isDetailVisible && isMenuVisible) {
            forceResetMenuStyles();
            hideDetailPanel();
            menu.classList.remove('show');
            isMenuVisible = false;
            return;
        }

        if (isDetailVisible) {
            hideDetailPanel(false);
            return;
        }

        btn.classList.toggle('active-state');
        menu.classList.toggle('show');
        isMenuVisible = !isMenuVisible;

        if (!isMenuVisible) {
            forceResetMenuStyles();
        }
    });

    menu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-item')) {
            forceResetMenuStyles();

            e.target.classList.add('selected');
            selectedItem = e.target;

            const titleMap = {
                '管理员查水评分辅助': '管理员查水评分辅助 - 详细界面',
                '功能暂定1': '功能待定-待开发1',
                '功能暂定2': '不知道做什么东西了'
            };

            const menuText = e.target.textContent.trim();
            const newTitle = titleMap[menuText] || '未知功能 - 详细界面';

            detailPanel.querySelector('.detail-title').textContent = newTitle;

            if (menuText === '管理员查水评分辅助') {
                loadFloorData();
            } else {
                clearFloorData(false);
            }

            showDetailPanel();

            e.target.style.transform = 'scale(0.98)';
            e.target.style.textShadow = '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.6)';
            e.target.style.color = 'white';

            setTimeout(() => {
                e.target.style.transform = '';
                e.target.style.textShadow = '';
                e.target.style.color = 'white';

                setTimeout(() => {
                    e.target.style.transform = 'scale(0.98)';
                    e.target.style.textShadow = '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.6)';
                }, 50);
            }, 50);
        }
    });

    function forceResetMenuStyles() {
        [...menu.children].forEach(item => {
            item.classList.remove('selected');
            item.style.transform = '';
            item.style.textShadow = '';
            item.style.color = '#006400';
            item.style.borderRadius = '';
            item.style.margin = '';
            item.style.padding = '';
            item.style.backgroundColor = '';
        });
        selectedItem = null;
    }

    window.openPostPage = function (tid, page, fromuid, pid) {
        const domain = pageInfo.domain || location.hostname;
        const targetUrl = `http://${domain}/bbs/viewthread.php?tid=${tid}&page=${page}&fromuid=${fromuid}#pid${pid}`;
        window.open(targetUrl, '_blank');
    };

    window.copyPostLink = function (text) {
        const tempInput = document.createElement('textarea');
        tempInput.value = decodeURIComponent(text);
        document.body.appendChild(tempInput);
        tempInput.select();

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('复制失败:', err);
        }
        document.body.removeChild(tempInput);

        if (success) {
            showFeedback('已复制楼层相对链接', 'success');
        } else {
            showFeedback('复制失败，请手动操作', 'error');
        }
    };

    window.copyInfoValue = function (element, label) {
        const text = element.textContent.trim();
        copyToClipboard(text, `已复制${label}`);
    };

    window.copyFloorNumber = function (tid) {
        const formattedLink = `[bbs]/bbs/thread-${tid}-1-1.html[/bbs]`;
        copyToClipboard(formattedLink, '已复制主题相对链接');
    };

    window.openTopicLink = function (tid) {
        const domain = pageInfo.domain || location.hostname;
        const targetUrl = `https://${domain}/bbs/thread-${tid}-1-1.html`;
        window.open(targetUrl, '_blank');
    };

    window.openUserLink = function (authorid) {
        const domain = pageInfo.domain || location.hostname;
        const targetUrl = `https://${domain}/bbs/space-uid-${authorid}.html`;
        window.open(targetUrl, '_blank');
    };

    function copyToClipboard(text, successMsg) {
        navigator.clipboard.writeText(text).then(() => {
            showFeedback(successMsg, 'success');
        }).catch(err => {
            showFallbackCopy(text, successMsg);
        });
    }

    function showFallbackCopy(text, successMsg) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) { }

        document.body.removeChild(tempInput);
        showFeedback(success ? successMsg : '复制失败', success ? 'success' : 'error');
    }

    window.showFeedback = function (message, type) {
        document.querySelectorAll('.feedback-bubble').forEach(e => e.remove());

        const bubble = document.createElement('div');
        bubble.className = `feedback-bubble ${type}`;
        bubble.textContent = message;

        Object.assign(bubble.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            background: type === 'success' ? '#4CAF50' : '#F44336',
            color: 'white',
            borderRadius: '25px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 9999,
            opacity: 0,
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
        });

        document.body.appendChild(bubble);

        requestAnimationFrame(() => {
            bubble.style.opacity = '0.9';
            bubble.style.bottom = '100px';
        });

        setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.bottom = '80px';
            setTimeout(() => bubble.remove(), 400);
        }, 2000);
    };
    function loadFloorData() {
        const floorList = detailPanel.querySelector('.floor-list');
        floorList.innerHTML = '<div class="loading-indicator">数据加载中...<br><br>如果之后显示【数据加载失败】的话则再点击一下“管理员查水评分辅助”，<br><br>如果点击后仍旧没有自动显示的话，就刷新一下网页~</div>';

        (async () => {
            if (!window.firstPageData) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                if (!window.firstPageData) {
                    floorList.innerHTML = '<div class="error-message">数据加载失败，请重试</div>';
                    return;
                }
            }

            const extractedData = extractPostData();
            const firstPageContents = new Map(
                (window.firstPageData || []).map(([floor, details]) =>
                    [floor, details.content.split(' | ')[0].trim()]
                )
            );

            floorList.innerHTML = '';
            extractedData.forEach(([currentFloor, details]) => {
                const floorItem = document.createElement('div');
                floorItem.className = 'floor-item';

                const copyTextPid = encodeURIComponent(`[bbs]/bbs/viewthread.php?tid=${details.tid}&page=${details.page}&fromuid=${details.fromuid}#pid${details.pid}[/bbs]`);

                if (details.deletedUser == '该用户已被删除') {
                    floorItem.innerHTML = `
                    <div class="floor-header">
                        <span class="floor-number" onclick="copyFloorNumber('${details.tid}')" title="复制主题相对链接">${currentFloor}楼</span>
                        <span class="topic-info" onclick="openTopicLink('${details.tid}')" title="新标签打开主题第一页">主题ID : ${details.tid} | 第 ${details.page} 页</span>
                        <span class="post-id" onclick="copyPostLink('${copyTextPid}')" title="复制楼层相对链接">回帖ID：${details.pid}</span>
                    </div>
                    <div class="post-content">
                        <div class="user-left">
                            <div class="avatar-wrapper">
                                <div class="avatar-container"><img class="avatar" src="images/avatars/noavatar.gif" alt=""></img></div>
                                <div class="user-level"><span class="user-level-value">已被删除</span></div>
                                <div class="user-info-stack">
                                        ${details.username ? `
                                            <div class="user-name">
                                                <span class="info-label">用户名</span>
                                                <span class="info-value" onclick="copyInfoValue(this, '用户名')" title="复制用户名">${details.username}</span>
                                        </div>` : ''}
                                 <div class="user-info-authorid"><span class="info-label"></span><span class="info-value"></span></div>
                                 <div class="user-info-regdate"><span class="info-label"></span><span class="info-value"></span></div>
                            </div>
                        </div>
                        <div class="user-info">
                                <div class="user-info-delete"><span class="info-label">状态</span><span class="info-value">-9999999</span></div>
                                <div class="user-info-coins"><span class="info-label"></span><span class="info-value"></span></div>
                                <div class="user-info-originals"><span class="info-label"></span><span class="info-value"></span></div>
                                <div class="user-info-prestige"><span class="info-label"></span><span class="info-value"></span></div>
                                <div class="user-info-contributions"><span class="info-label"></span><span class="info-value"></span></div>
                                <div class="user-info-sponsors"><span class="info-label"></span><span class="info-value"></span></div>
                            </div>
                        </div>
                        <div class="user-right">
                            <div class="user-post">
                                ${details.postDate ? `
                                    <div class="user-post-date" onclick="openPostPage('${details.tid}', '${details.page}', '${details.fromuid}', '${details.pid}')">
                                        <span class="info-postDate-label">发表时间 : </span>
                                        <span class="info-postDate-value" title="新标签打开楼层链接">${details.postDate}</span>
                                    </div>` : ''}
                                ${generateContentHTML(details)}
                            </div>
                        </div>
                    </div>
                    `;
                } else {
                    floorItem.innerHTML = `
                    <div class="floor-header">
                        <span class="floor-number" onclick="copyFloorNumber('${details.tid}')" title="复制主题相对链接">${currentFloor}楼</span>
                        <span class="topic-info" onclick="openTopicLink('${details.tid}')" title="新标签打开主题第一页">主题ID : ${details.tid} | 第 ${details.page} 页</span>
                        <span class="post-id" onclick="copyPostLink('${copyTextPid}')" title="复制楼层相对链接">回帖ID：${details.pid}</span>
                    </div>
                    <div class="post-content">
                        <div class="user-left">
                            <div class="avatar-wrapper">
                                ${details.avatarHtml ? `<div class="avatar-container" onclick="openUserLink('${details.authorid}')" title="新标签打开用户个人空间">${details.avatarHtml}</div>` : ''}
                                ${details.userLevel ? `
                                    <div class="user-level">
                                        <span class="user-level-value">${details.userLevel}</span>
                                    </div>` : ''}
                                <div class="user-info-stack">
                                    ${details.username ? `
                                        <div class="user-name">
                                            <span class="info-label">用户名</span>
                                            <span class="info-value" onclick="copyInfoValue(this, '用户名')" title="复制用户名">${details.username}</span>
                                        </div>` : ''}
                                    ${details.authorid ? `
                                        <div class="user-info-authorid">
                                            <span class="info-label">用户ID</span>
                                            <span class="info-value" onclick="copyInfoValue(this, '用户ID')" title="复制用户ID">${details.authorid}</span>
                                        </div>` : ''}
                                    ${details.userInfo.regDate ? `
                                        <div class="user-info-regdate">
                                            <span class="info-label">注册时间</span>
                                            <span class="info-value">${details.userInfo.regDate}</span>
                                        </div>` : ''}
                                </div>
                            </div>
                            <div class="user-info">
                                ${details.userInfo.digests ? `
                                    <div class="user-info-digests">
                                        <span class="info-label">精华</span>
                                        <span class="info-value">${details.userInfo.digests}</span>
                                    </div>` : ''}
                                ${details.userInfo.coins ? `
                                    <div class="user-info-coins">
                                        <span class="info-label">金币</span>
                                        <span class="info-value">${details.userInfo.coins}</span>
                                    </div>` : ''}
                                ${details.userInfo.originals ? `
                                    <div class="user-info-originals">
                                        <span class="info-label">原创</span>
                                        <span class="info-value">${details.userInfo.originals}</span>
                                    </div>` : ''}
                                ${details.userInfo.prestige ? `
                                    <div class="user-info-prestige">
                                        <span class="info-label">威望</span>
                                        <span class="info-value">${details.userInfo.prestige}</span>
                                    </div>` : ''}
                                ${details.userInfo.contributions ? `
                                    <div class="user-info-contributions">
                                        <span class="info-label">贡献</span>
                                        <span class="info-value">${details.userInfo.contributions}</span>
                                    </div>` : ''}
                                ${details.userInfo.sponsors ? `
                                    <div class="user-info-sponsors">
                                        <span class="info-label">赞助</span>
                                        <span class="info-value">${details.userInfo.sponsors}</span>
                                    </div>` : ''}
                            </div>
                        </div>
                        <div class="user-right">
                            <div class="user-post">
                                ${details.postDate ? `
                                    <div class="user-post-date" onclick="openPostPage('${details.tid}', '${details.page}', '${details.fromuid}', '${details.pid}')">
                                        <span class="info-postDate-label">发表时间 : </span>
                                        <span class="info-postDate-value" title="新标签打开楼层链接">${details.postDate}</span>
                                    </div>` : ''}
                                ${generateContentHTML(details)}
                            </div>
                        </div>
                    </div>
                    `;
                }

                if (firstPageContents.size > 0) {
                    const currentContent = cleanContent(details.content);
                    let maxMatch = 0;
                    let matchedFloor = null;

                    firstPageContents.forEach((content, floor) => {
                        const common = countCommonWords(currentContent, content);
                        if (common > maxMatch && common / currentContent.split(' ').length > 0.3) {
                            maxMatch = common;
                            matchedFloor = floor;
                        }
                    });

                    const detectionResult = detectDuplication(currentContent, firstPageContents);

                    if ((detectionResult.score > 0 || detectionResult.fullMatch) && Number(urlTxtPage) > 1) {
                        const warning = document.createElement('div');
                        warning.className = 'duplication-warning';

                        let warningText = `⚠️ 检测到 ❗ 相同文本 ❗ （仅匹配2~10楼回复） : `;
                        if (detectionResult.matchedFloors.length > 0) {
                            warningText += ` 【 ${detectionResult.matchedFloors[0]} 楼】`;
                            if (detectionResult.matchedFloors.length > 1) {
                                warningText += ` 【 ${detectionResult.matchedFloors.slice(1).join('、')} 楼】`;
                            }
                        }

                        const sourceBtn = document.createElement('button');
                        sourceBtn.className = 'source-link-btn';
                        sourceBtn.textContent = '查看被复制楼层';

                        sourceBtn.onclick = () => {
                            const [firstMatch] = detectionResult.matchedFloors;
                            const targetPost = firstPageData.find(([floor]) => floor == firstMatch);
                            if (targetPost) {
                                const { fromuid, pid } = targetPost[1];
                                const viewUrl = `https://${pageInfo.domain}/bbs/viewthread.php?tid=${tid}&page=1&fromuid=${fromuid}#pid${pid}`;
                                window.open(viewUrl, '_blank');
                            }
                        };

                        warning.innerHTML = warningText +
                            (detectionResult.fullMatch ? ' ' : '') + `${detectionResult.segments.map(s => `<div class="matched-segment">部分重复片段 : "${s}"</div>`).join('')}`;

                        warning.appendChild(sourceBtn);
                        floorItem.appendChild(warning);
                    }
                }

                floorList.appendChild(floorItem);
            });

            showDetailPanel();
        })();
    }

    function generateContentHTML(details) {

        return `
            ${details.content ? `<div class="info-content-value">${details.content}</div>` : ''}
            ${details.ratings ? `
                <div class="user-info-ratings">
                    <span class="info-ratings-label">评分 : </span>
                    <span class="info-ratings-value">${details.ratings}</span>
                </div>` : ''}
        `;
    }

    function cleanContent(content) {
        return content.split(' | ')[0].trim().replace(/\s+/g, ' ').replace(/[ \t\n\r]+/g, ' ');
    }

    function countCommonWords(a, b) {
        const setA = new Set(a.split(' '));
        return b.split(' ').filter(word => setA.has(word)).length;
    }

    function clearFloorData(keepVisible = true) {
        detailPanel.querySelector('.floor-list').innerHTML = '';
        if (!keepVisible) hideDetailPanel(false);
    }

    function showDetailPanel() {
        if (!isMenuVisible) menu.classList.add('show');
        detailPanel.classList.add('show');
        isDetailVisible = true;
    }

    function hideDetailPanel(reset = true) {
        detailPanel.classList.remove('show');
        isDetailVisible = false;

        if (reset && selectedItem) {
            selectedItem.classList.remove('selected');
            selectedItem = null;
        }
    }

    detailPanel.querySelector('.close-btn').addEventListener('click', () => {
        hideDetailPanel(false);
    });

    function extractPostData() {
        const posts = document.querySelectorAll('td.postcontent');
        const results = [];

        posts.forEach(postContainer => {
            const postInfo = postContainer.querySelector('.postinfo');
            const postContent = postContainer.querySelector('.postmessage.defaultpost');
            const authorTd = postContainer.closest('tr').querySelector('.postauthor');

            if (!postInfo || !postContent || !authorTd) return;

            const strongElement = postInfo.querySelector('strong');
            const floorText = strongElement?.textContent?.replace('楼', '') || '未知楼层';

            const params = new Map();

            const parseHashParams = (url) => {
                const hash = url.hash;
                const params = {};
                const pidMatch = hash.match(/#pid(\d+)/);
                if (pidMatch) params.pid = pidMatch[1];
                new URLSearchParams(hash.replace(/^#/, '')).forEach((v, k) => {
                    params[k] = v;
                });
                return params;
            };

            const primaryLink = postInfo.querySelector('strong[onclick*="fromuid="]');
            if (primaryLink) {
                try {
                    const rawUrl = primaryLink.getAttribute('onclick')
                        .match(/setcopy\('(.*?)',/)[1]
                        .replace(/&amp;/g, '&');

                    const url = new URL(rawUrl, window.location.origin);
                    const hashParams = parseHashParams(url);

                    ['tid', 'page', 'fromuid', 'pid'].forEach(key => {
                        if (hashParams[key] !== undefined) {
                            params.set(key, hashParams[key]);
                        } else if (url.searchParams.has(key)) {
                            params.set(key, url.searchParams.get(key));
                        }
                    });
                } catch (error) {
                    console.warn('主链接解析失败:', primaryLink, error);
                }
            }

            postInfo.querySelectorAll('a').forEach(link => {
                try {
                    const url = new URL(link.href, window.location.origin);
                    const searchParams = new URLSearchParams(url.search);
                    const hashParams = parseHashParams(url);

                    ['tid', 'page', 'authorid', 'fromuid', 'pid'].forEach(key => {
                        if (hashParams[key] !== undefined) {
                            params.set(key, hashParams[key]);
                        } else if (searchParams.has(key)) {
                            params.set(key, searchParams.get(key));
                        }
                    });
                } catch (error) {
                    console.warn('链接解析失败:', link.href, error);
                }
            });

            const getParam = (key) => params.get(key) || '未知' + key;

            let contentText = '未知内容';
            let emojiCount = 0;
            const mainContent = postContent.querySelector('[id^="postmessage_"]');

            if (mainContent) {
                const clonedContent = mainContent.cloneNode(true);

                const imgPlaceholders = [];
                let imgCounter = 0;

                clonedContent.innerHTML = clonedContent.innerHTML.replace(
                    /<img[^>]+>/g,
                    (match) => {
                        const placeholder = `__IMG_${imgCounter}__`;
                        imgPlaceholders.push(match);
                        return placeholder;
                    }
                );

                ['.quote', 'blockquote', 'div.notice', 'fieldset', 'table'].forEach(selector => {
                    clonedContent.querySelectorAll(selector).forEach(el => el.remove());
                });

                const emojiRegex = /<img[^>]+>/g;
                let match;
                while ((match = emojiRegex.exec(clonedContent.innerHTML)) !== null) {
                    emojiCount++;
                }

                let processedContent = clonedContent.innerHTML
                    .replace(/<br>/g, '\n')
                    .replace(/<\/?div[^>]*>/gi, '')
                    .replace(/^[\s&nbsp;]*|[\s&nbsp;]*$/g, '')
                    .replace(/\[<i> 本帖最后由 .*? <\/i>\]/gs, '')
                    .replace(/\[<i> Last edited by .*? <\/i>\]/gs, '')
                    .replace(/\n+/g, '\n')
                    .replace(/[ \t\u3000]+/g, ' ')
                    .replace(/^\n+|\n+$/g, '')
                    .replace(/\n$/, '\n')
                    .trim();

                processedContent = processedContent.substring(0, 500) + (emojiCount > 0 ? ` | 表情${emojiCount}个` : '');

                imgPlaceholders.forEach((originalImg, index) => {
                    const placeholder = `__IMG_${index}__`;
                    processedContent = processedContent.replace(
                        new RegExp(placeholder, 'g'),
                        originalImg
                    );
                });

                contentText = processedContent;
            }

            let avatarHtml = '';
            let userLevel = '';
            const processedUserInfo = {};
            let postDate = '';

            let ratings = [];
            const ratingLegend = postContent.querySelector('fieldset legend a');
            const ratingItems = postContent.querySelectorAll('fieldset ul li');
            const validRatingItems = Array.from(ratingItems).filter(item =>
                item.querySelector('cite a') &&
                item.querySelector('strong')
            );
            validRatingItems.forEach(item => {
                const user = item.querySelector('cite a')?.textContent?.trim() || '匿名用户';
                const amount = item.querySelector('strong')?.textContent?.trim();
                const reason = item.querySelector('em')?.textContent?.trim() || '无说明';
                const typeMatch = item.textContent.match(/([\u4e00-\u9fa5]+)\s*[\+\-]\d+/);
                const type = typeMatch ? typeMatch[1].replace('：', '') : '未知类型';
                if (user && amount) {
                    const formattedRating = `${user} ${amount} ${type} 【${reason}】`;
                    ratings.push(formattedRating);
                }
            });

            const postInfoDiv = postContainer.closest('tr').querySelector('.postinfo');

            if (postInfoDiv) {
                const textContent = postInfoDiv.textContent;

                const dateMatch = textContent.match(/发表于\s+([\d-：:\s]+)/);
                if (dateMatch) {
                    postDate = dateMatch[1].replace(/[\s&nbsp;]+$/, '').trim();
                }
            }

            let username = '';
            const authorCite = postContainer.closest('tr').querySelector('.postauthor cite a.dropmenu');

            if (authorCite) {
                username = authorCite.textContent.trim();
            }

            const postAuthorTd = postContainer.closest('tr').querySelector('.postauthor');

            let deletedUser = null;
            const authorTdText = postAuthorTd?.textContent?.trim() || '';

            if (authorTdText.includes('该用户已被删除')) {

                deletedUser = '该用户已被删除';
                username = authorTd.querySelector(':scope > cite')?.textContent.trim() || '未知用户';
                const postInfoDiv = postContainer.closest('tr').querySelector('.postinfo');
                if (postInfoDiv) {
                    const dateMatch = postInfoDiv.textContent.match(/发表于\s+([\d\-：:\s]{16})/);
                    postDate = dateMatch ? dateMatch[1].replace(/[\s&nbsp;]+$/, '').trim() : '未知日期';
                }

            } else {
                const avatarDiv = postAuthorTd ? postAuthorTd.querySelector(':scope > .avatar') : null;

                if (avatarDiv) {
                    const imgTag = avatarDiv.querySelector(':scope > img:first-child');
                    if (imgTag) {
                        avatarHtml = imgTag.outerHTML;
                    }
                }

                if (postAuthorTd) {
                    const avatarDiv = postAuthorTd.querySelector('.avatar');

                    if (avatarDiv) {
                        const targetP = avatarDiv.nextElementSibling;

                        if (targetP && targetP.tagName === 'P') {
                            const levelFont = targetP.querySelector('em > font');

                            if (levelFont) {
                                userLevel = levelFont.textContent.trim();
                                userLevel = userLevel.replace(/\s+/g, ' ');
                                const LEVEL_MAP = {
                                    'Super Moderator(超版)': '超版',
                                    'Await Validating User(未激活)': '未激活',
                                    'Administrator(管理员)': '管理员',
                                    'Moderator(版主)': '版主',
                                    'Deputy Administrator(副管)': '副管'
                                };
                                userLevel = LEVEL_MAP[userLevel] || userLevel;
                            }
                        }
                    }
                }

                const userInfo = {
                    posts: '',
                    digests: '',
                    credits: '',
                    coins: '',
                    originals: '',
                    prestige: '',
                    supports: '',
                    thanks: '',
                    contributions: '',
                    sponsors: '',
                    promotions: '',
                    readPerm: '',
                    regDate: ''
                };

                if (postAuthorTd) {
                    const profileDl = postAuthorTd.querySelector('.profile');

                    if (profileDl) {
                        profileDl.querySelectorAll('dt').forEach(dt => {
                            const key = dt.textContent.trim();
                            const value = dt.nextElementSibling?.textContent.trim().replace(/[\s\u00A0]+/g, '');

                            if (key.includes('帖子')) userInfo.posts = extractValue(value);
                            if (key.includes('精华')) userInfo.digests = extractValue(value);
                            if (key.includes('积分')) userInfo.credits = extractValue(value);
                            if (key.includes('金币')) userInfo.coins = extractValue(value);
                            if (key.includes('原创')) userInfo.originals = extractValue(value);
                            if (key.includes('威望')) userInfo.prestige = extractValue(value);
                            if (key.includes('支持')) userInfo.supports = extractValue(value);
                            if (key.includes('感谢')) userInfo.thanks = extractValue(value);
                            if (key.includes('贡献')) userInfo.contributions = extractValue(value);
                            if (key.includes('赞助')) userInfo.sponsors = extractValue(value);
                            if (key.includes('推广')) userInfo.promotions = extractValue(value);
                            if (key.includes('阅读权限')) userInfo.readPerm = extractValue(value);
                            if (key.includes('注册时间')) userInfo.regDate = formatRegDate(value);
                        });
                    }
                    processedUserInfo.digests = formatUserValue(userInfo.digests);
                    processedUserInfo.coins = formatUserValue(userInfo.coins);
                    processedUserInfo.originals = formatUserValue(userInfo.originals);
                    processedUserInfo.prestige = formatUserValue(userInfo.prestige);
                    processedUserInfo.contributions = formatUserValue(userInfo.contributions);
                    processedUserInfo.sponsors = formatUserValue(userInfo.sponsors);
                    processedUserInfo.regDate = formatRegDate(userInfo.regDate);
                }

            }

            results.push([
                floorText,
                {
                    tid: getParam('tid'),
                    page: getParam('page'),
                    authorid: getParam('authorid'),
                    fromuid: getParam('fromuid'),
                    pid: getParam('pid'),
                    content: contentText,
                    ratings: ratings.length > 0 ? ratings.join(' | ') : '无评分记录',
                    avatarHtml: avatarHtml,
                    userLevel: userLevel,
                    userInfo: processedUserInfo,
                    postDate: postDate,
                    username: username,
                    deletedUser: deletedUser
                }
            ]);
        });

        return results;
    }

    function extractValue(rawValue) {
        return rawValue.replace(/[^\d\u4e00-\u9fa5]/g, '');
    }

    function formatUserValue(rawValue) {
        const cleaned = rawValue.replace(/[^\d-]/g, '');
        return cleaned;
    }

    function formatRegDate(rawDate) {
        const cleaned = rawDate.replace(/&nbsp;$/, '');

        const parts = cleaned.split('-');

        parts[1] = parts[1].padStart(2, '0');
        parts[2] = parts[2].padStart(2, '0');

        return parts.slice(0, 3).join('-');
    }

    function formatAndPrint(data) {
        // 空实现
    }

    function smartExecution() {
        extractGlobalInfo();

        setTimeout(fetchPMData, 1000);

        let attempts = 0;
        const maxAttempts = 10;
        const interval = 1000;

        function tryExtract() {
            const posts = document.querySelectorAll('td.postcontent');
            if (posts.length > 0 || attempts >= maxAttempts) {
                const extractedData = extractPostData();
                formatAndPrint(extractedData);
                if (extractedData.length === 0) {
                    console.warn('警告：未检测到帖子数据，请联系phygelus');
                }
            } else {
                attempts++;
                setTimeout(tryExtract, interval);
            }
        }
        tryExtract();
    }

    smartExecution();

    document.body.appendChild(detailPanel);
})();