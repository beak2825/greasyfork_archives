// ==UserScript==
// @name           Reddit - Top Comments Preview (old & new design)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        3.03
// @description    Preview to the top comments on Reddit (+ optional auto-load comments and images, auto-hide sidebar)
// @homepageURL    https://github.com/mationic/userscripts/blob/master/Reddit%20-%20Top%20Comments%20Preview.readme.md
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match          *://*.reddit.com/*
// @exclude        /.*\/comments\/.*/
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/4957/Reddit%20-%20Top%20Comments%20Preview%20%28old%20%20new%20design%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4957/Reddit%20-%20Top%20Comments%20Preview%20%28old%20%20new%20design%29.meta.js
// ==/UserScript==
(function ($) {
    "use strict";
    /*jshint validthis: true */
    /*jslint browser: true, regexp: true, newcap: true */
    /*global $, jQuery, GM_getValue, GM_setValue, MutationObserver */
    var options = {
            /* Number of comments to display */
            topComments: 3,
            /* Sortings available: top, best, new, hot, controversial, old */
            commentSorting: "top",
            /* Show comments at the top of items */
            commentsAtTop: false,
            /* Don't show (pinned) comments from following users */
            skipCommentsFrom: ["AutoModerator", "WholesomeBot", "PoliticalHumorBot", "SavageAxeBot", "movieDetailsModBot", "WritingPromptsRobot"],
            /* Disable sidebar button in menu bar */
            disableSidebarButton: false,
            /* Disable autoload buttons in menu bar */
            disableAutoloadButton: false,
            /* Disable RES keyboard shortcut 't' to show/hide comments */
            disableShortCut: false
        },
        helper = {
            const: {
                ID_REGEX: /\/comments\/([^/]+)/g
            },
            prefix: {
                item: "item-",
                id: "toplink-",
                box: "commentpreview-"
            },
            layout: {
                prefix: "layoutSwitch--",
                0: "card",
                1: "classic",
                2: "compact",
                active: ""
            },
            findLayout: function () {
                var i, j, colors = [],
                    counts = {};

                for (i = 0; i <= 2; i += 1) {
                    colors.push($("#" + helper.layout.prefix + helper.layout[i]).find("svg").css("fill"));
                }

                $.each(colors, function (value) {
                    if (!counts.hasOwnProperty(value)) {
                        counts[value] = 1;
                    } else {
                        counts[value] += 1;
                    }
                });

                for (j in counts) {
                    if (counts[j] === 1) {
                        for (i = 0; i <= 2; i += 1) {
                            if (colors[i] === j) {
                                helper.layout.active = helper.layout[i];
                                break;
                            }
                        }
                    }
                }
            },
            toggleView: function (className) {
                (function (style) {
                    style.display = style.display === "none" ? "" : "none";
                }(document.querySelector(className).style));
            }
        },
        design = {
            active: "new",
            new: {
                style: [
                    ".aubox a.disabled{color:#995F5F;font-weight:400} .aubox a.enabled{color:#009D2D;font-weight:400} a#sidebarswitch{cursor:pointer}",
                    "div.topbar{padding: 0 10px 0 10px;} div.topbar span{padding: 0 0 0 5px;} div.commentbox hr { border-color: #777; opacity: 0.2; }",
                    "div.commentbox{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;border-radius:5px;border:1px solid;white-space:normal;padding:5px;margin:8px 0}",
                    "div.commentbox .md{border:1px solid rgb(120,120,120,0.4);-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;margin:3px 0;box-sizing:border-box;padding:2px 8px}",
                    ".loaderror:before{content:' loading failed ';color:red} .loading:before{content:'Loading...'} .loading{color:rgb(79, 188, 255)} .res-nightmode .loaderror:before{content:' loading failed ';color:#E63A3A}",
                    "div.commentbox .md *{white-space:normal} div.commentbox .md code{white-space:pre} div.commentbox .md pre{overflow:visible} div.commentbox>*{font-size:small}",
                    "div.commentbox .ulink,div.commentbox .md a{font-weight:700} .listing-page .buttons li{vertical-align:top} .toplink{color:#FF4500!important;text-decoration:none;height: 14px; padding: 0 4px 0 4px;}",
                    ".permalink{float:right;color:#666;margin-left:.5em} .points{font-weight:700;margin-left:.5em}"
                ].join(""),
                items_selector: ".scrollerItem",
                menubar_element: "<div>",
                menubar_parent: $("#view--layout--FUE").parent(),
                expando_button: ".icon-expandoArrowExpand",
                comment_link: "a[data-click-id=comments]"

            },
            old: {
                style: [
                    ".aubox a.disabled{color:#995F5F;font-weight:400} .aubox a.enabled{color:#009D2D;font-weight:400} a#sidebarswitch{cursor:pointer}",
                    "div.commentbox{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;background:#fff;border-radius:5px;border:1px solid #dbdbdb;white-space:normal;padding:5px;display:inline-block;margin:8px 0}",
                    "div.commentbox .md{border:1px solid #ddd;background:#f0f0f0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;margin:3px 0;box-sizing:border-box;padding:2px 8px}",
                    ".loaderror:before{content:\" loading failed \";color:red} .loading:before{content:\"Loading...\"} .res-nightmode .loaderror:before{content:\" loading failed \";color:#E63A3A}",
                    "div.commentbox .md *{white-space:normal} div.commentbox .md code{white-space:pre} div.commentbox .md pre{overflow:visible} div.commentbox>*{font-size:small}",
                    "div.commentbox .ulink,div.commentbox .md a{font-weight:700;color:#369!important} .listing-page .buttons li{vertical-align:top} .toplink{color:#FF4500!important;text-decoration:none;margin-left:10px!important;}",
                    ".permalink{float:right;color:#666;margin-left:.5em} .points{color:#333;font-weight:700;margin-left:.5em}",
                    ".res-nightmode div.commentbox pre,.res-nightmode div.commentbox code,.res-nightmode .link .md pre{border:1px solid #222!important;background:#282828!important;background-color:#282828!important}",
                    ".res-nightmode div.commentbox .ulink,.res-nightmode div.commentbox .md a{color:#1496dc!important} .res-nightmode div.commentbox{background:#333!important;border-color:#666!important}",
                    ".res-nightmode div.commentbox .md{background:#555!important;border-color:#222!important} .res-nightmode .toplink{color:#eee!important}",
                    ".res-nightmode div.commentbox .points{color:#ddd!important} .res-nightmode div.commentbox .permalink{color:#ccc!important}",
                    ".res-nightmode div.commentbox .md blockquote, .res-nightmode div.commentbox .md del{color:#8C8C8C!important} .res-nightmode div.commentbox hr{border-color:#777!important};}",
                    ".res-nightmode div.commentbox hr{border-color:#777!important;}"
                ].join(""),
                items_selector: "div.entry",
                menubar_element: "<li>",
                menubar_parent: $(".tabmenu"),
                expando_button: ".res-show-images a",
                comment_link: "a:contains(comments)"
            }
        },
        addStyle = function () {
            var style = $("<style>", {
                type: "text/css",
                html: design[design.active].style
            });
            $("head").append(style);
        },
        retrieveTopComments = function (toplink) {
            var id = $(toplink).attr("id").replace(new RegExp("^" + helper.prefix.id), ""),
                item = $("#" + helper.prefix.item + id),
                comment_box = $("#" + helper.prefix.box + id),
                url = "//" + document.domain + "/comments/" + id + "/.json";

            if (comment_box.length === 0) {
                comment_box = $("<div>", {
                    "class": "commentbox loading",
                    "id": helper.prefix.box + id
                });

                if (options.commentsAtTop) {
                    if (design.active === "new") {
                        if (helper.layout.active === "card") {
                            item.children().last().children().first().next().after(comment_box);
                        } else if (helper.layout.active === "classic") {
                            item.children().last().children().first().after(comment_box);
                        } else {
                            item.first().children().first().after(comment_box);
                        }
                    } else {
                        item.find(".top-matter").after(comment_box);
                    }
                } else {
                    item.append(comment_box);
                }
            }
            if (comment_box.hasClass("loading")) {
                $.get(url, {
                        limit: options.topComments + 5, // + 5 in case we delete some pinned comments
                        sort: options.commentSorting
                    }, function (data) {
                        var i, newHTML = "",
                            comments_count = data[1].data.children.length,
                            threadLink = data[0].data.children[0].data.permalink,
                            comments_max = options.topComments < comments_count ? options.topComments : comments_count;
                        if (comments_count === 0) {
                            comment_box.remove();
                        } else if (comment_box !== null && comment_box.hasClass("loading")) {
                            comment_box.html("");
                            for (i = 0; i < comments_max; i += 1) {
                                if (options.skipCommentsFrom.indexOf(data[1].data.children[i].data.author) !== -1) {
                                    comments_max += 1;
                                } else {
                                    newHTML += (newHTML === "" ? "" : "<hr>");

                                    newHTML += $("<a>", {
                                        class: "ulink",
                                        target: "_blank",
                                        href: "/u/" + data[1].data.children[i].data.author,
                                        html: data[1].data.children[i].data.author
                                    })[0].outerHTML;

                                    newHTML += $("<span>", {
                                        class: "points",
                                        html: "| score: " + data[1].data.children[i].data.score
                                    })[0].outerHTML;

                                    newHTML += $("<a>", {
                                        class: "permalink",
                                        target: "_blank",
                                        href: threadLink + data[1].data.children[i].data.id,
                                        html: "permalink"
                                    })[0].outerHTML;
                                    newHTML += "<br />" + $($.parseHTML(data[1].data.children[i].data.body_html)).text();
                                }
                            }
                            comment_box.removeClass("loading");
                            comment_box.html(newHTML);
                        }
                    })
                    .fail(function () {
                        var retries = 0;
                        if (comment_box.data("retries") !== undefined) {
                            retries = parseInt(comment_box.data("retries"), 10);
                        }
                        comment_box.data("retries", retries + 1);
                        if (retries > 5) {
                            comment_box.removeClass("loading");
                            comment_box.addClass("loaderror");
                            comment_box.data("retries", 0);
                        } else {
                            setTimeout(retrieveTopComments(toplink), 2000);
                        }
                    }, "json");
            } else {
                comment_box.remove();
            }
        },
        addTopLinks = function (items) {
            var java = "java";
            if (items === undefined) {
                return;
            }
            items.each(function () {
                var link, result, comment_id, toplink,
                    comment_link = $(this).find(design[design.active].comment_link);
                if (comment_link.length === 0) {
                    return;
                }
                link = comment_link.attr("href");
                if (!link) {
                    console.log("No link found " + comment_link);
                    return;
                }
                result = new RegExp(helper.const.ID_REGEX).exec(link);
                if (!Array.isArray(result) || result.length < 2) {
                    console.log("Id not found in link: '" + link + "'");
                    return;
                }
                comment_id = result[1];
                $(this).attr("id", helper.prefix.item + comment_id);
                toplink = $("<a>", {
                    "class": "toplink",
                    "id": helper.prefix.id + comment_id,
                    "href": java + "script:;",
                    "html": options.commentSorting
                }).click(function () {
                    retrieveTopComments(this);
                });
                comment_link.after(toplink);
                if (GM_getValue("autoLoadComments", false)) {
                    retrieveTopComments(toplink);
                }
            });
        };
    $(function () {
        var sidebar, loadbar, spanImages, spanComments,
            sidebar_view = "hide",
            buttonStatus = "disabled";

        design.active = $(".scrollerItem").length > 0 ? "new" : "old";

        addStyle();

        if (design.active === "new") {
            helper.findLayout();
        }

        addTopLinks($(design[design.active].items_selector));

        // Menu button show/hide sidebar
        if (!options.disableSidebarButton && document.location.pathname.indexOf("/comments/") === -1) {
            if (design.active === "new") {
                $('div a[href="/submit"]').last().parent().parent().parent().addClass("side");
            }

            if (GM_getValue("sideBarToggle", true)) {
                sidebar_view = "show";
                helper.toggleView(".side");
            }

            sidebar = $(design[design.active].menubar_element, {
                html: $("<a>", {
                    id: "sidebarswitch",
                    html: sidebar_view + " sidebar"
                })
            }).click(function () {
                GM_setValue("sideBarToggle", !GM_getValue("sideBarToggle", true));
                sidebar_view = "hide";
                if (GM_getValue("sideBarToggle", true)) {
                    sidebar_view = "show";
                }
                $(this).find("a").html(sidebar_view + " sidebar");
                helper.toggleView(".side");
            });

            design[design.active].menubar_parent.append(sidebar);
        } else {
            GM_setValue("sideBarToggle", false);
        }

        // Menu button auto-load media and comments
        if (!options.disableAutoloadButton && document.location.pathname.indexOf("/comments/") === -1) {
            loadbar = $(design[design.active].menubar_element, {
                class: "aubox topbar",
                html: $("<a>", {
                    html: "show"
                })
            });
            if ($("#RESConsoleVersion").length > 0) {
                if (GM_getValue("autoExpandMedia", false)) {
                    buttonStatus = "enabled";
                }
                spanImages = $("<span>", {
                    html: $("<a>", {
                        href: "#",
                        class: buttonStatus,
                        html: "media"
                    })
                }).click(function () {
                    GM_setValue("autoExpandMedia", !GM_getValue("autoExpandMedia", false));
                    location.reload();
                });
                loadbar.append(spanImages);
            }

            buttonStatus = "disabled";
            if (GM_getValue("autoLoadComments", false)) {
                buttonStatus = "enabled";
            }
            spanComments = $("<span>", {
                html: $("<a>", {
                    href: "#",
                    class: buttonStatus,
                    html: "comments"
                })
            }).click(function () {
                GM_setValue("autoLoadComments", !GM_getValue("autoLoadComments", false));
                location.reload();
            });

            loadbar.append(spanComments);
            design[design.active].menubar_parent.append(loadbar);
        } else if (options.disableAutoloadButton) {
            GM_setValue("autoExpandMedia", false);
            GM_setValue("autoLoadComments", false);
        }

        // Get style from other menu button for new design
        if (design.active === "new") {
            $("#view--layout--FUE").children().each(function () {
                if ($(this).text() === "View") {
                    this.classList.forEach(function (cl) {
                        if (!/.+-.+/.test(cl)) {
                            loadbar.addClass(cl);
                            sidebar.addClass(cl);
                        }
                    });
                }
            });
        }

        // Auto expand images etc
        if (GM_getValue("autoExpandMedia", false)) {
            if (design.active === "new") {
                $(design[design.active].expando_button).click();
            } else {
                document.querySelector(design[design.active].expando_button).click();
            }
        }

        // Listener for layout change
        if (design.active === "new") {
            $("[id^=" + helper.layout.prefix + "]").click(function () {
                setTimeout(function () {
                    helper.findLayout();
                    addTopLinks($(design[design.active].items_selector));
                }, 100);
            });
        }

        // Listener for newly added items
        $("body").change(function (changes) {
            $.each(changes, function (i, l) {
                var item = $(l.addedNodes).find(design[design.active].items_selector);
                if (item.length > 0) {
                    addTopLinks(item);
                }
            });
        });

        // Listener for key 't' to toggle comments
        if (!options.disableShortCut && $("#RESConsoleVersion").length > 0) {
            $("window").keyup(function (e) {
                if (e.keyCode === 84 && $(".RES-keyNav-activeElement").length > 0) { //T: keycode 84
                    $(".RES-keyNav-activeElement .toplink").click();
                }
            });
        }
    });

    // A minimal jQuery library for reacting to innerHTML changes - https://jsfiddle.net/ecmanaut/jRbEz
    $.fn.change = function (cb, e) {
        e = e || {
            subtree: true,
            childList: true,
            characterData: true
        };
        $(this).each(function () {
            var node = this;

            function callback(changes) {
                cb.call(node, changes, this);
            }
            (new MutationObserver(callback)).observe(node, e);
        });
    };
}(jQuery));