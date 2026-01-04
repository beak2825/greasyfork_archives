// ==UserScript==
// @name         Bilibili Search Filter By Time
// @namespace    https://github.com/KID-joker/userscript
// @version      1.2.0
// @supportURL   https://github.com/KID-joker/userscript/issues
// @description  add time filter to bilibili search results
// @author       KID-joker
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @resource css https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css
// @require      https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448716/Bilibili%20Search%20Filter%20By%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/448716/Bilibili%20Search%20Filter%20By%20Time.meta.js
// ==/UserScript==

(function () {
    // 设置样式
    let css = `
        @media (max-width: 1099.9px) {
            #i_cecream .video-list-item {
                display:block!important;
            }
        }
        @media (max-width: 1439.9px) {
            #i_cecream .video-list-item {
                display:block!important;
            }
        }
        @media (max-width: 1699.9px) {
            #i_cecream .video-list-item {
                display:block!important;
            }
        }
        @media (max-width: 1919.9px) {
            #i_cecream .video-list-item {
                display:block!important;
            }
        }
        @media (max-width: 2199.9px) {
            #i_cecream .video-list-item {
                display:block!important;
            }
        }
    `
    GM_addStyle(css)
    GM_addStyle(GM_getResourceText('css'));

    // 获取过滤日期
    function getQueryObject(url) {
        url = url == null ? unsafeWindow.location.href : url
        const search = url.substring(url.lastIndexOf('?') + 1)
        const obj = {}
        const reg = /([^?&=]+)=([^?&=]*)/g
        search.replace(reg, (rs, $1, $2) => {
            const name = decodeURIComponent($1)
            let val = decodeURIComponent($2)
            val = String(val)
            obj[name] = val
            return rs
        })
        return obj
    }
    let date = 'none';
    let dateRange = [];
    function getDate() {
        let queryObj = getQueryObject();
        date = queryObj.date || 'none';
        dateRange = queryObj.date_range || [];
        if (date !== 'none') {
            dateRange = dateRange.split('_');
        }

        updateComponent();
    }

    // 返回json结果
    let responseJson = null;
    // 过滤的结果
    let result = [];
    // 日期过滤的页码
    let actualPage = 1;
    // 显示数量
    let actualPageSize = 21;
    // 已经显示的数量
    let showSize = 0;
    // b站对应页面
    let requestPage = 1;
    // 数量
    let pageSize = 0;
    // 没有更多数据
    let finished = false;
    // 最大页码
    let maxPage = 1;
    // 自定义日期选择弹窗
    let fp = null;
    // b站请求超时限制
    const timeout = 10000;
    let startFetch = 0;

    // 重写fetch，拦截fetch请求
    const originFetch = fetch;
    unsafeWindow.fetch = async function (url, options) {
        startFetch = Date.now();
        // 只针对视频搜索接口
        let params = options && options.params;
        if (url.indexOf('x/web-interface/wbi/search/type') > -1 && params.search_type === 'video' && date !== 'none') {
            // 暂停上报
            const originReportObserver = unsafeWindow.reportObserver;
            unsafeWindow.reportObserver = null;
            actualPage = params.page;
            pageSize = params.page_size;
            if (result.length < actualPage * actualPageSize) {
                await requestData(url, options);
            }
            let responseResult = [];
            // 保证有数据显示
            do {
                responseResult = result.slice(showSize, showSize + actualPageSize);
                if(responseResult.length == 0) {
                    showSize = Math.max(0, showSize - actualPageSize);
                }
            } while(responseResult.length == 0 && result.length > 0);
            showSize += responseResult.length;
            let response = new Response();
            response.json = function () {
                return new Promise(resolve => {
                    responseJson.data.page = +actualPage;
                    responseJson.data.result = responseResult;
                    resolve(responseJson);
                })
            }
            setTimeout(() => {
                hidePagenationBtn();
                changePagenationBtn();
            }, 200);
            unsafeWindow.reportObserver = originReportObserver;
            return response;
        } else {
            return originFetch(url, options);
        }
    }

    // 获取vue实例、vue-router实例
    let app = null, router = null, route = null;
    document.addEventListener('DOMContentLoaded', function () {
        app = document.querySelector('#i_cecream').__vue_app__;
        router = app.config.globalProperties.$router;
        route = app.config.globalProperties.$route;
        if (route.name === 'video') {
            insertComponent();
        } else {
            removeComponent();
        }
        router.afterEach(route => {
            if (route.name === 'video') {
                insertComponent();
            } else {
                removeComponent();
            }
        })
        // const vnode = route.matched.find(ele => ele.name == 'video').instances.default._;

        // 重写replace方法，拦截跳转，更新route，初始化数据
        const routerReplace = router.replace;
        router.replace = function (toRoute) {
            // 筛选条件改变
            if (!toRoute.query.date || toRoute.query.date === 'none' || !toRoute.query.page) {
                route = toRoute;
                result = [];
                actualPage = 1;
                showSize = 0;
                requestPage = 1;
                pageSize = 0;
                finished = false;
                return routerReplace.call(this, toRoute);
            }
        }

        // 获取时间筛选
        getDate();
        if (date !== 'none') {
            let searchBtn = document.querySelector('.search-button');
            searchBtn.click();
        }
    })

    // 插入日期过滤组件
    function insertComponent() {
        if (document.querySelector('#date-search-conditions')) {
            return;
        }
        let element = document.createElement('div');
        element.id = 'date-search-conditions';
        element.className = 'search-condition-row';
        element.addEventListener('click', clickDateCondition);
        let fragment = document.createDocumentFragment();
        let list = [{
            name: 'none',
            title: '时间不限'
        }, {
            name: 'day',
            title: '过去1天内'
        }, {
            name: 'week',
            title: '过去1周内'
        }, {
            name: 'month',
            title: '过去1月内'
        }, {
            name: 'year',
            title: '过去1年内'
        }, {
            name: 'custom',
            title: '自定日期范围'
        }]
        list.forEach(function (ele) {
            let button = document.createElement('button');
            button.id = `date-condition-${ele.name}`;
            button.textContent = ele.title;
            button.className = 'vui_button vui_button--tab mt_sm mr_sm';
            button.dataset.datecondition = ele.name;
            fragment.appendChild(button);
        });
        element.appendChild(fragment);
        document.querySelector('.more-conditions').appendChild(element);
    }
    // 移除日期过滤
    function removeComponent() {
        const dateCondition = document.querySelector('#date-search-conditions')
        if (dateCondition) {
            document.querySelector('.more-conditions').removeChild(dateCondition);
        }
    }
    // 更新日期按钮状态
    function updateComponent() {
        const dateCondition = document.querySelector('#date-search-conditions')
        if (dateCondition) {
            [...dateCondition.children].forEach(btn => {
                if (btn.dataset.datecondition == date) {
                    btn.classList.add("vui_button--active")
                } else {
                    btn.classList.remove("vui_button--active");
                }
            })
        }

        const customBtn = document.querySelector('#date-condition-custom');
        if(customBtn) {
            if(date == 'custom') {
                customBtn.textContent = `${formatTime(dateRange[0])}至${formatTime(dateRange[1])}`;
            } else {
                customBtn.textContent = '自定日期范围';
            }
        }
    }

    function routerGo(query) {
        router.replace({
            'name': 'video',
            query
        });
        setTimeout(() => {
            getDate();

            let firstPagenationBtn = document.querySelector('.vui_pagenation--btn-num');
            if(firstPagenationBtn) {
                showSize = 0;
                // 当前为第一页，点击不生效
                if(firstPagenationBtn.classList.contains("vui_button--active")) {
                    let searchBtn = document.querySelector('.search-button');
                    searchBtn.click();
                } else {
                    firstPagenationBtn.click();
                }
            }
        }, 0);
    }

    // 日期过滤点击事件
    function clickDateCondition(evt) {
        let datecondition = evt.target.dataset.datecondition;
        if (datecondition === 'none') {
            // 时间不限
            let { date, date_range, ...query } = route.query;
            routerGo(query);
        } else if (datecondition === 'custom') {
            // 自定义日期范围，弹出日期选择弹窗
            if (!fp) {
                fp = evt.target.flatpickr({
                    clickOpens: false,
                    maxDate: 'today',
                    mode: 'range',
                    onChange: function (selectedDates) {
                        if (selectedDates.length == 2) {
                            let startTime = +selectedDates[0];
                            let endTime = +selectedDates[1];
                            if (startTime == endTime) {
                                endTime += 86400000;
                            }
                            endTime = Math.min(Date.now(), endTime);
                            filterByDate(datecondition, startTime, endTime);
                        }
                    }
                });
            }
            fp.open();
        } else if (datecondition) {
            // 固定日期范围选择
            let endTime = Date.now();
            let timeMap = {
                'day': 86400000,
                'week': 604800000,
                'month': 2592000000,
                'year': 31536000000
            }
            filterByDate(datecondition, endTime - timeMap[datecondition], endTime);
        }
    }

    function filterByDate(datecondition, startTime, endTime) {
        let { page, o, ...query } = route.query;
        query.date = datecondition;
        query.date_range = `${Math.floor(startTime / 1000)}_${Math.floor(endTime / 1000)}`;
        routerGo(query);
    }

    // 隐藏分页按钮
    function hidePagenationBtn() {
        if (date !== 'none') {
            let pagenationBtnList = document.querySelectorAll('.vui_pagenation--btn-num');
            if (pagenationBtnList.length > 0) {
                for (let btn of pagenationBtnList) {
                    btn.style.display = 'none';
                }
            }
            let pagenationText = document.querySelector('.vui_pagenation--extend');
            if (pagenationText) {
                pagenationText.style.display = 'none';
            }
        }
    }
    // 修改下一页按钮状态
    function changePagenationBtn() {
        let pagenationParent = document.querySelector('.vui_pagenation--btns');
        if (pagenationParent) {
            let nextPagenation = pagenationParent.lastChild;
            if (finished && actualPage === maxPage) {
                nextPagenation.className += ' vui_button--disabled';
                nextPagenation.setAttribute('disabled', 'disabled')
            } else {
                nextPagenation.className = nextPagenation.className.replace(' vui_button--disabled', '');
                nextPagenation.removeAttribute('disabled');
            }
        }
    }

    // 请求数据保存
    async function requestData(url, options) {
        while (true) {
            const query = getQueryObject(url);
            query.page = requestPage;
            // 应该是浏览的偏移量，必须跟页码数量保持一致，不然会有重复数据
            query.dynamic_offset = (requestPage - 1) * pageSize;
            // 请求加密
            Object.assign(query, encWbi(query, encWbiKeys));
            const urlObj = new URL(url);
            url = `${urlObj.origin + urlObj.pathname}?${new URLSearchParams(query)}`;
            let _responseJson = await originFetch(url, options).then(response => {
                return response.json();
            }).catch(err => {
                return {
                    error: true
                }
            });
            if(_responseJson.error) {
                return;
            }
            if (_responseJson.data && _responseJson.data.result) {
                if (_responseJson.data.result.length < pageSize) {
                    finished = true;
                    maxPage = actualPage;
                }
                responseJson = _responseJson;
                let list = responseJson.data.result.filter(ele => ele.pubdate >= dateRange[0] && ele.pubdate <= dateRange[1]);
                result = result.concat(list);
            } else {
                finished = true;
                maxPage = actualPage;
            }
            requestPage++;
            /**
             * finished 没有更多数据了
             * result.length >= actualPage * actualPageSize 满足显示个数
             * (Date.now() - startFetch) > 0.8 * timeout 避免超时
             */
            if (finished || result.length >= actualPage * actualPageSize  || (Date.now() - startFetch) > 0.8 * timeout) {
                return;
            } else {
                let time = Math.round(Math.random() * 400) + 600;
                await delay(time);
            }
        }
    }

    // 防止请求频繁，被封ip
    function delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n);
        });
    }

    function formatTime(timestamp) {
        let date = new Date(timestamp * 1000);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    // 请求加密
    const encWbiKeys = {
        wbiImgKey: "76e91e21c4df4e16af9467fd6f3e1095",
        wbiSubKey: "ddfca332d157450784b807c59cd7921e"
    }
    function encWbi(st, dt) {
        dt || (dt = {});
        var Et = getWbiKey(dt),
            St = Et.imgKey,
            wt = Et.subKey;
        if (St && wt) {
            for (var xt = getMixinKey(St + wt), kt = Math.round(Date.now() / 1e3), Ht = Object.assign({}, st, {
                wts: kt
            }), Wt = Object.keys(Ht).sort(), zt = [], Xt = /[!'\(\)*]/g, Qt = 0; Qt < Wt.length; Qt++) {
                var Zt = Wt[Qt],
                    an = Ht[Zt];
                an && typeof an == "string" && (an = an.replace(Xt, "")), an != null && zt.push("".concat(
                    encodeURIComponent(Zt), "=").concat(encodeURIComponent(an)))
            }
            var mn = zt.join("&"),
                bn = md5(mn + xt);
            return {
                w_rid: bn,
                wts: kt.toString()
            }
        }
        return null
    }
    function getWbiKey(st) {
        if (st.useAssignKey) return {
            imgKey: st.wbiImgKey,
            subKey: st.wbiSubKey
        };
        var dt = getLocal("wbi_img_url"),
            Et = getLocal("wbi_sub_url"),
            St = dt ? getKeyFromURL(dt) : st.wbiImgKey,
            wt = Et ? getKeyFromURL(Et) : st.wbiSubKey;
        return {
            imgKey: St,
            subKey: wt
        }
    }
    function getLocal(st) {
        try {
            return localStorage.getItem(st)
        } catch (dt) {
            return null
        }
    }
    function getKeyFromURL(st) {
        return st.substring(st.lastIndexOf("/") + 1, st.length).split(".")[0]
    }
    function getMixinKey(st) {
        var dt = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39,
            12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63,
            57, 62, 11, 36, 20, 34, 44, 52],
            Et = [];
        return dt.forEach(function (St) {
            st.charAt(St) && Et.push(st.charAt(St))
        }), Et.join("").slice(0, 32)
    }
})();