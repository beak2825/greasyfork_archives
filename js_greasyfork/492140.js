// ==UserScript==
// @name         免登录免验证看某些在线文档
// @version      1.0.6
// @description  闲来无事,看看js源码吧
// @match        https://*.pig4cloud.com/*
// @match        https://doc.iocoder.cn/*
// @match        https://www.macrozheng.com/*
// @match        *://*.ddkk.com/*
// @match        *://*.bugstack.cn
// @match        *://bugstack.cn/*
// @match        *://cloud.iocoder.cn/*
// @match        *://maku.net/docs/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/dist/layer.min.js
// @namespace    https://greasyfork.org/users/1286345
// @downloadURL https://update.greasyfork.org/scripts/492140/%E5%85%8D%E7%99%BB%E5%BD%95%E5%85%8D%E9%AA%8C%E8%AF%81%E7%9C%8B%E6%9F%90%E4%BA%9B%E5%9C%A8%E7%BA%BF%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/492140/%E5%85%8D%E7%99%BB%E5%BD%95%E5%85%8D%E9%AA%8C%E8%AF%81%E7%9C%8B%E6%9F%90%E4%BA%9B%E5%9C%A8%E7%BA%BF%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    /* globals Cookies */
    /* globals layer */
    'use strict';

     // 当前域名
    const currentName = window.location.hostname;
    let flag = false;

    // 定义要匹配的域名及对应的操作
    const domainActions = {
        'pig4cloud.com': () => {
            // pigx框架文档
            // pigx文档 这个值是目前为止有效，不清楚啥时候失效 app.xxxxx.js中找到 用户暂时未扫码登录，未登录，打断点分析
            if (!localStorage.getItem('sadhjksdaklhnnklfs9812398yjbhfsd')) {
                localStorage.setItem('pigx-auth-user', '136B');
                localStorage.setItem('sadhjksdaklhnnklfs9812398yjbhfsd', "1");
                localStorage.setItem('pigx-auth-login-time', (new Date).getTime());
                flag = true;
            }
        },
        'iocoder.cn': () => {
            // ruoyi-vue-pro文档
            // 目前发现key不变；value定期修改 app.xxxxx.js中 找到vip用户，全局不拦截;打断点;再分析
            if (!Cookies.get('88974ed8-6aff-48ab-a7d1-4af5ffea88bb')) {
                Cookies.set('88974ed8-6aff-48ab-a7d1-4af5ffea88bb', 'jiankan');
                flag = true;
            }
        },
        'macrozheng.com': () => {
            // mall电商项目文档
            // 目前看是只判断有没有值，app.xxxx.js中 找 嗨，同学，来支持一下【mall电商项目】吧 打断点再分析
            if (!Cookies.get('access_token')) {
                Cookies.set('access_token', '136B');
                Cookies.set('refresh_token', '136B');
                Cookies.set('has_star', true);
                Cookies.set('unlock', null);
                flag = true;
            }
        },
        'ddkk.com': () => {
            // 弟弟快看，程序员编程资料站
            // 找到util.js，showLocker() 看这个方法的逻辑；断点分析
            if (!Cookies.get('ddkks-show-gzh')) {
                Cookies.set('ddkks-show-gzh', '136B');
                flag = true;
            }
        },
        'bugstack.cn': () => {
            // 小傅哥 bugstack 虫洞栈
            // 找到cg-5.js,_detect()看这个方法逻辑；断点分析
            if (!Cookies.get('_unlock')) {
                Cookies.set('_unlock', 'success');
                flag = true;
            }
        },
        'maku.net': () => {
            // maku-cloud文档
            if (typeof layer !== 'undefined') {
                layer.closeAll();
            }
            // 不需要刷新页面，不设置 flag
        }
    };

    // 正则表达式匹配
    const matchedKey = Object.keys(domainActions).find(key => {
        const regex = new RegExp(`(?:\\w+\\.)?${key.replace(/\./g, '\\.')}$`);
        return regex.test(currentName);
    });

    if (matchedKey) {
        domainActions[matchedKey]();
    }

    // 如果 flag 被设置为 true，则刷新页面
    if (flag) {
        window.location.reload();
    }
})();
