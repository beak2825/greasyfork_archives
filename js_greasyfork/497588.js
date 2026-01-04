// ==UserScript==
// @name         Simple Search Engines
// @namespace    https://www.iklfy.com
// @version      0.2.5
// @description  简洁的适配国内地区的搜索切换脚本.
// @author       Ancient
// @match        *://cn.bing.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.yandex.com/search*
// @match        *://www.sogou.com/web*
// @match        *://www.zhihu.com/search*
// @match        *://so.csdn.net/so/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497588/Simple%20Search%20Engines.user.js
// @updateURL https://update.greasyfork.org/scripts/497588/Simple%20Search%20Engines.meta.js
// ==/UserScript==
/**
 * 搜索引擎配置管理器类，用于根据浏览器类型动态调整搜索引擎配置，
 * 并在页面上创建一个搜索引擎切换容器，提升用户体验。
 */
class SearchEngineManager
{
    urlMapsConfig = {};

    /**
     * 构造函数，初始化搜索引擎配置。
     * @param urlMapsConfig
     */
    constructor(urlMapsConfig)
    {
        this.urlMapsConfig = urlMapsConfig;
    }

    /**
     * 从URL查询字符串中提取指定变量的值。
     *
     * @param {string} variable - 要提取的查询参数名。
     * @return {string|null} - 查询参数的值，若不存在则返回null。
     */
    getQueryVariable(variable)
    {
        let query = window.location.search.substring(1);
        if (!query) {
            return null;
        }
        const pairs = query.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            // 对键和值都进行解码，保持一致性。
            const decodedKey   = decodeURIComponent(key);
            const decodedValue = decodeURIComponent(value);
            if (decodedKey === variable) {
                return decodedValue;
            }
        }
        return null;
    }

    /**
     * 根据当前URL获取关键词。
     *
     * @return {string} - 当前搜索的关键词。
     */
    getKeywords()
    {
        for (const item of this.urlMapsConfig) {
            if (item.testUrl.test(window.location.href)) {
                return this.getQueryVariable(item.keyName);
            }
        }
        return '';
    }

    /**
     * 检测是否为Firefox浏览器并相应调整配置。
     */
    checkAndAdjustForFirefox()
    {
        // 使用功能检测代替User-Agent检测
        if ('MozWebSocket' in window) { // 假设Firefox特有的API是MozWebSocket
            console.info('[ Firefox ] 🚀');
            if (this.urlMapsConfig.length > 0) {
                this.urlMapsConfig[0].searchUrl = 'https://www.baidu.com/baidu?wd=';
                this.urlMapsConfig[0].testUrl   = /https:\/\/www\.baidu\.com\/baidu.*/;
            }
        }
    }

    /**
     * 添加样式
     */
    addStyleToHead()
    {
        // 检查是否已存在该样式，如果不存在再进行添加
        if (!document.getElementById('search-container-style')) {
            const style       = document.createElement('style');
            style.id          = 'search-container-style';
            // 将样式内容赋值给style节点的textContent，代替innerHTML，提高安全性
            style.textContent = `
                #search-container{width:80px;background-color:#f1f6f9d9;z-index:99999;position:fixed;display:flex;align-items:center;justify-content:center;padding:10px 0;top:150px;left:50px;border-radius:10px}
                #search-container ul{padding:initial;margin:initial}
                #search-container li.title{font-weight:700;user-select:none}
                #search-container li{display:block;margin:8px 0;text-align:center}
                #search-container a{color:#24578f;display:block}
            `;
            // 将style节点添加到head中
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    /**
     * 添加容器
     */
    createSearchContainer()
    {
        this.checkAndAdjustForFirefox();
        // div#search-container
        const container = document.createElement('div');
        container.id    = 'search-container';
        document.body.insertBefore(container, document.body.firstChild);
        //document.body.insertAdjacentElement('afterbegin', container);
        // ul
        const ul = document.createElement('ul');
        container.appendChild(ul);
        // li.title
        let titleLi         = document.createElement('li');
        titleLi.textContent = 'Engine';
        titleLi.className   = 'title';
        ul.appendChild(titleLi);
        // 优化DOM操作
        const fragment = document.createDocumentFragment();
        // 搜索列表
        this.urlMapsConfig.forEach(item =>
        {
            // li > a
            const li      = document.createElement('li');
            const a       = document.createElement('a');
            a.textContent = item.name;
            a.className   = 'search-engine-a';
            a.href        = `${item.searchUrl}${this.getKeywords()}`;
            // ul > li > a
            li.appendChild(a);
            fragment.appendChild(li);
        });
        ul.appendChild(fragment);
    }

    /**
     * 初始化并运行搜索容器的创建流程。
     */
    initialize()
    {
        this.addStyleToHead();
        this.createSearchContainer();
    }
}

(function ()
{
    'use strict';
    /**
     * 用于配置URL映射的对象。每个映射包含名称、键名、搜索URL字符串和测试URL的正则表达式。
     *
     * @typedef {Object} urlMapsConfig
     * @property {string} name - 映射的名称。不能为空。
     * @property {string} keyName - 映射的键名。不能为空。
     * @property {string} searchUrl - 用于搜索的URL字符串。必须是合法的URL格式。
     * @property {RegExp} testUrl - 用于测试URL是否匹配的正则表达式对象。必须是有效的正则表达式。
     */
    const urlMapsConfig = [
        {
            name: 'Bing', searchUrl: 'https://cn.bing.com/search?q=', keyName: 'q', testUrl: /https:\/\/cn.bing.com\/search.*/
        }, {
            name: '百度', searchUrl: 'https://www.baidu.com/s?wd=', keyName: 'wd', testUrl: /https:\/\/www.baidu.com\/s.*/
        }, {
            name: 'Yandex', searchUrl: 'https://www.yandex.com/search/?text=', keyName: 'text', testUrl: /https:\/\/www.yandex.com\/search.*/
        }, {
            name: '搜狗', searchUrl: 'https://www.sogou.com/web?query=', keyName: 'query', testUrl: /https:\/\/www.sogou.com\/web.*/
        }, {
            name: '知乎', searchUrl: 'https://www.zhihu.com/search?q=', keyName: 'q', testUrl: /https:\/\/www.zhihu.com\/search.*/
        }, {
            name: 'CSDN', searchUrl: 'https://so.csdn.net/so/search?q=', keyName: 'q', testUrl: /https:\/\/so.csdn.net\/so\/search.*/
        }
    ];

    /**
     * 初始化管理器
     * @returns {Promise<void>}
     */
    async function initializeManager()
    {
        const manager = new SearchEngineManager(urlMapsConfig);
        try {
            // 使用async-await优化异步逻辑
            await manager.initialize();
            console.log('Manager initialized successfully.');
        } catch (error) {
            console.error('Error initializing manager:', error);
        }
    }

    /**
     * 确保只添加一个事件监听器，避免内存泄露
     */
    window.addEventListener('load', () =>
    {
        initializeManager().catch(error =>
        {
            console.error('Error during manager initialization:', error);
        });
    }, {once: true});
})();
