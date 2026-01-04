// ==UserScript==
// @name         A-3340 amb-cn extend
// @namespace    http://amb-cn-extend.com/
// @version      1.6.6
// @description  function extension for amb-cn.com
// @author       A-3340
// @match        https://amb-cn.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522970/A-3340%20amb-cn%20extend.user.js
// @updateURL https://update.greasyfork.org/scripts/522970/A-3340%20amb-cn%20extend.meta.js
// ==/UserScript==

(function () {

    var enable_flag = {
        "archives_room_load_page_hook": true,
        "archives_room_show_content_hook": true,
        "archives_room_auto_load_page": true,
        "archives_room_search_jump": true,
        "lobby_search_archives": true,
        "lobby_search_user": true,
        "archives_data_display": false,
        "archivesb_data_display": false,
        "archives_data_bugfix": true,
        "archivesb_data_bugfix": true,
        "archives_data_association_amb": true
    }
    let url = new URL(window.location);

    // 大厅
    if (url.pathname === "/lobby.html") {
        if (enable_flag["lobby_search_archives"] || enable_flag["lobby_search_user"]) {
            GM_addStyle(`
                .search-input {
                    width: 100%;
                    padding: 1rem 3rem 1rem 1.5rem;
                    font-size: 1.1rem;
                    border: 2px solid var(--primary-red);
                    border-radius: 8px;
                    background-color: rgba(255, 255, 255, 0.9);
                    transition: all 0.3s ease;
                    font-family: "Source Code Pro", monospace;
                }
            `);
        }
        window.addEventListener('load', function () {
            if (enable_flag["lobby_search_user"]) {
                const nav = document.querySelector('.navbar');

                if (nav) {
                    // 创建新的HTML内容
                    const searchWrapperHTML = `
                        <div class="notices-container">
                            <div class="search-wrapper">
                                <div class="search-container">
                                    <input type="text" class="search-input" placeholder="输入A-xxx或xxx跳转至用户...">
                                    <i class="fas fa-search search-icon"></i>
                                </div>
                            </div>
                        </div>
                    `;
                    nav.insertAdjacentHTML('afterend', searchWrapperHTML);
                    const searchInput = document.querySelector('.search-input');

                    function triggerSearch() {
                        let searchValue = searchInput.value.trim().toLowerCase();
                        if (!searchValue) {
                            return;
                        }
                        if (searchValue.startsWith("a-")) {
                            searchValue = searchValue.slice(2);
                        }
                        let url = `/php/user.php?userID=A-${searchValue}`;
                        console.log(url);
                        window.location.assign(url);
                    }
                    searchInput.addEventListener('keypress', function (event) {
                        if (event.key === 'Enter') {
                            triggerSearch();
                        }
                    });
                }
            }
            if (enable_flag["lobby_search_archives"]) {
                const nav = document.querySelector('.navbar');

                if (nav) {
                    // 创建新的HTML内容
                    const searchWrapperHTML = `
                        <div class="notices-container">
                            <div class="search-wrapper">
                                <div class="search-container">
                                    <input type="text" class="search-input" placeholder="输入AMB-xxx或AMB-CSD-xxx或xxx跳转至档案...">
                                    <i class="fas fa-search search-icon"></i>
                                </div>
                            </div>
                        </div>
                    `;
                    nav.insertAdjacentHTML('afterend', searchWrapperHTML);
                    const searchInput = document.querySelector('.search-input');

                    function triggerSearch() {
                        let searchValue = searchInput.value.trim().toLowerCase();
                        if (!searchValue) {
                            return;
                        }
                        let search_type = "discovered";
                        if (searchValue.startsWith("amb-")) {
                            searchValue = searchValue.slice(4);
                        }
                        if (searchValue.startsWith("amb")) {
                            searchValue = searchValue.slice(3);
                        }
                        if (searchValue.startsWith("csd-")) {
                            searchValue = searchValue.slice(4);
                            search_type = "recorded";
                        }
                        if (searchValue.startsWith("csd")) {
                            searchValue = searchValue.slice(3);
                            search_type = "recorded";
                        }
                        if (!searchValue === String(parseInt(searchValue, 10))) {
                            alert("仅支持AMB-xxx或amb-xxx或xxx的纯数字格式")
                            return;
                        }
                        let url = `/archives_data.php?project_id=AMB-${searchValue}`;
                        if (search_type === "recorded") {
                            url = `/archivesB_data.php?project_id=AMB-CSD-${searchValue}`;
                        }
                        window.location.assign(url);
                    }
                    searchInput.addEventListener('keypress', function (event) {
                        if (event.key === 'Enter') {
                            triggerSearch();
                        }
                    });
                }
            }
        });
    }

    // 档案室
    if (url.pathname === "/archives_room.html") {
        if (enable_flag["archives_room_auto_load_page"] === true) {
            const origin_load_page = loadPage;
            loadPage = function (arg1, arg2) {
                origin_load_page(arg1, arg2);
                let url = new URL(window.location);
                url.searchParams.set('page', arg2);
                window.history.replaceState({}, '', url);
            };
        }

        if (enable_flag["archives_room_show_content_hook"] === true) {
            const origin_show_content = showContent;
            showContent = function (arg1) {
                origin_show_content(arg1);
                let url = new URL(window.location);
                url.searchParams.set('contentType', arg1);
                if(url.searchParams.get('page') === null){
                    url.searchParams.set('page', 1);
                }
                window.history.replaceState({}, '', url);
            };
        }

        if (enable_flag["archives_room_auto_load_page"] === true) {
            function getQueryParam(param) {
                let urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(param);
            }

            function loadSpecifiedPage() {
                let content_type = getQueryParam('contentType');
                if (content_type === null) {
                    content_type = "discovered";
                }
                showContent(content_type);
                let page = getQueryParam('page');
                if (content_type && page) {
                    setTimeout(() => {
                        if (content_type && page) {
                            loadPage(content_type, page);
                        }
                    }, 500);
                }
            }
            window.addEventListener('load', function () {
                loadSpecifiedPage();
            });
        }
    }

    // 档案
    if (url.pathname === "/archives_data.php") {
        if (enable_flag["archives_data_display"]) {
            GM_addStyle(`
            .content-box {
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                line-height: 1.6;
            }
        `);
        }
        window.addEventListener('load', function () {
            if (enable_flag["archives_data_bugfix"]) {
                // 确保页面完全加载后再进行处理
                let contentBoxes = document.querySelectorAll('.content-box');
                contentBoxes.forEach(function (contentBox) {
                    contentBox.style.setProperty('width', 'auto', 'important');
                    contentBox.style.setProperty('max-width', '100%', 'important');
                    contentBox.style.setProperty('margin', '20px 0', 'important');
                });
            }
        });
        if (enable_flag["archives_data_association_amb"]) {
            window.addEventListener('load', function () {
                const urlParams = new URLSearchParams(window.location.search);
                const excludeCode = urlParams.get('project_id')?.toLowerCase() || "";
                const ambPattern = /amb-?\d+|AMB-?\d+/g;
                const contentBoxes = document.querySelectorAll('.content-box');
                let extractedCodes = new Set();
                contentBoxes.forEach(box => {
                    const text = box.textContent.toLowerCase();
                    const matches = text.match(ambPattern);
                    if (matches) {
                        matches.forEach(code => {
                            if (code !== excludeCode) {
                                extractedCodes.add(code);
                            }
                        });
                    }
                });
                const warningBanner = document.querySelector('.warning-banner');
                if (warningBanner && extractedCodes.size > 0) {
                    const contextBox = document.createElement('div');
                    contextBox.className = 'warning-banner';
                    let addon = [];
                    extractedCodes.forEach(code => {
                        const ambMark = code.toUpperCase();
                        addon.push(`<a href="/archives_data.php?project_id=${ambMark}">${ambMark}</a>`);
                    });
                    contextBox.innerHTML = `关联项目：${addon.join(' ')}`;
                    warningBanner.insertAdjacentElement('afterend', contextBox);
                }
            });
        }
    }

    // 档案B
    if (url.pathname === "/archivesB_data.php") {
        if (enable_flag["archivesb_data_display"]) {
            GM_addStyle(`
            .content-box {
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                line-height: 1.6;
            }
        `);
        }
        window.addEventListener('load', function () {
            if (enable_flag["archivesb_data_bugfix"]) {
                let contentBoxes = document.querySelectorAll('.content-box');
                contentBoxes.forEach(function (contentBox) {
                    contentBox.style.setProperty('width', 'auto', 'important');
                    contentBox.style.setProperty('max-width', '100%', 'important');
                    contentBox.style.setProperty('margin', '20px 0', 'important');
                });
            }
        });
    }

})();