// ==UserScript==
// @name         🔥优惠券+高额返现🔥花前省一省©--省钱60%，支持淘宝、天猫、京东、唯品会、考拉海购，配合APP扫码下单后即可获得返现!!!   ~~超多平台支持，长期更新，放心使用。
// @namespace    cyzlizhe
// @version      4.2.0.1
// @description  This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @author       cyzlizhe
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://*.liangxinyao.com/*
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match        *://*.vip.com/*
// @match        *://*.kaola.com/*
// @match        *://*.suning.com/*
// @match        *://*.fengwd.com/*
// @match        https://*/*
// @match        http://*/*
// @exclude      *://login.taobao.com/*
// @exclude      *://pages.tmall.com/*
// @exclude      *://uland.taobao.com/*
// @exclude      *://uland.taobao.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes    true
// @connect     taobao.com
// @connect     gwdang.com
// @connect     jd.com
// @connect     suning.com
// @connect     pinduoduo.com
// @connect     vmall.com
// @connect     mi.com
// @connect     youyizhineng.top
// @note    2020年11月26日12:46:33 优化响应速度
// @note    2020年11月24日11:45:42 新增考拉海购搜索结果页显示返现额度
// @note    2020年11月23日11:08:55 优化淘宝查券速度
// @note    2020年11月12日14:52:46 服务器性能提升，优化查券速度
// @note    2020年11月5日10:46:11  唯品会页面异常修复
// @note    2020年10月30日14:14:54 准被适配考拉海购
// @note    2020年10月28日18:47:22 新增考拉海购详情页支持
// @note    2020年10月27日08:49:59 支持京东国际的预售页面
// @note    2020年10月26日09:53:53 修复页面图片显示异常
// @note    2020年10月25日17:17:19 新增双11领超级红包接口
// @note    2020年10月16日11:23:12 优化京东查券体验
// @note    2020年10月12日10:37:32 解决历史价格一直验证失败的bug，若一直验证失败，可以打开购物党独立验证窗口。
// @note    2020年9月29日09:42:51 接口调整。
// @note    2020年9月28日15:31:39 增加唯品会支持，修复京东图书详情页优惠券返现不出现的bug。
// @note    2020年9月27日09:46:31 增加京东拼购页面的支持。
// @note    2020年9月25日09:23:38 修复京东商品搜索页返现金额显示不正确的bug，修复京东商品返现二维码扫码后找不到商品的bug。
// @note    2020年9月23日09:54:58 京东支持历史价格查询了，优化界面，自动隐藏需要验证和没有历史数据的商品趋势图
// @note    2020年9月22日08:51:05 修复淘宝主页异常显示，修复在无历史价格时仍旧提示验证，修复验证窗口在某种情况下无法关闭，开始适配京东历史价格
// @note    2020年9月21日08:43:03 修复历史价格不显示的bug，调用购物党接口，增加验证环节，验证后可自动刷新显示。
// @note    2020年9月18日18:03:50 新增历史价格显示（目前只支持淘宝），点击可以隐藏/显示，修复京东详情页，价格出来的慢时候代码报错
// @note    2020年9月17日12:49:27 修复部分页面下优惠券会出现两个的问题。
// @note    2020年9月16日15:05:21 修复京东列表页懒加载后隐藏标签无效的bug，修复部分阿里健康大药房不显示优惠券的bug
// @note    2020年9月15日16:05:04 新增对京东新款，京东优评页面的支持，部分界面调整
// @note    2020年9月14日17:32:30 更新，修复部分页面不显示的bug，修复返现金额显示不准确。
// @note    2020年9月13日22:57:15 更新，新增京东优惠券及返现的支持，修复上一版中天猫超市优惠券查询无反应的bug。
// @note    2020年9月10日11:37:20 更新，修复返现金额查询时间长的bug，京东的查券返现功能正在适配中。
// @downloadURL https://update.greasyfork.org/scripts/413223/%F0%9F%94%A5%E4%BC%98%E6%83%A0%E5%88%B8%2B%E9%AB%98%E9%A2%9D%E8%BF%94%E7%8E%B0%F0%9F%94%A5%E8%8A%B1%E5%89%8D%E7%9C%81%E4%B8%80%E7%9C%81%C2%A9--%E7%9C%81%E9%92%B160%25%EF%BC%8C%E6%94%AF%E6%8C%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E8%80%83%E6%8B%89%E6%B5%B7%E8%B4%AD%EF%BC%8C%E9%85%8D%E5%90%88APP%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%E5%90%8E%E5%8D%B3%E5%8F%AF%E8%8E%B7%E5%BE%97%E8%BF%94%E7%8E%B0%21%21%21%20%20%20~~%E8%B6%85%E5%A4%9A%E5%B9%B3%E5%8F%B0%E6%94%AF%E6%8C%81%EF%BC%8C%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/413223/%F0%9F%94%A5%E4%BC%98%E6%83%A0%E5%88%B8%2B%E9%AB%98%E9%A2%9D%E8%BF%94%E7%8E%B0%F0%9F%94%A5%E8%8A%B1%E5%89%8D%E7%9C%81%E4%B8%80%E7%9C%81%C2%A9--%E7%9C%81%E9%92%B160%25%EF%BC%8C%E6%94%AF%E6%8C%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E8%80%83%E6%8B%89%E6%B5%B7%E8%B4%AD%EF%BC%8C%E9%85%8D%E5%90%88APP%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%E5%90%8E%E5%8D%B3%E5%8F%AF%E8%8E%B7%E5%BE%97%E8%BF%94%E7%8E%B0%21%21%21%20%20%20~~%E8%B6%85%E5%A4%9A%E5%B9%B3%E5%8F%B0%E6%94%AF%E6%8C%81%EF%BC%8C%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%E3%80%82.meta.js
// ==/UserScript==
