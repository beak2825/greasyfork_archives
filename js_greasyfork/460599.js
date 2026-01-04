// ==UserScript==
// @name         鲸探埋点小助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  点一点，埋点代码到手
// @author       燕修
// @match        https://log.alipay.com/index_v4.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alipay.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460599/%E9%B2%B8%E6%8E%A2%E5%9F%8B%E7%82%B9%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460599/%E9%B2%B8%E6%8E%A2%E5%9F%8B%E7%82%B9%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function debounce(fn, wait) {
        let timer = null;
        return function () {
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(fn, wait);
        };
    }

    const copyStr = (type, content, code, params) => {
        const config = {};
        config.fans = code;
        if (params) {
            config.trackerParams = {};
            params.forEach((v) => {
                config.trackerParams[v] = '';
            });
        }
        let fn = '';
        switch (type) {
            case 'click':
                fn = 'logClick';
                break;
            case 'pv':
                fn = 'logPv';
                break;
            case 'expo':
            default:
                fn = 'logExpo';
        }

        const str = params?`// ${content}
${fn}( ${JSON.stringify(config, null, 2)
    .replace(/"/g, "'")
    .replace(/'([^']+)':/g, '$1:')} );`:`// ${content}
${fn}(${JSON.stringify(config)
    .replace(/"/g, "'")
    .replace(/'([^']+)':/g, '$1:')});`;
        const regex = /"(\w+)":/g;
        copyText(str.replace(regex, '$1:'));
    };


    function copyText(text) {
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }

    const build = (type, content, code, params ) => {
        const a = document.createElement('span');
        a.addEventListener('click', () => {
            copyStr(type, content, code, params)
        });
        switch (type) {
            case 'click':
                a.innerText = '点击';
                break;
            case 'pv':
                a.innerText = '页面曝光';
                break;
            case 'expo':
            default:
                a.innerText = '曝光';
        }
        a.style.color = 'orange';
        a.style.marginRight = '5px';
        a.style.cursor = 'pointer';
        a.className = 'addBlackBtn';
        return a;
    };
    const renderBtn = () => {
        console.log('埋点小助手启动');
        document.querySelectorAll('.addBlackBtn').forEach((v) => v.remove());
        const listListDom = document.querySelectorAll('.ant-table-row');
        for (let i = 0; i <= listListDom.length; i++) {
            const v = listListDom[i];
            if(!v) continue;
            const needFeatures = v?.children[3]?.children[0]?.children;
            const item = v.children[1].children[0].children[0];
            const content = item.children[0].children[0].innerText;
            const code = item.children[1].children[1].innerHTML;
            const params = v?.children[7].children[0]?.innerText.split('，');
            const container = item.children[1];
            if(code.indexOf('c')>-1){
                [1,0].forEach(i=>{
                    const f = needFeatures[i];
                    if(f){
                    const feat = needFeatures[i].children[0].innerText;
                    if(feat === '点击') {
                        container.append(build('click', content, code, params ));
                    }
                    if(feat === '曝光') {
                        container.append(build('expo', content, code,params ));
                    }
                    }

                });
            } else {
                container.append(build('pv', content, code, params));
            }

        }
    };
    const _wr = function (type) {
        const orig = history[type];
        return function () {
            const rv = orig.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    const delayRenderBtn = () => {
        setTimeout(() => {
            renderBtn();
        }, 5000);
    };
    window.addEventListener('hashchange', () => {
        delayRenderBtn();
    });
    window.addEventListener('popstate', () => {
        delayRenderBtn();
    });
    window.addEventListener('replaceState', () => {
        delayRenderBtn();
    });
    window.addEventListener('pushState', () => {
        delayRenderBtn();
    });
    window.onload = () => {
        delayRenderBtn();
    };

    // Your code here...
})();
