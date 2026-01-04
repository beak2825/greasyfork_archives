// ==UserScript==
// @name         Check JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2025.01.13.080000
// @description  I try to take over the world!
// @author       Kay
// @match        *://*.qipeiyigou.com/mshop/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472311/Check%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/472311/Check%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = window.location.href;
    // 添加样式
    const addStyles = () => {
        const style = `
        <style>
            .description a,
            .main .content a,
            .description *[style*="pointer"],
            .main .content *[style*="pointer"],
            .description img:not([src*="aimg8.dlssyht.cn"]),
            .main .content img:not([src*="aimg8.dlssyht.cn"]) {
                color: white !important;
                padding-left: 5px !important;
                background-color: blue !important;
                border-left: 5px solid red !important;
            }
            .online-kefu {
                top: calc(50% + 100px) !important;
            }
            #shop-info {
                display: inline-block;
                position: absolute;
                font-size: 16px;
                height: 42px;
                line-height: 42px;
                top: 0;
                right: 100px;
                display: none;
                color: white !important;
            }
            #shop-cat,
            #shop-cert {
                margin: 9px;
            }
            #shop-cert a {
                color: white !important;
            }
            #keywordx {
                color: red;
                display: inline-block;
                margin-top: 10px;
            }
            #divx {
                position: fixed;
            }
            #tipx {
                position: absolute;
                top: 0;
                right: 0;
                color: white;
                height: 51px;
                line-height: 51px;
                background-color: green;
                font-size: 20px;
                width: 700px;
                margin: 0;
                text-align: center;
                border-radius: 0 4px 0 0;
                display: none;
            }
        </style>
        `;
        $('body').append(style);
    };
    // 显示关键词
    const showKeyword = () => {
        const keyword = $("meta[name=keywords]").attr("content");
        const author = $("meta[name=author]").attr("content");
        if (keyword.includes(author)) {
            $('#keywordx').text("关键词为空");
        } else {
            $('#keywordx').text(keyword);
        }
    };
    // 检查商品信息
    const checkProduct = () => {
        let id = 0;
        let tip = "";
        $('#tipx').text("正在检查中……");
        if ($('.main a').length) {
            id = 1;
            tip += "存在超链接！";
        }
        if ($('.main *[style*=pointer]').length) {
            id = 2;
            tip += "存在非超链接小手！";
        }
        const images = $('.main img');
        for (let i = 0; i < images.length; i++) {
            const src = images.eq(i).attr('src');
            if (!src.includes("aimg8.dlssyht.cn")) {
                id = 3;
                tip += "存在外链图片！";
                break;
            }
        }
        if (id === 0) {
            tip = "正常！";
        } else {
            $('#tipx').css('background-color', 'red');
            alert(tip);
        }
        $('#tipx').text(`检查结果：${tip}`);
    };
    // 获取商铺信息
    const fetchShopInfo = () => {
        const shopId = unsafeWindow.__NUXT__.data["/api/siteData?undefined"]["dev"]["rawdata"]["basic_info"]["shop_info"]["id"];
        GM_xmlhttpRequest({
            type: "GET",
            url: `http://admin.qipeiyigou.com/shops/shops_add.php?shops_id=${shopId}`,
            headers: {
                "Content-Type": "text/html;charset=gbk",
            },
            onload: function (response) {
                let bigId = response.responseText.match(/big_id.*?>/)[0].match(/(\d+)/)[0];
                let subId = response.responseText.match(/sub_id".*>/)[0].match(/(\d+)/)[0];
                let certifiedInfo = "无";
                if (response.responseText.includes("certified_info")) {
                    certifiedInfo = response.responseText.match(/https:\/\/aimg8.dlssyht.cn\/certified_info.*target/)[0].split("?")[0];
                }
                if (certifiedInfo === "无") {
                    $('#shop-cert a').text("无认证资料");
                } else {
                    $('#shop-cert a').attr('href', certifiedInfo);
                }
                // 获取商铺类别
                GM_xmlhttpRequest({
                    type: "GET",
                    url: `http://testpage.qipeiyigou.com/dom/shops/ajax_get_class.php?big_id=${bigId}&sub_id=${subId}`,
                    headers: {
                        "Content-Type": "text/html;charset=gbk",
                    },
                    onload: function (response) {
                        $('#shop-cat').attr('title', '查询完毕……');
                        let f = response.responseText.split("selected")[1].split("<")[0].replace(">|-", "");
                        let g = response.responseText.split("selected")[2].split("<")[0].replace(">", "");
                        $('#shop-cat').attr('title', `${f}-${g}`);
                    }
                });
            }
        });
    };
    // 获取分类信息
    const fetchCategoryInfo = () => {
        const proId = url.split("/item/")[1].split("?")[0];
        const channelId = unsafeWindow.__NUXT__.data["/api/product/item/" + proId + "?undefined"]["data"]["channelId"];
        const channelNameMap = [
            ["15770577", "发动机系统"],
            ["16435676", "美容养护"],
            ["16435678", "电子电器"],
            ["15770578", "车身及驾驶室"],
            ["15770579", "汽修工具"],
            ["19365569", "底盘系统"],
            ["19366355", "液压系统"],
            ["19366356", "通用配件"],
            ["19366357", "新能源"],
            ["19366358", "车辆饰品"]
        ];
        let channelName = "";
        for (const [id, name] of channelNameMap) {
            if (channelId == Number(id)) {
                channelName = name;
                break;
            }
        }
        GM_xmlhttpRequest({
            type: "GET",
            url: `http://testpage.qipeiyigou.com/dom/sc_product.php?ch_id=${channelId}&id=${proId}`,
            headers: {
                "Content-Type": "text/html;charset=gbk",
            },
            onload: function (response) {
                if (response.responseText.includes(title)) {
                    // 获取产品性质和专属车型
                    let productProperties = "";
                    let exclusiveModels = "";
                    const properties = response.responseText.split("产品性质")[1].split("tr")[0].split("checked=");
                    for (const prop of properties) {
                        if (prop.includes("checked")) {
                            productProperties += prop.match(/[\u4e00-\u9fa5]+/) + "-";
                        }
                    }
                    productProperties = productProperties.slice(0, -1);
                    exclusiveModels = response.responseText.split("专属车型")[1].split('"checked"')[1].split("</label>")[0].match(/[\u4e00-\u9fa5]+/);
                    $('#span3').text(`产品性质：${productProperties}`);
                    $('#span4').text(`专属车型：${exclusiveModels}`);
                    // 获取系统分类id
                    const bigId = response.responseText.split('"big_id"')[2].split('"')[1];
                    const subId = response.responseText.split('"sub_id"')[2].split('"')[1];
                    // 获取系统分类名
                    GM_xmlhttpRequest({
                        type: "GET",
                        url: `http://admin.qipeiyigou.com/Ajax/VT/AjaxGetInfo.php?ch_id=${channelId}&req_method=5&one_cid=${bigId}&two_cid=${subId}`,
                        headers: {
                            "Content-Type": "text/html;charset=gbk",
                        },
                        onload: function (response) {
                            const dalei = response.responseText.split(`"${bigId}"` + ',"classname":')[1].split(",")[0].split('"')[1];
                            const xiaolei = response.responseText.split(`"${subId}"` + ',"classname":')[1].split(",")[0].split('"')[1];
                            $('#span2').text(`系统分类：${channelName}-${dalei}-${xiaolei}`);
                            $('#span1').text("查询完毕……");
                        }
                    });
                }
            }
        });
    };
    // 主体代码
    addStyles();
    const title = '"' + $(".title:first").text() + '"';
    if (url.includes("mshop/?")) {
        $('body').append('<div id="shop-info"><span id="shop-cat">商铺类别</span><span id="shop-cert"><a target="_blank">认证资料</a></span></div>');
        $(document).on('mouseenter', 'body', function () {
            if (!$('.header-nav #shop-info').length) {
                const $shopInfo = $('#shop-info');
                const $headerNav = $('.header-nav');
                $headerNav.append($shopInfo.detach());
                $('#shop-info').css('display', 'inline-block');
            }
        });
        fetchShopInfo();
    } else if (url.includes("product/item/")) {
        const a = `
            <div id="divx">
                <span id="span1">查询中……</span><br>
                <span id="span2">系统分类：</span><br>
                <span id="span3">产品性质：</span><br>
                <span id="span4">专属车型：</span><br>
            </div>
            <p id="tipx">正在检查中……</p>
        `;
        $('body').append(a);
        $(document).on('mouseenter', 'body', function () {
            if (!$('.main .v-x-scroll #tipx').length) {
                const $checkTip = $('#tipx');
                const $proDes = $('.main .v-x-scroll');
                $proDes.append($checkTip.detach());
                const top = $('.content-wrap').offset().top + 'px';
                const left = (($('body').width() - 1200) / 2 + 1210) + 'px';
                $('#divx').css('top', top);
                $('#divx').css('left', left);
                $('#tipx').css('display', 'inline-block');
            }
        });
        $('.title h3').append('<br><p id="keywordx"></p>');
        $('.nav-link').click(() => {
            $('#divx, #tipx').remove();
        });
        showKeyword();
        checkProduct();
        fetchCategoryInfo();
    }
})();
/*2025.01.13.080000 - Line : 269*/
