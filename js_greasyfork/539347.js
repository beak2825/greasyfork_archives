// ==UserScript==
// @name         imdb豆瓣直达
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  1.豆瓣可直接跳转imdb。可区分剧集与电影并显示必要按钮，imdb页显示家长引导。2.按钮分为3个，分别是imdb首页、系列第一部的首页和跳转该季评分页。3.功能依赖豆瓣信息栏与下方首个同系列作品内的的tt号
// @author       PH365
// @match        https://movie.douban.com/subject/*
// @match        https://www.douban.com/movie/subject/*
// @match        https://www.douban.com/tv/subject/*
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/539347/imdb%E8%B1%86%E7%93%A3%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/539347/imdb%E8%B1%86%E7%93%A3%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;

    if (hostname.includes('douban.com')) {
        initDoubanFeature();
    } else if (hostname.includes('imdb.com')) {
        initIMDbFeature();
    }

    // ===================================================================
    // ================== 功能 1, 2, 3: 豆瓣直达IMDB ================
    // ===================================================================
    function initDoubanFeature() {
        const CURRENT_PAGE_BUTTON_ID = 'douban-to-imdb-button';
        const SERIES_BUTTON_ID = 'douban-to-series-imdb-button';
        const SEASON_RATINGS_BUTTON_ID = 'douban-to-season-ratings-button';
        const SERIES_MENU_WRAPPER_ID = 'douban-series-menu-wrapper';
        const SERIES_MENU_BUTTON_ID = 'douban-series-menu-button';
        const SERIES_MENU_DROPDOWN_ID = 'douban-series-dropdown-menu';

        function chineseNumeralToArabic(text) {
            const map = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'十一':11,'十二':12,'十三':13,'十四':14,'十五':15,'十六':16,'十七':17,'十八':18,'十九':19,'二十':20};
            return map[text] || null;
        }

        function getCurrentSeasonNumber() {
            const title = document.title;
            let match = title.match(/Season\s+(\d+)/i);
            if (match) return parseInt(match[1], 10);
            match = title.match(/第\s*([一二三四五六七八九十]+)\s*季/);
            if (match && match[1]) return chineseNumeralToArabic(match[1]);
            return null;
        }

        function getSeriesIMDbInfoFromList() {
            return new Promise(resolve => {
                const seriesSectionTitle = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.trim().includes('同系列作品'));
                const firstSeriesLink = seriesSectionTitle?.nextElementSibling?.querySelector('a');
                if (!firstSeriesLink?.href) return resolve(null);
                GM_xmlhttpRequest({
                    method: "GET", url: firstSeriesLink.href,
                    onload: response => resolve(response.responseText.match(/tt\d{7,}/)?.[0] || null),
                    onerror: () => resolve(null)
                });
            });
        }

        function createInitialButton() {
            if (document.getElementById(CURRENT_PAGE_BUTTON_ID)) return null;
            const infoDiv = document.getElementById('info');
            if (!infoDiv) return null;
            const match = (infoDiv.textContent || '').match(/tt\d{7,}/);
            if (!match) return null;

            const currentPageId = match[0];
            let referenceElement = Array.from(infoDiv.getElementsByTagName('span')).find(span => span.textContent?.includes('IMDb:'));
            if (!referenceElement) referenceElement = infoDiv.querySelector(`a[href*="${currentPageId}"]`);
            if (!referenceElement) return null;

            GM_addStyle(`
                /* 按钮样式 */
                #${CURRENT_PAGE_BUTTON_ID}, #${SERIES_BUTTON_ID}, #${SEASON_RATINGS_BUTTON_ID} {
                    display: inline-block; margin-left: 10px; padding: 1px 8px; font-size: 13px;
                    border-radius: 4px; text-decoration: none; vertical-align: baseline; transition: filter 0.2s;
                }
                #${CURRENT_PAGE_BUTTON_ID}:hover, #${SERIES_BUTTON_ID}:hover, #${SEASON_RATINGS_BUTTON_ID}:hover {
                    text-decoration: none; filter: brightness(0.9);
                }
                #${CURRENT_PAGE_BUTTON_ID} { background-color: #ff953c; color: #fff !important; }
                #${SERIES_BUTTON_ID} { background-color: #3B7ABE; color: #fff !important; }
                #${SEASON_RATINGS_BUTTON_ID} { background-color: #28a745; color: #fff !important; }
                #${SERIES_MENU_WRAPPER_ID} { position: relative; display: inline-block; }
                #${SERIES_MENU_BUTTON_ID} {
                    display: inline-block; padding: 1px 8px; font-size: 13px; color: #fff !important;
                    background-color: #6c757d; border-radius: 4px; text-decoration: none;
                    cursor: pointer; transition: filter 0.2s;
                }
                #${SERIES_MENU_BUTTON_ID}:hover { filter: brightness(0.9); }

                /* 系列菜单智能展开的CSS */
                #${SERIES_MENU_DROPDOWN_ID} {
                    display: none; position: absolute; left: 0;
                    background-color: white; min-width: 250px;
                    border: 1px solid #ccc; border-radius: 4px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.175); z-index: 1000;
                    max-height: 300px; overflow-y: auto; text-align: left;
                    /* 默认向下展开 */
                    top: 100%; margin-top: 5px;
                }
                /* 向上展开的样式 */
                #${SERIES_MENU_DROPDOWN_ID}.is-up {
                    top: auto;
                    bottom: 100%;
                    margin-top: 0;
                    margin-bottom: 5px;
                }
                #${SERIES_MENU_DROPDOWN_ID}.is-visible { display: block; }
                #${SERIES_MENU_DROPDOWN_ID} a {
                    color: #333; padding: 8px 15px; text-decoration: none;
                    display: block; font-size: 13px; white-space: nowrap;
                    transition: background-color 0.2s;
                }
                #${SERIES_MENU_DROPDOWN_ID} a:hover { background-color: #f5f5f5; text-decoration: none; }
            `);

            const button = document.createElement('a');
            button.id = CURRENT_PAGE_BUTTON_ID;
            button.textContent = '主页';
            button.href = `https://www.imdb.com/title/${currentPageId}`;
            button.target = '_blank';
            button.title = '跳转到当前页对应的 IMDb 页面';
            referenceElement.after(button);

            return { button, imdbId: currentPageId };
        }

        async function createAdditionalButtons(initialButton, currentPageId) {
            const infoDiv = document.getElementById('info');
            if (!infoDiv) return;

            const isTVShow = infoDiv.textContent.includes('集数');
            const hasSeriesSection = !!Array.from(document.querySelectorAll('h2')).find(h => h.textContent.trim().includes('同系列作品'));

            let lastButton = initialButton;

            if (hasSeriesSection) {
                const seriesId = await getSeriesIMDbInfoFromList();
                const seasonNumber = getCurrentSeasonNumber();
                if (seriesId && seriesId !== currentPageId && (!isTVShow || (isTVShow && seasonNumber > 1))) {
                    const seriesButton = document.createElement('a');
                    seriesButton.id = SERIES_BUTTON_ID;
                    seriesButton.textContent = '系列页';
                    seriesButton.href = `https://www.imdb.com/title/${seriesId}`;
                    seriesButton.target = '_blank';
                    seriesButton.title = '跳转到整个系列的 IMDb 页面';
                    lastButton.after(seriesButton);
                    lastButton = seriesButton;
                }
            }

            if (isTVShow) {
                const seasonNumber = getCurrentSeasonNumber() ?? 1;
                const seriesButton = document.getElementById(SERIES_BUTTON_ID);
                const idForRatings = seriesButton ? seriesButton.href.match(/tt\d{7,}/)[0] : currentPageId;
                const seasonRatingsButton = document.createElement('a');
                seasonRatingsButton.id = SEASON_RATINGS_BUTTON_ID;
                seasonRatingsButton.textContent = '本季评分';
                seasonRatingsButton.href = `https://www.imdb.com/title/${idForRatings}/episodes/?season=${seasonNumber}&ref_=ttep`;
                seasonRatingsButton.target = '_blank';
                seasonRatingsButton.title = `跳转到 IMDb S${seasonNumber} 评分页面`;
                lastButton.after(seasonRatingsButton);
            }

            if(hasSeriesSection) {
                const seriesMenuRow = createSeriesMenuRow();
                if (seriesMenuRow) {
                    let imdbLine = Array.from(infoDiv.children).find(el => el.textContent.includes('IMDb'));
                    if (imdbLine) {
                        // 寻找IMDb行末尾的 <br> 标签作为插入点
                        let imdbLineBreak = null;
                        let currentNode = imdbLine;
                         while(currentNode.nextSibling) {
                            if(currentNode.nodeName === 'BR') {
                                imdbLineBreak = currentNode;
                                break;
                            }
                            currentNode = currentNode.nextSibling;
                        }
                        if (imdbLineBreak) {
                            imdbLineBreak.after(seriesMenuRow);
                        } else {
                            infoDiv.appendChild(seriesMenuRow);
                        }
                    } else {
                         infoDiv.appendChild(seriesMenuRow);
                    }
                }
            }
        }

        /**
         * 创建“系列菜单”的完整行，并绑定定位逻辑
         */
        function createSeriesMenuRow() {
            const seriesSectionTitle = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.trim().includes('同系列作品'));
            if (!seriesSectionTitle) return null;
            const links = seriesSectionTitle.nextElementSibling?.querySelectorAll('dl > dd > a');
            if (!links || links.length === 0) return null;

            const fragment = document.createDocumentFragment();

            const label = document.createElement('span');
            label.className = 'pl';
            label.textContent = '系列菜单';
            fragment.appendChild(label);
            fragment.appendChild(document.createTextNode(': '));

            const menuWrapper = document.createElement('span');
            menuWrapper.id = SERIES_MENU_WRAPPER_ID;

            const menuButton = document.createElement('a');
            menuButton.id = SERIES_MENU_BUTTON_ID;
            menuButton.textContent = '点击展开';
            menuButton.href = 'javascript:void(0);';

            const dropdown = document.createElement('div');
            dropdown.id = SERIES_MENU_DROPDOWN_ID;
            links.forEach(link => {
                const item = document.createElement('a');
                item.href = link.href;
                item.textContent = link.textContent.trim();
                item.target = '_blank';
                dropdown.appendChild(item);
            });

            menuWrapper.appendChild(menuButton);
            menuWrapper.appendChild(dropdown);
            fragment.appendChild(menuWrapper);
            fragment.appendChild(document.createElement('br'));

            // 定位点击交互逻辑
            menuButton.addEventListener('click', (event) => {
                event.stopPropagation();

                // 切换菜单的显示状态
                dropdown.classList.toggle('is-visible');

                // 如果菜单是隐藏的，则什么都不做
                if (!dropdown.classList.contains('is-visible')) {
                    return;
                }

                // 如果菜单是可见的，则开始计算位置
                dropdown.classList.remove('is-up'); // 先重置为默认向下

                const buttonRect = menuButton.getBoundingClientRect();
                const dropdownHeight = dropdown.offsetHeight;

                // 计算按钮下方和上方的可用空间
                const spaceBelow = window.innerHeight - buttonRect.bottom;
                const spaceAbove = buttonRect.top;

                // 如果下方空间不足，并且上方空间比下方空间更大，则向上展开
                if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                    dropdown.classList.add('is-up');
                }
            });

            // 点击外部区域关闭菜单
            document.addEventListener('click', () => {
                if (dropdown.classList.contains('is-visible')) {
                    dropdown.classList.remove('is-visible');
                    dropdown.classList.remove('is-up'); // 关闭时重置方向
                }
            });

            return fragment;
        }

        function run() {
            const initialData = createInitialButton();
            if (initialData) {
                createAdditionalButtons(initialData.button, initialData.imdbId);
                return true;
            }
            return false;
        }

        if (run()) return;
        const observer = new MutationObserver((mutations, obs) => {
            if (run()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ===================================================================
    // ================= 功能 4: IMDb页面添加家长指引按钮 =================
    // ===================================================================
    function initIMDbFeature() {
        const BUTTON_ID = 'imdb-parental-guide-button';

        function createIMDbButton() {
            if (document.getElementById(BUTTON_ID)) return true;
            const anchor = document.querySelector('[data-testid="hero-subnav-bar-right-block"]');
            if (!anchor) return false;

            const urlMatch = window.location.href.match(/(tt\d{7,})/);
            if (!urlMatch || !urlMatch[0]) return false;

            const ttNumber = urlMatch[0];
            const parentalGuideUrl = `https://www.imdb.com/title/${ttNumber}/parentalguide/?ref_=tt_stry_pg`;

            const button = document.createElement('a');
            button.id = BUTTON_ID;
            button.className = 'ipc-chip ipc-chip--on-base';
            button.textContent = 'Parental Guide';
            button.href = parentalGuideUrl;
            button.title = '跳转到家长指引页面';

            GM_addStyle(`
                #${BUTTON_ID} { margin-right: 8px !important; color: #FFFFFF !important; font-weight: bold !important; background-color: #4A4A4A !important; transition: background-color 0.2s; }
                #${BUTTON_ID}:hover { background-color: #606060 !important; color: #FFFFFF !important; }
            `);

            anchor.prepend(button);
            return true;
        }

        const observer = new MutationObserver((mutations, obs) => {
            if (createIMDbButton()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();