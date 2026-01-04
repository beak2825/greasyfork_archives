// ==UserScript==
// @name         搜索引擎切换
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  切换搜索引擎
// @match        *://www.baidu.com/*/s*
// @match        *://m.baidu.com/*/s*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/baidu*
// @match        *://m.baidu.com/baidu*
// @match        *://duckduckgo.com/*
// @match        *://search.brave.com/search*
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://weixin.sogou.com/weixin*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.zhihu.com/search*
// @match        *://search.cnki.com.cn/Search/Result*
// @match        *://www.sogou.com/web*
// @match        *://m.sogou.com/web*

// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/489708/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/489708/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==
(function () {
    "use strict";

    // 搜索网址配置
    const urlMapping = {
        'google': {
            name: "Google",
            searchUrl: "https://www.google.com/search?q=",
            keyName: "q",
        },
        'baidu': {
            name: "百度",
            searchUrl: "https://www.baidu.com/s?wd=",
            keyName: ["wd", 'word'],
        },
        'bing': {
            name: "Bing",
            searchUrl: "https://www.bing.com/search?q=",
            keyName: "q",
        },
        'sogou': {
            name: "搜狗",
            searchUrl: "https://www.sogou.com/web?query=",
            keyName: ["keyword", 'query'],
        },
        'brave': {
            name: "Brave",
            searchUrl: "https://search.brave.com/search?q=",
            keyName: "q",
        },
        'duckduckgo':  {
            name: "DuckDuckGo",
            searchUrl: "https://duckduckgo.com/?q=",
            keyName: "q",
        },
        'weixin': {
            name: "微信文章",
            searchUrl: "https://weixin.sogou.com/weixin?type=2&s_from=input&query=",
            keyName: "query",
        },
        'zhihu': {
            name: "知乎",
            searchUrl: "https://www.zhihu.com/search?q=",
            keyName: "q",
        },
        'cnki': {
            name: "知网",
            searchUrl: "https://search.cnki.com.cn/Search/Result?content=",
            keyName: "content",
        },
    };

    const extraReg = {
        'weixin.sogou.com': 'weixin',
    }

    const iconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEU0lEQVRoQ+2ZWahVVRjHtUEcSi0DzahwKqdCbXgII4gk0hweRKzwITRNUHNAUksMzAohGh+yyIn0TVBTXywFU1PUypxQQ1GsiDItMyvL+v1kn7ht9jlnrX3OPZwLffBjn3vPWt9a/7XX8H3rNG/WxK15E+9/s2oKaM1gXANXwy/wUy0GpxIB19PBR2E43AM3pzp8lr/3wXpYDYcbQ1AeAbfTkRdhBFzVoFPf8vlH+AMU1zl5G4Uie/kwFz6sppAYAe1o+BUYl3Tczq6DNfAR/JzqmFPJNzMsEatw7ROYDAqq2EIFdKOltdAbzsPb8FJGp0t16CG+fA36wm/wFHxQqYIQAffTiHPYafExPAHf5WzYt/I8OJW0eTA/p6/L1coJ6EqZnXADvAuT4GIlDSZ1R/JcCm3gaViU12cpAW1xuh36wFswJW8jReoN4v8b4G94GDbn8V9KwHs4dMFuhMHwZ54GytRxUN6AU3AbXIhto5gAF+uX4IHUHX6IdRxR3nPCAZoN7nJRVkyAi9YDag68HOUxvvAdVPkczoG7ndtzsGUJ6Ejtb5JR78Lz12Bv+Qsup+oYmAavx7jJEuD+7I7jGhgf46yCsm7VW+BTuC/GT5YAT9chYJzj/KyFXZG88Wt5doD0qV60D1kCvqf0daCz6F2hArWFxezb2BrqJy2gPRXPwDFwQdXSXqWx6fAkLA1tOC3ARWvnd8G9oU6qVM4db0EiwpgpyNICelDrCEQvpqDWSheaydcL4dnkGeQyLeBGarmFHgCjxlqaQZ2B3kR4J7ThtIArqejp+xe4iI1TamUraOhxcAc0RgqyrF3oM2r2B0/I/UFeqlPoEG56ghHw8VCXWQJMF59LXqeLqhZmPn0y4daYBrME3I0Dd6HdYEpYC3PhGsiZ6ZluBluWAP/3VfIqjdnNdxvTvIo5CsZgDp5TONiKRaMGVgZYJt4D4FKwx/iCL1DF1HIVmKlFWTEBxiZ7oB88A29GeQ0vbN5hytoS3Laj745KZWQDcbgJLPMIVHsqGbTZeUMWcw5P4mgrl9RPwKOHikmG+/OO6BayK3jD4X2Sg2QY/SB49kRbOQE6NMFwGlXrLqcXvrxjMlU9Dd6pDgWvbKItRIBO3ea8yHJtrASP/ODDJumVHZ0Ks8BT3n3/luQ7sz5v8KJFhAqwHUdpCTh3fwcztvfhizLD1onvH4MZcBM4VZbBaFBUwRRhG667YIsRoFPvRx1Bp1SrpJWveW4DdxCnhBdfJkSG5nfBneCb07zYtf5BMHEx5vEcKFj0m4gVUGjIm+exMArKRa1eQzrnF0N6E6hYRF4BDQbt8gnqeeHFlHO7BXhFcgIMyw3SSllFIqohoEz/gr7OLaJeBKgyl4h6EpBLRL0JiBZRjwKiRNSrgGAR9SxAEQZ5Hn4NT2yDvwcKe1u9C0i/Ca/h/bHw3yv4piCgIMILBn+b/s/vB01FQNHT8H8BQYFCIxb6B7quzDGJddU4AAAAAElFTkSuQmCC'


    // 从url中获取搜索关键词
    function getKeywords() {
        const urlInfo = new URL(window.location.href)
        const domain = urlInfo.host.replace('www.', '')
        let current = extraReg[domain];

        if (!current) {
            for (const [index,item] of Object.entries(urlMapping)) {
                if (domain.indexOf(index) !== -1) {
                    current = index;
                    break;
                }
            }
        }

        console.log({current})
        let keyword = "";
        const urlParser = new URL(window.location.href);
        const keyName = urlMapping[current].keyName;
        if (Array.isArray(keyName)) {
            keyName.map(key=> {
                const v = urlParser.searchParams.get(key);
                if (v) {
                    keyword = v;
                }
            });
        } else {
            keyword = urlParser.searchParams.get(keyName);
        }
        return keyword;
    }

    const style = `
<style>
    #search-app-box {
      position: fixed;
      top: 140px;
      left: 0px;

      background-color: hsla(200, 40%, 96%, .9);
      font-size: 12px;
      border-radius: 6px;
      z-index: 99999;
    }

    #search-app-box .search-engine-icon {
      width: 20px;
      padding: 8px;
    }

    #search-app-box .search-engine-title {
      display: block;
      white-space: nowrap;
      color: hsla(211, 60%, 35%, .8);
      text-align: center;
      margin-top: 10px;
      margin-bottom: 5px;
      font-size: 12px;
      font-weight: bold;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

    }

    #search-app-box .search-engine-a {
      display: block;
      white-space: nowrap;
      color: #132d4a;
      padding: 8px;
      text-decoration: none;
    }

    #search-app-box .hide {
      display: none;
    }

    #search-app-box .search-engine-a:hover {
      background-color: hsla(211, 60%, 35%, .1);
    }
</style>`;


    // 添加节点
    function addBox() {
        // 主元素
        const div = document.createElement("div");
        div.innerHTML = style
        div.id = 'search-app-box'
        document.body.insertAdjacentElement("afterbegin", div);

        let icon = document.createElement("img");
        icon.className = "search-engine-icon";
        icon.src = iconBase64
        div.appendChild(icon);

        const searchItemsBox = document.createElement("div");
        searchItemsBox.className = "search-engine-items-box hide";

        let title = document.createElement("span");
        title.innerText = "搜索引擎";

        const toggleBox = () => {
            const isHideBox = searchItemsBox.classList.contains('hide')
            if (isHideBox) {
                searchItemsBox.classList.remove('hide')
                icon.classList.add('hide')
            } else {
                searchItemsBox.classList.add('hide')
                icon.classList.remove('hide')
            }
        }

        title.className = "search-engine-title";
        searchItemsBox.appendChild(title);

        div.addEventListener("click", (event) => {
            const classList = event.target.classList
            if (classList.contains('search-engine-icon') || classList.contains('search-engine-title')) {
                toggleBox()
            }
        });

        // 搜索列表
        const keyword = getKeywords()
        for (const [index,item] of Object.entries(urlMapping)) {
            // 设置搜索引擎链接
            let a = document.createElement("a");
            a.innerText = item.name;
            a.className = "search-engine-a";
            a.href = item.searchUrl + keyword;
            searchItemsBox.appendChild(a);
        }
        div.appendChild(searchItemsBox)
    }

    window.addEventListener("load", (event) => {
        addBox()
    });
})();