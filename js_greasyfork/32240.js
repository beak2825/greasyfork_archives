// ==UserScript==
// @name         Zimuku2pianyuan
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  增加片源网的搜索按钮，并直接显示字幕下载地址。
// @author       Johnxon
// @include      *://zmk.pw/detail/*
// @include      *://zimuku.org/detail/*
// @include      *://zimuku.pw/detail/*
// @include      *://srtku.com/detail/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32240/Zimuku2pianyuan.user.js
// @updateURL https://update.greasyfork.org/scripts/32240/Zimuku2pianyuan.meta.js
// ==/UserScript==

(function () {

    function addButton() {
        GM_addStyle("span.py{background:#20A4FF;padding:16px 20px !important;height:50px;font-size:18px;color:#fff !important}");
        let keywords = $("meta[name='keywords']").attr("content");
        let [title, en_title, ...rest] = keywords.split(',');
        let pianyuanBtn = `<a href="http://pianyuan.org/search?q=${encodeURIComponent(title)}" target="_blank"><span class="py">片源</span></a>`;
        let btnDownload = $('.dl').parent();
        btnDownload.after(pianyuanBtn);
    }
    async function fetchDLinks() {
        GM_addStyle(`
            .down{margin:20px 0;}
            .down ul {
                -webkit-column-count: 3;
                -moz-column-count: 3;
                column-count: 3;
                }
            .down li{padding:10px}
        `);
        let link = document.getElementById('down1');
        link.hostname = location.hostname;
        link.protocol = location.protocol;
        let html = await fetch(link.href)
            .then(response => response.text());
        let downLinks = $($.parseHTML(html)).find('.down');
        downLinks.find('a').removeClass('btn');
        downLinks.find(".btn-warning").parent().remove();
        downLinks.find(".btn-success").parent().remove();
        $('.subinfo').after(downLinks);
    }
    addButton();
    fetchDLinks();
})();