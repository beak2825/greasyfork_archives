// ==UserScript==
// @name         获取公众号数据
// @namespace    https://greasyfork.org/zh-CN/scripts/472880
// @version      1.1
// @description  尝试获取公众号数据!
// @author       gai871013
// @match        *://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      Apache2
// @downloadURL https://update.greasyfork.org/scripts/472880/%E8%8E%B7%E5%8F%96%E5%85%AC%E4%BC%97%E5%8F%B7%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/472880/%E8%8E%B7%E5%8F%96%E5%85%AC%E4%BC%97%E5%8F%B7%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.includes('mp.weixin.qq.com')) {

        var data_type;
        if (location.href.indexOf("menuanalysis") == 30) {
            data_type = "menu";
        } else if (location.href.indexOf("useranalysis") == 30) {
            data_type = location.href.indexOf("action=attr") > 30 ? "attr" : "list";
        } else {
            alert("不支持此页面");
            return;
        }

        var config = {
            list: function() {
                return {
                    type: "list",
                    data: JSON.stringify(CGI_DATA['pages/statistics/user_statistics'].list[0].list)
                };
            },
            attr: function() {
                return {
                    type: "attr",
                    data: JSON.stringify(cgiData.list[0])
                };
            },
            menu: function() {
                var data = {};
                cgiData["list"].forEach(function(row) {
                    if (!data[row.ref_date]) {
                        data[row.ref_date] = {};
                    }
                    if (!data[row.ref_date][row.primary_menu_name]) {
                        data[row.ref_date][row.primary_menu_name] = {
                            uv: 0,
                            pv: 0
                        };
                    }
                    data[row.ref_date][row.primary_menu_name].uv += row.clk_uv;
                    data[row.ref_date][row.primary_menu_name].pv += row.clk_pv;
                });
                return {
                    type: "menu",
                    data: JSON.stringify(data)
                };
            }
        };
        var loading = false;
        var js = document.createElement("script");
        js.src = "https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js";
        js.onload = function() {
            $(`<div class="weui-desktop-online-faq__wrp" style="bottom:90px">
    <div class="weui-desktop-online-faq">
        <div class="weui-desktop-online-faq__inner">
            <div class="weui-desktop-online-faq__switch">
                <div class="weui-desktop-online-faq__switch_content">
                    <div class="text">采集数据</div>
                </div>
            </div>
        </div>
    </div>
</div>`)
                .appendTo(body)
                .click(function() {
                if (loading) return;
                loading = true;
                var dom = $(this).find(".text");
                dom.html("正在采集");
                $.post(
                    "https://mpp.bzh001.com/api/large_screen/acquisition",
                    config[data_type](),
                    function(res) {
                        dom.html("重新采集");
                        alert(res);
                        loading = false;
                    }
                );
            });
        };
        document.getElementsByTagName("head")[0].appendChild(js);
    }
})();