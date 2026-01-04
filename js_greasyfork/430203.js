// ==UserScript==
// @name         hitomi.la 助手
// @namespace    https://greasyfork.org/zh-CN/users/200067#1
// @version      1.99
// @description  下载加速,分包下载,优化在线阅读,标签汉化,本子列表标题自动换行,点击本子列表预览图新标签页打开,非搜索增加选页功能,本子列表标签支持展开(默认显示10个),本子列表显示本子总页数
// @author       不会英语会写点代码的小白
// @match        http*://hitomi.la/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @connect      hub.gitmirror.com
// @connect      ghp.ci
// @connect      github.com
// @connect      githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/430203/hitomila%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430203/hitomila%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    const location_hash = location.hash.startsWith("#VIEW#") ? location.hash : void 0;
    let db;
    init: {
        if (location.pathname.startsWith("/reader/")) break init;
        const gx = 4;
        if (GM_getValue("更新", 0) != gx) {
            GM_getValue("db_update_time", 0) > 0 && localStorage.setItem("db_js", GM_getValue("db_js"));
            const list = GM_listValues();
            for (const key of list) GM_deleteValue(key);
            GM_setValue("更新", gx);
        }
        GM_addStyle("\n#lang > a {\n  padding: 10px 70px 10px 15px;\n}\n.gallery-content > div > h1.lillie {\n  white-space: normal; //标题换行显示\n}\n"), 
        unsafeWindow.load_ehtagtranslation_db_text = obj => {
            const data = obj.data;
            obj = {
                TMap: {
                    tags: "标签",
                    artists: "艺术家",
                    series: "原作",
                    characters: "角色",
                    language: "语言",
                    type: "类型",
                    group: "团队"
                },
                aliasMap: {
                    // 标签
                    loli: "lolicon",
                    shota: "shotacon",
                    // 类型
                    "artist CG": "artistcg",
                    "game CG": "gamecg",
                    "image set": "imageset"
                },
                alias(str) {
                    return this.aliasMap[str] || str.toLowerCase();
                }
            };
            for (const j of data) obj[j.namespace] = j;
            db = obj, $ && translate();
        };
        let is_add_script = !0;
        const xhr_onload = r => {
            if (200 !== r.status) return xhr.onerror(r), null;
            const responseText = r.responseText;
            if (4 === r.readyState) {
                if (!responseText.includes("load_ehtagtranslation_db_")) return xhr.onerror(r), 
                null;
                localStorage.setItem("db_update_time", (new Date).getTime() + 864e5 + ""), localStorage.setItem("db_js", responseText);
            }
            if (is_add_script) {
                if (!document.head) return r.readyState = 0, void setTimeout(xhr_onload, 100, r);
                is_add_script = !1;
                const script = document.createElement("script");
                script.src = URL.createObjectURL(new Blob([ responseText ], {
                    type: "application/x-javascript"
                })), document.head.appendChild(script);
            }
        }, db_js = localStorage.getItem("db_js") || "";
        if (db_js.includes("load_ehtagtranslation_db_") && (xhr_onload({
            status: 200,
            responseText: db_js
        }), parseInt(localStorage.getItem("db_update_time") || "0") > (new Date).getTime())) break init;
        let index = 0;
        const urls = [ "https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.js", "https://ghp.ci/https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.js", "https://hub.gitmirror.com/https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.js" ], xhr_onerror = er => {
            console.error(`status:${er.status || 0}, url:${xhr.url} index:${index}`), index >= 2 * urls.length ? is_add_script && alert("用于汉化标签的数据库加载失败,请确保网络可以访问github.com后刷新网页重试") : xhr_send();
        }, xhr = {
            url: "",
            method: "GET",
            timeout: 1e4,
            onload: xhr_onload,
            onerror: xhr_onerror,
            ontimeout: xhr_onerror,
            onabort: xhr_onerror
        }, xhr_send = () => {
            xhr.url = urls[index++ % urls.length], GM_xmlhttpRequest(xhr);
        };
        xhr_send();
    }
    let $, main = () => {
        console.log("main()");
        {
            let limit, _onresizeT, each_fun = function() {
                const el = $(this);
                el.index() >= limit && el.addClass("hidden-list-item");
            }, onclick = function() {
                let el = $(this);
                const is = "展开&gt;" === el.html();
                el.html(is ? "收起&lt;" : "展开&gt;"), el = el.parent().nextAll(), is ? el.removeClass("hidden-list-item") : el.addClass("hidden-list-item");
            }, each_fun2 = function() {
                let el = $(this).children();
                if (el.length > limit) {
                    const ex = $('<li><a style="cursor: pointer; color:aqua">展开&gt;</a></li>');
                    ex.children().on("click", onclick), el.eq(9).after(ex), el = el.last(), "..." === el.text() && el.remove();
                }
            };
            const onresize = () => {
                _onresizeT = void 0;
                const is = document.body.clientWidth > 768, p = 768 == document.body.clientWidth ? 30 : 15, dom = $(".gallery-content > div");
                return dom.each((function() {
                    const img = this.firstElementChild, imgD = img.firstElementChild;
                    let top;
                    if (is) top = (this.offsetHeight - imgD.offsetHeight) / 2 + 18 + "px"; else {
                        const title = img.nextElementSibling, artist = title.nextElementSibling;
                        top = title.offsetHeight + artist.offsetHeight + p + "px";
                    }
                    imgD.style.top = top;
                })), dom;
            };
            unsafeWindow.addEventListener("resize", (() => {
                null != _onresizeT && clearTimeout(_onresizeT), _onresizeT = setTimeout(onresize, 10);
            }));
            //去除顶部广告被屏蔽后的空白
            const el = document.querySelector(".content > div, .top-content > div");
            el && !el.className.match("list-title|cover-column") && el.remove(), (main = () => {
                limit = 10, $(".relatedtags li, .series-list li").each(each_fun), $(".relatedtags ul, .series-list ul").each(each_fun2), 
                limit = 5, $(".artist-list li").each(each_fun), $(".artist-list ul").each(each_fun2);
                const dom = onresize();
                dom.length && dom.find("a.lillie").attr("target", "_blank");
            })();
        }
        if (!unsafeWindow.galleryinfo) return;
        const files = unsafeWindow.galleryinfo.files;
        // 阅读页
        // 下载按钮扩展
                {
            const dlbt = $("#dl-button");
            dlbt.removeAttr("href").css("cursor", "pointer").children().html("下载"), GM_addStyle('\n.cover > a , #dl_options {\n  text-align: center;\n  display: block;\n}\n#dl_options input[type="radio"] {\n  margin: 0 2px 0 4px;\n}\n#dl_options span, #dl_options label, #dl_options input {\n  vertical-align: middle;\n  font-size: 14px;\n}\n.gallery-info > table {\n  table-layout: fixed; /*限制tag长度*/\n}\n');
            const dl_options = $(`\n<div id="dl_options" style="line-height: 25px;">\n  <label>下载并发数:<input type="number" style="width:38px" name="dl_thread" value="${GM_getValue("dl_thread", "4")}"></label>\n  <label><input type="radio" name="dl_mode" value="2">不打包下载</label>\n  <br>\n  <label>\n    <input type="radio" name="dl_mode" value="1">按大小分包:\n    <input type="number" style="width:55px" name="zip_max_length" value="${GM_getValue("zip_max_length", "1024")}">M\n  </label>\n  <br>\n  图片格式:\n  <label><input type="radio" name="img_type" value="webp">webp</label>\n  <label><input type="radio" name="img_type" value="avif">avif</label>\n</div>\n`);
            dl_options.find("input[name=dl_mode][value=" + GM_getValue("dl_mode", "1") + "]").attr("checked", "checked"), 
            dl_options.find("input[name=img_type][value=" + GM_getValue("img_type", "webp") + "]").attr("checked", "checked"), 
            dl_options.find("input[type]").on("change", (e => {
                const target = e.target, name = target.name;
                name && GM_setValue(name, target.value);
            }));
            const dlt = $('<span style="position:absolute;left:0px;right:0px;vertical-align:middle;"/>'), progressbar = $("#progressbar");
            progressbar.append(dlt), progressbar.css({
                "text-align": "center",
                position: "relative"
            }), progressbar.after(dl_options), unsafeWindow.download_gallery = name => {
                let obj;
                const files_length = files.length, dl_fun = {
                    mode1(xhr) {
                        let zip, zip_i = 0;
                        do {
                            if ((zip = obj.zips[zip_i]) || (zip = obj.zips[zip_i] = new JSZip, zip_i > 0 && (zip.index = obj.zips[zip_i - 1].max_index + 1)), 
                            xhr.dl_index > zip.max_index) {
                                if (zip.next_zip) continue;
                                files_length - xhr.dl_index < 20 ? zip.max_index = files_length : zip.max_index = xhr.dl_index;
                            }
                            break;
                        } while (++zip_i);
                        zip.file(files[xhr.dl_index].name, xhr.response), zip.index++;
                        const is_dl_finish = obj.dl_index_finish === files_length;
                        if (is_dl_finish || (zip.next_zip = (zip.byteLength += xhr.response.byteLength) > obj.zip_max_byteLength) && zip.index > zip.max_index) {
                            const zip_name = zip_i > 0 ? obj.gallery_name + " (" + zip_i + ")" : obj.gallery_name;
                            zip.generateAsync({
                                type: "blob"
                            }).then((data => saveAs(data, zip_name + ".zip")));
                        }
                        is_dl_finish && this.finish();
                    },
                    mode2(xhr) {
                        let datas = obj.bolbs;
                        datas || (datas = obj.bolbs = []), xhr.response.dl_index = xhr.dl_index, datas.push(xhr.response), 
                        obj.itv_id || (obj.itv_id = setInterval(this.mode2_itv.bind(this), 200));
                    },
                    mode2_itv() {
                        const blob = obj.bolbs.shift();
                        blob && obj ? saveAs(blob, obj.gallery_name + "_" + files[blob.dl_index].name) : (clearInterval(obj.itv_id), 
                        obj.itv_id = 0, obj.dl_index_finish === files_length && this.finish());
                    },
                    finish() {
                        progressbar.hide(), dlbt.children().text("下载"), obj = null;
                    }
                };
                function xhr_onreadystatechange() {
                    if (4 === this.readyState) {
                        if (!obj) return;
                        200 === this.status ? (dlt.html(++obj.dl_index_finish + "/" + files_length), progressbar.progressbar("value", obj.dl_index_finish / files_length * 100), 
                        obj.dl_mode_fun(this), obj && obj.dl_index < files_length && (xhr_init(this), xhr_send.bind(this)())) : (this.status >= 500 && this.status < 600 || --this.dl_retry) && setTimeout(xhr_send.bind(this), 500);
                    }
                }
                function xhr_init(xhr) {
                    const image = files[obj.dl_index];
                    let img_type = obj.img_type;
                    "avif" !== img_type || image.hasavif || (img_type = "webp"), image.name = image.name.replace(/[^.]*$/, img_type), 
                    xhr.dl_url = unsafeWindow.url_from_url_from_hash(unsafeWindow.galleryid, image, img_type), 
                    xhr.dl_index = obj.dl_index++, xhr.dl_retry = 100;
                }
                function xhr_send() {
                    this.open("GET", this.dl_url, !0), this.send();
                }
                const JSZip = unsafeWindow.JSZip;
                JSZip.prototype.byteLength = 0, JSZip.prototype.index = 0, JSZip.prototype.max_index = 0, 
                JSZip.prototype.next_zip = !1, (unsafeWindow.download_gallery = name => {
                    if (null != obj) {
                        for (const xhr of obj.xhrs) xhr.abort();
                        return void dl_fun.finish();
                    }
                    dlbt.children().text("取消下载"), dlt.html("0/" + files_length), progressbar.show(), 
                    progressbar.progressbar({
                        value: !1
                    }), obj = {}, obj.gallery_name = name || "hitomi", obj.dl_index = 0, obj.dl_index_finish = 0, 
                    obj.img_type = GM_getValue("img_type", "webp");
                    const dl_mode = GM_getValue("dl_mode", "1");
                    obj.dl_mode_fun = dl_fun["mode" + dl_mode].bind(dl_fun);
                    let xhr_responseType, dl_thread = parseInt(GM_getValue("dl_thread", "6"));
                    // 线程 1-6，超过6会出现503错误
                    if (dl_thread = dl_thread < 1 ? 1 : dl_thread > 6 ? 6 : dl_thread, "1" === dl_mode) {
                        const max_length = parseInt(GM_getValue("zip_max_length", "1024"));
                        obj.zip_max_byteLength = 1048576 * (max_length < 100 ? 100 : max_length > 2048 ? 2048 : max_length), 
                        // 限制大小100M-2048M
                        xhr_responseType = "arraybuffer", obj.zips = [];
                    } else "2" === dl_mode && (xhr_responseType = "blob");
                    obj.xhrs = [];
                    for (let xhr, thread = 0; thread < dl_thread && obj.dl_index < files_length; thread++) obj.xhrs.push(xhr = new XMLHttpRequest), 
                    xhr.onreadystatechange = xhr_onreadystatechange, xhr.responseType = xhr_responseType, 
                    xhr_init(xhr), xhr_send.bind(xhr)();
                })(name);
            };
        }
        // 在线阅读
                {
            let titleA = $("#gallery-brand > a");
            titleA.length && titleA.before("(" + files.length + ")"), GM_addStyle('\n#_VIEW_ {\n    height: 100%;\n  width: 100%;\n  position: fixed;\n  z-index: 99998;\n}\n#_VIEW_ > iframe {\n  height: 100%;\n  width: 100%;\n}\n#_VIEW_ > .lum-close-button {\n  cursor: pointer;\n  position: absolute;\n  right: 5px;\n  top: 3px;\n  width: 32px;\n  height: 32px;\n  z-index: 99999;\n  opacity: 1\n}\n#_VIEW_ > .lum-close-button:hover {\n  opacity: .7\n}\n#_VIEW_ > .lum-close-button:after,.lum-close-button:before {\n  position: absolute;\n  left: 15px;\n  content: " ";\n  height: 33px;\n  width: 2px;\n  background-color: #fff;\n}\n#_VIEW_ > .lum-close-button:before {\n  transform: rotate(45deg)\n}\n#_VIEW_ > .lum-close-button:after {\n  transform: rotate(-45deg)\n}\n');
            const ro = $("#read-online-button > :eq(0)");
            ro.html("在线阅读");
            const reader_href = ro.parent().attr("href"), view = $(`\n<div tabindex="1" style="display: none;">\n<div id="_VIEW_">\n  <iframe src="${reader_href}#1"/>\n  <div class="lum-close-button"/>\n </div>\n</div>\n`);
            document.body.prepend(view[0]);
            const hideView = e => {
                view.hide(), void 0 !== e && (unsafeWindow.history.back(), e.stopPropagation(), 
                e.preventDefault());
            };
            view.find(".lum-close-button").on("click", hideView);
            const _get_pagenum_hash = unsafeWindow.get_pagenum_hash;
            unsafeWindow.get_pagenum_hash = function(...args) {
                if (location.hash.startsWith("#VIEW#")) {
                    const iframe = view.find("#_VIEW_>iframe")[0];
                    view.is(":hidden") && (view.show(), iframe.focus({
                        preventScroll: !0
                    }));
                    const page = location.hash.substring(6);
                    ro.html("继续阅读第" + page + "页");
                    const iframe_hash = reader_href + "#" + page;
                    return $("#read-online-button, #gallery-brand > a").attr("href", iframe_hash), iframe.contentWindow?.location.replace(iframe_hash), 
                    $(".simplePagerNav a").length + 1;
                }
                return view.is(":hidden") || hideView(void 0), _get_pagenum_hash.apply(this, args);
            }, $("#read-online-button, #gallery-brand > a, .thumbnail-container > a").on("click", (function(e) {
                const match = this.href.match(/#([0-9-]+)$/), hash = "#VIEW#" + (match ? match[1] : "1");
                view.is(":hidden") ? location.hash = hash : location.replace(hash), e.stopPropagation(), 
                e.preventDefault();
            })), unsafeWindow.addEventListener("message", (e => {
                const data = e.data;
                data.startsWith("#") && location.replace(location.pathname + data.replace("#", "#VIEW#"));
            }), !1), location_hash && (location.hash = location_hash);
        }
    }, translate = () => {
        let translateList;
        const is = null != unsafeWindow.galleryinfo;
        (translate = () => {
            if (document.querySelector(".dj-desc tr > td")) {
                if (document.querySelector(".dj-desc tr > td[title]")) console.warn("！重复翻译"); else if ($(".dj-desc tr > td:nth-of-type(1), .gallery-info tr > td:nth-of-type(1)").each(each_fun2), 
                //行名
                translateList = [ "female", "male", "other", "mixed", "artist", "character", "cosplayer", "group", "parody" ], 
                $(".relatedtags a[href], .tags a[href]").each(each_fun), //标签
                is && (
                // $('.gallery-info ul#tags a').each(each_fun); // 详情页的标签
                // translateList.splice(5, 1);
                // translateList.unshift('character');
                translateList = [ "character" ], $(".gallery-info ul#characters a").each(each_fun)), 
                // 原作
                translateList = [ "parody" ], $(".dj-content tr:nth-of-type(1) > td:nth-of-type(2) a").each(each_fun3), 
                is && ($(".gallery-info tr:nth-of-type(4) > td:nth-of-type(2) a").each(each_fun3), 
                translateList = [ "group" ], // 团队
                $(".gallery-info tr:nth-of-type(1) > td:nth-of-type(2) a").each(each_fun3)), 
                // 类型
                translateList = [ "reclass" ], $(".dj-content tr:nth-of-type(2) > td:nth-of-type(2) a").each(each_fun3), 
                is) {
                    $(".gallery-info tr:nth-of-type(2) > td:nth-of-type(2)").find("a").each(each_fun3);
                }
            } else console.warn("？列表加载中");
        })(), 
        // 工具栏
        $("nav > ul > li > a[href]").each(each_fun2);
        const lang = $("nav > ul > li#lang > a");
        if (lang.length) {
            $("nav > ul #lang-list").children() ? (lang.html(lang.children()[0]), lang.prepend("语言 ")) : lang.parent().hide();
        }
        function each_fun() {
            let map, str;
            const mat = /^(.+)( [♀♂])/.exec(this.innerHTML);
            if (mat) {
                if (str = " ♀" === mat[2] ? "female" : "male", map = db[str].data[db.alias(mat[1])], 
                map) return this.title = map.intro, void (this.innerHTML = map.name + mat[2]);
                this.innerHTML = mat[1];
            }
            const str2 = db.alias(this.innerHTML);
            for (const val of translateList) if (val !== str && (map = db[val].data[str2], map)) {
                this.title = map.intro, this.innerHTML = map.name + (str || ("female" === val ? "♀" : "male" === val ? "♂" : ""));
                break;
            }
        }
        function each_fun2() {
            this.title = this.innerHTML;
            const str = db.TMap[this.innerHTML.toLowerCase()];
            str && (this.innerHTML = str);
        }
        function each_fun3() {
            const str = db.alias(this.innerHTML);
            let map;
            for (const val of translateList) if (map = db[val].data[str], map) {
                this.innerHTML = map.name, this.title = map.intro;
                break;
            }
        }
    };
    {
        let _$ = () => {
            if (!$) return;
            function limitLists(el = $(".gallery-content > div > h1.lillie > a")) {
                el.length && (el.each(each_fun2), get_galleryinfo_l || get_galleryinfo_fnish(), 
                db && translate());
            }
            _$ = () => $, console.log("开始劫持 limitLists()"), unsafeWindow.limitLists ? unsafeWindow.limitLists = limitLists : Object.defineProperty(unsafeWindow, "limitLists", {
                get: () => limitLists,
                set() {}
            });
            let get_galleryinfo_l = 0;
            const galleryinfos = {};
            function each_fun2() {
                const match = this.href.match(/-([0-9]+)\.html/);
                match && !galleryinfos[match[1]] && (get_galleryinfo_l++, get_galleryinfo("//" + unsafeWindow.domain + "/galleries/" + match[1] + ".js", 10));
            }
            let galleryinfo_datas = [];
            function get_galleryinfo(url, retry) {
                $.ajax({
                    type: "get",
                    url,
                    dataType: "text",
                    success: response => {
                        galleryinfo_datas.push(response.replace(/.*?galleryinfo *=/, "galleryinfos[" + url.replace(/.*\/([0-9]+).js$/, "'$1'") + "]= ")), 
                        --get_galleryinfo_l || (new Function("galleryinfos", galleryinfo_datas.join("\n"))(galleryinfos), 
                        galleryinfo_datas = [], get_galleryinfo_fnish());
                    },
                    error: () => retry && setTimeout(get_galleryinfo, 500, url, retry - 1)
                });
            }
            function get_galleryinfo_fnish() {
                $(".gallery-content > div > h1.lillie > a").each(each_fun), main();
            }
            function each_fun() {
                const match = this.href.match(/-([0-9]+)\.html/);
                if (!match) return;
                const galleryinfo = galleryinfos[match[1]];
                galleryinfo && $(this).before("(" + galleryinfo.files.length + ")");
            }
            const el = $(".gallery-content > div > h1.lillie > a");
            return el.length && limitLists(el), $;
        };
        unsafeWindow.$ ? (console.warn("脚本被延迟加载"), $ = unsafeWindow.$, _$()) : Object.defineProperty(unsafeWindow, "$", {
            get: () => _$(),
            set(value) {
                $ = value;
            }
        });
    }
    function saveAs(blob, filename) {
        const url = URL.createObjectURL(blob), save_link = document.createElement("a");
        save_link.href = url, save_link.download = filename, document.body.appendChild(save_link), 
        save_link.click(), save_link.remove();
    }
    if (location.pathname.startsWith("/reader/")) {
        function end() {
            console.log("end()");
            // 改变hash不添加历史
            const script = document.createElement("script");
            script.type = "text/javascript";
            const fns = [ "singlePageChange", "mobile_singlePageChange", "twoPageChange", "mobile_twoPageChange" ];
            for (const index in fns) fns[index] = unsafeWindow[fns[index]].toString().replace(/location.hash *= *([A-z]*);/g, "location.replace(location.pathname+'#'+$1);");
            script.innerHTML = "'use strict'\n" + fns.join("\n"), document.body.appendChild(script);
            // 取消在图片上隐藏鼠标指针
            const make_image_element_ = unsafeWindow.make_image_element;
            unsafeWindow.make_image_element = function(...args) {
                return args.length > 4 && (
                // 取消 img.onmouseover 事件
                args[4] = void 0), make_image_element_.apply(this, args);
            };
            // 修复 preventDefault报错
            const addEventListener_ = document.addEventListener;
            if (document.addEventListener = function(...args) {
                return "touchmove" === args[0] && (2 == args.length && args.push({
                    passive: !1
                }), document.addEventListener = addEventListener_), addEventListener_.apply(this, args);
            }, GM_addStyle("\n#comicImages.fitVertical > picture {\n  display: contents;\n}\n#comicImages.fitVertical {\n  height: calc(100% - 41px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n#comicImages.fitVertical img {\n  max-height: 100%;\n  width: auto;\n  height: auto;\n  max-width: calc(100% - 4px);\n}\n#mobileImages.fitVertical {\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n#mobileImages.fitVertical img {\n  max-height: 100%;\n  width: auto;\n  height: auto;\n  max-width: 100%;\n}\n"), 
            unsafeWindow.mobile_fitHorizontal = unsafeWindow.mobile_fitVertical, unsafeWindow.parent === unsafeWindow) return;
            // iframe
                        $(".mobile-navbar-inner>.gallery-link").remove(), $(".mobile-navbar-inner>.mobile-nav-right").css("float", "left"), 
            $(".container>a.brand").remove(), $(".container>.btn-navbar").css("float", "left"), 
            $("ul.pull-right").css("float", "left");
            unsafeWindow.addEventListener("hashchange", (() => {
                const hash = location.hash;
                unsafeWindow.parent.postMessage("" === hash ? "#1" : hash);
            } // 向父页面发送消息
            ), !1);
        }
        "loading" !== document.readyState ? (console.warn(document.readyState), end()) : document.addEventListener("DOMContentLoaded", end, {
            capture: !0,
            once: !0
        });
    }
    /******/})();