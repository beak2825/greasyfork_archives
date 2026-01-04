// ==UserScript==
// @name         马帮/店匠自动登录
// @namespace    http://tampermonkey.net/
// @version      25.1.20.1
// @description  私人代码
// @author       Ano_via
// @match        https://www.mabangerp.com/*
// @match        https://sso.shoplazza.com/*
// @match        https://*.myshoplaza.com/admin/smart_apps/base/order/*
// @match        https://*.myshoplaza.com/admin/smart_apps/python/products*
// @match        https://www.instagram.com/accounts/comment_filter/*
// @match        https://www.instagram.com/accounts/hide_custom_words/*
// @match        https://www.facebook.com/ads/library/*
// @match        https://business.facebook.com/latest/inbox/*
// @match        https://imgus.cc/*
// @match        https://whocall.cc/*
// @match        https://ipfs.1kbtool.com/*
// @match        https://search.zhelper.net/*
// @match        https://apkpure.com/*
// @match        https://www.linshiyouxiang.net/*
// @match        https://www.free-api.com/*
// @match        https://so.lzpanx.com/*
// @match        https://img.staticdj.com/*
// @match        https://cdn.shoplazza.com/*
// @match        https://img.fantaskycdn.com/*
// @match        https://xueqiu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mabangerp.com
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/523824/%E9%A9%AC%E5%B8%AE%E5%BA%97%E5%8C%A0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/523824/%E9%A9%AC%E5%B8%AE%E5%BA%97%E5%8C%A0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加子目录
    function addSubdirectories() {
        // 创建第一个子目录
        var firstChild = document.createElement("li");
        firstChild.className = "relative";
        firstChild.innerHTML = '<a href="index.php?mod=employee.list" class="">人员</a>';

        // 创建第二个子目录
        var secondChild = document.createElement("li");
        secondChild.className = "relative";
        secondChild.innerHTML = '<a href="index.php?mod=shop.list" class="" style="color:#f19240;font-weight:600">店铺</a>';

        // 创建第三个子目录
        var thirdChild = document.createElement("li");
        thirdChild.className = "relative";
        thirdChild.innerHTML = '<a href="index.php?mod=main.cloudbi" class="">销量</a>';

        // 创建第四个子目录
        var fourthChild = document.createElement("li");
        fourthChild.className = "relative";
        fourthChild.innerHTML = '<a href="index.php?mod=reports.salesSkuReports&salesSwitch=&supplierId=" class="" style="color:#f19240;font-weight:600">商品报表</a>';

        // 获取父节点
        var parentElement = document.querySelector("#mb-nav");

        // 将子目录插入到父节点的最前面
        parentElement.insertBefore(fourthChild, parentElement.firstChild);
        parentElement.insertBefore(thirdChild, parentElement.firstChild);
        parentElement.insertBefore(secondChild, parentElement.firstChild);
        parentElement.insertBefore(firstChild, parentElement.firstChild);
    }
    function shoplaza_add_button(){
        // JavaScript 代码
        const targetButton = document.querySelector('#dj-smart-app > div > div > div:nth-child(1) > header > div:nth-child(2) > button:nth-child(1)');
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.id = 'trigger-button';
        newButton.className = 'orca-sds-btn orca-sds-btn-tertiary orca-sds-dropdown-trigger';
        newButton.style.width = 'auto';
        newButton.innerHTML = '<span>更多</span><span role="img" aria-label="dropdown" class="sds-icon sds-icon-dropdown"><svg viewBox="0 0 16 16" focusable="false" data-icon="dropdown" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M7.65 10.65a.5.5 0 00.7 0l3.8-3.8a.5.5 0 00-.36-.85H4.21a.5.5 0 00-.36.85l3.8 3.8z" fill-rule="evenodd" clip-rule="evenodd"></path></svg></span>';

        targetButton.parentNode.insertBefore(newButton, targetButton);

        const dragonButtons = document.querySelectorAll('.dragon-icon-btn.dragon-icon-btn-normal.dragon-icon-btn-sm.dragon-icon-btn-gray.close_86f5');

        newButton.addEventListener('click', () => {
            dragonButtons.forEach(button => {
                button.click();
            });
        });
    }
    if (window.location.href === 'https://www.mabangerp.com/index.htm') {
        document.querySelector('#login-btn').click();
        document.querySelector('#account-btn').click();
    } else if (window.location.href === 'https://www.mabangerp.com/' || window.location.href === 'https://www.mabangerp.com/index.php?') {
        addSubdirectories();
        // 在页面加载完成后执行点击操作
        window.addEventListener('load', function() {
            // 检查是否存在名为 "setRemind-container" 的 div 元素
            document.getElementById("shopReminderTime").style.display = "none";
        });
    } else if (window.location.href.startsWith('https://www.mabangerp.com')) {
        addSubdirectories();
        // 店匠部分
    } else if (window.location.href.startsWith('https://sso.shoplazza.com/login')) {
        // 在页面加载完成后执行点击操作
        window.addEventListener('load', function() {
            // 点击第一个元素
            var element1 = document.querySelector("#root > div > div.right.svelte-1yg3wu6 > div.container.svelte-1yg3wu6 > div > div > form > div.tip.svelte-azanf0 > div");
            if (element1) {
                element1.click();
            }
            // 点击第二个元素
            var element2 = document.querySelector("#root > div > div.right.svelte-1yg3wu6 > div.container.svelte-1yg3wu6 > div > div > form > button");
            if (element2) {
                element2.click();
            }
        });
    } else if (window.location.href.startsWith('https://sso.shoplazza.com/switch_account')) {
        window.addEventListener('load', function() {
            document.querySelector("#root > div > div.right.svelte-1yg3wu6 > div.container.svelte-1yg3wu6 > div > div > div > ul > li").click();
        });
    } else if (window.location.href.includes('.myshoplaza.com/admin/')) {
        setInterval(function() {
            if (window.location.href.includes('.myshoplaza.com/admin/smart_apps/base/order/_dealing')) {

                var elements = document.getElementsByClassName("link_bb97 table_padding_0a07");
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];

                    if (element.innerHTML.toLowerCase().includes("=ash")) {
                        element.style.background = "pink";
                    } else if (element.innerHTML.toLowerCase().includes("=terry")) {
                        element.style.background = "green";
                        element.style.color = "white";
                    } else if (element.innerHTML.toLowerCase().includes("=google")) {
                        element.style.background = "orange";
                    } else if (element.innerHTML.toLowerCase().includes("=pinterest")) {
                        element.style.background = "#e60023";
                        element.style.color = "white";
                    } else if (element.innerHTML.toLowerCase().includes("=lux")) {
                        element.style.background = "yellow";
                    } else if (element.innerHTML.toLowerCase().includes("=snapchat")) {
                        element.style.background = "SlateBlue";
                        element.style.color = "white";
                    } else if (element.innerHTML.toLowerCase().includes("=nunu")) {
                        element.style.background = "purple";
                        element.style.color = "white";
                    } else if (element.innerHTML.toLowerCase().includes("=stream") | element.innerHTML.toLowerCase().includes("=omnisend") | element.innerHTML.toLowerCase().includes("=cartsee") | element.innerHTML.toLowerCase().includes("=inshomepage")) {
                        element.style.background = "LightGray";
                    } else if (element.innerHTML.toLowerCase().includes("=jenna")) {
                        element.style.background = "AntiqueWhite";
                    }
                }
                if (window.location.href.includes('keyword=')) {
                    // 定义 XPath 表达式
                    const xpath = '//*[@id="order_list"]/form/div/div/div/div/div/div/div/div[3]/div/table/tbody/tr/td[5]';

                    // 使用 document.evaluate 获取所有匹配的元素
                    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    // 初始化总和
                    let sum = 0;

                    // 遍历所有匹配的元素
                    for (let i = 0; i < result.snapshotLength; i++) {
                        const element = result.snapshotItem(i);
                        const value = parseFloat(element.textContent); // 获取文本内容并转换为数字
                        if (!isNaN(value)) { // 确保值是有效的数字
                            sum += value; // 累加到总和
                        }
                    }

                    // 保留两位小数
                    sum = sum.toFixed(2);

                    // 修改指定元素的内容
                    const summaryElement = document.evaluate('//*[@id="dj-smart-app"]/div/div/div[1]/header/div[1]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (summaryElement) {
                        summaryElement.textContent = `待处理订单 总和：${sum}`;
                    }

                    // 输出总和（可选）
                    console.log('总和:', sum);
                }
            } else if (window.location.href.includes('.myshoplaza.com/admin/smart_apps/base/order/_undeal')) {

                var elements3 = document.getElementsByClassName("link_364c table_padding_69b2");
                for (var i3 = 0; i3 < elements3.length; i3++) {
                    var element3 = elements3[i3];

                    if (element3.innerHTML.toLowerCase().includes("=ash")) {
                        element3.style.background = "pink";
                    } else if (element3.innerHTML.toLowerCase().includes("=terry")) {
                        element3.style.background = "green";
                        element3.style.color = "white";
                    } else if (element3.innerHTML.toLowerCase().includes("=google")) {
                        element3.style.background = "orange";
                    } else if (element3.innerHTML.toLowerCase().includes("=pinterest")) {
                        element3.style.background = "#e60023";
                        element3.style.color = "white";
                    } else if (element3.innerHTML.toLowerCase().includes("=lux")) {
                        element3.style.background = "yellow";
                    } else if (element3.innerHTML.toLowerCase().includes("=snapchat")) {
                        element3.style.background = "SlateBlue";
                        element3.style.color = "white";
                    } else if (element3.innerHTML.toLowerCase().includes("=nunu")) {
                        element3.style.background = "purple";
                        element3.style.color = "white";
                    } else if (element3.innerHTML.toLowerCase().includes("=stream") | element3.innerHTML.toLowerCase().includes("=omnisend") | element3.innerHTML.toLowerCase().includes("=cartsee") | element3.innerHTML.toLowerCase().includes("=inshomepage")) {
                        element3.style.background = "LightGray";
                    } else if (element3.innerHTML.toLowerCase().includes("=jenna")) {
                        element3.style.background = "AntiqueWhite";
                    }
                }
            } else if (window.location.href.includes('.myshoplaza.com/admin/smart_apps/python/products')) {
                // 遍历所有 class 为 image_48cc 的 a 标签
                document.querySelectorAll('a.image_48cc').forEach(function(anchor) {
                    // 获取 style 属性中的 background 属性值
                    let style = anchor.getAttribute('style');
                    let match = style.match(/url\("([^"]+)"\)/);

                    if (match) {
                        // 获取背景图片的 URL
                        let imageUrl = match[1];

                        // 替换 720x 为 64x
                        let newImageUrl = imageUrl.replace('_720x', '');

                        // 创建新的 img 元素
                        let img = document.createElement('img');
                        img.setAttribute('src', newImageUrl);
                        img.setAttribute('width', '64'); // 可根据需要设置 alt 属性

                        // 用 img 替换 a 标签
                        anchor.parentNode.replaceChild(img, anchor);
                    }
                });
                GM_registerMenuCommand("复制图片链接（去除路径）", function() {
                    // 获取当前页面选中的图片
                    let img = document.querySelector("img:hover");
                    if (!img) {
                        alert("请将鼠标悬停在图片上！");
                        return;
                    }

                    // 获取图片链接并处理
                    let imgUrl = img.src;
                    if (!imgUrl) {
                        alert("无法获取图片链接！");
                        return;
                    }

                    // 去掉 "/" 及之前的内容
                    let strippedUrl = imgUrl.replace(/^.*\//, "");

                    // 复制到剪贴板
                    GM_setClipboard(strippedUrl);
                    alert("图片链接已复制：" + strippedUrl);
                });
            }
        }, 500); // 每秒运行一次
        // 获取当前网站的 URL
        window.addEventListener('load', function() {
            var currentURL = window.location.href;

            // 检查网站开头是什么字符
            if (currentURL.includes("fancytia")) {
                replaceImage("https://img.staticdj.com/a2305b1b08996d86bd11e7d5ecee594e.png");
            } else if (currentURL.includes("etanas")) {
                replaceImage("https://img.staticdj.com/aa762024ae406c921defea971c3692ca.png");
            } else if (currentURL.includes("outletsltd")) {
                replaceImage("https://img.staticdj.com/aed81d87e30c37c07f65566db6787ae3.png");
            } else if (currentURL.includes("allsomia")) {
                replaceImage("https://img.staticdj.com/38975e57605751bea77c41afd46a6326.png");
            } else if (currentURL.includes("linenstylish")) {
                replaceImage("https://img.fantaskycdn.com/56ac894eab01639949ee43fc16d49beb.png");
            }

            // 替换图片的函数
            function replaceImage(newImageURL) {
                // 获取 id 为 "dragon-header" 的元素
                var dragonHeader = document.getElementById("dragon-header");

                // 如果 dragonHeader 不为空，则继续操作
                if (dragonHeader) {
                    // 获取 dragonHeader 下第一个 div 中的 img 元素
                    var imgElement = dragonHeader.querySelector("div:first-of-type img");

                    // 如果 imgElement 不为空，则进行图片替换
                    if (imgElement) {
                        // 替换图片的 src 属性为新图片的 URL
                        imgElement.src = newImageURL;
                    } else {
                        console.error("未找到图片元素");
                    }
                } else {
                    console.error("未找到 id 为 'dragon-header' 的元素");
                }
            }
        });
    } else if (window.location.href.startsWith('https://www.instagram.com/accounts/comment_filter/') || window.location.href.startsWith('https://www.instagram.com/accounts/hide_custom_words/')) {
        function updateContent() {
            // 找到class="_acok"的textarea元素
            const textareaElement = document.querySelector('textarea._acok');

            // 计算textarea内逗号的数量
            const commaCount = (textareaElement.value.match(/,/g) || []).length;

            // 找到class="_acoh"的div元素
            const divElement = document.querySelector('div._acoh');

            // 修改div内p元素的内容
            const pElement = divElement.querySelector('p');
            pElement.textContent = `隐藏包含你输入的特定字词的帖子评论。屏蔽词数量：${commaCount}/365 `;
        }

        // 每0.5秒执行一次updateContent函数
        setInterval(updateContent, 500);
    } else if (window.location.href.startsWith('https://www.facebook.com/ads/library/')) {
        // 获取当前网址
        var currentUrl = window.location.href;
        // 检查当前网址是否包含"active_status=all"
        if (currentUrl.includes("active_status=all")) {
            // 将"active_status=all"替换为"active_status=active"
            var newUrl = currentUrl.replace("active_status=all", "active_status=active");

            // 重定向到新的网址
            window.location.href = newUrl;
        }
    } else if (window.location.href.startsWith('https://business.facebook.com/latest/inbox/')) {
        // 定义一个函数，用于修改 div 内容
        function modifyDivElement() {
            // 获取需要修改的 div 元素
            var divElement = document.querySelector('.x1xqt7ti.x1ldc4aq.x1xlr1w8.x1cgboj8.xbsr9hj.x1yc453h.xuxw1ft.x6ikm8r.x10wlt62.xlyipyv.x1h4wwuj.xeuugli');

            // 如果找到了需要修改的 div 元素
            if (divElement) {
                // 获取当前页面的 URL
                var currentURL = window.location.href;

                // 判断 URL 是否包含特定字符串并相应地修改 div 内容
                if (currentURL.includes('113312618315756')) {
                    divElement.textContent = "Fancytia";
                } else if (currentURL.includes('140694405798052')) {
                    divElement.textContent = "Outletsltd";
                } else if (currentURL.includes('2204468843007898')) {
                    divElement.textContent = "Linensia";
                } else if (currentURL.includes('118810661161808')) {
                    divElement.textContent = "Linenforlove";
                }
            } else {
                // 如果没有找到 div 元素，则继续等待
                setTimeout(modifyDivElement, 100); // 继续等待 100 毫秒后再次尝试
            }
        }

        // 创建一个 MutationObserver 实例，用于监听 DOM 变化
        var observer = new MutationObserver(modifyDivElement);

        // 配置观察器以监视子节点的添加
        var config = { childList: true, subtree: true };

        // 选择需要观察变化的父元素
        var targetNode = document.body;

        // 开始观察 DOM 变化
        observer.observe(targetNode, config);

        // 执行函数以确保已加载的 div 元素也会被修改
        modifyDivElement();

    } else if (window.location.href.includes('#google_vignette')) {
        var currentUrl1 = window.location.href;
        var newUrl1 = currentUrl1.replace("#google_vignette", "");
        window.location.href = newUrl1;
    } else if ((window.location.href.includes('https://img.staticdj.com/') || window.location.href.includes('https://cdn.shoplazza.com/') || window.location.href.includes('https://img.fantaskycdn.com/')) && window.location.href.includes('_')) {
        var currentUrl2 = window.location.href;
        var newUrl2 = currentUrl2.replace(/_[^_]*x/g, '');
        window.location.href = newUrl2;
    }

})();
