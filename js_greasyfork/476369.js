// ==UserScript==
// @name 图集岛破解VIP-威力加强版修改匹配地址--lc自用
// @namespace http://tampermonkey.net/
// @version 2.2.5.3
// @description 破解VIP、一键打包下载和图片自适应
// @author 原作者请搜索fordes123
// @homepageURL https://greasyfork.org/zh-CN/scripts/446150
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.0.0/jquery.min.js
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @match   https://www.sqmuying.com/*
// @include https://www.sqmuying.com/*
// @match   *.sqmuying.com/*
// @include *.sqmuying.com/*
// @match   https://www.sqmuying.com/
// @include https://www.sqmuying.com/
// @match   *.sqmuying.com/
// @include *.sqmuying.com/
// @match   https://www.sqmuying.com
// @include https://www.sqmuying.com
// @match   *.sqmuying.com
// @include *.sqmuying.com
// @grant  GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476369/%E5%9B%BE%E9%9B%86%E5%B2%9B%E7%A0%B4%E8%A7%A3VIP-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88%E4%BF%AE%E6%94%B9%E5%8C%B9%E9%85%8D%E5%9C%B0%E5%9D%80--lc%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/476369/%E5%9B%BE%E9%9B%86%E5%B2%9B%E7%A0%B4%E8%A7%A3VIP-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88%E4%BF%AE%E6%94%B9%E5%8C%B9%E9%85%8D%E5%9C%B0%E5%9D%80--lc%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function asyncGet(zip, filename, url) {
        const defered = $.Deferred();
        GM_xmlhttpRequest({
            method: "GET", url: url, headers: {
                referer: window.location.href,
            }, responseType: "blob", onload: (response) => {
                zip.file(filename, response.response);
                defered.resolve("success");
                console.log(filename + " download completed~");
            }, onerror: () => console.log(filename + "(" + url + ") download failed!")
        });
        return defered;
    }

    function download() {
        let filename;
        const start = performance.now();
        const zip = new JSZip();
        const list = document.querySelectorAll("#kbox>img");
        console.log("start download... " + list.length + " task");

        let arr = [];
        for (const item of list) {
            filename = item.getAttribute("filename");
            const url = item.getAttribute("data-src");
            arr.push(asyncGet(zip, filename, url));
        }

        filename = $("title").text();
        $.when.apply(this, arr).then((...args) => {
            console.log("download completed... " + args.length + " task");
            console.log("start generate zip files, timely: ", `${(performance.now() - start) / 1000} s`);
            zip.generateAsync({
                type: "blob",
            }).then((content) => {
                saveAs(content, filename + ".zip");
                sessionStorage.removeItem(filename);
                console.log("all completed: ", `${(performance.now() - start) / 1000} s`);
            });
        });
    }

    function tujidaoinit() {
        let action = document.location.href.split(window.location.host)[1];
        try {
            layui.use('layer', () => layer = layui.layer);
        } catch (e) { }
        switch (action) {
            case "/":
                if (localStorage.getItem("data") != null) {
                    let data = JSON.parse(localStorage.getItem("data"));
                    localStorage.removeItem("data");
                    $("title").html(data.title);
                    $('.lg').remove();
                    let footer = $(".footer");
                    footer.before($("<div class='tuji'><h1>" + data.title + "</h1>" + data.tags + "<p>图片数量：" + data.num + "P</p></div>"));
                    footer.before(`<div class='mulu'><li id='scrollToTop'>回顶</li><li id='back'>返回</li><li id='collect'>${localStorage.getItem(data.id) != null ? "移除" : "收藏"}</li><li id='download'>下载</li></div>`)
                    const kbox = $("<div id='kbox'></div>");
                    for (let i = 1; i <= data.num; i++) {
                        kbox.append(`<img class='lazy' filename='${data.title}-${i}.jpg' src='/Static/images/default.png' data-src='${data.prefix}${data.path}/${data.id}/${i}.jpg'>`)
                    }
                    footer.before(kbox);
                    footer.before($('<script src="/Static/css/lazy.js"></script>'));
                    footer.before($(`<script>$(function(){'use strict';var console=window.console||{log:function(){}};var $images=$('#kbox');var $toggles=$('.docs-toggles');var $buttons=$('.docs-buttons');var options={tooltip:true,title:false,navbar:false,fullscreen:false,zoomRatio:0.2,url:'data-src',ready:function(e){console.log(e.type)},show:function(e){console.log(e.type)},shown:function(e){console.log(e.type)},hide:function(e){console.log(e.type)},hidden:function(e){console.log(e.type)},view:function(e){console.log(e.type)},viewed:function(e){console.log(e.type)}};function toggleButtons(mode){if(/modal|inline|none/.test(mode)){$buttons.find('button[data-enable]').prop('disabled',true).filter('[data-enable*="'+mode+'"]').prop('disabled',false)}}$images.on({ready:function(e){console.log(e.type)},show:function(e){console.log(e.type)},shown:function(e){console.log(e.type)},hide:function(e){console.log(e.type)},hidden:function(e){console.log(e.type)},view:function(e){console.log(e.type)},viewed:function(e){console.log(e.type)}}).viewer(options);toggleButtons(options.inline?'inline':'modal');$toggles.on('change','input',function(){var $input=$(this);var name=$input.attr('name');options[name]=name==='inline'?$input.data('value'):$input.prop('checked');$images.viewer('destroy').viewer(options);toggleButtons(options.inline?'inline':'modal')});$buttons.on('click','button',function(){var data=$(this).data();var args=data.arguments||[];if(data.method){if(data.target){$images.viewer(data.method,$(data.target).val())}else{$images.viewer(data.method,args[0],args[1])}switch(data.method){case'scaleX':case'scaleY':args[0]=-args[0];break;case'destroy':toggleButtons('none');break}}})});layui.use('element',function(){var element=layui.element});</script>`));
                    footer.before($('<script> layui.use("element", function(){ var element = layui.element; }); </script>'));
                    $(document).on("click", "#download", () => {
                        if (sessionStorage.getItem(data.title) == null) {
                            sessionStorage.setItem(data.title, true);
                            layer.msg("已创建下载任务", download());
                        } else {
                            layer.msg("努力打包中, 请耐心等待！", { time: 1000 });
                        }
                    });
                    $(document).on("click", "#scrollToTop", () => scrollTo(0, 0));
                    $(document).on("click", "#back", () => window.close())
                    $(document).on("click", "#collect", () => {
                        let catalog = JSON.parse(localStorage.getItem("collect") || "[]");
                        const index = catalog.indexOf(data.id);
                        if (index != -1) {
                            let newCatelog = [];
                            catalog.forEach((item, i) => {
                                if (i != index) {
                                    newCatelog.push(item);
                                }
                            });
                            catalog = newCatelog;
                            localStorage.removeItem(data.id);
                            localStorage.setItem("collect", JSON.stringify(newCatelog));
                            $(`#collect`).text(`收藏`);
                            layer.msg("已取消收藏", { time: 1000 });
                        } else {
                            catalog.push(data.id);
                            localStorage.setItem(data.id, JSON.stringify(data));
                            $(`#collect`).text(`移除`);
                            localStorage.setItem("collect", JSON.stringify(catalog));
                            layer.msg("已添加收藏", { time: 1000 });
                        }
                    });
                    // window.onbeforeunload = () => localStorage.setItem("data", JSON.stringify(data));
                    localStorage.removeItem("data");
                }
                break;
            case "/u/":
                $('.lg>p:nth-child(2)').html("您目前的会员等级： <span>白嫖VIP </span>");
                let up = $('.unav>a[href="/u/?action=shengji"]');
                up.attr("href", "https://greasyfork.org/zh-CN/scripts/446150");
                up.attr("target", "_blank");
                up.attr("style", "color: #c12c1f;");
                up.text("👉 脚本主页");
                $('.lg').append('<p style="font-size: 14px;"><span>白嫖会员：</span> 以上功能全部免费白嫖！只求去脚本主页给个好评支持一下~</p>')
                break;
            case "/u/?action=shoucang":
                let catalog = localStorage.getItem("collect") == null ? [] : JSON.parse(localStorage.getItem("collect"));
                $('.width').remove();
                $('.c').after(`<div class="width"><fieldset class="layui-elem-field layui-field-title"><legend>我的收藏</legend></fieldset> </div>`);
                let ul = $('.hezi > ul');
                for (let i = 0; i < catalog.length; i++) {
                    let data = JSON.parse(localStorage.getItem(catalog[i]));
                    ul.append(`<li id="${data.id}"> <a href="/a/?id=${data.id}" target="_blank" ><img src="${data.prefix}${data.path}/${data.id}/0.jpg"/></a><span class="shuliang">${data.num}P</span>${data.tags}<p class="biaoti"><a href="/a/?id=${data.id}">${data.title}</a></p></li>`);
                }
            default:
                $("div.hezi>ul>li").each(function () {
                    let $item = $(this);
                    $(this)
                        .find('a[href^="/a/?id="]')
                        .each(function () {
                            $(this).attr("href", "/");
                            var tags = "";
                            $item.find("p:not(.biaoti)").each(function () {
                                tags += "<p>" + $(this).html() + "</p>";
                            });
                            let title = $item.find("p.biaoti > a").text();
                            let num = $item.find("span.shuliang").text().split("P")[0];
                            let id = /(.*)(\d+)\/(\d+)\/(\d+).*/g.exec($item.find('img').attr('src'));
                            if (num == null || id.length < 3) {
                                throw ("未获取到图集信息" + $item.html());
                            }
                            $(this).on("click", function () {
                                var data = { "num": num, "tags": tags, "prefix": id[1], "path": id[2], "id": id[3], "title": title };
                                localStorage.setItem("data", JSON.stringify(data));
                                window.open("/");
                                return false;
                            });
                        });
                });
                break;
        }
    }
    tujidaoinit()
    var last = 1;
    new MutationObserver(() => {
        if ($('.hezi').length > last) {
            console.log("观察到分页脚本触发, 图集岛脚本重新初始化...")
            tujidaoinit()
            last = $('.hezi').length;
        }
    }).observe(document.body, { childList: true, subtree: true });
})();