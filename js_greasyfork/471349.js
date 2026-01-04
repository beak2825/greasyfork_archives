// ==UserScript==
// @name         Add Fanhao In AVstudio List Page
// @name:zh-CN   JAV片商官网列表页添加番号
// @namespace    https://greasyfork.org/zh-CN/users/51119-jywyf
// @version      202307211700
// @author       jywyf
// @description          JAV片商官网列表页添加番号(搭配脚本'根据番号搜索',不用进入详情页,就能在列表页查看此车牌是否已入库(emby/115)\预览片花\一键跳转在线观看等花样操作.)
// @description:zh-CN    JAV片商官网列表页添加番号(搭配脚本'根据番号搜索',不用进入详情页,就能在列表页查看此车牌是否已入库(emby/115)\预览片花\一键跳转在线观看等花样操作.)

// @include      *://attackers.net/*
// @include      *://av-e-body.com/*
// @include      *://av-opera.jp/*
// @include      *://befreebe.com/*
// @include      *://bi-av.com/*
// @include      *://bibian-av.com/*
// @include      *://dasdas.jp/*
// @include      *://fitch-av.com/*
// @include      *://hajimekikaku.com/*
// @include      *://hhh-av.com/*
// @include      *://honnaka.jp/*
// @include      *://ideapocket.com/*
// @include      *://kawaiikawaii.jp/*
// @include      *://kirakira-av.com/*
// @include      *://madonna-av.com/*
// @include      *://miman.jp/*
// @include      *://mko-labo.net/*
// @include      *://moodyz.com/*
// @include      *://muku.tv/*
// @include      *://mvg.jp/*
// @include      *://nanpa-japan.jp/*
// @include      *://oppai-av.com/*
// @include      *://premium-beauty.com/*
// @include      *://rookie-av.jp/*
// @include      *://s1s1s1.com/*
// @include      *://tameikegoro.jp/*
// @include      *://to-satsu.com/*
// @include      *://v-av.com/*
// @include      *://wanz-factory.com/*
// 匹配有码厂商详情页
// @include      *://*/search/list?keyword=*
// @include      *://*/actress/detail/*
// @include      *://*/works/list/reserve
// @include      *://*/actress/detail/*
// @include      *://*/top
// @include      *://*/works/list/genre/*
// @include      *://*/works/detail/*

// @grant        GM_addStyle
// @license      GPL-3.0
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/471349/Add%20Fanhao%20In%20AVstudio%20List%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/471349/Add%20Fanhao%20In%20AVstudio%20List%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function addfanhao() {
        GM_addStyle([
            '.chepaise{margin-top:5px;margin-bottom:5px;font-weight: 700;color: #d37912 !important;}',
            '.c-card .name {margin:0px;}',
        ].join(''));
    }
    function setfanhao() {
        $("a[class='img hover'],a[class='item']").each(function () {
            var infoDiv = $(this);
            var chafanhao = $(this);
            var AVID = $(infoDiv).attr('href');
            var reg = /[a-zA-Z]{2,15}\d{2,15}/i;
            //var fanhao=AVID.substring(AVID.lastIndexOf('/') + 1);
            var fanhao = AVID.substring(AVID.lastIndexOf('/') + 1).match(reg)[0];
            if (fanhao.match((/^[a-z|A-Z]{2,15}\d{2,15}$/i))) {
                var number = fanhao.search(/\d/);
                if (number > 0) {
                    fanhao = fanhao.slice(0, number) + "-" + fanhao.slice(number)
                }
            }
            var fanhaocode = $('<div class="chepaise" >' + fanhao + '</div>');
            $(chafanhao).append(fanhaocode);
        });
    }
    addfanhao();
    setfanhao();
})();