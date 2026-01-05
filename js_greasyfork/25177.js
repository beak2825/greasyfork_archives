// ==UserScript==
// @name         PcOnLine二手交易论坛按发表时间排序
// @namespace    rpsoft@163.com
// @version      0.1
// @description  打开太平洋电脑网论坛的二手交易板块时，自动按发表时间排序帖子
// @author       钟蔚
// @match        http://itbbs.pconline.com.cn/es/f45.html
// @match        http://itbbs.pconline.com.cn/es/f671334.html
// @match        http://itbbs.pconline.com.cn/es/f240027.html
// @match        http://itbbs.pconline.com.cn/es/f681102.html
// @match        http://itbbs.pconline.com.cn/es/f240201.html
// @match        http://itbbs.pconline.com.cn/es/f2312207.html
// @grant        none
// @create         2016-11-28
// @lastmodified   2016-11-28
// @run-at         document-start
// @icon           http://www.pconline.com.cn/favicon.ico
// @note           只对第一页生效
// @compatible     Chrome_v54.0.2840.99 m + TamperMonkey_v4.2 + 脚本_0.1 测试通过
// @downloadURL https://update.greasyfork.org/scripts/25177/PcOnLine%E4%BA%8C%E6%89%8B%E4%BA%A4%E6%98%93%E8%AE%BA%E5%9D%9B%E6%8C%89%E5%8F%91%E8%A1%A8%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/25177/PcOnLine%E4%BA%8C%E6%89%8B%E4%BA%A4%E6%98%93%E8%AE%BA%E5%9D%9B%E6%8C%89%E5%8F%91%E8%A1%A8%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==


// 二手电脑板块
if(location.href.indexOf("f45.html") > -1){
    location.href="http://itbbs.pconline.com.cn/es/f45-postat.html";
}

// 二手笔记本板块
if(location.href.indexOf("f671334.html") > -1){
    location.href="http://itbbs.pconline.com.cn/es/f671334-postat.html";
}

// 二手手机板块
if(location.href.indexOf("f240027.html") > -1){
    location.href="http://itbbs.pconline.com.cn/es/f240027-postat.html";
}

// 二手数码板块
if(location.href.indexOf("f681102.html") > -1){
    location.href="http://itbbs.pconline.com.cn/es/f681102-postat.html";
}

// 二手杂货铺板块
if(location.href.indexOf("f240201.html") > -1){
    location.href="http://itbbs.pconline.com.cn/es/f240201-postat.html";
}

// 二手平板板块
if(location.href.indexOf("f2312207.html") > -1){
    location.href="http://itbbs.pconline.com.cn/es/f2312207-postat.html";
}
