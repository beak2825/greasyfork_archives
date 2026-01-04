// ==UserScript==
// @name         玄奘百宝箱-朱仁路(玄奘)
// @namespace    https://www2.alibaba.com/campaign_list.htm
// @version      0.2.7
// @homepageURL   http://www.non-zero.cn/
// @description  导出数据管家数据;显产品订单买家交易;popular 订单询盘数;显示三个关键词,更多功能看描述，有问题及时反馈：有更多的需求及时留言
// @author       朱仁路 玄奘老师
// @match        https://www2.alibaba.com/*
// @match        https://www.alibaba.com/product-detail/*
// @match        https://*.en.alibaba.com/*
// @match      https://data.alibaba.com/*
// @match       https://*.alibaba.com/message*
// @match        https://www.alibaba.com/trade/search*
// @match       https://www.alibaba.com/products/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alibaba.com
// @license Apache
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454766/%E7%8E%84%E5%A5%98%E7%99%BE%E5%AE%9D%E7%AE%B1-%E6%9C%B1%E4%BB%81%E8%B7%AF%28%E7%8E%84%E5%A5%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454766/%E7%8E%84%E5%A5%98%E7%99%BE%E5%AE%9D%E7%AE%B1-%E6%9C%B1%E4%BB%81%E8%B7%AF%28%E7%8E%84%E5%A5%98%29.meta.js
// ==/UserScript==
setTimeout(() => {
        var importJs = document.createElement('script');
        importJs.setAttribute("type", "text/javascript");
        importJs.setAttribute("src", 'https://cdn.jsdelivr.net/gh/zrl2088/Ali_Tools/XuanzangAlitTool-0.2.7.js');
        document.getElementsByTagName("head")[0].appendChild(importJs);
},500)