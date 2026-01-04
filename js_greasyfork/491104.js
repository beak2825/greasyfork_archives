// ==UserScript==
// @name water33
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 吃饭
// @author ddd
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.0.0/jquery.min.js
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @match   *
// @grant   GM_xmlhttpRequest
// @grant   GM_registerMenuCommand
// @grant   GM_unregisterMenuCommand
// @grant   GM_deleteValue
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491104/water33.user.js
// @updateURL https://update.greasyfork.org/scripts/491104/water33.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var last = 1, menu;
    const handlers = {
        '/': () => {
            if (localStorage.getItem("data") != null) {
                let data = JSON.parse(localStorage.getItem("data"));
                $("title").html(data.title);
                $('.lg').remove();
                let footer = $(".footer");
                footer.before($("<div class='tuji'><h1>" + data.title + "</h1>" + data.tags + "<p>图片数量：" + data.num + "P</p></div>"));
                footer.before(`<div class='mulu'><li id='scrollToTop'>回顶</li><li id='back'>返回</li><li id='collect'>${GM_getValue(data.id) != null ? "移除" : "收藏"}</li><li id='download'>下载</li></div>`)
                const kbox = $("<div id='kbox'></div>");
                if (data.path >= 5) {
                    if ("DECxuQvAnv8tEdKCd35tK6olqaO8HepYw8s37TRqY6ulnN7KUce8kUR6k87fwLe4jJumpRXSb+sQ9TVBhemnyA==" != null) {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: window.location.protocol + "//" + window.location.host + "/index.php?m=Api&c=Tuji&a=index",
                            headers: {
                                "Token": "DECxuQvAnv8tEdKCd35tK6olqaO8HepYw8s37TRqY6ulnN7KUce8kUR6k87fwLe4jJumpRXSb+sQ9TVBhemnyA==",
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            "data": encodeURIComponent("id") + '=' + encodeURIComponent(data.id),
                            responseType: "json", onload: (response) => {
                                if (response.response.status === 200) {
                                    $.getScript("/Static/css/lazy.js").done(function () {
                                        lazyload();
                                    });
                                    response.response.data.imgs.forEach((item, i) => {
                                        kbox.append(`<img class='lazy' filename='${data.title}-${i}.jpg' src='/Static/images/default.png' data-src='${item}'>`)
                                    });
                                } else {
                                    layer.msg(response.response.data.tip, { time: 1500 });
                                }
                            }, onerror: () => GM_notification({ text: "获取图集信息失败！\n请检查授权码是否正确且有效", timeout: 3000 })
                        });
                    }
                } else {
                    for (let i = 1; i <= data.num; i++) {
                        kbox.append(`<img class='lazy' filename='${data.title}-${i}.jpg' src='/Static/images/default.png' data-src='${data.prefix}${data.path}/${data.id}/${i}.jpg'>`)
                    }
                }
                footer.before(kbox);
                footer.before($('<script src="/Static/css/lazy.js"></script>'));
                footer.before($(`<script>$(function(){'use strict';var console=window.console||{log:function(){}};var $images=$('#kbox');var $toggles=$('.docs-toggles');var $buttons=$('.docs-buttons');var options={tooltip:true,title:false,navbar:false,fullscreen:false,zoomRatio:0.2,url:'data-src',ready:function(e){console.log(e.type)},show:function(e){console.log(e.type)},shown:function(e){console.log(e.type)},hide:function(e){console.log(e.type)},hidden:function(e){console.log(e.type)},view:function(e){console.log(e.type)},viewed:function(e){console.log(e.type)}};function toggleButtons(mode){if(/modal|inline|none/.test(mode)){$buttons.find('button[data-enable]').prop('disabled',true).filter('[data-enable*="'+mode+'"]').prop('disabled',false)}}$images.on({ready:function(e){console.log(e.type)},show:function(e){console.log(e.type)},shown:function(e){console.log(e.type)},hide:function(e){console.log(e.type)},hidden:function(e){console.log(e.type)},view:function(e){console.log(e.type)},viewed:function(e){console.log(e.type)}}).viewer(options);toggleButtons(options.inline?'inline':'modal');$toggles.on('change','input',function(){var $input=$(this);var name=$input.attr('name');options[name]=name==='inline'?$input.data('value'):$input.prop('checked');$images.viewer('destroy').viewer(options);toggleButtons(options.inline?'inline':'modal')});$buttons.on('click','button',function(){var data=$(this).data();var args=data.arguments||[];if(data.method){if(data.target){$images.viewer(data.method,$(data.target).val())}else{$images.viewer(data.method,args[0],args[1])}switch(data.method){case'scaleX':case'scaleY':args[0]=-args[0];break;case'destroy':toggleButtons('none');break}}})});layui.use('element',function(){var element=layui.element});</script>`));
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
                    let catalog = JSON.parse(GM_getValue("tujidao-collect") || "[]");
                    const index = catalog.indexOf(data.id);
                    if (index != -1) {
                        let newCatelog = [];
                        catalog.forEach((item, i) => {
                            if (i != index) {
                                newCatelog.push(item);
                            }
                        });
                        catalog = newCatelog;
                        GM_deleteValue("tujidao-" + data.id);
                        GM_setValue("tujidao-collect", JSON.stringify(newCatelog));
                        $(`#collect`).text(`收藏`);
                        layer.msg("已取消收藏", { time: 1000 });
                    } else {
                        catalog.push(data.id);
                        GM_setValue("tujidao-" + data.id, JSON.stringify(data));
                        $(`#collect`).text(`移除`);
                        GM_setValue("tujidao-collect", JSON.stringify(catalog));
                        layer.msg("已添加收藏", { time: 1000 });
                    }
                });
                // window.onbeforeunload = () => localStorage.setItem("data", JSON.stringify(data));
                localStorage.removeItem("data");
            }
        },
        '/u/': () => {
            $('.lg>p:nth-child(2)').html("您目前的会员等级： <span>开心VIP </span>");
            let up = $('.unav>a[href="/u/?action=shengji"]');
            up.attr("href", "https://greasyfork.org/zh-CN/scripts/446150");
            up.attr("target", "_blank");
            up.attr("style", "color: #f17c67;");
            up.text("👉 脚本主页");
            $('.lg').append('<p style="font-size: 14px;"><span>开心会员：</span> 以上功能全部免费白嫖！只求去脚本主页给个好评支持一下~</p>')
        },
        '/u/?action=shoucang': () => {
            let catalog = GM_getValue("tujidao-collect") != null ? JSON.parse(GM_getValue("tujidao-collect")) : [];
            $('.width').remove();
            $('.c').after(`<div class="width"><fieldset class="layui-elem-field layui-field-title"><legend>我的收藏</legend></fieldset> </div>`);
            let ul = $('.hezi > ul');
            for (let i = 0; i < catalog.length; i++) {
                let data = JSON.parse(GM_getValue("tujidao-" + catalog[i]));
                ul.append(`<li id="${data.id}"> <a href="/a/?id=${data.id}" target="_blank" ><img src="${data.prefix}${data.path}/${data.id}/0.jpg"/></a><span class="shuliang">${data.num}P</span>${data.tags}<p class="biaoti"><a href="/a/?id=${data.id}">${data.title}</a></p></li>`);
            }

            listHandler();
        },
    };

    registerMenu();
    tujidaoinit()
    new MutationObserver(() => {
        if ($('.hezi').length > last) {
            console.log("观察到分页脚本触发, 开心岛脚本重新初始化...")
            tujidaoinit()
            last = $('.hezi').length;
        }
    }).observe(document.body, { childList: true, subtree: true });

    function tujidaoinit() {
        try {
            layui.use('layer', () => layer = layui.layer);
        } catch (e) { }

        let action = document.location.href.split(window.location.host)[1];
        const handler = handlers[action] || listHandler;
        handler();
    }

    function listHandler() {
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
                        if (id[2] >= 5 && "DECxuQvAnv8tEdKCd35tK6olqaO8HepYw8s37TRqY6ulnN7KUce8kUR6k87fwLe4jJumpRXSb+sQ9TVBhemnyA==" == null) {
                            layer.msg("😭该图集无法白嫖~", { time: 1000 });
                        } else {
                            var data = { "num": num, "tags": tags, "prefix": id[1], "path": id[2], "id": id[3], "title": title };
                            localStorage.setItem("data", JSON.stringify(data));
                            window.open("/");
                        }
                        return false;
                    });
                });
        });
    }

    function registerMenu() {
        let title = "DECxuQvAnv8tEdKCd35tK6olqaO8HepYw8s37TRqY6ulnN7KUce8kUR6k87fwLe4jJumpRXSb+sQ9TVBhemnyA==" ? '✅ 已登录共享账号' : '❌ 点击登录共享账号'
        menu = GM_registerMenuCommand(title, () => {
            if ("DECxuQvAnv8tEdKCd35tK6olqaO8HepYw8s37TRqY6ulnN7KUce8kUR6k87fwLe4jJumpRXSb+sQ9TVBhemnyA==") {
                GM_deleteValue('tujidao-code')
                GM_notification({ text: `已移除共享账号授权码`, timeout: 3000 });
                GM_unregisterMenuCommand(menu);
            } else {
                var key = window.prompt("请输入共享账号授权码:", "");
                if (key !== null) {
                    GM_setValue('tujidao-code', key)
                }
                GM_notification({ text: `已保存共享账号授权码`, timeout: 3000 });
                GM_unregisterMenuCommand(menu);
            }
            registerMenu();
        });
    }

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
            console.log("start generate zip files...");
            zip.generateAsync({
                type: "blob",
            }).then((content) => {
                saveAs(content, filename + ".zip");
                sessionStorage.removeItem(filename);
                console.log("all completed: ", `${(performance.now() - start) / 1000} s`);
            });
        });
    }
})();