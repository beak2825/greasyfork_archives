// ==UserScript==
// @name         Nvidea显驱下载工具
// @description  显示更老的N卡驱动
// @description  Show older Nvidia drivers
// @author       皇家养猪场
// @namespace    皇家养猪场
// @note         安装此脚本后前往 https://www.nvidia.cn/geforce/drivers/ 能够看到更老的驱动。
// @note         注意: 开启此脚本后 查询驱动所需的时间也会增加!!!
// @note         After installing this script, you can see older drivers at https:/www.nvidia.com/en-us/geforce/drivers/.
// @note         Note: After turning on this script, the time required to query the driver will also increase!!!
// @note         ===== 2022-02-18 =====
// @note         修复了无法显示5XX版本驱动的问题
// @note         ===== 2023-04-15 =====
// @note         修复了只显示10个Studio驱动的问题
// @note         ===== 2024-02-22 =====
// @note         添加提示
// @note         ===== 2024-04-07 =====
// @note         ===== 2024-11-21 =====
// @note         ===== 2024-11-25 =====
// @note         修复无法正常查询驱动的问题(502 Bad Gateway)
// @version      0.7
// @create       2021-10-22
// @lastmodified 2024-11-25
// @charset      UTF-8
// @match        *://www.nvidia.cn/geforce/drivers/
// @match        *://www.nvidia.com/en-us/geforce/drivers/
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434293/Nvidea%E6%98%BE%E9%A9%B1%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/434293/Nvidea%E6%98%BE%E9%A9%B1%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    const tips = {
        'zh-cn': '选择 Windows 10 系统以查看更多老版本驱动',
        'zh-hk': '選擇 Windows 10 系統以查看更多舊版本驅動',
        'en-us': 'Select Windows 10 to view more old version drivers'
    };

    GM_addStyle(`
    #DrvrManuvalSrh .body-text.description.color-ui-elements::after {
        content: "${tips[navigator.language.toLowerCase()] ?? tips['en-us']}";
        color: #FF0;
    }
    `);

    const allowedParams = ['func', 'psid', 'pfid', 'osID', 'languageCode', 'isWHQL', 'dch', 'qnf'];

    function changeUrl(url) {
        try {
            const urlObj = new URL(url);

            // 替换回老 host
            if (urlObj.host === 'gfwsl.geforce.cn')
                urlObj.host = 'gfwsl.geforce.com';

            // 删除不必要的参数, 避免 502 Bad Gateway
            for (let [k, v] of urlObj.searchParams) {
                if (!allowedParams.includes(k)) {
                    console.warn(`[Warn][Nvidea显驱下载工具]: remove request param: `, `${k}=${v}`)
                    urlObj.searchParams.delete(k);
                }
            }

            // 修改请求的驱动个数
            urlObj.searchParams.set('numberOfResults', 500);
            console.warn(`[Warn][Nvidea显驱下载工具]: final request params:`, new Map(urlObj.searchParams.entries()));
            return urlObj.toString();
        } catch (err) {
            console.error('[Error][Nvidea显驱下载工具]: ', err);
            return url;
        }
    }

    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, {
        apply(target, thisArg, args) {
            let [method, url, async] = args;
            // match download url
            if (/^https?:\/\/gfwsl\.geforce\.(com|cn)\/services_toolkit\/services\/com\/nvidia\/services\/AjaxDriverService\.php/.test(url)) {
                args[1] = changeUrl(url);
            }
            return target.apply(thisArg, args);
        }
    });
})();