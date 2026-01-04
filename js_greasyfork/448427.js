// ==UserScript==
// @name         ss-shopline表格追加行点击弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  shopline 表格每行追加点击弹窗功能，支持页面：订单、弃单、草稿单、商品管理、客户、折扣码、自动折扣、在线商店-(自定义页面、菜单导航)、评价管理-商品评价、预售活动、联盟分销-分销员、组合销售、赠品活动、会员系统-客户、弹窗推广、公告栏、限时促销
// @author       CShWen
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @match        *://*/admin/orders*
// @match        *://*/admin/recallOrders*
// @match        *://*/admin/draftOrders*
// @match        *://*/admin/products*
// @match        *://*/admin/customer/management*
// @match        *://*/admin/sales/promo-code*
// @match        *://*/admin/sales/auto-coupon*
// @match        *://*/admin/website/page*
// @match        *://*/admin/website/navList*
// @match        *://*/product-plugin/comment/*
// @match        *://*/admin/plugins/sales/pre-order/list/?*
// @match        *://*/admin/plugins/sales/pre-order/list*
// @match        *://*/sales-plugin/affiliate/*
// @match        *://*/sales-plugin/bundle/home/?*
// @match        *://*/sales-plugin/gift*
// @match        *://*/customer-plugin/member-system/*
// @match        *://*/admin/plugins/sales/popups/home?*
// @match        *://*/admin/plugins/sales/notice/home?*
// @match        *://*/admin/plugins/sales/promotion/?*
// @run-at       document-idle
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/448427/ss-shopline%E8%A1%A8%E6%A0%BC%E8%BF%BD%E5%8A%A0%E8%A1%8C%E7%82%B9%E5%87%BB%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/448427/ss-shopline%E8%A1%A8%E6%A0%BC%E8%BF%BD%E5%8A%A0%E8%A1%8C%E7%82%B9%E5%87%BB%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let recordTrLen = 0, recordList = new Array();
    let svgCode = '<svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" class="svg-icon icon-active"><path d="M261.7 621.4c-9.4 14.6-17 30.3-22.5 46.6H324V558.7c-24.8 16.2-46 37.5-62.3 62.7zM700 558.7V668h84.8c-5.5-16.3-13.1-32-22.5-46.6a211.6 211.6 0 00-62.3-62.7zm-64-239.9l-124-147-124 147V668h248V318.8zM512 448a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" fill="#e6f7ff"></path><path d="M864 736c0-111.6-65.4-208-160-252.9V317.3c0-15.1-5.3-29.7-15.1-41.2L536.5 95.4C530.1 87.8 521 84 512 84s-18.1 3.8-24.5 11.4L335.1 276.1a63.97 63.97 0 00-15.1 41.2v165.8C225.4 528 160 624.4 160 736h156.5c-2.3 7.2-3.5 15-3.5 23.8 0 22.1 7.6 43.7 21.4 60.8a97.2 97.2 0 0043.1 30.6c23.1 54 75.6 88.8 134.5 88.8 29.1 0 57.3-8.6 81.4-24.8 23.6-15.8 41.9-37.9 53-64a97 97 0 0043.1-30.5 97.52 97.52 0 0021.4-60.8c0-8.4-1.1-16.4-3.1-23.8L864 736zm-540-68h-84.8c5.5-16.3 13.1-32 22.5-46.6 16.3-25.2 37.5-46.5 62.3-62.7V668zm64-184.9V318.8l124-147 124 147V668H388V483.1zm240.1 301.1c-5.2 3-11.2 4.2-17.1 3.4l-19.5-2.4-2.8 19.4c-5.4 37.9-38.4 66.5-76.7 66.5s-71.3-28.6-76.7-66.5l-2.8-19.5-19.5 2.5a27.7 27.7 0 01-17.1-3.5c-8.7-5-14.1-14.3-14.1-24.4 0-10.6 5.9-19.4 14.6-23.8h231.3c8.8 4.5 14.6 13.3 14.6 23.8-.1 10.2-5.5 19.6-14.2 24.5zM700 668V558.7a211.6 211.6 0 0162.3 62.7c9.4 14.6 17 30.3 22.5 46.6H700z" fill="#1890ff"></path><path d="M464 400a48 48 0 1096 0 48 48 0 10-96 0z" fill="#1890ff"></path></svg>';

    function arrayEquals(a, b) {
        if (a.length !== b.length) {
            return false
        } else {
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false
                }
            }
            return true;
        }
    }

    function applyPath(path, dataId) {
        let pathTemplate = {
            "/admin/categories": `/admin/categories/${dataId}/edit`,
            "/admin/customer/management": `/admin/customer/management/${dataId}`,
            "/admin/sales/promo-code": `/admin/sales/promo-code/edit/${dataId}`,
            "/admin/sales/auto-coupon": `/admin/sales/auto-coupon/edit/${dataId}`,
            "/admin/website/page": `/admin/website/page/${dataId}/edit`,
            "/admin/website/navList": `/admin/website/navList/${dataId}`,
            "/product-plugin/comment/comment-list": `/product-plugin/comment/comment-list/comment-list/${dataId}`,
            "/admin/plugins/sales/pre-order/list": `/admin/plugins/sales/pre-order/edit/${dataId}`,
            "/admin/plugins/sales/pre-order/list/": `/admin/plugins/sales/pre-order/edit/${dataId}`,
            "/sales-plugin/affiliate/distributor": `/sales-plugin/affiliate/distributor/detail/${dataId}`,
            "/sales-plugin/bundle/home/": `/sales-plugin/bundle/edit/${dataId}`,
            "/sales-plugin/gift/activity": `/sales-plugin/gift/activity/edit/${dataId}`,
            "/customer-plugin/member-system/customers": `/customer-plugin/member-system/customers/customer-detail/${dataId}`,
            "/admin/plugins/sales/popups/home": `/admin/plugins/sales/popups/activity/edit?popupId=${dataId}`,
            "/admin/plugins/sales/notice/home": `/admin/plugins/sales/notice/edit/${dataId}`,
            "/admin/plugins/sales/promotion/": `/admin/plugins/sales/promotion/${dataId}`,
        };
        return pathTemplate[path];
    }

    // 一些插件页面 iframe 嵌入
    function isIframePath(path) {
        let iframePath = [
            "/product-plugin/comment/comment-list",
            "/sales-plugin/affiliate/distributor",
            "/sales-plugin/bundle/home/",
            "/sales-plugin/gift/activity",
            "/customer-plugin/member-system/customers",
            "/admin/plugins/sales/popups/home",
            "/admin/plugins/sales/notice/home",
            "/admin/plugins/sales/promotion/"];
        let sign = false;
        iframePath.forEach(v => {
            if (v == path) {
                sign = true;
                return false;
            }
        })
        return sign;
    }

    // 轮询，只能说是蠢方法吧，毕竟我前端知识匮乏，菜鸡一枚
    setInterval(function () {
        let currentUrlPath = location.pathname;
        if ($('#root > div > section > section > main').length == 0 && !isIframePath(currentUrlPath)) {
            return
        }

        let trLen = $('tbody.ant-table-tbody tr').length;
        // 0 行时重置
        if (trLen == 0) {
            recordTrLen = 0;
            recordList = new Array();
            return
        }

        let tempList = new Array();
        $('tbody.ant-table-tbody tr').each(function () {
            let $this = $(this);
            tempList.push($this.attr('data-row-key'));
        });

        if (arrayEquals(recordList, tempList)) { return }

        recordList = tempList;
        recordTrLen = recordList.length;

        $('tbody.ant-table-tbody tr').each(function () {
            let $this = $(this);
            let dataId = "";
            let currentHref = $this.find('a').attr("href");

            // a href 取不到 path 时
            if (currentHref == undefined || currentHref == "") {
                dataId = $this.attr('data-row-key');
                if (dataId != undefined && dataId != "") {
                    currentHref = applyPath(currentUrlPath, dataId);
                }
            }

            // path 拼接 dataId 仍为空时
            if (currentHref == undefined || currentHref == "") {
                return true
            }

            // 需额外处理，商品列表页 div.checkboxContainer__1y95-
            if (currentUrlPath == "/admin/products") {
                let divClass = $this.children("td:first").children("div").attr("class");
                if (divClass == undefined || divClass == "") {
                    return true;
                }
                let divClass0 = String(divClass).split(" ")[0];
                $this.children("td:first").children("div." + divClass0).removeClass(divClass0);
            }

            // 先清理再追加 a 标签
            $this.children("td:first").children("a.ssts_new_tab").remove();
            $this.children("td:first").prepend($('<a href="' + currentHref + '" target="_blank" class="ssts_new_tab">' + svgCode + '</a>'));

            // 禁止点击事件     td:first 同 td:nth-child(1) 大部分时候相同
            $this.find('td:first > a').on(
                "click", event => event.stopImmediatePropagation()
            )
        });
    }, 1688);

})();