// ==UserScript==
// @name         小惠妹优惠券 - 快速领取淘宝、天猫优惠券
// @namespace    http://www.xiaohuimei.com/
// @version      0.4
// @description  快速领取淘宝、天猫优惠券
// @author       Minicocor
// @match        *://*.taobao.com/item.htm?*
// @match        *://detail.tmall.com/item.htm?*
// @require      http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/374001/%E5%B0%8F%E6%83%A0%E5%A6%B9%E4%BC%98%E6%83%A0%E5%88%B8%20-%20%E5%BF%AB%E9%80%9F%E9%A2%86%E5%8F%96%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/374001/%E5%B0%8F%E6%83%A0%E5%A6%B9%E4%BC%98%E6%83%A0%E5%88%B8%20-%20%E5%BF%AB%E9%80%9F%E9%A2%86%E5%8F%96%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }

    function getProductTitle() {
        if (host.indexOf('taobao.com') > 0) {
            productTitle = $.trim($('.tb-main-title').text());
            addDom = ".tb-action";
        } else if (host.indexOf('tmall.com') > 0) {
            productTitle = $.trim($('.tb-detail-hd h1').text());
            addDom = ".tb-action";
        }
    }

    var ajaxGetQuanitems = function(title, id, fn_success) {
        var queryUrl = "https://www.xiaohuimei.com/api/quan/GetQuanItemByTaobaoJs?id=" + id + "&s=" + title;
        GM_xmlhttpRequest({
            method: "GET",
            url: queryUrl,
            onload: function(response) {
                //debugger;
                if (response.status == 200 && fn_success) {
                    //debugger;
                    //console.log(response);
                    var rst = JSON.parse(response.response);
                    if (rst.isSucc) {
                        //console.log(rst.data);
                        if (rst.data != null && rst.data.length > 0)
                            fn_success(rst.data)
                    } else {
                        console.log("url:" + url + " 错误:" + rst.errMsg);
                    }
                }
            }
        });
    }

    var getQuanHtml = function(str, url) {
        var html = "";
        if (host.indexOf('taobao.com') > 0) {
            html = '<div class="div-inline"><div class="tb-btn-buy" style="padding-top:11px;"><a href="' + url + '" target="_blank">' + str + '</a></div></div>';
        } else if (host.indexOf('tmall.com') > 0) {
            html = '<div class="div-inline"><div class="tb-btn-buy tb-btn-sku"  style="padding-top:11px;"><a href="' + url + '" target="_blank">' + str + '</a></div></div>';
        }
        return html;
    }



    //encodeURIComponent()
    var host = window.location.host;
    var id = getQueryString("id");
    //var callurl = window.location.protocol + "\\" + host + "?id=" + id;
    var productTitle = '';
    var addDom = '';
    getProductTitle();
    ajaxGetQuanitems(productTitle, id, (views) => {
        var htmls = "";
        views.forEach(function(item, index) {
            htmls += getQuanHtml("领取" + item.amountStr + "券", item.url);
            if (index == 0) {
                //添加活动页链接
            }
        })
        $(addDom).append(htmls);
    });

})();