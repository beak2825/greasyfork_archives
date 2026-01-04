// ==UserScript==
// @name         Yande.re 界面样式美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用 Bootsrtap 重构 yande.re 界面样式
// @author       Loong
// @match        https://yande.re/*
// @match        https://konachan.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420701/Yandere%20%E7%95%8C%E9%9D%A2%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/420701/Yandere%20%E7%95%8C%E9%9D%A2%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

jQuery.noConflict();
jQuery(function () {
    var $ = jQuery;

    var off = localStorage.getItem("loong-off");
    if (off) {
        var $on = $("<button></botton>")
            .css({
                position: "fixed",
                right: 0,
                top: 0
            })
            .text("L")
            .on("click", function () {
                localStorage.removeItem("loong-off");
                location.reload();
            });
        $("body").append($on);
        return;
    }

    if (location.pathname.match(/^\/post\/?$/)
        || location.pathname.match(/^\/post\/popular_[^\/]+$/)
        || location.pathname.match(/^\/pool\/show\/[0-9]+\/?$/)
        || location.pathname.match(/^\/note\/?$/)) {
        // 初始化页头
        initHead();
        // 读取页面数据
        var data = readPageData();
        // 构建主体
        buildBody(data);
        // 初始化事件
        initEvent(data);
    }

    // 初始化头
    function initHead() {
        // 移除原页面引入
        $("script").remove();
        $("link[rel='stylesheet']").remove();
        // 设置头
        $("head")
            // 适应手机浏览
            .append('<meta name="viewport" content="width=device-width,initial-scale=1">')
            // 加载 Bootstrap 样式
            .append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">');
    }

    // 读取页面数据
    function readPageData() {

        var data = {
            title: null,
            titleOptHtml: null,
            menus: [],
            submenus: [],
            pages: {},
            images: [],
            tags: []
        }

        // 读取头部菜单
        $("#main-menu>ul>li").each(function () {
            var $a = $(this).children("a").first();
            data.menus.push({
                href: $a.attr("href"),
                note: $a.text()
            });
        });
        // 读取副菜单
        $("#subnavbar>li>a").each(function () {
            data.submenus.push({
                href: $(this).attr("href"),
                note: $(this).text()
            });
        });

        // 标题
        data.title = $("#content>div>h4").text();

        // 标题式操作栏
        data.titleOptHtml = $("#content>div>h3").html();

        // 读取图片列表
        var $ul = $("#post-list-posts");
        $ul.children("li").each(function () {
            var $li = $(this);
            var $a = $li.find(">div.inner>a.thumb");
            var $img = $a.children("img");
            var $download = $li.children("a.directlink");
            var infoStr = $img.attr("alt");
            data.images.push({
                // id
                id: $li.attr("id").substring(1),
                // 地址
                href: $a.attr("href"),
                // 缩略图
                preview: $img.attr("src"),
                // 等级
                rating: imgAttrValue(infoStr, "Rating"),
                // 评分
                score: imgAttrValue(infoStr, "Score"),
                // 标签
                // tags : tags == null ? [] : imgAttrValue(infoStr, "Tags").split(/ /),
                // 是否有子图片
                hasChildren: $li.hasClass("has-children"),
                // 是否有父图片
                hasParent: $li.hasClass("has-parent"),
                // 下载地址
                download: $download.attr("href"),
                // 图片大小
                size: $download.children(".directlink-res").text(),
                // pending: $li.hasClass("pending"),
                // flagged: $li.hasClass("flagged"),
            });
        });

        // 读取页数信息
        var $paginator = $("#paginator>div.pagination");
        data.pages = {
            current: $paginator.length == 0 ? 1 : parseInt($paginator.children("em.current").text()),
            last: $paginator.length == 0 ? 1 : parseInt($paginator.children(".next_page").prev().text())
        };

        // 加载标签信息
        $("#tag-sidebar>li").each(function () {
            var a = $(this).find("a:last");
            data.tags.push({
                type: $(this).attr("class").replace("tag-link ", "").replace("tag-type-", ""),
                name: a.text(),
                href: a.attr("href"),
                count: parseInt($(this).find("span.post-count").text())
            });
        });

        return data;

        function imgAttrValue(str, name) {
            var result = RegExp(name + ": ([^:]+)(( [^:]+:)|$)", "i").exec(str);
            return (result != null && result.length > 1) ? result[1] : null;
        }
    }

    // 构建主体
    function buildBody(data) {
        $("body")
            .empty()
            .append(
                // 构建菜单栏
                nav(data),
                // 构建页面主体
                main(data),
                // 附加工具
                toolbar(data),
                // 分页栏
                paginator(data)
            );

        // 构建菜单栏
        function nav(data) {

            var $brand = $("<a></a>")
                .addClass("navbar-brand text-muted")
                .attr("href", "/")
                .text(location.host)
                .css("font-size", "1rem");

            // 菜单列表
            var $ul = $("<ul></ul>")
                .addClass("navbar-nav")
                .css("font-size", "0.9rem");
            $.each(data.menus, function (i, menu) {
                var $a = $("<a></a>")
                    .addClass("nav-link")
                    .attr("href", menu.href)
                    .text(menu.note);
                $ul.append($("<li>")
                    .addClass("nav-item")
                    .append($a));
            });
            var $navbar = $("<div></div>")
                .addClass("collapse navbar-collapse")
                .append($ul);

            // 搜索栏
            var input = $("<input>")
                .addClass("form-control form-control-sm")
                .attr({
                    type: "text",
                    name: "tags",
                    placeholder: "Search"
                });
            var $search = $("<form></form>")
                .attr({
                    action: "/post",
                    method: "get"
                })
                .append(input);

            // 插件关闭按钮
            var $off = $("<button></botton>")
                .addClass("btn btn-light btn-sm text-muted ml-2 d-none d-xl-block")
                .text("✕")
                .on("click", function () {
                    localStorage.setItem("loong-off", "true");
                    location.reload();
                });

            var $nav = $("<nav></nav>")
                .addClass("navbar navbar-expand-lg navbar-light bg-light border-bottom")
                .append(
                    $brand,
                    $navbar,
                    $search,
                    $off
                );
            return $nav;
        }

        // 构建页面主体
        function main(data) {

            var $main = $('<div></div>')
                .addClass("container-xl")
                .css("padding-bottom", data.pages.last > 1 ? "3.5rem" : "1.5rem")
                .append(
                    // 消息栏
                    message(data),
                    // 标题栏
                    title(data),
                    // 标题式操作栏
                    titleOpt(data),
                    // 标签栏
                    tags(data),
                    // 图片栏
                    images(data),
                    // 子菜单
                    submenu(data)
                );
            return $main;

            // 构建消息栏
            function message(data) {

                // 新增页数量提示处理
                if (location.pathname.match(/^\/post\/?$/)
                    && !location.search.match(/^.*tags=.+/)) {
                    // 加载浏览器存储的数量
                    var lastPage = localStorage.getItem("loong-last-page");
                    if (lastPage && data.pages.last > lastPage) {
                        // 有新增则提示
                        var $message = $("<div></div>");
                        var $close = $("<button></button>")
                            .addClass("close")
                            .css({
                                "line-height": "20px",
                                "outline": 0
                            })
                            .text("×")
                            .on("click", function () {
                                $message.hide();
                            });
                        $message
                            .addClass("alert border bg-light text-danger")
                            .css({
                                "margin": "1rem 0 0",
                                "text-align": "center"
                            })
                            .text("+" + (data.pages.last - lastPage) + " Page")
                            .append($close);
                        // 保存新数量
                        localStorage.setItem("loong-last-page-backup", lastPage);
                        localStorage.setItem("loong-last-page", data.pages.last);
                        return $message;
                    } else if (lastPage == null) {
                        // 第一次加载插件时直接保存
                        localStorage.setItem("loong-last-page", data.pages.last);
                    }
                }
                return null;
            }

            // 构建标题栏
            function title(data) {
                if (data.title) {
                    return $("<h5></h5>").addClass("text-dark mt-4 mb-3").text(data.title);
                }
                return null;
            }

            // 构建标题式操作栏
            function titleOpt(data) {
                if (data.titleOptHtml) {
                    var $opt = $("<h5></h5>")
                        .addClass("text-warning text-center mt-4 mb-3")
                        .html(data.titleOptHtml);
                    $opt.children("a")
                        .addClass("text-info")
                        .css("text-decoration", "none");
                    return $opt;
                }
                return null;
            }

            // 构建标签栏
            function tags(data) {
                // 标签类型对应的样式
                var badgeClass = {
                    "circle": "text-primary",
                    "artist": "text-warning",
                    "copyright": "text-info",
                    "character": "text-success",
                    "general": "text-secondary",
                    "faults": "text-danger",
                    "style": "text-danger"
                };
                if (data.tags.length) {
                    var $tags = $("<div></div>").addClass("text-center mt-3 d-none d-md-block");
                    $.each(data.tags, function (i, tag) {
                        var $a = $("<a></a>")
                            .addClass("btn btn-light btn-sm m-1")
                            .addClass(badgeClass[tag.type])
                            // 暂时设为白色，避免css加载前样式颜色太突出，css加载后会被强制覆盖
                            .css("color", "#fff")
                            .attr("href", tag.href)
                            .text(tag.name);
                        $a.append(
                            $("<span></span>").addClass("badge").text(tag.count)
                        );
                        $tags.append($a);
                    });
                    return $tags;
                }
                return null;
            }

            // 构建图片列表
            function images(data) {
                // 图片级别对应的样式
                var ratingClass = {
                    "Safe": "text-success",
                    "Questionable": "text-warning",
                    "Explicit": "text-danger"
                };

                var $images = $('<div></div>')
                    .addClass("row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mt-2 pl-1 pl-sm-2 pl-md-3 pl-xl-0")
                    .attr("id", "post-list-posts");
                $.each(data.images, function (i, image) {

                    var $img = $("<img>")
                        .addClass("card-img-top")
                        .css({
                            "max-height": $(window).height() + "px",
                            "object-fit": "cover"
                        })
                        .attr("src", image.preview);
                    var $a = $("<a></a>")
                        .attr("href", image.href)
                        .append($img);

                    var $cardBody = $('<div></div>').addClass("card-body p-2");
                    $cardBody.append(
                        // 图片id
                        cardItem("id", image.id),
                        // 图片级别
                        cardItem(
                            "rating",
                            $('<span></span>')
                                .addClass(ratingClass[image.rating])
                                .text(image.rating)),
                        // 图片评分
                        cardItem("score", image.score)
                    );
                    // 父子图片
                    if (image.hasParent) {
                        $cardBody.append(cardItem("parent", "✓"))
                    }
                    if (image.hasChildren) {
                        $cardBody.append(cardItem("children", "✓"))
                    }
                    // 下载连接
                    $cardBody.append(
                        cardItem(
                            "down",
                            $('<a></a>')
                                .attr({
                                    "href": image.download,
                                    "target": "_blank"
                                })
                                .addClass("text-info")
                                .css("text-decoration", "none")
                                .text(image.size)
                        )
                    );

                    // 项卡片
                    var $card = $('<div></div>')
                        .addClass("card text-muted")
                        .attr("data-id", image.id)
                        .append($a, $cardBody);
                    $images.append(
                        $('<div></div>').addClass("col p-0 pr-1 pr-sm-2 pr-md-3 pt-1 pt-sm-2 pt-md-3").append($card)
                    );
                });
                return $images;

                function cardItem(title, value) {
                    return $("<p></p>").addClass("mb-0").append($("<span></span>").text(title + ": ")).append(value);
                }
            }

            // 构建子菜单
            function submenu(data) {
                var $submenu = $("<ul></ul>")
                    .addClass("nav justify-content-center mt-4")
                    .css("font-size", "0.9rem");
                $.each(data.submenus, function (i, submenu) {
                    var $a = $("<a></a>")
                        .addClass("nav-link text-muted")
                        .attr("href", submenu.href)
                        .text(submenu.note);
                    $submenu.append(
                        $("<li>").addClass("nav-item").append($a)
                    );
                });
                return $submenu;
            }
        }

        // 构建分页栏
        function paginator(data) {

            if (data.pages.last <= 1) {
                return null;
            }

            // 处理跳转参数
            var param = location.search.substring(1);
            if (param.length == 0) {
                param = "?page=";
            } else {
                var vars = param.split("&");
                $.each(vars, function (i, value) {
                    var pair = value.split("=");
                    if (pair[0] == "page") {
                        vars.splice(i, 1);
                        return false;
                    }
                });
                vars.push("page=");
                param = "?" + vars.join("&");
            }

            var $paginator = $("<ul></ul>").addClass("pagination pagination-sm justify-content-center mb-0");
            // 上一页按钮
            var $prev = pageButton(
                param + (data.pages.current - 1),
                "← Previous",
                "mr-auto"
            );
            $prev.attr("id", "paginator-prev");
            if (data.pages.current <= 1) {
                // 没有上一页
                $prev.addClass("disabled").children("a").removeClass("text-info");
            }
            $paginator.append($prev);
            // 首页按钮
            if (data.pages.current > 4) {
                $paginator.append(
                    pageButton(
                        param + 1,
                        "1...",
                        "ml-1 mr-1 d-none d-md-block"
                    )
                );
            }
            // 分页按钮
            for (var i = data.pages.current - 3; i <= data.pages.current + 3; i++) {
                var text = i == data.pages.last && i != 1 ? ("..." + i) : i;
                if (i == data.pages.current) {
                    // 当前页按钮的处理
                    var $span = $("<span></span>")
                        .addClass("page-link rounded bg-info text-light text-center")
                        .css({
                            "cursor": "default",
                            "min-width": "28px"
                        })
                        .text(text);
                    $paginator.append(
                        $("<li></li>").addClass("page-item ml-1 mr-1").append($span)
                    );
                } else if (i >= 1 && i <= data.pages.last) {
                    $paginator.append(
                        pageButton(
                            param + i,
                            text,
                            "ml-1 mr-1 d-none d-sm-block"
                        )
                    );
                }
            }
            // 尾页按钮
            if (data.pages.current < data.pages.last - 3) {
                $paginator.append(
                    pageButton(
                        param + data.pages.last,
                        "..." + data.pages.last,
                        "ml-1 mr-1 d-none d-md-block"
                    )
                );
            }
            // 跳转栏
            if (data.pages.last > 4) {
                var $to = $("<input>")
                    .addClass("form-control form-control-sm d-inline").css("width", "65px")
                    .attr({
                        type: "number",
                        placeholder: "to",
                        min: 1,
                        max: data.pages.last
                    }).on("keydown", function (e) {
                        if (e.keyCode == 13) {
                            location.href = param + $(this).val();
                        }
                    });
                $paginator.append(
                    $("<li></li>").addClass("page-item ml-1 mr-1 d-none d-lg-block").append($to)
                );
            }
            // 下一页按钮
            var $next = pageButton(
                param + (data.pages.current + 1),
                "Next →",
                "ml-auto"
            );
            $next.attr("id", "paginator-next")
            if (data.pages.current >= data.pages.last) {
                $next.addClass("disabled").children("a").removeClass("text-info");
            }
            $paginator.append($next);
            return $("<div></div>").addClass("fixed-bottom bg-light p-2").append($paginator);

            function pageButton(href, text, style) {
                var $a = $("<a></a>")
                    .addClass("page-link rounded text-info text-center")
                    .attr("href", href).css("min-width", "28px").text(text);
                return $("<li></li>")
                    .addClass(style == null ? "page-item" : "page-item " + style)
                    .append($a);
            }
        }

        // 构建附加工具
        function toolbar() {
            // 回到页面顶部
            var $up = $("<button></botton>")
                .addClass("btn btn-light text-info")
                .css({
                    "position": "fixed",
                    "right": "8px",
                    "bottom": data.pages.last > 1 ? "112px" : "77px",
                    "width": "40px"
                })
                .text("↑")
                .on('click', function () {
                    $('html').animate({ scrollTop: 0 }, 800);
                });
            // 到页面底部
            var $down = $("<button></botton>")
                .addClass("btn btn-light text-info")
                .css({
                    "position": "fixed",
                    "right": "8px",
                    "bottom": data.pages.last > 1 ? "65px" : "30px",
                    "width": "40px"
                })
                .text("↓")
                .on('click', function () {
                    $('html').animate({ scrollTop: $(document).height() }, 800);
                });
            // 检测滚动条状态
            setTimeout(function () {
                checkScroll($up, $down)
            }, 100);
            $(document).scroll(function () {
                checkScroll($up, $down);
            });

            return $("<div></div>")
                .addClass("d-none d-xl-block")
                .append($up, $down);

            // 检测滚动条状态
            function checkScroll($up, $down) {
                var scroH = $(document).scrollTop();
                var viewH = $(window).height();
                var contentH = $(document).height();
                if (contentH - (scroH + viewH) <= 50) {
                    $down.attr('disabled', true).addClass("border border-info");
                } else {
                    $down.removeAttr('disabled', true).removeClass("border border-info");
                }
                if (scroH <= 100) {
                    $up.attr('disabled', true).addClass("border border-info");
                } else {
                    $up.removeAttr('disabled', true).removeClass("border border-info");
                }
            }
        }
    }

    // 初始化事件
    function initEvent() {
        // 设置键盘事件
        var $images = $("#post-list-posts>.col");
        $(document).on("keydown", function (e) {
            if (e.keyCode == 37) {
                // 键盘←事件
                // 前往上一页
                var $prev = $("#paginator-prev");
                if ($prev.length && !$prev.hasClass("disabled")) {
                    location.href = $prev.children("a.page-link").attr("href");
                }
            } else if (e.keyCode == 39) {
                // 键盘→事件
                // 前往下一页
                var $next = $("#paginator-next");
                if ($next.length && !$next.hasClass("disabled")) {
                    location.href = $next.children("a.page-link").attr("href");
                }
            } else if (e.keyCode == 38) {
                // 键盘↑事件
                // 滚动条移动到上一行图片位置
                var scroll = 0;
                var change = false;
                $images.each(function () {
                    if ($(this).offset().top > $(document).scrollTop() - 1) {
                        $(document).scrollTop(scroll);
                        change = true;
                        return false;
                    } else {
                        scroll = $(this).offset().top;
                    }
                });
                if (!change) {
                    $(document).scrollTop(scroll);
                }
                return false;
            } else if (e.keyCode == 40) {
                // 键盘↓事件
                // 滚动条移动到下一行图片位置
                var change = false;
                $images.each(function () {
                    if ($(this).offset().top > $(document).scrollTop() + 1) {
                        $(document).scrollTop($(this).offset().top);
                        change = true;
                        return false;
                    }
                });
                if (!change) {
                    $(document).scrollTop($(document).height());
                }
                return false;
            }
        });
    }
});