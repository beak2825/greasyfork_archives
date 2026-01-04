// ==UserScript==
// @name         爱卡黑名单
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在爱卡论坛中隐藏某些作者的帖子或者评论
// @author       Junnnnne
// @match        https://*.xcar.com.cn/bbs/*
// @grant        GM_addStyle
// @icon64       data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjMzMzMzMzIiBzdHJva2U9IiNiYmJiYmIiIGQ9Ik00NSwzQzU3LDMsNjcsMTMsNjcsMjVDNjcsMzMsNjMsNDAsNTYsNDRDNTksNDUsNjIsNDcsNjQsNDlDNTEsNTEsNDIsNjMsNDIsNzZDNDIsODEsNDMsODYsNDYsOTBMMTIsOTBDMTEsOTAsOSw4OSw5LDg3QzEwLDY3LDIwLDUwLDM0LDQ0QzI3LDQwLDIzLDMzLDIzLDI1QzIzLDEzLDMzLDMsNDUsM3oiLz48cGF0aCBmaWxsPSIjYzgzMjMyIiBkPSJNNzAsNTVDODIsNTUsOTIsNjUsOTIsNzdDOTIsODksODIsOTksNzAsOTlDNTgsOTksNDgsODksNDgsNzdDNDgsNjUsNTgsNTUsNzAsNTV6TTgzLDg2Qzg1LDg0LDg2LDgwLDg2LDc3Qzg2LDY4LDc5LDYxLDcwLDYxQzY3LDYxLDYzLDYyLDYxLDY0TDgzLDg2ek01Nyw2OEM1NSw3MCw1NCw3NCw1NCw3N0M1NCw4Niw2MSw5Myw3MCw5M0M3Myw5Myw3Nyw5Miw3OSw5MEw1Nyw2OHoiLz48L3N2Zz4=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525094/%E7%88%B1%E5%8D%A1%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/525094/%E7%88%B1%E5%8D%A1%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .blacklist-icon {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjMzMzMzMzIiBzdHJva2U9IiNiYmJiYmIiIGQ9Ik00NSwzQzU3LDMsNjcsMTMsNjcsMjVDNjcsMzMsNjMsNDAsNTYsNDRDNTksNDUsNjIsNDcsNjQsNDlDNTEsNTEsNDIsNjMsNDIsNzZDNDIsODEsNDMsODYsNDYsOTBMMTIsOTBDMTEsOTAsOSw4OSw5LDg3QzEwLDY3LDIwLDUwLDM0LDQ0QzI3LDQwLDIzLDMzLDIzLDI1QzIzLDEzLDMzLDMsNDUsM3oiLz48cGF0aCBmaWxsPSIjYzgzMjMyIiBkPSJNNzAsNTVDODIsNTUsOTIsNjUsOTIsNzdDOTIsODksODIsOTksNzAsOTlDNTgsOTksNDgsODksNDgsNzdDNDgsNjUsNTgsNTUsNzAsNTV6TTgzLDg2Qzg1LDg0LDg2LDgwLDg2LDc3Qzg2LDY4LDc5LDYxLDcwLDYxQzY3LDYxLDYzLDYyLDYxLDY0TDgzLDg2ek01Nyw2OEM1NSw3MCw1NCw3NCw1NCw3N0M1NCw4Niw2MSw5Myw3MCw5M0M3Myw5Myw3Nyw5Miw3OSw5MEw1Nyw2OHoiLz48L3N2Zz4=) !important;
            background-color: unset;
        }

        .blacklist-icon-notshown {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjQ5NGQiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTQ0Ljg5NjYsNUM1NS44NjIxLDUsNjUsMTQuNDgyOCw2NSwyNS44NjIxQzY1LDMzLjQ0ODMsNjIuODAxOSwzOC4xOTUsNTYsNDNDNTguNTIxOCw0NC4xNjYsNjAuMTE1NSw0NS40MjUyLDYxLDQ3QzQ5LjEyMDcsNDguODk2NiwzOS43MDIsNjEuNjE0OSwzOSw3NEMzOC43MzE3LDc4LjczMzgsMzkuMTQ1Niw4My4xNjg5LDQxLDg3TDE0Ljc0MTQsODcuNUMxMy44Mjc2LDg3LjUsMTIsODYuNTUxNywxMiw4NC42NTUyQzEyLjkxMzgsNjUuNjg5NywxNy4yMzIyLDU1LjQ4MjQsMzQsNDRDMjguNDIyNywzOS41OTUsMjQuNzkzMSwzMy40NDgzLDI0Ljc5MzEsMjUuODYyMUMyNC43OTMxLDE0LjQ4MjgsMzMuOTMxLDUsNDQuODk2Niw1eiIvPjxlbGxpcHNlIGN4PSI3MCIgY3k9Ijc3IiByeD0iMTkiIHJ5PSIxOSIvPjxwYXRoIGQ9Ik01Niw2M0w4NCw5MSIvPjwvc3ZnPg==) !important;
            background-color: unset;
        }

        .blacklist-placeholder {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGRkZGRkIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTI1LDEyTDI1LDZMMjQsNUw0LDVMMyw2TDMsMjNMNCwyNEwxNCwyNE03LDEwTDE2LDEwTTcsMTRMMTIsMTRNNywxOEwxMiwxOE0yMiwxNEMyNS4zMTM3LDE0LDI4LDE2LjY4NjMsMjgsMjBDMjgsMjMuMzEzNywyNS4zMTM3LDI2LDIyLDI2QzE4LjY4NjMsMjYsMTYsMjMuMzEzNywxNiwyMEMxNiwxNi42ODYzLDE4LjY4NjMsMTQsMjIsMTR6TTE4LDE3TDI2LDIzIi8+PC9zdmc+);
        }

        .blacklist-unknownicon {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAjhJREFUSEvtlr+vAUEQx1dCQqFQkFAoFAoKhUJBofBnKxQahUJBoVCSUJCQUEju5bN5I3tr73b9SF7zJrmcuN39zHdmdnYzURRF6g8s8w/2Rf18PqvD4fAYls1mVblcVoVCwTc19j041Pf7XS0WC3U8Hp2AWq2mms2mwpEQCwIDnc/nCrVpViwWVbfbDYIHgZfLpdrtdg9mtVp9hBanttut4o3V63Wt3GdeMAtOJhO9DmFEEcpMMyPCmOFw6OMqLxg1q9VKL9Tr9TRUVOZyOV1YwEjDbDbT4zqdjv4/zbzgzWajeAACxsi3FBkAQNh4PNbvRqOhn4/AVDLbp1Qq6TCbylg4n8+rwWAQA1MD7Xb7M7CoI5xsGZRKdZs5xzmcxMTJtxVfr1edN6lYcyFC32q1dApwBAdlHA6RlrSmkppjya/Lcyk0s/jMcWwptlaSpYLtfJqLjEajp0Izv/f7/fcVsxA5JYy2oYgw298IM1VOnt/OsUyUyk5d6fdjSEUz1LuPGeQqHunJZvGFFJU4HwS24a5m8go0WLF4aXYsKhYYlY+FhvhlxUwwwXa+Q0+ll8F2nm0w6mmdX70I0CTW67Wzg5kO0Kk4HAi7zxKLC9jpdFL7/d4LdKlnH1cqlUQnnsA0DPatqz/7VLi+J10eYmBg0+n0a1BxxJX/GDipPb6j1J5DwzHbaAycdhp9CrdPK2eOUS4H/ie5RqH5mM57WyaXgcvlovs1v2+3m1M8eaSVchXibd9E7Uk/sN2vthPbI3cAAAAASUVORK5CYII=);
        }

        .blacklist-button-add {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M4MzIzMiI+PGVsbGlwc2UgY3g9IjQiIGN5PSI0IiByeD0iMyIgcnk9IjMiLz48cGF0aCBkPSJNMiwyTDYsNiIvPjwvc3ZnPg==);
            background-color: unset;
            border: none;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .MobileForumPage {
            margin-top: 10px;
            margin-left: 6px;
        }

        .MobileThreadPage {
            transform: translateY(25%);
            margin-left: 6px;
        }

        .ClassicForumPage {
            transform: translateY(20%);
            margin-left: 10px;
        }

        .ClassicThreadPage {
            float: right;
        }

        .NewStyleForumPage {
            float: left;
            transform: translateY(25%);
            margin-right: 10px;
        }

        .NewStyleThreadPage {
            transform: translateY(25%);
            margin-left: 10px;
        }

        a#blacklist_menuitem.show span {
            color: black;
            font-weight: bold;
        }

        a#blacklist_addbutton.show {
            color: black;
            font-weight: bold;
        }

        .blacklist-align-content-center {
            align-content: center;
        }

        .blacklist-pointer-events-none {
            pointer-events: none;
        }

        div#blacklist-panel {
            position: fixed;
            top: 50px;
            width: 300px;
            background: #FFFFFF;
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            z-index: 9999;

            a {
                display: flex;
                text-decoration: none;
                color: #181818;
                align-items: center;
                margin-right: auto;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            button {
                cursor: pointer;
            }

            button.remove {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDgxZTA2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIsNkwyMiw2TTcsNkw3LDRMOCwzTDE2LDNMMTcsNEwxNyw0TDE3LDZNNSw5TDUsMjBMNywyMkwxNywyMkwxOSwyMEwxOSw5TTEwLDEwTDEwLDE5TTE0LDEwTDE0LDE5Ii8+PC9zdmc+);
            }

            a:hover {
                color: #08f;
            }

            h2 {
                display: flex;
                align-items: center;
                font-size: 16px;
                font-weight: bold;
                background: #1cb6f8;
                box-sizing: border-box;
                height: 30px;
                margin: 0px;
                padding: 5px;
                cursor: move;

                .button {
                    width: 20px;
                    height: 20px;
                    padding: 0px;
                    margin: 4px;
                    background: none;
                    border: none;

                    svg path {
                        stroke: white;
                        stroke-width: 2px;
                    }

                    #close {
                        margin-left: 10px;
                    }
                }

                .button:hover svg path {
                    stroke-width: 3px;
                }

                .on svg path {
                    stroke: orange;
                }
            }

            ul {
                list-style: none;
                font-size: 14px;
                margin: 2px;
                padding: 4px;
                height: inherit;
                min-height: 100px;
                max-height: 200px;
                overflow-y: auto;

                li {
                    display: flex;
                    align-items: center;
                    padding: 1px 1px;

                    img {
                        width: 30px;
                        height: 30px;
                        border: 1px solid lightgray;
                        border-radius: 50%;
                    }

                    span {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin: 0px 6px;
                    }

                    span.count {
                        FONT-WEIGHT: 800;
                        font-size: 12px;
                        text-align: center;
                        color: white;
                        background-color: lightgray;
                        border-radius: 5px;
                        min-width: 12px;
                        margin-right: 8px;
                        padding: 0px 2px;
                        cursor: default;
                    }

                    button {
                        width: 18px;
                        min-width: 18px;
                        height: 18px;
                        padding: 0px;
                        border: none;
                        background: none;
                    }

                    button:hover svg path {
                        stroke-width: 3px;
                    }
                }

                li:hover {
                    background-color: lightgray;
                }

                li.disable {
                    a span {
                        color: darkgray;
                    }

                    a span:hover {
                        color: #08f;
                    }

                    button {
                        cursor: default;
                        pointer-events: none;
                        mix-blend-mode: luminosity;
                        opacity: 30%;
                    }
                }
            }

            ul::-webkit-scrollbar {
                width: 9px;
                height: 9px;
            }

            ul::-webkit-scrollbar-track {
                background-color: #ccc;
            }

            ul::-webkit-scrollbar-thumb {
                background-color: #999;
                border-radius: 2em;
            }

            ul::-webkit-scrollbar-thumb:hover {
                background-color: #fff;
            }

            ul#allAuthors {
                display: none;
            }
        }

        div.blacklist-placeholder {
            width: 30px;
            height: 30px;
            justify-self: center;
        }

        div.activity_three_picture div.blacklist-placeholder {
            margin-bottom: .12rem;
        }
    `);


    class Page {
        static postItemSelector;
        static authorItemSelector;
        static openAuthorHrefInNewWindow;
        static addButtonAfterItemSelector = null;
        static createBlacklistMenuItemWithOnClick(onClick) {}
        static needExcludePostItem($postItem) {return false;}
        static authorIDFromItem($authorItem) {return null;}
        static authorNameFromItem($authorItem) {return null;}
        static authorIconFromItem($authorItem) {return null;}
        static postIDFromItem($postItem) {return null;}

        static idFromHref(href) {
            return Number(substrByMarker(href, "id=", null));
        }

        static authorIconFromHref(href) {
            return (href ? substrByMarker(href, "/my/", ".jpg").split('_')[0] : null);
        }

        static authorHrefOfID(uid) {
            return `//my.xcar.com.cn/space.php?uid=${uid}`;
        }

        static showPostItem($postItem, show) {
            if (show) {
                $postItem.find("div.blacklist-placeholder").remove();
                $postItem.children().show();
            } else {
                $postItem.children().hide();
                $postItem.append($("<div>").addClass("blacklist-placeholder"));
            }
        }

        static observeMutation(onAddedPostItem) {}
    }

    class MobilePage extends Page {
        static mutationObserverSelector;

        static openAuthorHrefInNewWindow = false;

        static createBlacklistMenuItemWithOnClick(onClick) {
            $("div.menu-wrapper>section.tools.clearfix").children().last().after(`
                <div class="item">
                    <a id="blacklist_menuitem" href>
                        <span class="tag blacklist-panel-status" style="transform:scale(0.8);"></span>
                        <span class="txt">黑名单</span>
                    </a>
                </div>
            `);
            $('a#blacklist_menuitem').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                $("a.menu>em").first().click();
                onClick();
            });
        }

        static authorIDFromItem($authorItem) {
            let href = $authorItem.attr("href");
            return Number(substrByMarker(href, "/author/", ".html"));
        }

        static authorHrefOfID(uid) {
            return `//a.xcar.com.cn/aikahao/author/${uid}.html`;
        }

        static observeMutation(onAddedPostItem) {
            let $target = $(this.mutationObserverSelector);
            if ($target.length > 0) {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        $(mutation.addedNodes).each(function(){
                            onAddedPostItem($(this[0]));
                        });
                    });
                });
                observer.observe($target[0], {childList: true});
            }
        }
    }

    class ClassicPage extends Page {
        static openAuthorHrefInNewWindow = true;
        static mutationObserverSelector = null;

        static createBlacklistMenuItemWithOnClick(onClick) {
            $("div.muser.menubox>div.muser_show>a").last().before(`
                <a id="blacklist_menuitem" href>
                    <span class="blacklist-panel-status" style="background-size: 16px 16px; background-position: left; background-position-x: 12px;">黑&ensp;名&ensp;单</span>
                </a>
            `);
            $('a#blacklist_menuitem').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                $("div.muser.menubox").removeClass("hover");
                onClick();
            });
        }
    }

    class NewStylePage extends Page {
        static openAuthorHrefInNewWindow = true;

        static createBlacklistMenuItemWithOnClick(onClick) {
            $(".muser_show>.xlogined>a>i.icon-signoutx2").parent().before(`
                <a id="blacklist_menuitem" href>
                    <i class="blacklist-panel-status" style="width:16px; height:16px;"></i>
                    <span>黑&ensp;名&ensp;单</span>
                </a>
            `);
            $('a#blacklist_menuitem').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                $("a.menu>em").first().click();
                $("div#xlogininfo").removeClass("hover");
                onClick();
            });
        }
    }

    class MobileForumPage extends MobilePage {
        static postItemSelector = "div.activity_content>div.activity_three_picture";
        static authorItemSelector = "div>a.lazy-face";
        static mutationObserverSelector = "div.activity_content";

        static authorNameFromItem($authorItem) {
            return $authorItem.parent().find("span.go_author").text();
        }

        static authorIconFromItem($authorItem) {
            return this.authorIconFromHref($authorItem.attr("data-original"));
        }

        static postIDFromItem($postItem) {
            return Number(substrByMarker($postItem.attr("data-godetails"), "thread-", ".html").split("-")[0]);
        }

        static createBlacklistMenuItemWithOnClick(onClick) {
            super.createBlacklistMenuItemWithOnClick(onClick);

            $("div.post_interaction>div.post_interaction_tab").css("display", "flex");
            let $rightdiv = $("div.post_interaction_tab>div.follow_tpl.post-btn-wrap.row");
            $rightdiv.css("min-width", "fit-content");
            $rightdiv.children().first().before(`
                <a id="blacklist_addbutton" href style="margin-right: 6px; margin-left: 6px;">黑名单</a>
            `);
            $('a#blacklist_addbutton').click(function(event) {
                event.preventDefault();
                onClick();
            });
        }

        static showPostItem($postItem, show) {
            super.showPostItem($postItem, show);
            if (show) {
                $postItem.removeClass("blacklist-pointer-events-none");
            } else {
                $postItem.addClass("blacklist-pointer-events-none");
            }
        }
    }

    class MobileThreadPage extends MobilePage {
        static postItemSelector = "div.list_box>ul>li";
        static authorItemSelector = "div.post_top>a";
        static mutationObserverSelector = "div.list_box>ul";

        static authorNameFromItem($authorItem) {
            return $authorItem.find("em.username").text();
        }

        static authorIconFromItem($authorItem) {
            return this.authorIconFromHref($authorItem.find("span>img").attr("src"));
        }

        static postIDFromItem($postItem) {
            return Number($postItem.attr("pid"));
        }

        static createBlacklistMenuItemWithOnClick(onClick) {
            super.createBlacklistMenuItemWithOnClick(onClick);

            $("div.footer_replay>ul>li.replay_footer_btn").css("width", "auto");
            let $li = $(`
                <li style="height: 24px; margin-left:.31rem">
                  <span class="blacklist-panel-status" style="width:24px; height:24px;"></span>
                </li>
            `);
            $("div.footer_replay>ul").append($li);
            $li.find('span.blacklist-panel-status').click(function(event) {
                event.preventDefault();
                onClick();
            });
        }
    }

    class ClassicForumPage extends ClassicPage {
        static postItemSelector = "div.post-list>div.table-section>dl.list_dl:not(.table_head)";
        static authorItemSelector = "dd.pub_dd>a.linkblack";

        static authorIDFromItem($authorItem) {
            return this.idFromHref($authorItem.attr("href"));
        }

        static authorNameFromItem($authorItem) {
            return $authorItem.text();
        }

        static authorIconFromItem($authorItem) {
            return null;
        }

        static postIDFromItem($postItem) {
            return this.idFromHref($postItem.find("dt>p.thenomal>a.titlink").attr("href"));
        }

        static showPostItem($postItem, show) {
            super.showPostItem($postItem, show);
            if (show) {
                $postItem.removeClass("blacklist-align-content-center");
            } else {
                $postItem.addClass("blacklist-align-content-center");
            }
        }
    }

    class ClassicThreadPage extends ClassicPage {
        static postItemSelector = "form#delpost>div.main.item";
        static authorItemSelector = "table.mainbox>tbody>tr>td.sidebar>div.userside>div.user_info";
        static addButtonAfterItemSelector = "table.mainbox>tbody>tr>td.sidebar>div.userside>div.otherinfo>p.star>img:last";

        static needExcludePostItem($postItem) {
            return ($postItem.find("table.mainbox>tbody>tr>td.side_content>div.mainwrap>span.t_title1").length > 0);
        }

        static authorIDFromItem($authorItem) {
            return this.idFromHref($authorItem.find("p.avatar>a").attr("href"));
        }

        static authorNameFromItem($authorItem) {
            return $authorItem.find("p.name>a").text();
        }

        static authorIconFromItem($authorItem) {
            return this.authorIconFromHref($authorItem.find("p.avatar>a>img").attr("src"));
        }

        static postIDFromItem($postItem) {
            return Number(substrByMarker($postItem.find(">a").attr("name"), "pid", null));
        }
    }

    class NewStyleForumPage extends NewStylePage {
        static postItemSelector = "ul.topic_list_item>li.default_item";
        static authorItemSelector = "div.user_item>a.user_photo";

        static authorIDFromItem($authorItem) {
            return this.idFromHref($authorItem.attr("href"));
        }

        static authorNameFromItem($authorItem) {
            return $authorItem.find("span.user_name").text();
        }

        static authorIconFromItem($authorItem) {
            return this.authorIconFromHref($authorItem.find("img").attr("src"));
        }

        static postIDFromItem($postItem) {
            return this.idFromHref($postItem.find("dl.article_item>dt>a").attr("href"));
        }

        static createBlacklistMenuItemWithOnClick(onClick) {
            super.createBlacklistMenuItemWithOnClick(onClick);

            $("ul#navItem").append(`
                <li style="float: right;">
                  <a id="blacklist_addbutton" href style="font-size: 16px; margin-right: 30px; margin-left: 10px;">黑名单</a>
                </li>
            `);
            $("div#fixNav>div.nav_item>ul").append(`
                <li style="float: right;">
                  <a id="blacklist_addbutton" href style="font-size: 16px; margin-right: 20px; margin-left: 10px;">黑名单</a>
                </li>
            `);
            $('a#blacklist_addbutton').click(function(event) {
                event.preventDefault();
                onClick();
            });
        }

        static observeMutation(onAddedPostItem) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    $(mutation.addedNodes).filter("li.default_item").each(function(){
                        onAddedPostItem($(this));
                    });
                });
            });
            observer.observe($("ul#listForum.topic_list_item")[0], {childList: true});
        }
    }

    class NewStyleThreadPage extends NewStylePage {
        static postItemSelector = "div.comment_all>div.comment_txt_box";
        static authorItemSelector = "div.comment_author>div.author_div_user";

        static authorIDFromItem($authorItem) {
            return this.idFromHref($authorItem.find("a.comment_author_username").attr("href"));
        }

        static authorNameFromItem($authorItem) {
            return $authorItem.find("a.comment_author_username").text();
        }

        static authorIconFromItem($authorItem) {
            return this.authorIconFromHref($authorItem.find("a.comment_author_img>img").attr("src"));
        }

        static postIDFromItem($postItem) {
            return Number($postItem.find("div.jb_hover").attr("data_pid"));
        }

        static showPostItem($postItem, show) {
            super.showPostItem($postItem, show);
            if (show == false) {
                $postItem.find("div.comment_line").show();
            }
        }

        static observeMutation(onAddedPostItem) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    $(mutation.addedNodes).filter("div.comment_txt").find("div#comment_all>div.comment_txt_box").each(function(){
                        onAddedPostItem($(this));
                    });

                    var observerAgain = new MutationObserver(function(mutations) {
                        $(mutation.addedNodes).filter("div.comment_txt").find("div#comment_all>div.comment_txt_box").each(function(){
                            onAddedPostItem($(this));
                        });
                    });
                    observerAgain.observe($(mutation.addedNodes).filter("div.comment_txt").find("div#comment_all")[0], {childList: true});
                });
            });
            observer.observe($("div.details>div.floor_div>div#comment")[0], {childList: true});
        }
    }


    let forMobile = (location.hostname.split(".")[0] == "a");
    let isOldStyle = ($("div.forum-head>a.tabNewxbbxq").length > 0);
    let filename = location.pathname.split("/")[2];
    let pageClass;
    if (forMobile) {
        switch (filename.split("-")[0]) {
            case "forum":
            case "digest":
                pageClass = MobileForumPage;
                break;
            case "thread":
                pageClass = MobileThreadPage;
                break;
            default:
                return;
        }
    } else {
        if (isOldStyle) {
            switch (filename) {
                case "forumdisplay.php":
                    pageClass = ClassicForumPage;
                    break;
                case "viewthread.php":
                    pageClass = ClassicThreadPage;
                    break;
                default:
                    return;
            }
        } else {
            switch (filename) {
                case "forumdisplay.php":
                    pageClass = NewStyleForumPage;
                    break;
                case "viewthread.php":
                    pageClass = NewStyleThreadPage;
                    break;
                default:
                    return;
            }
        }
    }

    $('body').append($(`
        <div id="blacklist-panel" style="display: none;">
            <h2>
                <span class="blacklist-icon" style="width:24px; height:24px;"></span>
                <span style="color: #363636; margin-left: 2px; margin-right: auto;">黑名单</span>
                <button type="button" id="close" class="button">
                    <svg viewBox="0 0 20 20">
                        <path d="M3,3L17,17M17,3L3,17" />
                    </svg>
                </button>
            </h2>
            <ul id="blacklist">
            </ul>
        </div>
    `));

    const MIN_REMAIN_WIDTH = 80;
    const MIN_REMAIN_HEIGHT = 30;

    let $panel = $("div#blacklist-panel");
    let $h2 = $panel.find("h2");
    let $buttonClose = $h2.find("button#close");
    let $blacklist = $panel.find("ul#blacklist");

    pageClass.createBlacklistMenuItemWithOnClick(function() {
        adjustPanelPosition();

        if ($panel.is(':visible')) {
            $buttonClose.click();
        } else {
            $('a#blacklist_menuitem').addClass("show");
            $('a#blacklist_addbutton').addClass("show");
            $('.blacklist-panel-status').removeClass("blacklist-icon-notshown");
            $('.blacklist-panel-status').addClass("blacklist-icon");
            $panel.show();
            $(pageClass.postItemSelector).each(function(){
                if (pageClass.needExcludePostItem($(this)) == false) {
                    appendAddButton($(this));
                }
            });

            localStorage.setItem("show_panel", true);
        }
    });

    let panelPosition = JSON.parse(localStorage.getItem("panel_position") || '{"top": 0, "left": 0}');
    $panel.offset(panelPosition);
    var showPanel = JSON.parse(localStorage.getItem("show_panel") || "false");
    if (showPanel) {
        $('a#blacklist_menuitem').addClass("show");
        $('a#blacklist_addbutton').addClass("show");
        $('.blacklist-panel-status').addClass("blacklist-icon");
        $panel.show();
        adjustPanelPosition();
    } else {
        $('.blacklist-panel-status').addClass("blacklist-icon-notshown");
    }

    (function() {
        var active = false;
        var initialX;
        var initialY;

        function moveBegin($target, clientX, clientY) {
            if ($target.parents("button").length == 0) {
                initialX = clientX - ($panel.position().left - $(window).scrollLeft());
                initialY = clientY - ($panel.position().top - $(window).scrollTop());
                active = true;
            }
        }

        function moving(e, clientX, clientY) {
            if (active) {
                e.preventDefault();

                var maxLeft = document.documentElement.clientWidth - MIN_REMAIN_WIDTH;
                var maxTop = document.documentElement.clientHeight - MIN_REMAIN_HEIGHT;
                var currentX = clientX - initialX;
                var currentY = clientY - initialY;
                currentX = (currentX < 0 ? 0 : currentX);
                currentX = (currentX > maxLeft ? maxLeft : currentX);
                currentY = (currentY < 0 ? 0 : currentY);
                currentY = (currentY > maxTop ? maxTop : currentY);
                $panel.css({top: currentY, left: currentX});
                localStorage.setItem("panel_position", JSON.stringify({top: currentY, left: currentX}));
            }
        }

        function moveEnd(e) {
            active = false;
        }

        $h2.on("mousedown",          function (e) { moveBegin($(e.target), e.clientX, e.clientY); });
        $(document).on("mousemove",  function (e) { moving(e, e.clientX, e.clientY); });
        $(document).on("mouseup",    moveEnd);
        $h2.on("touchstart", function (e) { moveBegin($(e.target), e.touches[0].clientX, e.touches[0].clientY); });
        $h2.on("touchmove",  function (e) { moving(e, e.touches[0].clientX, e.touches[0].clientY); });
        $h2.on("touchend",   moveEnd);
    })();

    function adjustPanelPosition() {
        if ($panel.is(':visible')) {
            var maxLeft = document.documentElement.clientWidth - MIN_REMAIN_WIDTH;
            var maxTop = document.documentElement.clientHeight - MIN_REMAIN_HEIGHT;

            var oPanel = $panel[0];
            var changed = false;

            if (oPanel.offsetTop < 0) {
                oPanel.style.top = 0 + "px";
                changed = true;
            }

            if (oPanel.offsetLeft < 0) {
                oPanel.style.left = 0 + "px";
                changed = true;
            }

            if (oPanel.offsetTop > maxLeft) {
                oPanel.style.top = maxLeft + "px";
                changed = true;
            }

            if (oPanel.offsetLeft > maxTop) {
                oPanel.style.left = maxTop + "px";
                changed = true;
            }

            if (changed) {
                localStorage.setItem("panel_position", JSON.stringify({top: oPanel.offsetTop, left: oPanel.offsetLeft}));
            }
        }
    }

    $(window).resize(adjustPanelPosition);

    let blackListDatas = JSON.parse(localStorage.getItem("blackList") || "[]");
    blackListDatas.forEach(data => {
        let $authorItem = makeAuthorItem({
            uid: data.uid,
            name: data.name,
            icon: data.icon,
            pids: null
        });
        $blacklist.append($authorItem);
    });

    let allAuthorDatas = [];

    $(pageClass.postItemSelector).each(function(){
        if (pageClass.needExcludePostItem($(this)) == false) {
            dealWithAddedPostItem($(this));
        }
    });

    $buttonClose.click(function () {
        $('a#blacklist_menuitem').removeClass("show");
        $('a#blacklist_addbutton').removeClass("show");
        $('.blacklist-panel-status').removeClass("blacklist-icon");
        $('.blacklist-panel-status').addClass("blacklist-icon-notshown");
        $panel.hide();
        $("button.blacklist-button-add").remove();
        localStorage.setItem("show_panel", false);
    });

    pageClass.observeMutation(function($addedPostItem) {
        if (pageClass.needExcludePostItem($addedPostItem) == false) {
            dealWithAddedPostItem($addedPostItem);
        }
    });

    function makeAuthorItem(data) {
        let $img = $("<img>");
        if (data.icon != null) {
            $img.attr("src", `//image1.xcarimg.com/attachments/my/${data.icon}_50.jpg`);
            $img.attr("onerror", "this.onerror=null;this.src='//image1.xcarimg.com/attachments/my/default/50.jpg'");
        } else {
            $img.addClass("blacklist-unknownicon");
        }

        let $span = $("<span>").text(data.name);

        let authorHref = pageClass.authorHrefOfID(data.uid);
        let $a = $("<a>").attr("href", authorHref);
        if (pageClass.openAuthorHrefInNewWindow) {
            $a.attr("target", "_blank");
        }
        $a.append($img).append($span);

        let $spanCount = $("<span>").addClass("count");
        if (data.pids && data.pids.size > 0) {
            $spanCount.text(data.pids.size);
            $spanCount.show();
        } else {
            $spanCount.text("");
            $spanCount.hide();
        }

        let $button = $("<button>").addClass("remove");
        $button.click(function () {
            let $li = $(this).parent();
            let uid = Number($li.attr("id").substr(1));
            $li.remove();

            let dataIndex = blackListDatas.findIndex(data => data.uid === uid);
            if (dataIndex >= 0) {
                blackListDatas.splice(dataIndex, 1);
            }
            localStorage.setItem("blackList", JSON.stringify(blackListDatas));

            $(pageClass.postItemSelector).each(function(){
                if (pageClass.needExcludePostItem($(this)) == false) {
                    let $authorItem = $(this).find(pageClass.authorItemSelector);
                    if (pageClass.authorIDFromItem($authorItem) == uid) {
                        pageClass.showPostItem($(this), true);
                    }
                }
            });
        });

        let $li = $("<li>").attr("id", `u${data.uid}`);
        $li.append($a).append($spanCount).append($button);
        return $li;
    }

    function dealWithAddedPostItem($postItem) {
        let $authorItem = $postItem.find(pageClass.authorItemSelector);
        let uid = pageClass.authorIDFromItem($authorItem);
        let name = pageClass.authorNameFromItem($authorItem);
        let icon = pageClass.authorIconFromItem($authorItem);
        let pid = pageClass.postIDFromItem($postItem);

        if ($panel.is(':visible')) {
            appendAddButton($postItem);
        }

        let itemData;
        var countChanged = false;
        let blackListData = blackListDatas.find(data => data.uid == uid);
        let matched = allAuthorDatas.find(data => data.uid == uid);
        if (matched !== undefined) {
            itemData = matched;
            if (itemData.pids.has(pid) == false) {
                itemData.pids.add(pid);
                countChanged = true;
            }
        } else {
            itemData = {
                uid: uid,
                name: name,
                icon: icon,
                pids: new Set([pid])
            };
            allAuthorDatas.push(itemData);
            countChanged = true;
        }

        if (blackListData !== undefined) {
            let $blacklistItem = $blacklist.find(`li[id='u${uid}']`);
            if (countChanged) {
                let $countItem = $blacklistItem.find("span.count");
                if (itemData.pids.size > 0) {
                    $countItem.text(itemData.pids.size);
                    $countItem.show();
                } else {
                    $countItem.hide();
                }
            }

            var changed = false;
            if (blackListData.name != name) {
                blackListData.name = name;
                changed = true;
            }
            if (icon != null && blackListData.icon != icon) {
                blackListData.icon = icon;
                changed = true;
            }
            if (changed) {
                let $newAuthorItem = makeAuthorItem(itemData);
                $blacklistItem.replaceWith($newAuthorItem);

                localStorage.setItem("blackList", JSON.stringify(blackListDatas));
            }

            pageClass.showPostItem($postItem, false);
        }
    }

    function appendAddButton($postItem) {
        let $authorItem = $postItem.find(pageClass.authorItemSelector);
        let uid = pageClass.authorIDFromItem($authorItem);
        let name = pageClass.authorNameFromItem($authorItem);
        let icon = pageClass.authorIconFromItem($authorItem);

        let $button = $("<button>").attr("type", "button").addClass("blacklist-button-add").addClass(pageClass.name);
        $button.click(function (event) {
            event.stopPropagation();

            let matched = allAuthorDatas.find(data => data.uid == uid);
            let data = {
                uid: uid,
                name: name,
                icon: icon,
                pids: (matched !== undefined ? matched.pids : null)
            };
            let $authorItem = makeAuthorItem(data);
            $blacklist.append($authorItem);
            $blacklist.animate({scrollTop:$(document).height()}, 'slow');
            $blacklist.scrollTop($(document).height());

            blackListDatas.push({
                uid: uid,
                name: name,
                icon: icon
            });

            localStorage.setItem("blackList", JSON.stringify(blackListDatas));
            $(pageClass.postItemSelector).each(function(){
                if (pageClass.needExcludePostItem($(this)) == false) {
                    let $authorItem = $(this).find(pageClass.authorItemSelector);
                    if (pageClass.authorIDFromItem($authorItem) == uid) {
                        pageClass.showPostItem($(this), false);
                    }
                }
            });

        });
        let $afterItem = (pageClass.addButtonAfterItemSelector ? $postItem.find(pageClass.addButtonAfterItemSelector) : $authorItem);
        $afterItem.after($button);
    }

    function substrByMarker(string, leftMarker, rightMarker) {
        let indexOfLeft = (leftMarker != null ? string.indexOf(leftMarker) + leftMarker.length : 0);
        let indexOfRight = (rightMarker != null ? string.indexOf(rightMarker) : string.length);
        return string.substr(indexOfLeft, indexOfRight - indexOfLeft);
    }

})();
