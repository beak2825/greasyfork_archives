// ==UserScript==
// @name         SCI HUB Checker
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  检查网页内doi在scihub上是否存在并跳转
// @author       You
// @match        https://www.webofscience.com/*
// @match        https://www.sciencedirect.com/*
// @match        https://webofscience.clarivate.cn/*
// @match        https://onlinelibrary.wiley.com/*
// @match        https://www.hindawi.com/*
// @match        https://link.springer.com/*
// @match        https://meridian.allenpress.com/*
// @match        https://dl.asminternational.org/*
// @match        https://chemistry-europe.onlinelibrary.wiley.com/doi/*
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @match        https://www.ams.org.cn/*
// @match        https://journals.sagepub.com/*
// @match        https://www.semanticscholar.org/*
// @match        https://asmedigitalcollection.asme.org/*
// @match        https://www.tandfonline.com/*
// @match        https://www.emerald.com/*
// @match        https://xueshu.baidu.com/*
// @match        https://www.osti.gov/*
// @match        https://www.mdpi.com/*
// @match        https://www.x-mol.com/*
// @match        https://www.degruyter.com/*
// @match        https://www.researchgate.net/*
// @match        https://iopscience.iop.org/*
// @match        https://bioone.org/*
// @match        https://research.monash.edu/*
// @match        https://www.astm.org/*
// @match        https://kns.cnki.net/*
// @match        https://d.wanfangdata.com.cn/*
// @match        https://springer.longhoe.net/*
// @match        https://pubs.aip.org/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://www.frontiersin.org/*
// @match        https://data.mendeley.com/*
// @match        https://openurl.ebsco.com/*
// @match        https://ceramics.onlinelibrary.wiley.com/*
// @match        https://pubs.rsc.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496437/SCI%20HUB%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/496437/SCI%20HUB%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认选择器数组
    var defaultSelectors = [
        'h2.item-details__value__h', '.with-spacing.mdui-text', '.volumeInfo+a', '.creative-work__title .visitable',
        '.u-pb-1.stats-document-abstract-doi a', '.citation-doi', '.c-bibliographic-information__list-item.c-bibliographic-information__list-item--chapter-doi .c-bibliographic-information__value',
        '.doiStyle a', '.rowtit+p', '.info_value', '.core-enumeration+.doi a', '.astm-type-body.mb-2',
        '.doi .link', '.ProceedingsArticleOpenAccessAnchor+a', '.icon-button.button--full-width.button--primary.flex-paper-actions__button.flex-paper-actions__button--primary',
        '.icon-button.flex-paper-actions__button.alternate-sources__dropdown-button', '.wd-jnl-art-breadcrumb-issue+span+span', '#FullRTa-DOI', '#banner+div a[title]',
        '.epub-doi', '.articleHeader__meta_doiLink :first-child', '.citation-doi', '.chapter-doi-link :first-child',
        '.epub-section .epub-doi', '[class="identifier doi"] a.id-link', '.doi__link', '.chapter-doi-link:first-child',
        '.citation-label a', '[class="docsum-journal-citation full-journal-citation"]', '.table span.txt_zhaiyao',
        '.book-info__doi-link', '.dx-doi a', '.intent_doi_link.Citation__identifier__link', '.kw_main',
        '.bib-identity a', '.itsmblue', '.subTitleInfoProductPage.ga_doi', '.link.link-external',
        '.color-grey-dark a', '.nova-legacy-e-text.nova-legacy-e-text--size-m.nova-legacy-e-text--family-sans-serif.nova-legacy-e-text--spacing-xxs.nova-legacy-e-text--color-grey-700',
        '.epub-doi', 'a .text--small',
    ];


    // 获取保存的自定义选择器和网站数组
    var customMappings = GM_getValue('customMappings', {});
    if (!customMappings) {
        customMappings = {};
    }

    // 打印网站和选择器的对应关系
    // console.log('网站和选择器的对应关系:');
    // Object.entries(customMappings).forEach(([site, selectors]) => {
    //     console.log(`网站: ${site}`);
    //     selectors.forEach(selector => {
    //         console.log(`  选择器: ${selector}`);
    //     });
    // });

    // 重置自定义选择器和网站数组
    function resetCustomValues() {
        GM_setValue('customMappings', {});
        customMappings = {};
    }

    // 重置自定义选择器和网站数组
    //resetCustomValues();

    // 获取保存的自定义选择器和网站数组
    // console.log('保存前:', customMappings);

    // 添加设置页面
    GM_registerMenuCommand('添加自定义选择器和网站', function () {
        if (window.top !== window.self) {
            return; // 如果不是主页面，直接退出
        }

        // 添加一个标志位来记录是否已经弹出过 prompt
        if (window.hasPrompted) {
            return; // 如果已经弹出过 prompt，直接退出
        }
        window.hasPrompted = true;

        var currentUrl = window.location.origin + '/*';
        var newSite = prompt('请输入新的网站:', currentUrl);
        if (newSite === null) {
            window.hasPrompted = false; // 用户点击取消，重置标志位
            return; // 用户点击取消，直接退出
        }
        var newSelector = prompt('请输入新的选择器:');
        if (newSite && newSelector) {
            if (!customMappings[newSite]) {
                customMappings[newSite] = [];
            }
            customMappings[newSite].push(newSelector);
            GM_setValue('customMappings', customMappings);
            console.log('Stored customMappings:', customMappings);
            alert('网站和选择器已添加: ' + newSite + ' -> ' + newSelector);
            location.reload(); // 重新加载页面以应用新的匹配规则
        }
        window.hasPrompted = false; // 重置标志位
    });

    // 获取保存的自定义选择器和网站数组
    customMappings = GM_getValue('customMappings', {});
    console.log('保存后的:', customMappings);


    // 添加上传自定义选择器和网站的菜单项
    GM_registerMenuCommand('上传自定义选择器和网站', function () {

        if (Object.keys(customMappings).length === 0) {
            alert('没有自定义选择器和网站可上传');
            return;
        }
        var timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // 生成时间戳
        var serverUrl = 'https://dav.jianguoyun.com/dav/DOI/customMappings_' + timestamp + '.json'; // 替换为你的 WebDAV 服务器地址
        var username = 'yiboto6201@maxturns.com'; // 替换为你的 WebDAV 用户名
        var password = 'a45cnvqwvn2ra38h'; // 替换为你的 WebDAV 密码

        GM_xmlhttpRequest({
            method: 'PUT',
            url: serverUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            },
            data: JSON.stringify(customMappings),
            onload: function (response) {
                console.log('Response:', response);
                if (response.status === 200 || response.status === 201) {
                    alert('自定义选择器和网站已成功上传');
                } else {
                    alert('上传失败，请稍后再试');
                    console.error('Upload failed:', response.status, response.statusText);
                }
            },
            onerror: function (error) {
                alert('上传失败，请检查网络连接');
                console.error('Upload error:', error);
            }
        });
    });


    // 添加自定义选择器和网站的菜单项
    GM_registerMenuCommand('管理自定义选择器和网站', function () {
        var settingsWindow = window.open('', '', 'width=600,height=500');
        settingsWindow.document.write(`
            <html>
            <head>
                <title>管理自定义选择器和网站</title>
                <style>
                    body {
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f7f9fc;
                        color: #4a4a4a;
                    }

                    h1 {
                        font-size: 26px;
                        color: #333;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }

                    p {
                        font-size: 16px;
                        color: #666;
                        text-align: left;
                        margin-bottom: 20px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        background-color: #ffffff; /* 强调白色背景 */
                        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                        border: 1px solid #e0e0e0; /* 添加边框颜色 */
                        border-radius: 8px;
                    }

                    th, td {
                        padding: 10px 12px;
                        text-align: left;
                        font-size: 14px;
                    }

                    th {
                        background-color: #f4f6f9;
                        color: #555;
                        font-weight: 500;
                    }

                    td {
                        background-color: #fafafa;
                        color: #333;
                    }

                    tr:nth-child(even) td {
                        background-color: #f9f9f9;
                    }

                    button {
                        background-color: #007bff;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        font-size: 14px;
                    }

                    button:hover {
                        background-color: #0056b3;
                    }

                    .empty-state {
                        text-align: center;
                        color: #aaa;
                        font-size: 16px;
                        padding: 30px;
                    }

                    /* 响应式设计：适配小屏设备 */
                    @media (max-width: 768px) {
                        table {
                            font-size: 12px;
                        }

                        button {
                            padding: 6px 12px;
                            font-size: 12px;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>管理自定义选择器和网站</h1>
                <p>您可以在此页面管理自定义的选择器与其对应的网站。</p>
                <table>
                    <thead>
                        <tr>
                            <th>网站</th>
                            <th>选择器</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="mappingTable">
                        <tr class="empty-state">
                            <td colspan="3">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
        `);

        var mappingTable = settingsWindow.document.getElementById('mappingTable');

        // 初始化表格内容
        function refreshTable() {
            mappingTable.innerHTML = ''; // 清空表格内容

            var hasData = false;

            for (var site in customMappings) {
                customMappings[site].forEach(function (selector, index) {
                    hasData = true;

                    var row = settingsWindow.document.createElement('tr');

                    var siteCell = settingsWindow.document.createElement('td');
                    siteCell.textContent = site;
                    row.appendChild(siteCell);

                    var selectorCell = settingsWindow.document.createElement('td');
                    selectorCell.textContent = selector;
                    row.appendChild(selectorCell);

                    var actionCell = settingsWindow.document.createElement('td');
                    var deleteButton = settingsWindow.document.createElement('button');
                    deleteButton.textContent = '删除';

                    deleteButton.onclick = function () {
                        customMappings[site].splice(index, 1);
                        if (customMappings[site].length === 0) {
                            delete customMappings[site];
                        }
                        GM_setValue('customMappings', customMappings);
                        refreshTable(); // 重新刷新表格内容
                    };

                    actionCell.appendChild(deleteButton);
                    row.appendChild(actionCell);

                    mappingTable.appendChild(row);
                });
            }

            // 如果没有数据，则显示空状态
            if (!hasData) {
                mappingTable.innerHTML = '<tr class="empty-state"><td colspan="3">暂无数据</td></tr>';
            }
        }

        refreshTable(); // 初次加载数据
    });


    // 检查当前网址是否匹配 @match 规则或自定义网站
    function isMatchingSite(site) {
        var matches = GM_info.script.matches;
        return matches.some(match => {
            var regex = new RegExp(match.replace(/\*/g, '.*'));
            return regex.test(site);
        }) || Object.keys(customMappings).some(customSite => {
            var regex = new RegExp(customSite.replace(/\*/g, '.*'));
            return regex.test(site);
        });
    }

    // 检查当前网址是否匹配 @match 规则或自定义网站
    if (!isMatchingSite(window.location.href)) {
        console.log('当前网址不匹配:', window.location.href);
        return;
    }

    // 合并默认和自定义选择器
    var selectors = defaultSelectors.concat(...Object.values(customMappings).flat());

    // console.log('-----------------------------------程序测试-----------------------------------');
    // 初始化元素数组
    var elements = [];
    let observerCallCount = 0; // 初始化计数器
    let observerCount = 0; // 初始化计数器

    var observer;

    window.onload = function () {
        observer = new MutationObserver(function (mutations) {
            // 使用循环来查询和添加元素
            selectors.forEach(function (selector) {
                var els = document.querySelectorAll(selector);
                if (els.length > 0) {
                    elements.push(...els);
                } else {
                    return; // 跳出当前循环
                }
            });
            elements.forEach(function (element) {
                if (element && !element.hasAttribute('data-checked') && (!element.parentElement || !element.parentElement.hasAttribute('data-checked'))) {
                    checkPaperAvailability(element);
                    observerCallCount++;
                    //console.log(checkspliDOI(element.text));
                    console.log('Observer call count:', observerCallCount);
                }
                else {
                    return; // Exit the current iteration of the loop
                }
            });
        });
        observer.observe(document, { childList: true, subtree: true, attributes: false });
    };

    // 提取文本中的DOI
    function checksplitDOI(text) {
        var doiRegex = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/ig;
        var matches = text.match(doiRegex);
        if (matches) {
            // 删除末尾的句点、冒号、分号、连字符和下划线
            var cleanedDOI = matches[0].replace(/[.:;_-]+$/, '');
            return cleanedDOI;
        }
    }

    // 更新DOI元素
    function updateDOIElement(doi, element, available) {
        if (available) {
            var newelement = document.createElement(element.tagName === 'A' ? 'span' : 'a');
            if (element.tagName !== 'A') {
                newelement.href = "https://www.sci-hub.st/" + doi;
                newelement.target = "_self";
            } else {
                element.href = "https://www.sci-hub.st/" + doi;
                element.target = "_self";
                element.onclick = function () {
                    window.location.replace("https://www.sci-hub.st/" + doi);
                };
            }
            var newelementtext = document.createTextNode("   可访问sci-hub");
            newelement.appendChild(newelementtext);
            element.appendChild(newelement);
            element.style.color = 'hotpink';
            newelement.style.textDecoration = 'underline';
            newelement.style.color = 'hotpink';
            setupNavigationHoverEffectForDOI(doi, element, true);
        } else {
            var text = document.createTextNode(" (未找到该文献！)");
            element.style.color = '#9955FF';
            element.style.cursor = 'pointer';
            element.appendChild(text);
            setupNavigationHoverEffectForDOI(doi, element, false);
        }
    }
    //更新 DOI 元素
    function setupNavigationHoverEffectForDOI(doi, element, available) {
        var popup = document.createElement('div');
        popup.id = 'popup';
        let copyButton = document.createElement('div');
        copyButton.textContent = 'DOI: ' + doi + ' (点击复制)';
        popup.appendChild(copyButton);

        let Doiserach = document.createElement('span');
        Doiserach.textContent = 'DOI搜索: ';
        popup.appendChild(Doiserach);

        let bingLink = createSearchLink('https://www.bing.com/search?q=', doi, 'Bing搜索');
        let googleLink = createSearchLink('https://www.google.com.hk/search?q=', doi, 'Google搜索');
        let googleScholarLink = createSearchLink('https://xs.cljtscd.com/scholar?hl=en&as_sdt=0%2C5&q=', doi, 'Google Scholar搜索');

        popup.appendChild(bingLink);
        popup.appendChild(googleLink);
        popup.appendChild(googleScholarLink);

        let br1 = document.createElement('br');
        popup.appendChild(br1);
        let scitext = document.createElement('span');
        scitext.textContent = 'SCI-HUB: ';
        popup.appendChild(scitext);

        if (available) {
            let scilink = createSearchLink('https://www.sci-hub.st/', doi, '前往SCI-HUB');
            scilink.target = '_self';
            scilink.style.color = 'hotpink';
            popup.appendChild(scilink);
        } else {
            let scilink = createSearchLink('https://www.sci-hub.st/', doi, '未找到该文献！');
            scilink.style.color = '#9955FF';
            scilink.target = '_self';
            popup.appendChild(scilink);
        }
        let br2 = document.createElement('br');
        popup.appendChild(br2);
        let libstctext = document.createElement('span');
        libstctext.textContent = 'Lib-Stc: ';
        popup.appendChild(libstctext);

        let libstclink = createSearchLink('https://libstc.cc/#/?q=', doi, '前往libstc')
        popup.appendChild(libstclink)

        popup.style.cssText = `
            position: absolute;
            border: 1px solid rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #ffffff, #f9f9f9);
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            max-width: 390px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            z-index: 1000;
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: translateY(-10px);
            flex-direction: column;
            gap: 100px;
            text-align: left;
            `;

        document.body.appendChild(popup);

        copyButton.addEventListener('click', function () {
            navigator.clipboard.writeText(doi).then(() => {
                copyButton.textContent = 'DOI: ' + doi + ' (已复制)';
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });

        var state = 'hidden';
        function transition(newState) {
            if (state === newState) return;
            state = newState;

            switch (state) {
                case 'hidden':
                    popup.style.opacity = '0';
                    popup.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        popup.style.display = 'none';
                    }, 300);
                    break;
                case 'visible':
                    popup.style.display = 'block';
                    popup.style.opacity = '0';
                    popup.style.transform = 'translateY(-10px)';
                    requestAnimationFrame(() => {
                        popup.style.opacity = '1';
                        popup.style.transform = 'translateY(0)';
                    });
                    break;
                case 'hovered':
                    popup.style.display = 'block';
                    popup.style.opacity = '1';
                    popup.style.transform = 'translateY(0)';
                    break;
            }
        }

        function showPopup(event) {
            popup.style.left = event.pageX + 'px';
            popup.style.top = (event.pageY + 10) + 'px';
            transition('visible');
        }

        element.addEventListener('mouseover', function (event) {
            if (state === 'hidden') {
                showPopup(event);
            }
            transition('hovered');
        });

        element.addEventListener('mouseout', function () {
            setTimeout(function () {
                if (!popup.matches(':hover') && !element.matches(':hover')) {
                    transition('hidden');
                }
            }, 300);
        });

        popup.addEventListener('mouseout', function () {
            setTimeout(function () {
                if (!popup.matches(':hover') && !element.matches(':hover')) {
                    transition('hidden');
                }
            }, 300);
        });

        popup.addEventListener('mouseover', function () {
            transition('hovered');
        });
    }

    function createSearchLink(baseURL, searchQuery, linkText) {
        let link = document.createElement('a');
        // 如果是 sci-hub 的 baseURL，保留 DOI 中的斜杠（避免将 '/' 编码为 '%2F'）
        if (/sci-?hub/i.test(baseURL)) {
            // 对除了斜杠以外的字符进行编码，保留 '/'
            link.href = baseURL + encodeURIComponent(searchQuery).replace(/%2F/g, '/');
        } else {
            link.href = `${baseURL}${encodeURIComponent(searchQuery)}`;
        }
        link.textContent = linkText;
        link.target = '_blank';
        link.style.marginRight = '10px';
        link.style.color = '#007bff';
        return link;
    }

    function checkPaperAvailability(element) {
        var doitext = element.innerText;
        let doi = checksplitDOI(doitext);
        if (doi) {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.sci-hub.st/${doi}`,
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    // 检测 embed 元素,判断文献是否可用
                    const embed = doc.querySelector('embed[type="application/pdf"]');
                    const isAvailable = embed && embed.src && embed.src.includes('.pdf');
                    updateDOIElement(doi, element, isAvailable);
                }
            });
            element.setAttribute('data-checked', 'true');
        } else if (element.tagName === 'A') {
            // 尝试多次解码 href，以处理像 %2F 或多重编码的情况，然后从中提取 DOI
            function safeDecode(input) {
                var v = input;
                try {
                    for (var i = 0; i < 3; i++) {
                        var decoded = decodeURIComponent(v);
                        if (decoded === v) break;
                        v = decoded;
                    }
                } catch (e) {
                    return input;
                }
                return v;
            }

            var rawHref = element.getAttribute('href') || element.href || '';
            var decodedHref = safeDecode(rawHref);
            // 先尝试从 decodedHref 提取 DOI，如果没有，再尝试从 rawHref 提取
            var doihreftext = checksplitDOI(decodedHref) || checksplitDOI(rawHref);

            if (doihreftext) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.sci-hub.st/" + doihreftext,
                    onload: function (response) {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response.responseText, "text/html");
                        // 检测 embed 元素,判断文献是否可用
                        var embed = doc.querySelector('embed[type="application/pdf"]');
                        var isAvailable = embed && embed.src && embed.src.includes('.pdf');
                        updateDOIElement(doihreftext, element, isAvailable);
                    }
                });
                element.setAttribute('data-checked', 'true');
            }
        } else {
            element.setAttribute('data-checked', 'true');
            return;
        }
    }

})();