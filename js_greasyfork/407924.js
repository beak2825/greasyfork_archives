// ==UserScript==
// @name          小黄工具箱测试
// @version       1.011.03
// @namespace     https://www.zhaidh.cn
// @supportURL    https://www.zhaidh.cn
// @author        小黄工具测试
// @description   生意参谋指数转换，数据分析，数据导出；淘宝客查询
// @grant         unsafeWindow
// @grant         GM_setClipboard
// @grant         GM_xmlhttpRequest
// @connect       taobao.com
// @connect       trade.tmall.com
// @include       https://sycm.taobao.com*
// @include       https://trade.taobao.com*
// @include       https://zuanshi.taobao.com*
// @include       https://item.taobao.com*
// @include       https://detail.tmall.com*
// @include       https://detail.tmall.hk*
// @include       https://subway.simba.taobao.com*
// @include       https://subway.simba.tmall.hk*
// @include       https://detail.tmall.hk*
// @include       https://healthcenter.taobao.com*
// @require       https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require       https://cdn.jsdelivr.net/npm/echarts@4.5.0/dist/echarts.js
// @require       https://cdn.jsdelivr.net/gh/donggezs/xh@cc4ac1c74446aaaf3b25ebc9b974334ac99dcc51/assets/layui/layui.all.js

// @downloadURL https://update.greasyfork.org/scripts/407924/%E5%B0%8F%E9%BB%84%E5%B7%A5%E5%85%B7%E7%AE%B1%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/407924/%E5%B0%8F%E9%BB%84%E5%B7%A5%E5%85%B7%E7%AE%B1%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
(function() {
    // 引入入口文件
    unsafeWindow.TOOL_VERSION = 1.0;
    unsafeWindow.TOOL_NAME = "yingxiao";
    unsafeWindow.GM_setClipboard = GM_setClipboard

    unsafeWindow.layui = layui
    unsafeWindow.echarts = echarts
    unsafeWindow.$ = $

    const script = document.createElement("script");
    script.charset = "UTF-8";
    script.src = "https://www.zhaidh.cn/xh/dist/main.js";
    document.documentElement.appendChild(script);
})();
