// ==UserScript==
// @name                Search Switcher
// @name:zh-CN          一键切换搜索
// @name:zh-TW          壹鍵切換搜索
// @description         Add links to each other in search engines. Including multiple search modes.
// @description:zh-CN   在常用的搜索引擎页面中添加互相切换的按钮。
// @description:zh-TW   在常用的搜索引擎頁面中添加互相切換的按鈕。
// @author              XanderWang
// @icon                https://i.loli.net/2020/05/29/DxSmHAy2o53FdUY.png
// @license             GPL-3.0
// @include             https://www.baidu.com/*
// @include             *.so.com/*
// @include             *.bing.com/*
// @include             *.soku.com/*
// @include             *.sogou.com/*
// @include             /^https?://[a-z]+\.google\.[a-z,\.]+/.+$/
// @run-at              document_body
// @date                05/29/2020
// @modified            07/31/2024
// @version             1.0.7
// @namespace           https://blog.xanderwang.site
// @downloadURL https://update.greasyfork.org/scripts/404308/Search%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/404308/Search%20Switcher.meta.js
// ==/UserScript==

(function () {
    //指定代码在严格条件下执行
    'use strict';
    const sites = [
        {
            name: "百度",
            host: "baidu.com",
            link: "https://www.baidu.com/s",
            key: "wd",
            hide: false,
        },
        {
            name: "必应",
            host: "bing.com",
            link: "https://bing.com/search",
            key: "q",
            hide: false,
        },
        {
            name: "谷歌",
            host: "google.com",
            link: "https://www.google.com.hk/search",
            key: "q",
            hide: false,
        },
        {
            name: "谷歌镜像",
            host: "google.fuckcloudnative.io",
            link: "https://google.fuckcloudnative.io/search",
            key: "q",
            hide: false,
        },
        {
            name: "搜搜",
            host: "so.com",
            link: "https://www.so.com/s",
            key: "q",
            hide: false,
        },
        {
            name: "搜狗",
            host: "sogou.com",
            link: "https://www.sogou.com/web",
            key: "query",
            hide: false,
        },
    ];

    const css = `
        .search-warpper {
          position: fixed;
          left: 0;
          top: 0;
        }

        .search-switcher {
          position: fixed;
          opacity: 0.2;
          top: 80px;
          right: calc(100% - 10px);
          z-index: 9999999;
          transition: all 400ms;
        }

        .search-switcher:hover {
          top: 80px;
          left: 0px;
          right:auto;
          opacity: 1;
          border-radius: 0 20px;
        }

        .search-switcher .search-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing:border-box;
          background-color: #000;
          border-radius: 0px 10px 10px 0px;
          color: #fff;
          padding: 10px;
          box-shadow: 5px 5px 5px #777;
        }

        .search-switcher .search-list a {
          color: #0cf;
          height: 25px;
          line-height: 25px;
        }

        .search-switcher .search-list a.mirror {
          font-weight: bold;
        }
        `;

    function setup() {
        console.log("setup location:", location.href);
        let current_site;
        for (let site of sites) {
            if (location.host.includes(site.host)) {
                current_site = site;
            }
        }
        let site_list = sites.filter(
            ({ host, hide }) => !location.hostname.includes(host) && !hide
        );
        // console.log("site_list:", site_list);
        let query = new URLSearchParams(location.search).get(current_site.key || "q");
        console.log("current_site:", current_site, ",query:", query);
        if (query == null) {
            return;
        }
        let body = document.body;
        if (body == undefined) {
            return;
        }
        let switcherParentId = "search-switcher-parent";
        let switcherParent = document.getElementById(switcherParentId);
        if (switcherParent == undefined) {
            // 样式
            const style = document.createElement("style");
            style.innerHTML = css;
            body.appendChild(style);
            // 生成切换框
            switcherParent = document.createElement("div");
            switcherParent.setAttribute("id", switcherParentId);
            console.log("body.appendChild:", switcherParent);
            body.appendChild(switcherParent);
        }
        const siteTag = ({ link, name, host, mirror, key }) => {
            let className = "";
            let text = name;
            let href = `${link}?${key}=${query}`;
            console.log("href:", href);
            return `<a href='${href}' target='_blank' >${text}</a>`;
        };
        const tags = site_list
            .filter(({ hidden }) => !hidden)
            .map(siteTag)
            .join("");

        switcherParent.innerHTML = `
              <div id='search-switcher' class='search-switcher'>
                  <div id='search-list' class="search-list">${tags}</div>
              </div>
          `;
        console.log("switcherParent:", switcherParent);
    }

    // 监听 pushState 和 replaceState 方法
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('urlChange'));
    };

    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('urlChange'));
    };

    // 监听 popstate 事件（用于处理浏览器后退和前进）
    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('urlChange'));
    });

    // 自定义的 URL 变化事件处理函数
    const handleUrlChange = () => {
        console.log('URL changed to: ', window.location.href);
        // 这里可以添加你希望执行的代码
        setTimeout(function () {
            setup();
        }, 2000)
    };

    // 监听自定义的 urlChange 事件
    window.addEventListener('urlChange', handleUrlChange);

    // 初始加载时也触发一次
    handleUrlChange();
})();
// end userScript