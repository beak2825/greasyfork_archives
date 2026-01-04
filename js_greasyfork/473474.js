// ==UserScript==
// @name         98搜索增强-手机版
// @version      1.0.12
// @description  望好心堂友发邀请码转正，方便日后提供更强力的功能！etai2019@outlook.com。在搜索页进行搜索结果过滤、自动翻页、帖子预览
// @author       etai2019
// @license      GPL-3.0 License
// @match        https://*.sehuatang.net/search.php?*
// @match        https://*.sehuatang.org/search.php?*
// @match        https://*.18stm.cn/search.php?*
// @match        https://*.30fjp.com/search.php?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_notification
// @namespace https://greasyfork.org/users/1074290
// @downloadURL https://update.greasyfork.org/scripts/473474/98%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA-%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473474/98%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA-%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==
 
const clearCfg = false;
const debug = false;
 
// 初始化参数
if (clearCfg || GM_getValue('version') != GM_info.script.version) {
    for (let i of GM_listValues()) {
        GM_deleteValue(i)
    }
 
    GM_setValue('version', GM_info.script.version)
}
 
(function() {
    'use strict';
 
    // 添加样式
    GM_addStyle(`
        .checkbox-group {
            display: flex;
            font-size: 1em;
            padding: .2em 1em;
            flex-flow: wrap;;
        }
 
        .checkbox-group label {
            display: inline-block;
            vertical-align: middle;
            padding-right: 1em;
        }
 
        .checkbox-group input {
            padding-right: .3em;
        }
 
        .like-popup {
            width: 80%;
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
            background-color: #ddd;
            border: 1px solid;
            padding: 5px;
        }
 
        .like-popup h3{
            font-size: 1.5em;
            margin-bottom: 2em;
        }
 
        .like-popup h5{
            font-size: 1.5em;
        }
    `);
 
    // 提示语
    const tit = document.querySelector('.thread_tit');
    let resultCount = '很多';
    if (tit != null)
    {
        resultCount = tit.textContent.match(/\d+/);
    }

    tit.innerHTML = '';
 
    const tip = document.createElement('p');
    const tipName = "紬宝"
    tip.innerText = `${tipName}: 找到 ${resultCount} 个主题 ❤`;
    tit.appendChild(tip);
 
    // 创建弹窗
    const likePopupLifetimePages = 20;
    const likePopup = document.createElement('div');
    likePopup.className = 'like-popup';
    likePopup.style.setProperty('display', 'none')
    document.body.appendChild(likePopup);
    likePopup.innerHTML = `
        <h3>好用请给作者评个分吧~（弹窗只有这一次）</h3>
        <h5><a href="forum.php?mod=viewthread&tid=1502558" target="_blank">好的，打开帖子评分</a></h5>
        <h5><a href="javascript:document.querySelector('.like-popup').style.setProperty('display', 'none')">关闭</a></h5>
    `;
 
    var pausePage = false;

    BuildUIElements();
    BuildSearchResult();
 
    // 自动翻页
    // 全局变量
    var curSite = {
        SiteTypeID: 641,
        pageurl: "",
        pager: {
            forceHTTPS: true,
            interval: 500,
            nextLM: ".page a:nth-child(3)",
            nextLPC: "a.nxt:not([href^=\"javascript\"]) ,a.next:not([href^=\"javascript\"])",
            pageEM: ".threadlist > ul",
            pageEPC: "#threadlist > ul",
            scrollD: 10,
            type: 1
        }
    }
 
    // 函数区域
    // 插入 <Style>
    function insStyle(style) {
        console.log(style)
        document.documentElement.appendChild(document.createElement('style')).textContent = style;
    }
 
    // 监听滚动条事件
    function windowScroll(fn1) {
        var beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var fn = fn1 || function () {};
        setTimeout(function () { // 延时 1 秒执行，避免刚载入到页面就触发翻页事件
 
            // 避免网页内容太少，高度撑不起来，不显示滚动条而无法触发翻页事件
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                scrollHeight = window.innerHeight || document.documentElement.clientHeight
            if (scrollTop === 0 && document.documentElement.scrollHeight === scrollHeight) {
                // console.log('网页内容太少，高度撑不起来！！')
                insStyle(`html, body {min-height: ${document.documentElement.clientHeight+100}px;}`)
            }
 
            window.addEventListener('scroll', function (e) {
                var afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                    delta = afterScrollTop - beforeScrollTop;
                if (delta == 0) return false;

                fn(delta > 0 ? 'down' : 'up', e);
                beforeScrollTop = afterScrollTop;
            }, false);
        }, 1000)
    }
 
    // 将无缝翻页注册进监听器
    function pageLoading() {
        if (curSite.pager.scrollD === undefined) curSite.pager.scrollD = 10; // 默认翻页触发线 10
        if (curSite.pager.interval === undefined) curSite.pager.interval = 500; // 默认间隔时间 500ms
        curSite.pageUrl = ''; // 下一页URL
        windowScroll(function (direction, e) {
            if(debug) console.log('11', direction, pausePage)

            // 下滑 且 未暂停翻页 且 SiteTypeID > 0 时，才准备翻页
            if (direction != 'down' || pausePage || curSite.SiteTypeID == 0) return

            if (debug) console.log('22')
 
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
            let scrollHeight = window.innerHeight || document.documentElement.clientHeight
            let scrollD = curSite.pager.scrollD;
 
            if (document.documentElement.scrollHeight <= scrollHeight + scrollTop + scrollD) {
                if(debug) console.log('33')
                tip.innerText = `${tipName}: 找到 ${resultCount} 个主题，正在翻页 ❤`;
                intervalPause(); checkURL(getPageE);
            }
        });
 
        function intervalPause() {
            if (curSite.pager.interval) {
                if(pausePage) return;
                
                pausePage = true;
                setTimeout(function(){pausePage = false;}, curSite.pager.interval)
            }
        }
    }
 
    // 检查 URL
    function checkURL(func) {
        if (getNextE()) {
            curSite.pageUrl = curSite.pageUrl.replace('&mobile=2', '');
            func(curSite.pageUrl);
        }
    }
 
    // 通用型获取下一页地址（从 元素 中获取页码）
    function getNextE() {
        let next = getOne(curSite.pager.nextLM) || getOne(curSite.pager.nextLPC);
        if (next && next.nodeType === 1 && next.href && next.href.slice(0,4) === 'http' && next.getAttribute('href').slice(0,1) !== '#') {
            if (next.href != curSite.pageUrl) {
                if (curSite.pager.forceHTTPS && location.protocol === 'https:') {
                    if (next.href.replace(/^http:/,'https:') === curSite.pageUrl) {
                        return false
                    }
                    curSite.pageUrl = next.href.replace(/^http:/,'https:');
                } else {
                    curSite.pageUrl = next.href;
                }
            } else {
                return false
            }
 
            return true
        }
        return false
    }
 
    // 获取一个元素
    function getOne(selector, contextNode = undefined, doc = document) {
        if (!selector) return;
        contextNode = contextNode || doc;
        return getCSS(selector, contextNode);
    }
 
    // 获取元素（CSS/Xpath）来自：https://github.com/machsix/Super-preloader
    function getCSS(css, contextNode = document) {
        return contextNode.querySelector(css);
    }
 
    function createDocumentByString(e) {
        if (e) {
            if ('HTML' !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, 'application/xhtml+xml');
            var t;
            try { t = (new DOMParser).parseFromString(e, 'text/html');} catch (e) {}
            if (t) return t;
            if (document.implementation.createHTMLDocument) {
                t = document.implementation.createHTMLDocument('ADocument');
            } else {
                try {((t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)), t.documentElement.appendChild(t.createElement('head')), t.documentElement.appendChild(t.createElement('body')));} catch (e) {}
            }
            if (t) {
                var r = document.createRange(),
                    n = r.createContextualFragment(e);
                r.selectNodeContents(document.body);
                t.body.appendChild(n);
                for (var a, o = { TITLE: !0, META: !0, LINK: !0, STYLE: !0, BASE: !0}, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                return t;
            }
        } else console.error('没有找到要转成 DOM 的字符串', e);
    }
 
    // 读取下一页内容
    function getPageE(url) {
        tip.innerText = `${tipName}: 找到 ${resultCount} 个主题，正在读取下一页 ❤`;

        console.log('正在读取下一页:', url) 
        // 读取下一页
        GM_xmlhttpRequest({
            url: url,
            method: 'GET',
            overrideMimeType: 'text/html; charset=' + (document.characterSet||document.charset||document.inputEncoding),
            headers: {
                'Referer': window.location.href,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.203',
                'Accept': 'text/html,application/xhtml+xml,application/xml'
            },
            timeout: 3000,
            onload: function (response) {
                try {
                    // console.log('URL：' + url, '最终 URL：' + response.finalUrl, '返回内容：' + response.responseText)
                    console.log('成功载入下一页:', url, 'Response URL:', response.finalUrl)
 
                    processElems(createDocumentByString(response.responseText));
 
                    // 筛选搜索结果
                    removeSearchResutls();
 
                    // 微移一个像素，这样可以直接用滚轮载入下一页
                    document.documentElement.scrollTop -= 0.1;
 
                    // 推广弹窗
                    const lifetimePages = (GM_getValue("lifetime_pages") ?? 0) + 1;
                    const likePopupDisplayTimes = GM_getValue("likePopupDisplayTimes") ?? 0;
                    if (likePopupDisplayTimes == 0 && lifetimePages >= likePopupLifetimePages) {
                        document.querySelector('.like-popup').style.setProperty('display', 'block');
                        GM_setValue("likePopupDisplayTimes", likePopupDisplayTimes + 1);
                    }
 
                    GM_setValue("lifetime_pages", lifetimePages);
                    console.log("lifetime_pages:", lifetimePages)
                } catch (e) {
                    console.error('[自动无缝翻页] - 处理获取到的下一页内容时出现问题，请检查！', e, response.responseText);
                }
            },
            onerror: function (response) {
                console.log('URL：' + url, response)
                GM_notification({text: '❌ 获取下一页失败...', timeout: 5000});
            },
            ontimeout: function (response) {
                console.log('URL：' + url, response)
                GM_notification({text: '❌ 获取下一页超时，可 3 秒后再次滚动网页重试（或尝试刷新网页）...', timeout: 5000});
            }
        });
    }
 
    // 插入位置 5 时，排除 <script> <style> <link> 标签
    function toE5pop(a) {
        if (a.length === 0) return
        let b = a.pop();
        if (b.tagName === 'SCRIPT' || b.tagName === 'STYLE' || b.tagName === 'LINK') {
            return toE5pop(a);
        }
        return b
    }
 
    function getAllCSS(css, contextNode = document) {
        return [].slice.call(contextNode.querySelectorAll(css));
    }
 
    function getAll(selector, contextNode = undefined, doc = document) {
        if (!selector) return [];
        contextNode = contextNode || doc;
        return getAllCSS(selector, contextNode);
    }
 
    // 插入位置
    function getAddTo(num) {
        return 'afterend';
    }
 
    // 替换元素
    function replaceNextL(pageE, o = curSite.pager.nextLM, r = curSite.pager.nextLPC) {
        let oE = getAll(o),
            rE = getAll(r, pageE, pageE);
 
        // 更新页码
        const pageNum = parseInt(document.querySelector('#select_a span').innerText.match(/\d+/));
        document.querySelector('#select_a span').innerText = `第${pageNum + 1}页`;
        if (oE.length != 0 && rE.length != 0 && oE.length === rE.length) {
            for (let i = 0; i < oE.length; i++) {
                oE[i].href = rE[i].href;
            }
            return true
        } else {
            console.log(pageE,oE,rE)
        }
        return false
    }
 
    // XHR 后处理结果，插入、替换元素等（适用于翻页类型 1/3/6）
    function processElems(response) {
        if (!curSite.pager.insertP) {curSite.pager.insertP = [curSite.pager.pageEM, 5]}
        let pageE = getAll(curSite.pager.pageEPC, response, response), toE;
        if (curSite.pager.insertP[1] === 5) { // 插入 pageE 列表最后一个元素的后面
            toE = toE5pop(getAll(curSite.pager.insertP[0]));
        }
 
        console.log('toE', toE != null, curSite.pager.insertP, 'pageE.length', pageE.length, response.innerText);
        if (pageE.length > 0 && toE) {
 
            // 插入位置
            let addTo = getAddTo(curSite.pager.insertP[1]);
 
            // 插入新页面元素
            if (curSite.pager.insertP[1] === 2 || curSite.pager.insertP[1] === 4 || curSite.pager.insertP[1] === 5) pageE.reverse(); // 插入到 [元素内头部]、[目标本身后面] 时，需要反转顺序
            pageE.forEach(function (ulE) {
                // 转换成移动版的格式
                let nlis = Array.from(ulE.querySelectorAll('li')).map(x => {
                    const nli = document.createElement('li');
                    nli.innerHTML = x.querySelector('h3').innerHTML;
                    nli.dataTextContent = x.textContent;
                    return nli;
                });
                const nul = document.createElement('ul');
                nlis.forEach(x => nul.appendChild(x));
 
                toE.insertAdjacentElement(addTo, nul);
            });
 
            // 替换待替换元素
            if (curSite.pager.nextLM) replaceNextL(response);
 
        } else { // 获取主体元素失败
            console.error('[自动无缝翻页] 获取主体元素失败...')
        }
    }
 
    // 代码区域
    pageLoading();
 
    // 函数
    function removeSearchResutls() {
        tip.innerText = `${tipName}: 找到 ${resultCount} 个主题，处理结果中 ❤`;
 
        // 读取所选值
        const excludedValues = GM_getValue('excludedValues') ?? [];
        const includedValues = GM_getValue('includedValues') ?? [];
 
        // 获取搜索结果
        var items = document.querySelectorAll('.threadlist ul li');
 
        // 处理每一个搜索结果
        for (let item of items){
 
            // 只显示关键词
            let shouldShow = includedValues.length == 0 || includedValues.some(word => item.dataTextContent.includes(word));
 
            if (shouldShow) {
                item.style.removeProperty('display');
            } else {
                item.style.display = "none";
                continue;
            }
 
            // 排除关键词
            let shouldHide = excludedValues.some(char => item.dataTextContent.toLowerCase().includes(char));
            if (shouldHide) {
                item.style.display = "none";
            } else {
                item.style.removeProperty('display');
            }
        }
 
        tip.innerText = `${tipName}: 找到 ${resultCount} 个主题 ❤`;
    };
 
    function BuildUIElements() {
        // 创建多选框组
        const exclusionCheckboxGroup = document.createElement('div');
        exclusionCheckboxGroup.className = 'checkbox-group';
        exclusionCheckboxGroup.innerHTML = `
            <span>排除关键词：</span>
            <label><input type="checkbox" class="exclusion" value="资源出售"/>资源出售</label>
            <label><input type="checkbox" class="exclusion" value="求片问答"/>求片问答</label>
            <label><input type="checkbox" class="exclusion" value="内容隐藏"/>内容隐藏</label>
            <label><input type="checkbox" class="exclusion" value="搬运"/>搬运</label>
            <label><input type="checkbox" class="exclusion" value="sha1"/>sha1</label>
        `;
 
        const inclusionCheckboxGroup = document.createElement('div');
        inclusionCheckboxGroup.className = 'checkbox-group';
        inclusionCheckboxGroup.innerHTML = `
            <span>只看关键词：</span>
            <label><input type="checkbox" name="option1" value="综合讨论">综合讨论</label>
            <label><input type="checkbox" name="option2" value="高清中文">高清中文</label>
        `;
 
        // 将多选框组添加到页面中
        const settingsContainer = document.createElement('div')
        settingsContainer.className = 'settings-container';
        settingsContainer.appendChild(exclusionCheckboxGroup);
        settingsContainer.appendChild(inclusionCheckboxGroup);
 
        const searchForm = document.querySelector('.searchform');
        searchForm.appendChild(settingsContainer);
 
        // 当多选框选项更改时，将所选值保存到脚本中
        exclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                const excludedValues = Array.from(exclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]:checked')).map((checked) => checked.value);
                GM_setValue('excludedValues', excludedValues);
 
                // 移除搜索结果
                removeSearchResutls();
            });
        });
 
        inclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                const includedValues = Array.from(inclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]:checked')).map((checked) => checked.value);
                GM_setValue('includedValues', includedValues);
                removeSearchResutls();
            });
        });
 
        // 读取所选值
        const excludedValues = GM_getValue('excludedValues') ?? [];
        const includedValues = GM_getValue('includedValues') ?? [];
 
        // 恢复之前的选择
        excludedValues.forEach((selectedValue) => {
            const checkboxElement = exclusionCheckboxGroup.querySelector(`input[value="${selectedValue}"]`);
            if (checkboxElement) {
                checkboxElement.checked = true;
            }
        });
 
        includedValues.forEach((selectedValue) => {
            const checkboxElement = inclusionCheckboxGroup.querySelector(`input[value="${selectedValue}"]`);
            if (checkboxElement) {
                checkboxElement.checked = true;
            }
        });
    }
 
    function BuildSearchResult () {
        // 删除移动版搜索结果
        const tl = document.querySelector('.threadlist');
        const ul_m = document.querySelector('.threadlist ul');
        tl.removeChild(ul_m);
 
        // 获取PC搜索结果
        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href.replace('&mobile=2', ''),
            overrideMimeType: 'text/html; charset=' + (document.characterSet||document.charset||document.inputEncoding),
            headers: {
                'Referer': window.location.href,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.203',
                'Accept': 'text/html,application/xhtml+xml,application/xml'
            },
            onload: function(response) {
                // 获取PC搜索结果
                const parser = new DOMParser();
                try {
                    const hl = response.responseText;
                    const pc = parser.parseFromString(response.responseText, "text/html");

                    // 筛选搜索结果
                    let nlis = Array.from(pc.querySelectorAll('#threadlist ul li'));
                    // 转换搜索结果
                    nlis = nlis.map(x => {
                        const nli = document.createElement('li');
                        nli.innerHTML = x.querySelector('h3').innerHTML;
                        nli.dataTextContent = x.textContent;
                        return nli;
                    });
                    const nul = document.createElement('ul');
                    nlis.forEach(x => nul.appendChild(x));
 
                    // 添加PC搜索结果
                    const tit = document.querySelector('.threadlist');
                    tit.appendChild(nul);
                    // tit.insertAdjacentElement('afterend', nul);
 
                    // 初始时筛选结果
                    removeSearchResutls();
 
                    // 推广弹窗
                    const lifetimePages = (GM_getValue("lifetime_pages") ?? 0) + 1;
                    const likePopupDisplayTimes = GM_getValue("likePopupDisplayTimes") ?? 0;
                    if (likePopupDisplayTimes == 0 && lifetimePages >= likePopupLifetimePages) {
                        document.querySelector('.like-popup').style.setProperty('display', 'block');
                        GM_setValue("likePopupDisplayTimes", likePopupDisplayTimes + 1);
                    }
 
                    GM_setValue("lifetime_pages", lifetimePages);
                    console.log("lifetime_pages:", lifetimePages)
 
                    // 更新提示语
                    tip.innerText = `${tipName}: 找到 ${resultCount} 个主题 ❤`;
                } catch (error) {
                    console.log(error)
                    tip.innerText = `${tipName}: 初始化失败，请刷新重试 ❤`;
                }
            }
        });
 
    }
 
})();