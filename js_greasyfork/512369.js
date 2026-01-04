// ==UserScript==
// @name         优化超展开
// @version      0.12
// @description  优化超展开显示，并可显示日志
// @author       kedvfu
// @include     http*://bgm.tv/*
// @include     http*://chii.in/*
// @include     http*://bangumi.tv/*
// @license      MIT
// @namespace https://greasyfork.org/users/1302565
// @downloadURL https://update.greasyfork.org/scripts/512369/%E4%BC%98%E5%8C%96%E8%B6%85%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/512369/%E4%BC%98%E5%8C%96%E8%B6%85%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    const url = window.location.href;
    const top = window.top;
    const mainDocument = top.document;

    if (!(top.location.href.endsWith(".tv/rakuen") || top.location.href.endsWith(".in/rakuen"))) {
        return;
    }
    if (url.endsWith("/rakuen/home")) {
        const container = $(mainDocument).find("#container");
        container.css("width", "100vw");
    } else if (url.includes("/rakuen/topiclist")) {
        const targetA = $("a.title.avatar.l");
        targetA.attr("target", "right");
    } else if (url.includes("/blog/")) {
        const body = $("body")
        body.css({
            'background-image': 'url(/img/bangumi/header_bg_beta2.png)',
            'background-position': '50% 0',
            'background-repeat': 'no-repeat',
            'background-size': 'initial',
            'background-attachment': 'initial',
            'background-origin': 'initial',
            'background-clip': 'initial',
            'background-color': 'initial',
            'padding': '0 10px'
        });
        body.on("dblclick", parent.toggleFullscreen)
        $("#headerNeue2").remove();
        $("#footer").remove();
        $("#dock").remove();
        $("#wrapperNeue").css("min-width", "0")
        const main = $("#main");
        main.css({
            "padding-top": "0",
            "margin": "auto",
            "width": "100%"
        });
        const columns = $(".columns.clearit")
        columns.css("width", "100%");
        const columnA = $("#columnA");
        columnA.css("width", "100%");

        const columnB = $('#columnB');
        if (columnB[0].innerHTML) {
            const subjectHref = columnB.find("a.avatar").attr("href");
            const subjectTitle = columnB.find("a.avatar").attr("title");
            $("#pageHeader > h1 > span").after(`<span style="color: #ddd"> - <a href="${subjectHref}" target="_blank">${subjectTitle}</a></span>`);
        }
        columnB.remove();
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            body.css('background-image', 'none');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                body.css('background-image', 'none')
            } else {
                body.css({
                    'background-image': 'url(/img/bangumi/header_bg_beta2.png)'
                });
            }
        });
    }


})();

