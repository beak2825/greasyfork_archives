// ==UserScript==
// @name         搜索引擎快速切换 (百度/必应/谷歌)
// @name:en      Search Engine Quick Switcher (Baidu/Bing/Google)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用快捷键 Alt+S 在百度、必应、谷歌之间循环切换搜索引擎，并保留当前搜索词。
// @description:en Use Alt+S to cycle through Baidu, Bing, and Google search engines, keeping the current search query.
// @author       whyzzjw
// @match        *://www.baidu.com/s*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541484/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%20%28%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E8%B0%B7%E6%AD%8C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541484/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%20%28%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E8%B0%B7%E6%AD%8C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    // 定义你的搜索引擎列表和顺序
    // 每个搜索引擎需要:
    // - name: 唯一的名称
    // - host: URL中的主机名部分，用于识别当前网站
    // - param: URL中存储搜索关键词的参数名 (例如: 百度是 'wd', 谷歌/必应是 'q')
    // - url: 搜索的基础URL
    const engines = [
        {
            name: 'baidu',
            host: 'baidu.com',
            param: 'wd',
            url: 'https://www.baidu.com/s?wd='
        },
        {
            name: 'bing',
            host: 'bing.com',
            param: 'q',
            url: 'https://www.bing.com/search?q='
        },
        {
            name: 'google',
            host: 'google.com',
            param: 'q',
            url: 'https://www.google.com/search?q='
        }
    ];

    // --- 核心逻辑 ---

    // 1. 获取当前页面的信息
    const currentUrl = new URL(window.location.href);
    const currentHost = currentUrl.hostname;

    // 2. 识别当前是哪个搜索引擎，并获取搜索关键词
    let currentEngineIndex = -1;
    let query = '';

    for (let i = 0; i < engines.length; i++) {
        if (currentHost.includes(engines[i].host)) {
            currentEngineIndex = i;
            query = currentUrl.searchParams.get(engines[i].param);
            break;
        }
    }

    // 如果不在指定的搜索引擎页面或没有找到关键词，则不执行后续操作
    if (currentEngineIndex === -1 || !query) {
        console.log('Search Switcher: Not on a recognized search page or no query found.');
        return;
    }

    // 3. 定义切换函数
    function switchToNextEngine() {
        // 计算下一个搜索引擎的索引，实现循环切换
        const nextEngineIndex = (currentEngineIndex + 1) % engines.length;
        const nextEngine = engines[nextEngineIndex];

        // 构建新的搜索URL
        // encodeURIComponent确保特殊字符（如空格、+、&）被正确编码
        const newSearchUrl = nextEngine.url + encodeURIComponent(query);

        // 跳转到新页面
        window.location.href = newSearchUrl;
    }

    // 4. 监听键盘事件
    document.addEventListener('keydown', (e) => {
        // 设置快捷键为 Alt + S
        // 你可以修改这里的条件来改变快捷键
        // e.ctrlKey (Ctrl), e.shiftKey (Shift), e.altKey (Alt)
        if (e.altKey && e.key.toLowerCase() === 's') {
            // 阻止浏览器或其他脚本的默认行为
            e.preventDefault();
            // 执行切换
            switchToNextEngine();
        }
    });

})();
