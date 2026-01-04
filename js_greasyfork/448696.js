// ==UserScript==
// @name         MyYs4funTools
// @namespace    http://tampermonkey.net/
// @version      1.10.0
// @description  深空之眼弥弥尔论坛签到脚本
// @author       MakoStar [https://space.bilibili.com/7709386]
// @match        *://bbs.ys4fun.com/*
// @match        *://m.bbs.ys4fun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ys4fun.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @resource     css https://wiki.biligame.com/dhmmr/index.php?title=User:7709386/MyYs4funTools.css&action=raw&ctype=text/css
// @run-at       document-end
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/463967/MyYs4funTools.user.js
// @updateURL https://update.greasyfork.org/scripts/463967/MyYs4funTools.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    'use strict';
    // 工具元素结构模板
    const ElementTemplate = class {
        constructor() {
            this.snapUpTimerList = [];
            const _userInfo = this.toolsLocalStorage({
                handle: "getItem",
                key: "userInfo",
                type: "parse"
            });

            const localData = this.toolsLocalStorage({
                handle: "getItem",
                type: "parse",
                uid: _userInfo ? _userInfo.id : ""
            });

            this.toolsDefaultStateConfig = {
                stateConfig: {
                    isGlobalDayTask: false,
                    isGlobalCheckLogin: true,
                    isGlobalCheckLogout: true,
                    isIgnoreCheckState: false,
                    isRunSignInTask: false,
                    isRunLikeTask: false,
                    isCancelLike: false,
                    isRunBrowseTask: false,
                    isRunPostedTask: false,
                    isDeletePost: false,
                    isRunCommentTask: false,
                    isRunShareTask: false,
                    isDeleteComment: false,
                    isOpenCycleCancelLike: false,
                    isPostCustomComment: false,
                    isPostCustomContent: false,
                    isDeleteMyAllPost: false,
                    isDeleteMyAllComment: false,
                    isCancelMyAllLikeState: false,
                    isResetToolsDefaultState: false,
                    isClearUserLocalData: false,
                    isOpenRandomPostCustomContentList: false,
                    isOpenRandomCustomCommentListContent: false
                },
                customContentConfig: {
                    customPostContent: {
                        id: "",
                        content: "",
                        contentJson: "",
                        title: "",
                        cacheList: []
                    },
                    customCommentContent: {
                        id: "",
                        content: "",
                        contentJson: "",
                        title: "",
                        cacheList: []
                    }
                }
            };

            if (localData !== null
                && typeof localData === "object"
                && Object.keys(localData).length !== 0
            ) {
                this.toolsStateDataConfig = localData;

            } else {
                this.toolsStateDataConfig = this.toolsDefaultStateConfig;
            };

            // 工具菜单选项列表
            this.toolsMenuOptionList = [
                {
                    id: "ys4fun-tools-menu-button__setting",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:0; --c:#a529ff;",
                    title: "工具设置",
                    link: "javascript:void(0)",
                    target: "",
                    icon: '<ion-icon name="settings-outline"></ion-icon>',
                    isShowContent: true
                },
                {
                    id: "ys4fun-tools-menu-button__userInfo",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:1; --c:#00b0fe;",
                    title: "用户信息",
                    link: "javascript:void(0)",
                    target: "",
                    icon: '<ion-icon name="person-circle-outline"></ion-icon>',
                    isShowContent: true
                },
                {
                    id: "ys4fun-tools-menu-button__homePage",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:2; --c:#ff2972;",
                    title: "返回首页",
                    link: "https://bbs.ys4fun.com/",
                    target: "",
                    icon: '<ion-icon name="home-outline"></ion-icon>',
                    isShowContent: false
                },
                {
                    id: "ys4fun-tools-menu-button__rerunScript",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:3; --c:#fe00f1;",
                    title: "重新运行脚本",
                    link: "javascript:void(0)",
                    target: "",
                    icon: '<ion-icon name="refresh-circle-outline"></ion-icon>',
                    isShowContent: false
                },
                {
                    id: "ys4fun-tools-menu-button__snapUp",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:4; --c:#04fc43;",
                    title: "神秘商人",
                    link: "javascript:void(0)",
                    target: "",
                    icon: '<ion-icon name="cart-outline"></ion-icon>',
                    isShowContent: true
                },
                {
                    id: "ys4fun-tools-menu-button__versionInfo",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:5; --c:#ff4c00;",
                    title: "使用说明",
                    link: "javascript:void(0)",
                    target: "",
                    icon: '<ion-icon name="alert-circle-outline"></ion-icon>',
                    isShowContent: false
                },
                {
                    id: "ys4fun-tools-menu-button__bwiki",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:6; --c:#01bdab;",
                    title: "深空之眼Bwiki",
                    link: "https://wiki.biligame.com/dhmmr/",
                    target: "_blank",
                    icon: '<ion-icon name="game-controller-outline"></ion-icon>',
                    isShowContent: false
                },
                {
                    id: "ys4fun-tools-menu-button__feedback",
                    class: "ys4fun-tools-menu__item",
                    style: "--i:7; --c:#fea600;",
                    title: "意见反馈",
                    link: "javascript:void(0)",
                    target: "",
                    icon: '<ion-icon name="mail-outline"></ion-icon>',
                    isShowContent: false
                }
            ];

            // 工具菜单选项："工具设置" 子菜单列表
            this.settingSubMenuList = [
                {
                    id: 0,
                    attr: {
                        id: "basic-setting"
                    },
                    text: "基础设置",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "basic-0",
                            },
                            text: "全局"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "basic-1",
                            },
                            text: "特殊"
                        }
                    ]
                },
                {
                    id: 1,
                    attr: {
                        id: "daytask"
                    },
                    text: "每日任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "task-signIn",
                            },
                            text: "签到"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "task-like",
                            },
                            text: "点赞"
                        },
                        {
                            id: 2,
                            attr: {
                                id: "task-browse",
                            },
                            text: "浏览"
                        },
                        {
                            id: 3,
                            attr: {
                                id: "task-share",
                            },
                            text: "分享"
                        },
                        {
                            id: 4,
                            attr: {
                                id: "task-posted",
                            },
                            text: "发帖"
                        },
                        {
                            id: 5,
                            attr: {
                                id: "task-comment",
                            },
                            text: "评论"
                        }
                    ]
                }
            ];

            // 工具菜单选项："工具设置" 子菜单 "基础设置" 子选项内容列表
            this.basicSettingContentList = [
                {
                    id: 0,
                    name: "basic-0",
                    text: "全局功能",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isGlobalDayTask",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isGlobalDayTask"]
                            },
                            text: "开启每日任务脚本功能"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "isGlobalCheckLogin",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isGlobalCheckLogin"]
                            },
                            text: "开启检查用户登录功能"
                        },
                        {
                            id: 2,
                            attr: {
                                id: "isGlobalCheckLogout",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isGlobalCheckLogout"]
                            },
                            text: "开启检查用户注销功能"
                        },
                        {
                            id: 3,
                            attr: {
                                id: "isIgnoreCheckState",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isIgnoreCheckState"]
                            },
                            text: "开启无限制执行任务脚本功能(默认关闭,非重新执行脚本不要开启)"
                        }
                    ]
                },
                {
                    id: 1,
                    name: "basic-1",
                    text: "特殊功能",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isDeleteMyAllPost",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isDeleteMyAllPost"]
                            },
                            text: "开启删除所有个人帖子功能"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "isDeleteMyAllComment",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isDeleteMyAllComment"]
                            },
                            text: "开启删除所有个人评论功能"
                        },
                        {
                            id: 2,
                            attr: {
                                id: "isCancelMyAllLikeState",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isCancelMyAllLikeState"]
                            },
                            text: "开启撤销所有个人已点赞帖子功能"
                        },
                        {
                            id: 3,
                            attr: {
                                id: "isClearUserLocalData",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isClearUserLocalData"]
                            },
                            text: "开启清除当前用户本地存储数据功能"
                        },
                        {
                            id: 4,
                            attr: {
                                id: "isResetToolsDefaultState",
                                class: "basic-stting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isResetToolsDefaultState"]
                            },
                            text: "开启重置工具至默认配置并刷新页面功能"
                        }
                    ]
                }
            ];

            // 工具菜单选项："工具设置" 子菜单 "每日任务" 子选项内容列表
            this.daytaskSettingContentList = [
                {
                    id: 0,
                    name: "task-signIn",
                    text: "签到任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isRunSignInTask",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isRunSignInTask"]
                            },
                            text: "开启签到任务"
                        }
                    ]
                },
                {
                    id: 1,
                    name: "task-like",
                    text: "点赞任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isRunLikeTask",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isRunLikeTask"]
                            },
                            text: "开启点赞任务"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "isCancelLike",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isCancelLike"]
                            },
                            text: "点赞后撤销点赞状态"
                        },
                        {
                            id: 2,
                            attr: {
                                id: "isOpenCycleCancelLike",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isOpenCycleCancelLike"]
                            },
                            text: "开启强制循环撤销点赞直到成功状态"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "task-browse",
                    text: "浏览任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isRunBrowseTask",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isRunBrowseTask"]
                            },
                            text: "开启浏览任务"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "task-share",
                    text: "分享任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isRunShareTask",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isRunShareTask"]
                            },
                            text: "开启分享任务"
                        }
                    ]
                },
                {
                    id: 4,
                    name: "task-posted",
                    text: "发帖任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isRunPostedTask",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isRunPostedTask"]
                            },
                            text: "开启发帖任务"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "isDeletePost",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isDeletePost"]
                            },
                            text: "发帖后删除帖子"
                        },
                        {
                            id: 2,
                            attr: {
                                id: "isPostCustomContent",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isPostCustomContent"]
                            },
                            text: "开启自定义帖子内容"
                        },
                        {
                            id: 3,
                            attr: {
                                id: "isOpenRandomPostCustomContentList",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isOpenRandomPostCustomContentList"]
                            },
                            text: "开启随机自定义帖子草稿列表内容"
                        }
                    ]
                },
                {
                    id: 5,
                    name: "task-comment",
                    text: "评论任务",
                    subitemList: [
                        {
                            id: 0,
                            attr: {
                                id: "isRunCommentTask",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isRunCommentTask"]
                            },
                            text: "开启评论任务"
                        },
                        {
                            id: 1,
                            attr: {
                                id: "isDeleteComment",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isDeleteComment"]
                            },
                            text: "发表评论后删除"
                        },
                        {
                            id: 2,
                            attr: {
                                id: "isPostCustomComment",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isPostCustomComment"]
                            },
                            text: "开启自定义评论内容"
                        },
                        {
                            id: 3,
                            attr: {
                                id: "isOpenRandomCustomCommentListContent",
                                class: "daytask-setting-input",
                                type: "checkbox",
                                labelClass: "basic-setting-label",
                                checked: this.toolsStateDataConfig.stateConfig["isOpenRandomCustomCommentListContent"]
                            },
                            text: "开启随机自定义评论草稿列表内容"
                        }
                    ]
                }
            ];

            // 创建 "工具设置" 子菜单子选项内容结构
            const dayTaskSettingContentList = this.createDaytaskContainerBody();
            const basicSettingContentList = this.createBasicSettingContainerBody();

            // 工具菜单选项："工具设置" 子菜单所有子菜单选项内容结构体列表
            this.settingSubitemContainerList = [
                {
                    id: 0,
                    attr: {
                        index: "0",
                        bindId: "basic-setting"
                    },
                    subitemList: [
                        {
                            id: 0,
                            content: basicSettingContentList["basic-0"].html,
                            appendBody: ""
                        },
                        {
                            id: 1,
                            content: basicSettingContentList["basic-1"].html,
                            appendBody: this.createAppendBasicSpecialBody()
                        }
                    ]
                },
                {
                    id: 1,
                    attr: {
                        index: "1",
                        bindId: "daytask"
                    },
                    subitemList: [
                        {
                            id: 0,
                            content: dayTaskSettingContentList["task-signIn"].html,
                            appendBody: ""
                        },
                        {
                            id: 1,
                            content: dayTaskSettingContentList["task-like"].html,
                            appendBody: ""
                        },
                        {
                            id: 2,
                            content: dayTaskSettingContentList["task-browse"].html,
                            appendBody: ""
                        },
                        {
                            id: 3,
                            content: dayTaskSettingContentList["task-share"].html,
                            appendBody: ""
                        },
                        {
                            id: 4,
                            content: dayTaskSettingContentList["task-posted"].html,
                            appendBody: this.createAppendPostedCustomBody()
                        },
                        {
                            id: 6,
                            content: dayTaskSettingContentList["task-comment"].html,
                            appendBody: this.createAppendCommentCustomBody()
                        }
                    ]
                }
            ];

            // 工具菜单选项："用户信息" 内容结构列表
            this.userInfoConfigList = [
                {
                    id: 0,
                    key: "论坛id",
                    value: ""
                },
                {
                    id: 1,
                    key: "论坛昵称",
                    value: ""
                },
                {
                    id: 2,
                    key: "论坛等级",
                    value: ""
                },
                {
                    id: 3,
                    key: "弥尔币数量",
                    value: ""
                },
                {
                    id: 4,
                    key: "用户创建日期",
                    value: ""
                },
                {
                    id: 5,
                    key: "游戏服务器",
                    value: ""
                },
                {
                    id: 6,
                    key: "游戏uid",
                    value: ""
                },
                {
                    id: 7,
                    key: "游戏昵称",
                    value: ""
                },
                {
                    id: 8,
                    key: "游戏等级",
                    value: ""
                },
                {
                    id: 9,
                    key: "游戏创建日期",
                    value: ""
                },
                {
                    id: 10,
                    key: "我的地址",
                    value: ""
                }
            ];

            // 工具菜单所有选项主体内容结构列表
            this.containerList = [
                {
                    id: 0,
                    attr: {
                        id: "setting",
                        index: "0",
                        title: "工具设置",
                    },
                    style: {},
                    containerbody: this.createSettingContainerBody()
                },
                {
                    id: 1,
                    attr: {
                        id: "userInfo",
                        index: "1",
                        title: "用户信息",
                    },
                    style: {},
                    containerbody: this.createUserInfoContainerBody()
                },
                {
                    id: 4,
                    attr: {
                        id: "snapUp",
                        index: "4",
                        title: "神秘商人",
                    },
                    style: {
                        width: "90vw",
                        height: "90vh"
                    },
                    containerbody: this.createSnapUpContainerBody()
                },
                {
                    id: 5,
                    attr: {
                        id: "versionInfo",
                        index: "5",
                        title: "使用说明",
                    },
                    style: {},
                    containerbody: ""
                },
                {
                    id: 7,
                    attr: {
                        id: "feedback",
                        index: "7",
                        title: "意见反馈",
                    },
                    style: {},
                    containerbody: ""
                }
            ];
        }

        // 创建工具菜单面板
        createToolsMenuPanel() {
            const $toolsMenuPanel = $("<div>").attr({
                class: "ys4fun-tools-menu-panel"
            });

            const $menuOpenButton = $("<div>").attr({
                class: "ys4fun-tools-menu__open-button",
                role: "button",
                title: "论坛工具菜单"
            });

            $menuOpenButton.on("click", (event) => {
                event.stopPropagation();
                $(event.target).parents(".ys4fun-tools-menu-panel").toggleClass("active");
            });

            const $openButtonIcon = $("<div>").attr({
                class: "ys4fun-tools-menu__button-icon"
            });

            const $menuItemList = this.createToolsMenuList();

            $menuOpenButton.append($openButtonIcon);
            $toolsMenuPanel.append($menuOpenButton, $menuItemList);

            return $toolsMenuPanel;
        }

        // 创建工具菜单列表
        createToolsMenuList() {
            const $menuListUl = $("<ul>").attr({
                class: "ys4fun-tools-menu__item-list"
            });

            this.toolsMenuOptionList.forEach((optionMap, optionIdx) => {
                const $subitemLi = $("<li>").attr({
                    id: optionMap.id,
                    class: optionMap.class,
                    style: optionMap.style,
                    title: optionMap.title,
                    "data-index": optionIdx,
                    "data-show-content": optionMap.isShowContent ? true : ""
                });

                const $subitemA = $("<a>").attr({
                    href: optionMap.link,
                    target: optionMap.target
                });

                $subitemA.append(optionMap.icon);
                $subitemLi.append($subitemA);
                $menuListUl.append($subitemLi);
            });

            $menuListUl.on("click", "li", (event) => {
                event = event || window.event;
                event.stopPropagation();

                const $event = $(event.target);
                const $panel = $event.parents("#ys4fun-tools-panel");
                const $menu = $event.parents(".ys4fun-tools-menu-panel");
                const $container = $panel.find(".ys4fun-tools-container-panel");
                const $option = $event.parents(".ys4fun-tools-menu__item");

                if ($option.attr("data-show-content")) {
                    $menu.hide().removeClass("active");
                    const index = $option.attr("data-index");
                    $container.find(`.ys4fun-tools-container[data-index="${index}"]`).show("fast").siblings().hide();
                    $panel.addClass("show-container-panel");
                    $container.show("fast").css("display", "flex");
                } else {
                    let timer = null;
                    if ($option.attr("id") === "ys4fun-tools-menu-button__rerunScript") {
                        if (!this.toolsStateDataConfig.stateConfig.isIgnoreCheckState) {
                            alert(this.message[113]);
                            return;
                        };

                        const $a = $option.find("a");
                        const $ionEle = $a.find("ion-icon");
                        const title = $option.attr("title");

                        $a.css("pointer-events", "none");
                        $ionEle.css("opacity", "0.2");

                        if (!$a.hasClass("active")) {

                            const rerunTitle = "请等待一分钟后再执行！";
                            const $timingDiv = $("<div>").attr({
                                class: "rerun-timing-text",
                                title: rerunTitle
                            });

                            $option.attr("title", rerunTitle);
                            $a.append($timingDiv);
                            $a.attr("class", "active");

                        };

                        clearInterval(timer);

                        let timeCount = 60;
                        timer = setInterval(() => {
                            timeCount--;

                            if (timeCount === 0) {
                                $a.css("pointer-events", "unset");
                                $a.removeClass("active");
                                $a.find(".rerun-timing-text").remove();
                                $ionEle.css("opacity", "1");
                                $option.attr("title", title);
                                clearInterval(timer);
                                timer = null;
                            };

                            $a.find(".rerun-timing-text").text(timeCount);

                        }, 1000)

                        if (!this.toolsStateDataConfig.stateConfig.isGlobalDayTask) {
                            alert("您并未开启每日任务脚本功能！");
                            return;
                        };

                        this.init(true).then(() => {
                            this.checkDayTaskState();
                        });
                    }
                    console.log("该设置选项没有设置显示内容的容器");
                };
            });

            return $menuListUl;
        }

        // 创建工具菜单选项的内容容器结构面板
        createToolsContainerPanel() {
            const $containerPanelUl = $("<ul>").attr({
                class: "ys4fun-tools-container-panel"
            });

            this.containerList.forEach(containerMap => {
                const $templateLi = this.createContainerTemplate({
                    id: containerMap.attr.id,
                    index: containerMap.attr.index,
                    title: containerMap.attr.title,
                    body: containerMap.containerbody,
                    style: containerMap.style
                });
                $containerPanelUl.append($templateLi);
            });

            return $containerPanelUl;
        }

        // 创建工具菜单子元素内容模板
        createContainerTemplate({ id, index, title, body, style }) {
            const $containerLi = $("<li>").attr({
                id: id,
                class: "ys4fun-tools-container",
                "data-index": index
            });

            if (style && typeof style === "object" && Object.keys(style).length !== 0) {
                $containerLi.css({ ...style });
            };

            const $header = $("<div>").attr({
                class: "ys4fun-tools-container__header"
            });

            const $headerTitle = $("<h2>").attr({
                class: "ys4fun-tools-container-header__title",
                title: title
            }).text(title);

            const $closeButton = $("<div>").attr({
                class: "ys4fun-tools-container-header__closeButton",
                role: "button",
                title: "关闭"
            });

            const $closeButtonIcon = $('<ion-icon name="close-circle-outline"></ion-icon>');

            $closeButton.on("click", (event) => {
                event = event || window.event;

                const $panel = $(event.target).parents("#ys4fun-tools-panel");
                const $container = $(event.target).parents(".ys4fun-tools-container-panel");
                const $settingOptionMenuUl = $container.find(".ys4fun-tools-setting-container-menu");
                const $settingOptionLi = $settingOptionMenuUl.children("li");
                const $settingOptionLiItem = $settingOptionLi.find(".ys4fun-tools-setting-container-item-subitem__item");
                const $settingOptionLiItemSubitemList = $settingOptionLi.find(".ys4fun-tools-setting-container-item-subitem-list");
                const $settingOptionItemContainerUl = $settingOptionMenuUl.siblings(".ys4fun-tools-setting-container-item-content-list");

                $container.hide("fast");
                $panel.removeClass("show-container-panel");
                $panel.find(".ys4fun-tools-menu-panel").show("fast", "linear");
                $settingOptionLi.removeClass("active");
                $settingOptionLiItem.removeClass("active");
                $settingOptionLiItemSubitemList.hide();
                $settingOptionItemContainerUl.find(".ys4fun-tools-setting-container-item-content-item").hide();

            });

            const $containerBody = $("<div>").attr({
                class: "ys4fun-tools-container__body"
            });

            body && $containerBody.append(body);

            $closeButton.append($closeButtonIcon);
            $header.append($headerTitle, $closeButton);
            $containerLi.append($header, $containerBody);

            return $containerLi;
        }

        // 创建工具设置选项的内容主体部分
        createSettingContainerBody() {
            const $settingContainer = $("<div>").attr({
                class: "ys4fun-tools-setting-container"
            });

            const $optionMenu = this.createSettingOptionsMenu();

            const $optionContainer = this.createBodySubitemContent();

            $settingContainer.append($optionMenu, $optionContainer);

            return $settingContainer;
        }

        // 创建工具设置选项的内容主体的子项内容部分
        createBodySubitemContent() {
            const $optionContainer = $("<ul>").attr({
                class: "ys4fun-tools-setting-container-item-content-list"
            });

            this.settingSubitemContainerList.forEach(containerMap => {
                const $contentLi = $("<li>").attr({
                    class: "ys4fun-tools-setting-container-item-content-item",
                    "data-index": containerMap.attr.index,
                    "data-bind-id": containerMap.attr.bindId
                });

                const $contentLiSubitemListUl = $("<ul>").attr({
                    class: "ys4fun-tools-setting-container-item-content-item-subitem-list"
                });

                containerMap.subitemList.forEach((subitemMap, subitemIdx) => {
                    const $subitemLi = $("<li>").attr({
                        class: "ys4fun-tools-setting-container-item-content-item-subitem__item",
                        "data-index": subitemIdx,
                    }).html(subitemMap.content);

                    if (subitemMap.appendBody) {
                        $subitemLi.append(subitemMap.appendBody);
                    };

                    $contentLiSubitemListUl.append($subitemLi);
                });

                $contentLi.append($contentLiSubitemListUl);
                $optionContainer.append($contentLi);
            });

            return $optionContainer;
        }

        // 创建基础设置内容主体部分
        createBasicSettingContainerBody() {
            const templateObject = {};

            this.basicSettingContentList.forEach(contentMap => {
                const $div = $("<div>").attr({
                    class: "basic-setting-container"
                });

                contentMap.subitemList.forEach(subitemMap => {
                    const $lable = this.createChangeStateLabel({
                        inputId: subitemMap.attr.id,
                        spanText: subitemMap.text,
                        inputClass: subitemMap.attr.class,
                        inputType: subitemMap.attr.type,
                        inputState: subitemMap.attr.checked,
                        labelClass: subitemMap.attr.labelClass
                    });

                    $lable.on("click", (event) => {
                        event = event || window.event;
                        event.stopPropagation();
                        const $event = $(event.delegateTarget);
                        const $input = $event.find("input");

                        const id = $event.attr("for") || $input.attr("id");
                        const state = $input.is(":checked");

                        const $button = id ? $(`button[id=${id}]`) : [];

                        return $button.length > 0
                            ? state
                                ? $button.attr({ disabled: !state })
                                : $button.attr({ disabled: !state })
                            : null;
                    });

                    $div.append($lable);
                });

                templateObject[contentMap.name] = {
                    id: contentMap.id,
                    name: contentMap.text,
                    html: $div
                };
            });

            return templateObject;
        }

        // 创建每日任务设置内容主体部分
        createDaytaskContainerBody() {
            const templateObject = {};

            this.daytaskSettingContentList.forEach(contentMap => {
                const $table = $("<table>").attr({
                    class: "daytask-setting-table"
                });

                const $caption = $("<caption>").attr({
                    class: "daytask-setting-table-caption"
                }).text(contentMap.text);

                const $tbody = $("<tbody>");

                contentMap.subitemList.forEach(subitemMap => {
                    const $tr = $("<tr>");
                    const $td = $("<td>");

                    const $label = this.createChangeStateLabel({
                        inputId: subitemMap.attr.id,
                        spanText: subitemMap.text,
                        inputClass: subitemMap.attr.class,
                        inputType: subitemMap.attr.type,
                        inputState: subitemMap.attr.checked,
                        labelClass: subitemMap.attr.labelClass
                    });

                    $td.append($label);
                    $tr.append($td);
                    $tbody.append($tr);
                });

                $table.append($caption, $tbody);

                templateObject[contentMap.name] = {
                    id: contentMap.id,
                    name: contentMap.text,
                    html: $table
                };
            });

            return templateObject;
        }

        // 创建商城抢购内容主体部分
        createSnapUpContainerBody() {
            const $snapUpContainer = $("<div>").attr({
                class: "ys4fun-tools-snapUp-container"
            }).css("padding", "11px");

            const $snapUpButtonListBox = $("<div>").attr({
                class: "snapUp-container-button-list"
            }).css({
                "display": "flex",
                "align-content": "center",
                "align-items": "center",
                "justify-content": "center"
            });

            const $getUserInfoButton = this.createToolsButton({
                id: "getUserInfo",
                cls: "tools-button",
                text: "获取用户信息",
                style: {
                    color: "#646464"
                },
                disabled: false
            });

            $getUserInfoButton.on("click", (event) => {
                event = event || window.event;
                $(event.target).toggleClass("active");
                const $tipsBox = $(".snap-up-tips-text");

                if ($tipsBox && $tipsBox.length > 0) {
                    $tipsBox.hide();
                };

                if ($(event.target).hasClass("active")) {
                    const {
                        bbsId,
                        bbsNickName,
                        bbsLevel,
                        bbsCoin,
                        gameServer,
                        gameUid,
                        gameNickName,
                        gameLevel
                    } = this.userInfoCacheMap;

                    const noFoundStr = "您还未设置有收货地址或该收货地址未设置为默认地址";
                    const addressStr = this.userAddressInfoMap
                        ? this.userAddressInfoMap.addressStr
                        : noFoundStr;
                    const fontColor = addressStr === noFoundStr ? "red" : "#5c5b5b";

                    const $userInfoTable = $(`<table id="snapUp-userInfo-table" class="tools-table" style="display:none;">
                            <caption>用户信息</caption>
                            <thead>
                                <th>论坛id</th>
                                <th>论坛昵称</th>
                                <th>论坛等级</th>
                                <th>游戏区服</th>
                                <th>游戏id</th>
                                <th>游戏昵称</th>
                                <th>游戏等级</th>
                                <th>弥尔币数量</th>
                                <th>收货地址(仅获取默认地址)</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td name="bbsid">${bbsId}</td>
                                    <td name="bbsNickName">${bbsNickName}</td>
                                    <td name="bbsLevel">${bbsLevel}</td>
                                    <td name="gameServer">${gameServer}</td>
                                    <td name="gameUid">${gameUid}</td>
                                    <td name="gameNickName">${gameNickName}</td>
                                    <td name="gameLevel">${gameLevel}</td>
                                    <td name="bbsCoinNum">${bbsCoin}</td>
                                    <td name="userAddress">
                                        <font name="userAddressFont" color="${fontColor}">
                                            ${addressStr}
                                        </font>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`);

                    $snapUpContainer.find(".snapUp-container-button-list").after($userInfoTable);

                    const $button = this.createToolsButton({
                        id: "refreshUserAddress",
                        cls: "tools-button",
                        text: "",
                        html: '<ion-icon name="sync-outline"></ion-icon>',
                        style: {
                            color: "rgb(100, 100, 100)",
                            width: "25px",
                            height: "25px",
                            padding: "0"
                        }
                    });

                    $button.on("click", (event) => {
                        event = event || window.event;

                        const $evnet = $(event.delegateTarget);
                        const $eventFont = $evnet.siblings("font");
                        const $ionIcon = $evnet.children("ion-icon");

                        $evnet.attr("disabled", "disabled");
                        $evnet.css("opacity", "0");
                        $ionIcon.css("opacity", "0");

                        setTimeout(() => {
                            $evnet.removeAttr("disabled");
                            $evnet.css("opacity", "1");
                            $ionIcon.css("opacity", "1");
                        }, 1200);

                        $eventFont.fadeOut(800);

                        this.getUserAddressList().then(res => {
                            if (!this.userAddressInfoMap || !this.userAddressInfoMap.addressStr) {
                                $eventFont.fadeIn(800);
                                $eventFont.text(noFoundStr).attr("color", "red");
                            } else {
                                $eventFont.text(this.userAddressInfoMap.addressStr).attr("color", "#5c5b5b");
                                $eventFont.fadeIn(800);
                            };
                        });
                    });

                    if (!addressStr || addressStr === "") {
                        $('[name="userAddress"]').children().remove();
                        $('[name="userAddress"]').append($button);
                    } else {
                        $('[name="userAddress"]').append($button)
                    };

                    if (this.clientType === "2") {
                        $userInfoTable.css({
                            "overflow": "scroll",
                            "width": "400%"
                        });
                        $snapUpContainer.css({
                            "overflow": "scroll"
                        });
                    };

                    $userInfoTable.show(100);

                } else {

                    $snapUpContainer.find("#snapUp-userInfo-table").hide(100, () => {
                        $snapUpContainer.find("#snapUp-userInfo-table").remove();
                    });

                };

            });

            const $getCommodityListButton = this.createToolsButton({
                id: "getCommodityList",
                cls: "tools-button",
                text: "获取商品列表",
                style: {
                    color: "#646464"
                },
                disabled: false
            });

            $getCommodityListButton.on("click", (event) => {
                event = event || window.event;
                const $evnet = $(event.target);

                const $tipsBox = $(".snap-up-tips-text");

                if ($tipsBox && $tipsBox.length > 0) {
                    $tipsBox.hide();
                };

                $evnet.toggleClass("active");

                if ($evnet.hasClass("active")) {
                    const $commodityListTable = $(`<table id="commodity-list-table" class="tools-table" style="display:none;">
                        <caption>商品列表</caption>
                        <thead>
                            <tr>
                                <th rowspan="2">商品id</th>
                                <th rowspan="2">商品名称</th>
                                <th rowspan="2">可购状态</th>
                                <th rowspan="2">商品类型</th>
                                <th rowspan="2">可购数量</th>
                                <th rowspan="2">已购数量</th>
                                <th rowspan="2">总计数量</th>
                                <th rowspan="2">剩余数量</th>
                                <th colspan="2">所需条件</th>
                                <th rowspan="2">开始时间</th>
                                <th rowspan="2">结束时间</th>
                                <th rowspan="2">需要弥尔币</th>
                                <th rowspan="2">条件满足状态</th>
                                <th rowspan="2">是否抢购</th>
                            </tr>
                            <tr>
                                <th>游戏等级</th>
                                <th>论坛等级</th>
                            </tr>
                        </thead>
                        <tbody class="ys4fun-tools-shop-list-tbody">
                        </tbody>
                    </table>`);

                    $snapUpContainer.append($commodityListTable);

                    this.getCommodityList().then(commodityList => {
                        this.commodityList = commodityList;
                        this.snapUpQueryDataList = [];
                        this.snapUpCommodityTotalPrice = 0;
                        commodityList.forEach(commodityMap => {
                            const conditions = JSON.parse(commodityMap.restrictionCondition);
                            const commodityConditionGameLevel = conditions.skzyLevel;
                            const commodityConditionForumLevel = conditions.mimierLevel;
                            const userGameLevel = this.userInfoCacheMap.gameLevel;
                            const userForumLevel = this.userInfoCacheMap.bbsLevel;
                            const userCoinNumber = this.userInfoCacheMap.bbsCoin;

                            const currentDate = this.convertDateByTimestamp(new Date().getTime()).match(/\d{4}-\d{2}-\d{2}/)[0]
                            const buyStartDate = this.convertDateByTimestamp(commodityMap.validStartDate).match(/\d{4}-\d{2}-\d{2}/)[0]
                            const isSatisfyBuy = commodityMap.commodityBuyFlag
                                ? commodityMap.commodityBuyFlag
                                : currentDate === buyStartDate

                            const isSatisfy = isSatisfyBuy
                                && userGameLevel >= commodityConditionGameLevel
                                && userForumLevel >= commodityConditionForumLevel
                                && userCoinNumber >= commodityMap.price
                                && commodityMap.restrictionNumber >= commodityMap.cycleBuyNumber;

                            const $tr = this.createCommodityTrLine({
                                id: commodityMap.id,
                                name: commodityMap.name,
                                state: commodityMap.commodityBuyFlag,
                                type: commodityMap.commodityTypeVO.type.text,
                                rnum: commodityMap.restrictionNumber,
                                cnum: commodityMap.cycleBuyNumber,
                                tnum: commodityMap.number,
                                snum: commodityMap.surplusNumber,
                                gl: commodityConditionGameLevel,
                                fl: commodityConditionForumLevel,
                                startTime: this.convertDateByTimestamp(commodityMap.validStartDate),
                                endTime: this.convertDateByTimestamp(commodityMap.validEndDate),
                                price: commodityMap.price,
                                isSatisfy: isSatisfy,
                                snapUpInput: {
                                    id: commodityMap.id,
                                    name: commodityMap.name
                                },
                                extraParams: {
                                    commodityConditionGameLevel: commodityConditionGameLevel,
                                    commodityConditionForumLevel: commodityConditionForumLevel,
                                    userGameLevel: userGameLevel,
                                    userForumLevel: userForumLevel,
                                    validStartDate: commodityMap.validStartDate,
                                    validEndDate: commodityMap.validEndDate,
                                    userCoinNumber: userCoinNumber
                                }
                            });

                            $(".ys4fun-tools-shop-list-tbody").append($tr);
                        });
                    });

                    if (this.clientType === "2") {
                        $commodityListTable.css({
                            "overflow": "scroll",
                            "width": "400%"
                        });
                        $snapUpContainer.css({
                            "overflow": "scroll"
                        });
                    };

                    $commodityListTable.show("low");
                } else {
                    $snapUpContainer.find("#commodity-list-table").hide("low", () => {
                        $snapUpContainer.find("#commodity-list-table").remove();
                    });
                };

            });

            const $executeSnapUpButton = this.createToolsButton({
                id: "executeSnapUp",
                cls: "tools-button",
                text: "执行抢购脚本",
                style: {
                    color: "#646464"
                },
                disabled: false
            });

            $executeSnapUpButton.on("click", (event) => {
                event = event || window.event;
                const $evnet = $(event.target);

                const $tipsBox = $(".snap-up-tips-text");

                if ($tipsBox && $tipsBox.length > 0) {
                    $tipsBox.hide();
                };

                const userCoinNumber = this.userInfoCacheMap
                    ? this.userInfoCacheMap.bbsCoin
                    : this.userInfo ? this.userInfo.coin : "0";
                // const userCoinNumber = 999999999999;

                const snapUpTotalCoinNumber = this.snapUpCommodityTotalPrice
                    ? this.snapUpCommodityTotalPrice : "0";

                if (snapUpTotalCoinNumber > userCoinNumber) {
                    const title = "您所拥有的弥尔币数量低于选购的商品弥尔币总和\n";
                    const content1 = `您的弥尔币数量：${userCoinNumber}\n`;
                    const content2 = `商品弥尔币总和：${snapUpTotalCoinNumber}`;
                    alert(title + content1 + content2);
                    return;
                };

                if (!this.snapUpQueryDataList || this.snapUpQueryDataList.length === 0) {
                    alert("当前没有可供操作的数据对象，请检查是否勾选了商品");
                    return;
                };

                $evnet.toggleClass("active");

                if ($evnet.hasClass("active")) {
                    $evnet.text("取消执行抢购脚本");

                    $evnet.attr("disabled", "disabled");

                    setTimeout(() => {
                        $evnet.removeAttr("disabled");
                    }, 5000);

                    $evnet.siblings("#getCommodityList").prop("disabled", true);

                    const consoleStyle = {
                        0: "padding:5px 0;background: blue;color: #fff;",
                        1: "padding: 5px 5px 5px 0;background: #e5e5ff;color:blue",
                        2: "padding:5px 0;background: #00bc12;color: #fff;",
                        3: "padding: 5px 5px 5px 0;background: #e6ffe5;color:#00bc12",
                        4: "padding:5px 0;background: #ffa400;color: #fff;",
                        5: "padding: 5px 5px 5px 0;background: #fff0e5;color:#ffa400",
                    };
                    // timeout
                    this.snapUpTimeOut = this.snapUpTimeOut > 0 ? this.snapUpTimeOut : 0;

                    const snapUpHandler = (commoditySnapUpDataMap) => {
                        const now = new Date().getTime();
                        const id = commoditySnapUpDataMap.id;
                        const name = commoditySnapUpDataMap.name;
                        const startTime = commoditySnapUpDataMap.startTime;
                        // const startTime = new Date("2023-04-28 18:22").getTime();
                        const formatStarTime = this.convertDateByTimestamp(startTime);
                        const formatNowTime = this.convertDateByTimestamp(now);

                        if (now >= startTime || formatStarTime == formatNowTime) {

                            const timerDataMap = this.snapUpTimerList.find(timerDataMap => timerDataMap.id === id);
                            clearInterval(timerDataMap.timer);
                            timerDataMap.timer = null;
                            this.snapUpTimerList = this.snapUpTimerList.filter(timerDataMap => timerDataMap.id != id);

                            const $input = $(`input[id=${id}]`);
                            const messageTemplate = `%c 已执行抢购: %c id：${id} \tname：${name} \t state：$state$ \t message：$message$`;

                            this.snapUpQuery(commoditySnapUpDataMap.params, this.snapUpTimeOut * 1000)
                                .then(res => {
                                    const $success = $(`<ion-icon>`).attr({
                                        class: "snap-up-state-success",
                                        name: "checkmark-outline",
                                        title: "商品抢购成功-" + res
                                    }).css({
                                        "display": "inline-block",
                                        "width": "15px",
                                        "height": "15px",
                                        "color": "#36cb2d",
                                        "cursor": "pointer"
                                    });
                                    const printMessage = messageTemplate.replace("$state$", "成功").replace("$message$", res)
                                    console.log(printMessage, consoleStyle[2], consoleStyle[3]);
                                    $input.siblings(".snapUp-loading-box").remove();
                                    if ($input.css("display") !== "none") return;
                                    if ($input.siblings(".snap-up-state-success").length > 0) {
                                        $input.siblings(".snap-up-state-success").remove();
                                    };
                                    $input.after($success);
                                })
                                .catch(err => {
                                    const $failed = $(`<ion-icon>`).attr({
                                        class: "snap-up-state-failed",
                                        name: "close-outline",
                                        title: "商品抢购失败-" + err
                                    }).css({
                                        "display": "inline-block",
                                        "width": "15px",
                                        "height": "15px",
                                        "color": "#ff0000",
                                        "cursor": "pointer"
                                    });
                                    const printMessage = messageTemplate.replace("$state$", "失败").replace("$message$", err)
                                    console.log(printMessage, consoleStyle[4], consoleStyle[5]);
                                    $input.siblings(".snapUp-loading-box").remove();
                                    if ($input.css("display") !== "none") return;
                                    if ($input.siblings(".snap-up-state-failed").length > 0) {
                                        $input.siblings(".snap-up-state-failed").remove();
                                    };
                                    $input.after($failed);
                                });

                            this.snapUpTimeOut += 5;
                            return;
                        };

                        const printMessage = `%c 正在抢购中: %c id：${id} \tname：${name} \t start：${formatStarTime} \t now：${formatNowTime}`;
                        console.log(printMessage, consoleStyle[0], consoleStyle[1])
                    };

                    this.snapUpQueryDataList.map(commoditySnapUpDataMap => {
                        let timer = setInterval(() => {
                            snapUpHandler(commoditySnapUpDataMap);
                        }, 500);
                        this.snapUpTimerList.push({
                            id: commoditySnapUpDataMap.id,
                            timer: timer
                        });
                    });

                    const $snapUpLoadingDiv = $("<div>").attr({
                        class: "snapUp-loading-box",
                        title: "商品抢购中...点击取消"
                    });

                    $snapUpLoadingDiv.on("click", (event) => {
                        event = event || window.event;
                        const $event = $(event.delegateTarget);
                        const id = $event.siblings("input").attr("id");

                        $event.toggleClass("active");

                        if ($event.hasClass("active")) {

                            const $ion = $("<ion-icon>").attr({
                                class: "rerun-commodity-snapUp",
                                name: "play-circle-outline",
                                title: "重新运行该商品抢购"
                            });

                            try {
                                const snapUpTimerMap = this.snapUpTimerList.find(timerMap => {
                                    return timerMap.id === id;
                                });
                                clearInterval(snapUpTimerMap.timer);
                            } catch (error) {
                                if (error) {
                                    console.log("已经执行到发送请求步骤，无法取消计时器。")
                                };
                            };

                            this.snapUpTimerList = this.snapUpTimerList.filter(timerMap => {
                                return timerMap.id != id;
                            });

                            $event.children().hide();
                            $event.append($ion);

                        } else {

                            const snapUpCommodityMap = this.snapUpQueryDataList.find(commodityMap => {
                                return commodityMap.id === id;
                            });

                            this.snapUpTimeOut -= 5;
                            let timer = setInterval(() => {
                                snapUpHandler(snapUpCommodityMap);
                            }, 500);

                            this.snapUpTimerList.push({
                                id: snapUpCommodityMap.id,
                                timer: timer
                            });

                            $event.find(".snap-up-loading-svg").show(100);
                            $event.find(".rerun-commodity-snapUp").remove();
                        };
                    });

                    const $snapUpLoadingSvg = $(`<svg
                        class="snap-up-loading-svg"
                        xmlns:svg="http://www.w3.org/2000/svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        version="1.0" width="15px" height="15px"
                        viewBox="0 0 128 143" xml:space="preserve"
                    >
                        <path fill="#096aec" d="M119.8 31.3l-.6-.6a2.8 2.8 0 0 1-.4.5L116 34a2.8 2.8 0 0 1-4 0v-.2l-1.5 1.5a64 64 0 1 1-48.4-20v-2.6h-.6A3.7 3.7 0 0 1 57.6 9V3.7A3.7 3.7 0 0 1 61.4 0h5.2a3.7 3.7 0 0 1 3.8 3.7V9a3.7 3.7 0 0 1-3.8 3.7H66v2.6a63.8 63.8 0 0 1 42 17.4l1.4-1.5a2.8 2.8 0 0 1 0-4l2.7-2.7a2.8 2.8 0 0 1 .5-.4l-.6-.5a2 2 0 1 1 2.7-2.8l8 8a2 2 0 0 1-3 2.6zM64 19.3a59.7 59.7 0 1 0 60 60 59.8 59.8 0 0 0-60-60zM109.7 80v-1.6h7V80h-7zm-6.5-24.3l6-3.5 1 1.3-6.3 3.5zm-17 63.3l1.3-.8 3.5 6.2-1.3.7zm0-79.7l3.5-6 1.3.6-3.5 6zM64 86a6.7 6.7 0 1 1 6.7-6.8A6.7 6.7 0 0 1 64 86zm0-11.7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm-.7-47.8h1.5v7h-1.5v-7zm-26.3 98l3.5-6.3 1.3.8-3.5 6zm0-90.6l1.3-.8 3.5 6-1.3 1zm-19 70.8l6-3.5.8 1.3-6 3.5zm0-51.3l.7-1.3 6 3.5-.6 1.3zm.3 26.4h-7v-1.6h7V80zm46.4 51.8h-1.5v-7h1.5v7zm45.4-27l-.7 1.3-6-3.4.6-1.3z"/>
                        <path fill="#096aec" d="M64 73.6l-3-.4.8-34 2.2-3.7 2.2 3.7.8 34z">
                        <animateTransform attributeName="transform" type="rotate" from="0 64 79" to="360 64 79" dur="2160ms" repeatCount="indefinite"/>
                        </path>
                    </svg>`);

                    $snapUpLoadingDiv.append($snapUpLoadingSvg);
                    const $commodityCheckedInput = $(".commodity-isSnapUp input:checked");
                    $commodityCheckedInput.hide().after($snapUpLoadingDiv);
                } else {
                    $evnet.text("执行抢购脚本");
                    $evnet.siblings("#getCommodityList").removeAttr("disabled");
                    const $commodityCheckedInput = $(".commodity-isSnapUp input:checked");
                    $commodityCheckedInput.show(100).siblings(".snapUp-loading-box").remove();
                    $commodityCheckedInput.siblings('[class^="snap-up-state-"]').remove();
                    this.snapUpTimerList.map(commoditySnapUpTimerMap => {
                        clearInterval(commoditySnapUpTimerMap.timer);
                    });
                };
            });

            $snapUpButtonListBox.append(
                $getUserInfoButton,
                $getCommodityListButton,
                $executeSnapUpButton
            );

            const tipsText1 = "论坛购买商城商品大概有5秒的时间差，如果小于这个间隔则购买请求提示“访问频繁，请稍后再试!”<br>";
            const tipsText2 = "保险一点的就是抢一件，如果勾选多个，有可能在请求间隔外被别人抢完了（贪心不足蛇吞象）";

            const $tipsDiv = $("<div>").attr({
                class: "snap-up-tips-text",
                title: "商品抢购提示语"
            }).html(tipsText1 + tipsText2);

            $snapUpContainer.append($snapUpButtonListBox, $tipsDiv);

            return $snapUpContainer;
        }

        // 创建商城商品展示表格tr行
        createCommodityTrLine(params) {
            const {
                id,
                name,
                state,
                type,
                rnum,
                cnum,
                tnum,
                snum,
                gl,
                fl,
                startTime,
                endTime,
                price,
                isSatisfy,
                snapUpInput,
                extraParams
            } = params;

            const satisfy_yes = '<ion-icon class="satisfy-icon yes" name="checkmark-circle-outline"></ion-icon>';
            const satisfy_no = '<ion-icon class="satisfy-icon no" name="close-circle-outline"></ion-icon>';

            const surplusClass = tnum > 0 ? snum > 0 ? "satisfy-yes" : "satisfy-no" : "satisfy-yes";

            const glClass = extraParams.userGameLevel > extraParams.commodityConditionGameLevel
                ? "satisfy-yes"
                : "satisfy-no";

            const flClass = extraParams.userForumLevel > extraParams.commodityConditionForumLevel
                ? "satisfy-yes"
                : "satisfy-no";

            const startTimeClass = extraParams.validStartDate > new Date().getTime()
                ? "satisfy-future"
                : "satisfy-past del";

            const endTimeClass = extraParams.validEndDate > new Date().getTime()
                ? "satisfy-future"
                : "satisfy-past del";

            const coinClass = extraParams.userCoinNumber > price
                ? "satisfy-yes"
                : "satisfy-no";

            const $tr = $(`<tr>
                <td class="commodity-id">${id}</td>
                <td class="commodity-name">${name}</td>
                <td class="commodity-state"></td>
                <td class="commodity-type">${type}</td>
                <td class="commodity-restrictionNumber ${rnum > 0 ? cnum == rnum ? "satisfy-yes satisfy-line-red" : "satisfy-yes" : "satisfy-no"}">
                    ${rnum}
                </td>
                <td class="commodity-cycleBuyNumber ${rnum > 0 ? cnum == rnum ? "satisfy-yes satisfy-line-red" : "satisfy-unused" : "satisfy-no"}">
                    ${cnum}
                </td>
                <td class="commodity-totalNumber satisfy-yes">
                    ${tnum !== 0 ? tnum : "∞"}
                </td>
                <td class="commodity-surplusNumber ${surplusClass}">
                    ${tnum == 0 && snum == 0 ? "∞" : snum}
                </td>
                <td class="commodity-condition_gl ${glClass}">${gl}</td>
                <td class="commodity-condition_fl ${flClass}">${fl}</td>
                <td class="commodity-startTime ${startTimeClass}">${startTime}</td>
                <td class="commodity-endTime ${endTimeClass}">${endTime}</td>
                <td class="commodity-price ${coinClass}">${price}</td>
                <td class="commodity-isSatisfy"></td>
            </tr>`);

            $tr.find(".commodity-state").append(state ? $(satisfy_yes) : $(satisfy_no));
            $tr.find(".commodity-isSatisfy").append(isSatisfy ? $(satisfy_yes) : $(satisfy_no));

            if (snapUpInput) {
                const $td = $("<td>").attr({
                    class: "commodity-isSnapUp"
                });

                const $input = $("<input>").attr({
                    id: snapUpInput.id,
                    name: snapUpInput.name,
                    type: "checkbox",
                    "data-price": price
                });

                $input.on("change", (event) => {
                    event = event || window.event;
                    const commodityid = $(event.target).attr("id");
                    const commodityName = $(event.target).attr("name");
                    const inputState = $(event.target).prop("checked");
                    const price = $(event.target).attr("data-price");
                    if (inputState) {
                        const commodityObj = this.commodityList.find(commodityMap => {
                            return commodityMap.id === commodityid && commodityMap.name === commodityName;
                        });

                        const paramsMap = {
                            buyNum: commodityObj.restrictionNumber || 1,
                            commodityId: commodityObj.id || commodityid,
                            totalPrice: commodityObj.price,
                            uid: this.userInfoCacheMap.gameUid,
                            userAddressId: this.userAddressInfoMap ? this.userAddressInfoMap.id : ""
                        };

                        const params = this.convertUrlParams("", paramsMap).replace("?", "");

                        const dataMap = {
                            id: commodityObj.id,
                            name: commodityObj.name,
                            price: commodityObj.price,
                            startTime: commodityObj.validStartDate,
                            params: params
                        };

                        this.snapUpQueryDataList.push(dataMap);
                        this.snapUpCommodityTotalPrice += commodityObj.price;

                    } else {
                        const filterList = this.snapUpQueryDataList.filter(queryDataMap => {
                            return queryDataMap.id !== commodityid && queryDataMap.name !== commodityName;
                        });
                        this.snapUpQueryDataList = filterList;
                        this.snapUpCommodityTotalPrice -= price;
                    };
                })

                if (!isSatisfy) {
                    $input.prop("disabled", true);
                };

                $td.append($input);
                $tr.append($td);
            };

            return $tr;
        }

        // 创建草稿箱选项下拉菜单
        createDraftSelect({ id, configKey }) {
            const $select = $("<select>").attr({
                id: id,
                class: "draft-list-select"
            });

            $select.on("change", (event) => {
                event = event || window.event;
                const draftPostId = event.target.value;

                if (draftPostId === "0") {
                    const customContent = {
                        id: "",
                        content: "",
                        contentJson: "{}",
                        title: "",
                        cacheList: this.toolsStateDataConfig.customContentConfig[configKey].cacheList
                    };
                    this.toolsStateDataConfig.customContentConfig[configKey] = customContent;
                    this.saveDataToLocalStorage();
                    return;
                };

                if (this.draftPostList && Array.isArray(this.draftPostList)) {
                    this.draftPostList.map(draftPost => {
                        if (draftPost.id === draftPostId) {
                            const customContent = {
                                id: draftPost.id,
                                content: draftPost.content,
                                contentJson: draftPost.contentJson,
                                title: draftPost.title,
                                cacheList: this.toolsStateDataConfig.customContentConfig[configKey].cacheList
                            }
                            this.toolsStateDataConfig.customContentConfig[configKey] = customContent;
                            this.saveDataToLocalStorage();
                            return;
                        }
                    })
                };
            });

            return $select;
        }

        // 创建追加到基础设置中特殊功能的自定义设置部分
        createAppendBasicSpecialBody() {
            const $div = $("<div>").attr({
                class: "basic-setting-container"
            });

            const $button1 = this.createToolsButton({
                id: "isDeleteMyAllPost",
                cls: "tools-button",
                text: "删除所有帖子",
                style: "",
                disabled: !this.toolsStateDataConfig.stateConfig.isDeleteMyAllPost
            });

            this.bindToolsButtonClickEvent({
                $button: $button1,
                id: "isDeleteMyAllPost",
                handler: "recursionQueryData",
                handlerType: 4
            });

            const $button2 = this.createToolsButton({
                id: "isDeleteMyAllComment",
                cls: "tools-button",
                text: "删除所有评论",
                style: "",
                disabled: !this.toolsStateDataConfig.stateConfig.isDeleteMyAllComment
            });

            this.bindToolsButtonClickEvent({
                $button: $button2,
                id: "isDeleteMyAllComment",
                handler: "getUserSpaceAllComment",
                handlerType: 0
            });

            const $button3 = this.createToolsButton({
                id: "isCancelMyAllLikeState",
                cls: "tools-button",
                text: "撤销所有点赞",
                style: "",
                disabled: !this.toolsStateDataConfig.stateConfig.isCancelMyAllLikeState
            });

            this.bindToolsButtonClickEvent({
                $button: $button3,
                id: "isCancelMyAllLikeState",
                handler: "recursionQueryData",
                handlerType: 5
            });

            const $button4 = this.createToolsButton({
                id: "isClearUserLocalData",
                cls: "tools-button",
                text: "删除本地缓存",
                style: "",
                disabled: !this.toolsStateDataConfig.stateConfig.isClearUserLocalData
            });

            $button4.on("click", (event) => {
                event = event || window.event;

                this.toolsLocalStorage({
                    handle: "removeItem"
                });

                window.location.reload();
            });

            const $button5 = this.createToolsButton({
                id: "isResetToolsDefaultState",
                cls: "tools-button",
                text: "重置工具状态",
                style: "",
                disabled: !this.toolsStateDataConfig.stateConfig.isResetToolsDefaultState
            });

            $button5.on("click", (event) => {
                event = event || window.event;
                this.toolsStateDataConfig = this.toolsDefaultStateConfig;
                this.saveDataToLocalStorage();
                window.location.reload();
            })

            $div.append($button1, $button2, $button3, $button4, $button5);
            return $div;
        }

        // 绑定特殊设置工具按钮点击事件
        bindToolsButtonClickEvent({ $button, id, handler, handlerType }) {
            let timer = null;
            $button.on({
                click: (event) => {
                    event = event || window.event;
                    event.preventDefault();
                    event.stopPropagation();
                    clearTimeout(timer);
                    const str1 = "该功能会删除个人用户数据，数据无价，请谨慎操作！";
                    const str2 = "请确认无误后双击即可执行该脚本，执行进度请按F12打开控制台查看。";
                    timer = setTimeout(() => {
                        alert(`${str1}\n${str2}`);
                    }, 300);
                },
                dblclick: (event) => {
                    event = event || window.event;
                    event.preventDefault();
                    event.stopPropagation();

                    clearTimeout(timer);

                    const state = this.toolsStateDataConfig.stateConfig[id];

                    console.clear();

                    if (state && handler && handler === "recursionQueryData") {
                        if (id === "isDeleteMyAllPost") {
                            this.recursionQueryData(true, 0, handlerType, "deleteMyPagePost");
                        };
                        if (id === "isCancelMyAllLikeState") {
                            this.recursionQueryData(true, 0, handlerType, "cancelLikeState");
                        };
                    };

                    if (state && handler && handler === "getUserSpaceAllComment") {
                        if (id === "isDeleteMyAllComment") {
                            this.getUserSpaceAllComment().then(resList => {
                                const commetIdList = resList.map(itemMap => itemMap.reply.reply.id);
                                this.deleteMyComment(commetIdList);
                            });
                        };
                    };
                }
            });
        }

        // 创建追加到每日任务中自定义内容的模板
        createDayTaskCustomBodyTemplate(params) {
            const {
                $select,
                button1Text,
                button1Func,
                button2Href,
                hrefParams,
                button2Text,
                selectId,
                configKey,
                centerText,
                description,
            } = params;

            const $containerDiv = $("<div>").attr({
                class: "daytask-draft-container",
                "data-belong": configKey
            });

            const $selectBox = $("<div>").attr({
                class: "draft-select-list-box",
                "data-belong": configKey
            });

            const $span = $("<span>").text("选择草稿内容：");

            const $doTestContentButton = $("<button>").attr({
                type: "button",
                role: "button",
                class: "ys4fun-tools-test-button",
                "data-belong": configKey
            }).text(button1Text);

            $doTestContentButton.on("click", (event) => {
                event = event || window.event;

                $(event.target).attr("disabled", "disabled");
                $(event.target).hide("fast", "linear");

                $(`.review-post-button-list-box[data-belong="${configKey}"]`).show("fast");
                $(`.reviewPostButtonListBox-line[data-belong="${configKey}"]`).show("fast");

                setTimeout(() => {
                    $(event.target).show("fast", "linear");
                    $(event.target).removeAttr("disabled");
                }, 15000);

                let promise = new Promise((resolve, reject) => {
                    if (button1Func === "changePostReleaseState") {
                        this.changePostReleaseState()
                            .then(res => {
                                resolve(res);
                            })
                            .catch(err => reject(err));
                    };

                    if (button1Func === "changePostReviewState") {
                        this.changePostReviewState()
                            .then(res => {
                                resolve(res)
                            })
                            .catch(err => reject(err));
                    };
                });

                promise.then(res => {
                    const $lookTestContetButton = $("<button>").attr({
                        type: "button",
                        role: "button",
                        class: "ys4fun-tools-test-button"
                    });

                    const params = (hrefParams === "userId" ? this.userInfo.id : hrefParams) || res;

                    if (!params) {
                        const $listBox = $(`.review-post-button-list-box[data-belong="${configKey}"]`);
                        const $listBoxLine = $(`.reviewPostButtonListBox-line[data-belong="${configKey}"]`);
                        if (!$listBox.children().length) {
                            $listBox.hide();
                            $listBoxLine.hide();
                        };
                        return;
                    };

                    const lookText = hrefParams !== "userId" ? button2Text + "-" + params : button2Text;

                    const $a = $("<a>").attr({
                        href: button2Href + params,
                        target: "_blank"
                    }).text(lookText);

                    $lookTestContetButton.on("click", (event) => {
                        event = event || window.event;
                        $(event.delegateTarget).remove()
                    });

                    $lookTestContetButton.append($a);

                    $(`.review-post-button-list-box[data-belong="${configKey}"]`).append($lookTestContetButton);
                }).catch(err => {
                    console.log(err);

                });
            });

            const $reviewPostButtonListBox = $("<div>").attr({
                class: "review-post-button-list-box",
                "data-belong": configKey
            }).css("display", "none");

            const $draftButtonListBox = $("<div>").attr({
                class: "draft-button-list-box",
                "data-belong": configKey
            });

            const $randomContentMapListBox = $("<div>").attr({
                class: "random-content-list-box",
                "data-box-id": configKey,
                "data-belong": configKey
            }).css("display", "none");

            if (this.toolsStateDataConfig.customContentConfig[configKey]["cacheList"].length > 0) {
                $randomContentMapListBox.css("display", "block");
            };

            const $randomContentListUl = this.createCustomContentDraftRandomListTemplate(configKey);

            const $refreshSelectButton = $("<button>").attr({
                type: "button",
                role: "button",
                class: "ys4fun-tools-test-button"
            }).text("刷新选单");

            $refreshSelectButton.on("click", () => {
                $(selectId).children().remove();
                this.refreshDraftPostList();
            });

            const $addRandomContentForListButton = $("<button>").attr({
                type: "button",
                role: "button",
                class: "ys4fun-tools-test-button"
            }).text("添加到随机内容列表");

            $addRandomContentForListButton.on("click", (event) => {
                event = event || window.event;

                const draftId = $(selectId).val();

                if (draftId === "0") return;

                $(`.random-content-list-box[data-belong="${configKey}"]`).show("fast");
                $(`.randomContentMapListBox-line[data-belong="${configKey}"]`).show("fast");

                if (Array.isArray(this.draftPostList) && this.draftPostList.length > 0) {
                    const isExist = this.toolsStateDataConfig.customContentConfig[configKey]["cacheList"].find(item => item.id == draftId);

                    if (!isExist) {
                        this.draftPostList.map(draftPostMap => {
                            if (draftPostMap.id == draftId) {
                                const customContentMap = {
                                    id: draftPostMap.id,
                                    content: draftPostMap.content,
                                    contentJson: draftPostMap.contentJson,
                                    title: draftPostMap.title
                                };
                                this.toolsStateDataConfig.customContentConfig[configKey]["cacheList"].push(customContentMap);
                                this.saveDataToLocalStorage();
                                return;
                            };
                        });
                    };
                };

                const $newRandomContentListUl = this.createCustomContentDraftRandomListTemplate(configKey);

                $(`.random-content-list-box[data-belong="${configKey}"]`).children().remove();
                $(`.random-content-list-box[data-belong="${configKey}"]`).append($newRandomContentListUl);

            })

            $draftButtonListBox.append(
                $refreshSelectButton,
                $addRandomContentForListButton,
                $doTestContentButton
            );

            const $appendContainerDiv = $("<div>").css({
                "width": "100%",
                "height": "100%",
                "padding": "5px"
            }).attr({
                class: "daytask-setting-append-container"
            });

            const $center = $("<center>").css({
                "padding": "5px",
                "font-weight": "700"
            }).text(centerText);

            const $p = $("<p>").css({
                "text-indent": "2em",
                "font-size": "12px",
                "line-height": "20px",
                "letter-spacing": "0.25em"
            }).html(description);

            const line = `<div style="border-top: 1px dashed #d8dadb;" data-belong="${configKey}"]>`;

            $selectBox.append($span, $select);

            $appendContainerDiv.append($center, $p);
            $randomContentMapListBox.append($randomContentListUl);

            $containerDiv.append(
                $selectBox,
                $(line),
                $draftButtonListBox,
                $(line),
                $reviewPostButtonListBox,
                $(line).attr("class", "reviewPostButtonListBox-line").css("display", "none"),
                $randomContentMapListBox,
                $(line).attr("class", "randomContentMapListBox-line").css("display", "none"),
                $appendContainerDiv
            );

            return $containerDiv;
        }

        // 创建自定义内容草稿的随机列表
        createCustomContentDraftRandomListTemplate(configKey) {

            $(`div[data-box-id="${configKey}"] .random-content-list`).children().remove();

            const $randomContentListUl = $("<ul>").attr({
                class: "random-content-list",
                "data-id": configKey
            });

            this.toolsStateDataConfig.customContentConfig[configKey]["cacheList"].forEach(contentMap => {

                const $randomContentItemLi = $("<li>").attr({
                    class: "random-content-item",
                    "data-post-id": contentMap.id
                }).css("display", "grid")

                const $idSpan = $("<span>").attr({
                    class: "random-content-item__id",
                    title: "草稿帖子id"
                }).text(contentMap.id);

                const $titleSpan = $("<span>").attr({
                    class: "random-content-item__title",
                    title: "草稿帖子标题"
                }).text(contentMap.title);

                const $handleSpan = $("<span>").attr({
                    class: "random-content-item__handle",
                    title: "从列表中删除该草稿对象"
                });

                const $handleIon = $("<ion-icon>").attr({
                    name: "close-circle-outline",
                });

                $handleIon.on("click", (event) => {
                    event = event || window.event;
                    const $parentLi = $(event.target).parents("li.random-content-item");
                    const $parentUl = $parentLi.parents(`ul[data-id="${configKey}"]`);

                    const id = $parentLi.attr("data-post-id");

                    if ($parentUl.length > 0 && $parentUl.children().length === 1) {

                        const $box = $parentUl.parents("div.random-content-list-box");
                        const $line = $box.siblings(".randomContentMapListBox-line");

                        $parentUl.hide();
                        $box.hide("fast", "linear");
                        $line.hide();
                    }

                    const fiterDataList = this.toolsStateDataConfig.customContentConfig[configKey]["cacheList"].filter(item => {
                        return item.id !== id;
                    });

                    this.toolsStateDataConfig.customContentConfig[configKey]["cacheList"] = fiterDataList;
                    this.saveDataToLocalStorage();
                    $parentLi.remove();
                });

                $handleSpan.append($handleIon);
                $randomContentItemLi.append($idSpan, $titleSpan, $handleSpan);
                $randomContentListUl.append($randomContentItemLi);
            });

            return $randomContentListUl;
        }

        // 创建追加到发帖设置中的自定义设置部分
        createAppendPostedCustomBody() {
            const $select = this.createDraftSelect({
                id: "draft-list-select_posted",
                configKey: "customPostContent"
            });

            const $box = this.createDayTaskCustomBodyTemplate({
                $select: $select,
                button1Text: "测试帖子",
                button1Func: "changePostReleaseState",
                button2Href: "https://bbs.ys4fun.com/posts/",
                hrefParams: "",
                button2Text: "查看帖子",
                selectId: "#draft-list-select_posted",
                configKey: "customPostContent",
                centerText: "开启自定义帖子内容说明",
                description: "在登录的情况下，点击首页的<<我要发布>>按钮, 即可创建帖子的内容,创建好后保存到草稿箱即可在选单列表中查看,选择相应的草稿即可。"
            });

            return $box;
        }

        // 创建自定义评论设置中追加的内容结构
        createAppendCommentCustomBody() {
            const $select = this.createDraftSelect({
                id: "draft-list-select_comment",
                configKey: "customCommentContent"
            });

            const $box = this.createDayTaskCustomBodyTemplate({
                $select: $select,
                button1Text: "测试评论",
                button1Func: "changePostReviewState",
                button2Href: "https://bbs.ys4fun.com/space/",
                hrefParams: "userId",
                button2Text: "查看评论",
                selectId: "#draft-list-select_comment",
                configKey: "customCommentContent",
                centerText: "开启自定义评论内容说明",
                description: "在登录的情况下，点击首页的<<我要发布>>按钮, 即可创建帖子的内容,创建好后保存到草稿箱即可在选单列表中查看,选择相应的草稿即可。"
            });

            return $box;
        }

        // 创建用户信息容器内容主体
        createUserInfoContainerBody() {
            const $box = $("<div>").attr({
                class: "ys4fun-tools-userInfo-container"
            });

            const $ul = $("<ul>").attr({
                class: "ys4fun-tools-userInfo-list"
            });

            this.userInfoConfigList.map(itemMap => {
                const $li = $("<li>").attr({
                    class: "ys4fun-tools-userInfo-list__item",
                    "data-index": itemMap.id
                });

                const $div = $("<div>").attr({
                    class: "userInfo-item-box"
                });

                const $spanTitle = $("<span>").attr({
                    class: "userInfo-item-box__title"
                }).text(itemMap.key);

                const $spanText = $("<span>").attr({
                    class: "userInfo-item-box__text"
                }).text(itemMap.value);

                $div.append($spanTitle, $spanText);
                $li.append($div);
                $ul.append($li);
            });

            $box.append($ul);

            return $box;
        }

        // 创建更改状态的 label 内含span和input
        createChangeStateLabel(params) {
            const {
                inputId,
                spanText,
                inputClass,
                inputType,
                inputState,
                labelClass
            } = params;

            const $label = $("<label>").attr({
                for: inputId,
                class: labelClass || ""
            });

            const $span = $("<span>").text(spanText);

            const $input = $("<input>").attr({
                id: inputId,
                class: inputClass,
                type: inputType,
                checked: inputState
            });

            $input.on("click", (event) => {
                event = event || window.event;
                const id = $(event.target).attr("id");
                const state = $(event.target).is(":checked");
                this.toolsStateDataConfig.stateConfig[id] = state;
                this.saveDataToLocalStorage();
            });

            $label.append($span, $input);
            return $label;
        }

        // 创建工具所用按钮元素
        createToolsButton(params) {
            const {
                id,
                cls,
                text,
                style,
                html,
                disabled
            } = params;

            const $button = $("<button>").attr({
                id: id,
                class: cls,
                disabled: disabled
            });

            style && $button.css({ ...style });
            text && $button.text(text);
            html && $button.html(html);

            return $button;
        }

        // 创建设置选项菜单内容
        createSettingOptionsMenu() {
            const $settingOptionMenu = $("<ul>").attr({
                class: "ys4fun-tools-setting-container-menu"
            });

            this.settingSubMenuList.forEach(itemMap => {
                const $optionItem = $("<li>").attr({
                    id: itemMap.attr.id,
                    class: "ys4fun-tools-setting-container-item",
                    "data-index": itemMap.id
                });

                const $h4 = $("<h4>").attr({
                    class: "ys4fun-tools-setting-container-item__title"
                }).text(itemMap.text);

                $h4.on("click", (event) => {
                    event = event || window.event;
                    event.stopPropagation();

                    const $event = $(event.target);
                    const $optionsLi = $event.parents(".ys4fun-tools-setting-container-item");
                    const $subitemUl = $optionsLi.find(".ys4fun-tools-setting-container-item-subitem-list");
                    const $optionMenu = $optionsLi.parents(".ys4fun-tools-setting-container-menu");
                    const index = $optionsLi.attr("data-index");
                    const id = $optionsLi.attr("id");

                    $optionMenu.find(".ys4fun-tools-setting-container-item-subitem__item").removeClass("active");
                    $optionsLi.toggleClass("active");
                    $optionsLi.siblings().removeClass("active");
                    $optionsLi.siblings().find(".ys4fun-tools-setting-container-item-subitem-list").hide("fast");

                    const $subitemLi = $subitemUl.find(".ys4fun-tools-setting-container-item-subitem__item");
                    const $optionsMenu = $subitemUl.parents(".ys4fun-tools-setting-container-menu");
                    const $optionsContainerUl = $optionsMenu.siblings(".ys4fun-tools-setting-container-item-content-list");
                    const $optionsContainerLi = $optionsContainerUl.find(`[data-index="${index}"][data-bind-id="${id}"]`);

                    $optionsContainerLi.toggleClass("active");
                    $optionsContainerLi.siblings("li").removeClass("active");
                    $optionsContainerUl.find("li").hide();
                    $optionsContainerUl.find("li").removeClass("active");

                    $subitemUl.hide("fast");
                    $subitemLi.removeClass("active");

                    if ($optionsLi.hasClass("active")) {
                        $subitemUl.show("fast", "linear").children("li").removeClass("active");
                        $optionsContainerLi.show("fast", "linear");
                        $optionsContainerLi.siblings("li").hide();
                    } else {
                        $subitemUl.hide("fast", "linear").children("li").removeClass("active");
                        $optionsContainerLi.hide("fast", "linear").removeClass("active");
                        $optionsContainerLi.siblings("li").hide();
                        $optionsContainerLi.find(".ys4fun-tools-setting-container-item-content-item-subitem__item").hide();
                    };
                });

                const $subitemList = $("<ul>").attr({
                    class: "ys4fun-tools-setting-container-item-subitem-list"
                });

                itemMap.subitemList.forEach(subitemMap => {
                    const $li = $("<li>").attr({
                        id: subitemMap.attr.id,
                        class: "ys4fun-tools-setting-container-item-subitem__item",
                        "data-index": subitemMap.id
                    });

                    $li.on("click", (event) => {
                        event = event || window.event;
                        event.stopPropagation();
                        const $li = $(event.delegateTarget);
                        const $ul = $li.parents(".ys4fun-tools-setting-container-item-subitem-list");
                        const index = $li.attr("data-index");

                        $li.siblings().removeClass("active");
                        $li.toggleClass("active");

                        const $menuLi = $ul.parents(".ys4fun-tools-setting-container-item");
                        const $menuUl = $menuLi.parents(".ys4fun-tools-setting-container-menu");
                        const menuLiId = $menuLi.attr("id");
                        const menuLiIndex = $menuLi.attr("data-index");

                        const $containerUl = $menuUl.siblings(".ys4fun-tools-setting-container-item-content-list");

                        const $containerLi = $containerUl.find(`[data-index="${menuLiIndex}"][data-bind-id="${menuLiId}"]`);
                        $containerLi.show("fast", "linear");

                        const $containerLiItemContent = $containerLi.find(`[data-index="${index}"]`);
                        $containerLiItemContent.toggleClass("active");
                        $containerLiItemContent.siblings().removeClass("active");

                        if ($li.hasClass("active")) {
                            $containerLiItemContent.siblings().hide();
                            $containerLiItemContent.show("fast", "linear");
                        } else {
                            $containerLiItemContent.siblings().hide()
                            $containerLiItemContent.hide("fast", "linear");
                        };
                    });

                    const $span = $("<span>").attr({
                        role: "button"
                    }).text(subitemMap.text);

                    $li.append($span);
                    $subitemList.append($li);
                })

                $optionItem.append($h4, $subitemList);
                $settingOptionMenu.append($optionItem);
            });

            return $settingOptionMenu;
        }

        // 创建工具图标脚本标签
        createToolsIconScriptTag() {
            const scriptTag1 = $("<script>").attr({
                type: "module",
                src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
            });

            const scriptTag2 = $("<script>").attr({
                nomodule: "nomodule",
                src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
            });

            return [scriptTag1, scriptTag2];
        }

        // 创建工具主面板
        createToolsPanel(position) {
            const $toolsPanel = $("<div>").attr({
                id: "ys4fun-tools-panel"
                // title: "ys4fun-tools"
            });

            if (position) {
                $toolsPanel.css({
                    top: position.top + "px",
                    left: position.left + "px"
                });
            };

            const $toolsMenuPanel = this.createToolsMenuPanel();
            $toolsPanel.append($toolsMenuPanel);

            $toolsPanel.on({
                mousedown: (event) => {
                    event = event || window.event;
                    event.stopPropagation();

                    const $button = $(event.target);
                    const $panel = $(event.delegateTarget);
                    const offset = $panel.offset();
                    const className = "ys4fun-tools-menu__button-icon";

                    if (!$button.hasClass(className)) {
                        return;
                    };

                    let ex = event.clientX;
                    let ey = event.clientY;
                    let bx = offset.left;
                    let by = offset.top;
                    let cx = ex - bx;
                    let cy = ey - by;

                    document.onmousemove = (event) => {
                        event = event || window.event;

                        const doc = document.documentElement;

                        let mx = event.clientX;
                        let my = event.clientY;
                        let lx = mx - cx;
                        let ly = my - cy;

                        lx <= 0 ? lx = 0 : lx;
                        ly <= 0 ? ly = 0 : ly;

                        let cw = doc.clientWidth;
                        let ch = doc.clientHeight;
                        let bw = $panel.outerWidth();
                        let bh = $panel.outerHeight();

                        let rx = cw - bw;
                        let ry = ch - bh;

                        lx >= rx ? lx = rx : lx;
                        ly >= ry ? ly = ry : ly;

                        $panel.css("left", lx + "px");
                        $panel.css("top", ly + "px");

                        this.toolPanelPosition = {
                            top: ly,
                            left: lx
                        };

                        this.saveToolPanelPositionToLocalStorage();
                    };
                },
                mouseleave: function (event) {
                    const $panel = $(event.delegateTarget);
                    const $menu = $panel.find(".ys4fun-tools-menu-panel");
                    $menu.removeClass("active");
                }
            });

            $toolsPanel.on("dblclick", ".ys4fun-tools-menu__open-button", (event) => {
                const $panel = $(event.delegateTarget);
                $panel.hide();
            });

            document.onmouseup = (event) => {
                document.onmousemove = null;
            };

            return $toolsPanel;
        }
    }
    // 签名生成器
    const SignatureGenerator = class {
        static key = "d9d973c01b3517aef6b9c2a7dacde323";
        static str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        static len = 10;
        // 创建签名唯一的id
        static createNonce() {
            const str = this.str;
            let nonce = "";
            for (let i = 0; i < this.len; i++) {
                const rand = Math.floor(Math.random() * str.length);
                nonce += str.charAt(rand)
            }
            return nonce;
        }
        // 构建签名
        static signatureBuilder(t) {
            function e(D, k) {
                return D << k | D >>> 32 - k
            }
            function n(D, k) {
                var M, K, ee, le, ve;
                return ee = D & 2147483648,
                    le = k & 2147483648,
                    M = D & 1073741824,
                    K = k & 1073741824,
                    ve = (D & 1073741823) + (k & 1073741823),
                    M & K ? ve ^ 2147483648 ^ ee ^ le : M | K ? ve & 1073741824 ? ve ^ 3221225472 ^ ee ^ le : ve ^ 1073741824 ^ ee ^ le : ve ^ ee ^ le
            }
            function r(D, k, M) {
                return D & k | ~D & M
            }
            function i(D, k, M) {
                return D & M | k & ~M
            }
            function a(D, k, M) {
                return D ^ k ^ M
            }
            function s(D, k, M) {
                return k ^ (D | ~M)
            }
            function l(D, k, M, K, ee, le, ve) {
                return D = n(D, n(n(r(k, M, K), ee), ve)),
                    n(e(D, le), k)
            }
            function o(D, k, M, K, ee, le, ve) {
                return D = n(D, n(n(i(k, M, K), ee), ve)),
                    n(e(D, le), k)
            }
            function c(D, k, M, K, ee, le, ve) {
                return D = n(D, n(n(a(k, M, K), ee), ve)),
                    n(e(D, le), k)
            }
            function u(D, k, M, K, ee, le, ve) {
                return D = n(D, n(n(s(k, M, K), ee), ve)),
                    n(e(D, le), k)
            }
            function d(D) {
                for (var k, M = D.length, K = M + 8, ee = (K - K % 64) / 64, le = (ee + 1) * 16, ve = Array(le - 1), we = 0, H = 0; H < M;)
                    k = (H - H % 4) / 4,
                        we = H % 4 * 8,
                        ve[k] = ve[k] | D.charCodeAt(H) << we,
                        H++;
                return k = (H - H % 4) / 4,
                    we = H % 4 * 8,
                    ve[k] = ve[k] | 128 << we,
                    ve[le - 2] = M << 3,
                    ve[le - 1] = M >>> 29,
                    ve
            }
            function h(D) {
                var k = "", M = "", K, ee;
                for (ee = 0; ee <= 3; ee++)
                    K = D >>> ee * 8 & 255,
                        M = "0" + K.toString(16),
                        k = k + M.substr(M.length - 2, 2);
                return k
            }
            function v(D) {
                D = D.replace(/\r\n/g, `
        `);
                for (var k = "", M = 0; M < D.length; M++) {
                    var K = D.charCodeAt(M);
                    K < 128 ? k += String.fromCharCode(K) : K > 127 && K < 2048 ? (k += String.fromCharCode(K >> 6 | 192),
                        k += String.fromCharCode(K & 63 | 128)) : (k += String.fromCharCode(K >> 12 | 224),
                            k += String.fromCharCode(K >> 6 & 63 | 128),
                            k += String.fromCharCode(K & 63 | 128))
                }
                return k
            }
            var p = Array(), g, y, S, A, _, b, w, C, T, E = 7, P = 12, L = 17, I = 22, R = 5, B = 9, V = 14, Y = 20, F = 4, ie = 11, Z = 16, U = 23, ae = 6, te = 10, se = 15, X = 21;
            for (t = v(t),
                p = d(t),
                b = 1732584193,
                w = 4023233417,
                C = 2562383102,
                T = 271733878,
                g = 0; g < p.length; g += 16)
                y = b,
                    S = w,
                    A = C,
                    _ = T,
                    b = l(b, w, C, T, p[g + 0], E, 3614090360),
                    T = l(T, b, w, C, p[g + 1], P, 3905402710),
                    C = l(C, T, b, w, p[g + 2], L, 606105819),
                    w = l(w, C, T, b, p[g + 3], I, 3250441966),
                    b = l(b, w, C, T, p[g + 4], E, 4118548399),
                    T = l(T, b, w, C, p[g + 5], P, 1200080426),
                    C = l(C, T, b, w, p[g + 6], L, 2821735955),
                    w = l(w, C, T, b, p[g + 7], I, 4249261313),
                    b = l(b, w, C, T, p[g + 8], E, 1770035416),
                    T = l(T, b, w, C, p[g + 9], P, 2336552879),
                    C = l(C, T, b, w, p[g + 10], L, 4294925233),
                    w = l(w, C, T, b, p[g + 11], I, 2304563134),
                    b = l(b, w, C, T, p[g + 12], E, 1804603682),
                    T = l(T, b, w, C, p[g + 13], P, 4254626195),
                    C = l(C, T, b, w, p[g + 14], L, 2792965006),
                    w = l(w, C, T, b, p[g + 15], I, 1236535329),
                    b = o(b, w, C, T, p[g + 1], R, 4129170786),
                    T = o(T, b, w, C, p[g + 6], B, 3225465664),
                    C = o(C, T, b, w, p[g + 11], V, 643717713),
                    w = o(w, C, T, b, p[g + 0], Y, 3921069994),
                    b = o(b, w, C, T, p[g + 5], R, 3593408605),
                    T = o(T, b, w, C, p[g + 10], B, 38016083),
                    C = o(C, T, b, w, p[g + 15], V, 3634488961),
                    w = o(w, C, T, b, p[g + 4], Y, 3889429448),
                    b = o(b, w, C, T, p[g + 9], R, 568446438),
                    T = o(T, b, w, C, p[g + 14], B, 3275163606),
                    C = o(C, T, b, w, p[g + 3], V, 4107603335),
                    w = o(w, C, T, b, p[g + 8], Y, 1163531501),
                    b = o(b, w, C, T, p[g + 13], R, 2850285829),
                    T = o(T, b, w, C, p[g + 2], B, 4243563512),
                    C = o(C, T, b, w, p[g + 7], V, 1735328473),
                    w = o(w, C, T, b, p[g + 12], Y, 2368359562),
                    b = c(b, w, C, T, p[g + 5], F, 4294588738),
                    T = c(T, b, w, C, p[g + 8], ie, 2272392833),
                    C = c(C, T, b, w, p[g + 11], Z, 1839030562),
                    w = c(w, C, T, b, p[g + 14], U, 4259657740),
                    b = c(b, w, C, T, p[g + 1], F, 2763975236),
                    T = c(T, b, w, C, p[g + 4], ie, 1272893353),
                    C = c(C, T, b, w, p[g + 7], Z, 4139469664),
                    w = c(w, C, T, b, p[g + 10], U, 3200236656),
                    b = c(b, w, C, T, p[g + 13], F, 681279174),
                    T = c(T, b, w, C, p[g + 0], ie, 3936430074),
                    C = c(C, T, b, w, p[g + 3], Z, 3572445317),
                    w = c(w, C, T, b, p[g + 6], U, 76029189),
                    b = c(b, w, C, T, p[g + 9], F, 3654602809),
                    T = c(T, b, w, C, p[g + 12], ie, 3873151461),
                    C = c(C, T, b, w, p[g + 15], Z, 530742520),
                    w = c(w, C, T, b, p[g + 2], U, 3299628645),
                    b = u(b, w, C, T, p[g + 0], ae, 4096336452),
                    T = u(T, b, w, C, p[g + 7], te, 1126891415),
                    C = u(C, T, b, w, p[g + 14], se, 2878612391),
                    w = u(w, C, T, b, p[g + 5], X, 4237533241),
                    b = u(b, w, C, T, p[g + 12], ae, 1700485571),
                    T = u(T, b, w, C, p[g + 3], te, 2399980690),
                    C = u(C, T, b, w, p[g + 10], se, 4293915773),
                    w = u(w, C, T, b, p[g + 1], X, 2240044497),
                    b = u(b, w, C, T, p[g + 8], ae, 1873313359),
                    T = u(T, b, w, C, p[g + 15], te, 4264355552),
                    C = u(C, T, b, w, p[g + 6], se, 2734768916),
                    w = u(w, C, T, b, p[g + 13], X, 1309151649),
                    b = u(b, w, C, T, p[g + 4], ae, 4149444226),
                    T = u(T, b, w, C, p[g + 11], te, 3174756917),
                    C = u(C, T, b, w, p[g + 2], se, 718787259),
                    w = u(w, C, T, b, p[g + 9], X, 3951481745),
                    b = n(b, y),
                    w = n(w, S),
                    C = n(C, A),
                    T = n(T, _);
            return (h(b) + h(w) + h(C) + h(T)).toLowerCase()
        }
        // 获取签名结果
        static getSignatureResult(t, e, n, r) {
            let i = "";
            const a = [];
            for (const s in t) a.push(s);
            a.sort();
            for (const s of a) i = i + "&" + s + "=" + t[s];
            return i = i.substring(1) + "&appSecret=" + n + "&nonce=" + e + "&timestamp=" + r,
                this.signatureBuilder(i);
        }
        // 获取签名后的请求参数
        static getSignaturedParams(t) {
            const e = new Date().getTime(), 
                n = this.createNonce(), 
                r = this.key;
            if (t.headers && ((t == null ? void 0 : t.headers["Content-Type"]) === "application/json" || (t == null ? void 0 : t.headers["content-type"]) === "application/json")) {
                const a = JSON.stringify(t.data) + "&appSecret=" + r + "&nonce=" + n + "&timestamp=" + e;
                t.headers["X-API-TIMESTAMP"] = e,
                t.headers["X-API-NONCE"] = n,
                t.headers["X-API-SIGNATURE"] = this.signatureBuilder(a),
                t.headers["X-API-SIGNTYPE"] = "md5"
            } else
                t.headers = {},
                t.headers["X-API-TIMESTAMP"] = e,
                t.headers["X-API-NONCE"] = n,
                t.headers["X-API-SIGNATURE"] = this.getSignatureResult(t.params || t.data, n, r, e),
                t.headers["X-API-SIGNTYPE"] = "md5";
            return t
        }
    }
    // 工具类
    const Ys4funForumTools = class extends ElementTemplate {
        constructor() {
            super()
            this.tokenKey = "bbs-token";
            this.postTitle = "管理员每日签到贴";
            this.clientType = "1";
            this.gameId = "1";
            this.toolsVersions = "V1.10.0";
            this.apiConfig = {
                main: "https://bbs-api.ys4fun.com/bbs-api",
                post: {
                    getPostListUrl: "/post/list",
                    changeLikeStateUrl: "/post_like/add",
                    getBrowseStateUrl: "/post/get/",
                    addReviewPostUrl: "/reply/add",
                    changeShareStateUrl: "/post_share/add",
                    createPagePostUrl: "/post/add",
                    deletePagePostUrl: "/post/delete_by_id",
                    getDraftPostUrl: "/post_draft/page",
                    cancelLikeStateUrl: "/post_like/cancel"
                },
                dayTask: {
                    url: "/user_coin/my_coin",
                    myLevel: "/user_level/my_level"
                },
                signIn: {
                    url: "/user_sign_in/add"
                },
                emoji: {
                    url: "/emoji/list"
                },
                topics: {
                    url: "/topic/recommend_list/1/10"
                },
                comment: {
                    deleteUrl: "/reply/delete/",
                    userSpaceUrl: "/reply/list_by_user_id"
                },
                user: {
                    address: "/user_address/list",
                    info: "/user/get_user_info"
                },
                commodity: {
                    url: "/commodity/page",
                    buy: "/commodity/buy"
                }
            };
            this.message = {
                100: "您处于未登录状态，请先登录！",
                101: "获取页面帖子错误，请刷新页面！",
                102: "弥弥尔提醒您：每日任务已完成",
                103: "未登录状态: 该消息提示100次！",
                104: "操作超时状态: 请重新刷新页面！",
                105: "感谢您的登录：祝您生活愉快！",
                106: "您当前处已经处于退出登录状态!",
                107: "请重新检查您的登录状态！",
                108: "获取页面帖子错误:请刷新！",
                109: "您未选择草稿箱自定义内容！",
                110: "您并未开启该任务功能！",
                111: "您并未开启检查用户登录功能！",
                112: "查询数据完成，3秒后开始删除！",
                113: "您并未开启忽略任务完成进度执行脚本功能！",
                114: "您并未设置帖子的标题无法创建帖子！"
            };
            this.error = {
                100: "bbs-token is not found",
                101: "Get page post error",
                102: "Get emoji list error",
                103: "Get topic list error",
                104: "Get daytask list error"
            };
            this.toolExecutiveInformation = {
                toolsVersions: this.toolsVersions
            };
            this.recursionQueryDataMap = {};
        }

        // 检查客户端是pc还是手机
        checkClientType() {
            const userAgent = navigator.userAgent.toLowerCase();
            const isiPad = userAgent.match(/ipad/i) == "ipad";
            const isiPhone = userAgent.match(/iphone os/i) == "iphone os";
            const isAndroid = userAgent.match(/android/i) == "android";

            if (isAndroid || isiPad || isiPhone) {
                this.clientType = "2";
            };
        }

        // 检查用户登录状态
        checkUserLoginState() {
            const userInfo = this.toolsLocalStorage({
                handle: "getItem",
                key: "userInfo",
                type: "parse"
            });

            if (!userInfo
                || typeof userInfo !== 'object'
                || (typeof userInfo === "object" && Object.keys(userInfo).length == 0)
            ) {
                setTimeout(() => {
                    alert(this.message[100]);
                }, 2000);
                return !1;
            }
            this.userInfo = userInfo;
            this.toolExecutiveInformation.uid = userInfo.id;
            return !0;
        }

        // 获取key为 bbs-token 的token值
        getTokenByCookie() {
            return new Promise((resolve, reject) => {
                document.cookie.split(";").forEach(item => {
                    const cookieKey = item.split("=")[0];
                    const cookieValue = item.split("=")[1];
                    if (cookieKey.trim() === this.tokenKey) {
                        this.bbsToken = cookieValue;
                        resolve(cookieValue);
                    };
                })
                reject(new Error(this.error[100]));
            });
        }

        // 获取页面最新发布的五个帖子数据
        getPagePost() {
            this.postList = [];
            const url = this.apiConfig.main + this.apiConfig.post.getPostListUrl;

            const params = {
                gameId: 1,
                isFirstPage: true,
                lastId: 0,
                size: 5,
                sort: 1,
                listType: 1,
                postType: 0,
                _t: new Date().getTime()
            };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params))
                    .then(res => res.json())
                    .then(res => {
                        if (res && res.data && res.data.list) {
                            this.postList = res.data.list;
                        };
                        resolve(res.data.list);
                    })
                    .catch(err => reject(new Error(this.error[101])));
            });
        }

        // 获取论坛表情包列表
        getEmojiList() {
            this.emojiList = [];
            const url = this.apiConfig.main + this.apiConfig.emoji.url;

            const options = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Authorization": this.bbsToken,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "Client-Type": this.clientType,
                    "_t": new Date().getTime()
                },
                body: "exclude=''"
            };

            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then(res => res.json())
                    .then(res => {
                        if (res && res.data && Array.isArray(res.data)) {
                            res.data.map((item, idx) => {
                                item.emojiList.map(emoji => {
                                    if (emoji.groupId !== "1") {
                                        this.emojiList.push(emoji);
                                    };
                                });
                                if (idx === res.data.length - 1) {
                                    resolve(res.data);
                                };
                            });
                        };
                    })
                    .catch(err => reject(new Error(this.error[102])));
            });
        }

        // 获取论坛主题标签
        getTopicTag() {
            this.topicList = [];
            const url = this.apiConfig.main + this.apiConfig.topics.url;
            const params = { _t: new Date().getTime() };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        "Authorization": this.bbsToken,
                        "Client-Type": this.clientType
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res && res.data && Array.isArray(res.data)) {
                            this.topicList = res.data;
                            resolve(res.data);
                        };
                        reject(new Error(this.error[103]));
                    }).catch(err => reject(err));
            });
        }

        // 获取勇士论坛弥弥尔频道每日任务列表
        getDayTask() {
            const url = this.apiConfig.main + this.apiConfig.dayTask.myLevel;
            const params = { gameId: 1, _t: new Date().getTime() };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        "Authorization": this.bbsToken,
                        "Client-Type": this.clientType
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (
                            res
                            && res.data
                            && res.data.dayTaskList
                            && Array.isArray(res.data.dayTaskList)
                        ) {
                            this.dayTaskList = res.data.dayTaskList;
                            resolve(res.data.dayTaskList);
                        };
                        throw new Error(this.error[104]);
                    })
                    .catch(err => reject(err));
            });
        }

        // 每日任务：点赞帖子
        changePostLikeState(postId = "", listType) {
            const url = this.apiConfig.main + this.apiConfig.post.changeLikeStateUrl;

            let stateArray = [];

            const options = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Authorization": this.bbsToken,
                    "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "Client-Type": this.clientType,
                    "_t": new Date().getTime()
                }
            };

            if (postId && typeof postId === "string") {
                options.body = "postId=" + postId;
                return new Promise((resolve, reject) => {
                    fetch(url, options)
                        .then(res => res.json())
                        .then(res => {
                            console.log({
                                handle: "重新点赞",
                                post: postId,
                                state: res.message,
                                data: res.data,
                                response: res
                            });
                            this.cancelLikeState({
                                _postList: "",
                                isDefaultList: false,
                                rerunParams: postId,
                                isRerun: true,
                                _listType: listType
                            })
                                .then(response => {
                                    if (res.data
                                        && response.response
                                        && response.response.data
                                        && response._listType
                                    ) {
                                        const listData = this.recursionQueryDataMap[response._listType]["data"];
                                        const filterData = listData.filter(map => map.id !== postId);
                                        this.recursionQueryDataMap[response._listType]["data"] = filterData;
                                    };

                                    if (!response.response.data) {
                                        if (this.toolsStateDataConfig.stateConfig.isOpenCycleCancelLike) {
                                            this.changePostLikeState(postId, listType);
                                        };
                                    };
                                });
                            resolve(res);
                        })
                        .catch(err => reject(false));

                });
            };

            this.postList.map(post => {
                options.body = "postId=" + post.id;
                let promise = new Promise((resolve, reject) => {
                    fetch(url, options)
                        .then(res => res.json())
                        .then(res => {
                            console.log({
                                handle: "点赞任务",
                                post: post.id,
                                state: res.message,
                                data: res.data,
                                response: res
                            })
                            resolve(true)
                        })
                        .catch(err => reject(false))
                });
                stateArray.push(promise);
            });

            return new Promise((resolve, reject) => {
                Promise.all(stateArray)
                    .then(res => {
                        if (this.toolsStateDataConfig.stateConfig.isCancelLike) {
                            this.cancelLikeState({
                                _postList: "",
                                isDefaultList: true,
                                rerunParams: "",
                                isRerun: false,
                                _listType: ""
                            });
                        };
                        resolve(true);
                    })
                    .catch(err => reject(err));
            });
        }

        // 每日任务：每日签到
        changeSignInState() {
            const url = this.apiConfig.main + this.apiConfig.signIn.url;

            const queryParams = {
                gameId: this.gameId,
                _t: new Date().getTime()
            };

            const {headers: signatureHeaders } = SignatureGenerator.getSignaturedParams({params: {...queryParams}});

            const params = {
                method: "GET",
                mode: 'cors',
                headers: {
                    ...signatureHeaders,
                    "Authorization": this.bbsToken,
                    "Client-Type": this.clientType,
                    "_t": new Date().getTime()
                }
            };

            return new Promise((resolve, reject) => {
                console.log("sigin", this.convertUrlParams(url, queryParams), params);
                fetch(this.convertUrlParams(url, queryParams), params)
                    .then(res => res.json())
                    .then(res => {
                        console.log({
                            handle: "签到任务",
                            post: "",
                            state: res.message,
                            data: res.data,
                            response: res
                        });
                        resolve(true);
                    })
                    .catch(err => reject(false));
            });
        }

        // 每日任务：浏览帖子
        changePostBrowseState() {
            const url = this.apiConfig.main + this.apiConfig.post.getBrowseStateUrl;
            let stateArray = [];
            let timeout = 0;
            if (this.postList && Array.isArray(this.postList)) {
                this.postList.map(post => {
                    let promise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            fetch(url + post.id + "?_t=" + new Date().getTime(), {
                                method: "GET",
                                mode: "cors",
                                headers: {
                                    "Authorization": this.bbsToken,
                                    "Client-Type": this.clientType
                                }
                            })
                                .then(res => res.json())
                                .then(res => {
                                    console.log({
                                        handle: "浏览任务",
                                        post: post.id,
                                        state: res.message,
                                        data: res.data,
                                        response: res
                                    });
                                    resolve(true);
                                })
                                .catch(err => reject(false));
                        }, timeout)
                    });
                    timeout += 500;
                    stateArray.push(promise);
                });
                timeout = null;
            };

            return new Promise((resolve, reject) => {
                Promise.all(stateArray)
                    .then(res => resolve(true))
                    .catch(err => reject(err));
            });
        }

        // 每日任务：分享帖子
        changeShareState() {
            const url = this.apiConfig.main + this.apiConfig.post.changeShareStateUrl;
            let stateArray = [];
            if (this.postList && Array.isArray(this.postList)) {
                this.postList.map((post, index) => {
                    if (index < 1) {
                        const options = {
                            method: "POST",
                            mode: "cors",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                                "Authorization": this.bbsToken,
                                "Client-Type": this.clientType
                            },
                            body: "postId=" + post.id
                        };
                        let promise = new Promise((resolve, reject) => {
                            fetch(url + "?_t=" + new Date().getTime(), options)
                                .then(res => res.json())
                                .then(res => {
                                    console.log({
                                        handle: "分享任务",
                                        post: post.id,
                                        state: res.message,
                                        data: res.data,
                                        response: res
                                    });
                                    resolve(true);
                                })
                                .catch(err => reject(false));
                        });
                        stateArray.push(promise);
                    };
                });
            }

            return new Promise((resolve, reject) => {
                Promise.all(stateArray)
                    .then(res => resolve(true))
                    .catch(err => reject(err));
            });
        }

        // 每日任务：发布帖子
        changePostReleaseState() {
            const url = this.apiConfig.main + this.apiConfig.post.createPagePostUrl;
            const options = {
                method: 'POST',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    'Content-Type': 'application/json',
                    "Client-Type": this.clientType
                }
            };

            if (this.toolsStateDataConfig.stateConfig.isPostCustomContent) {
                const isOpenRandomDraft = this.toolsStateDataConfig.stateConfig.isOpenRandomPostCustomContentList;
                const cacheList = this.toolsStateDataConfig.customContentConfig.customPostContent.cacheList;

                const customData = isOpenRandomDraft
                    ? cacheList[Math.floor(Math.random() * cacheList.length)]
                    : this.toolsStateDataConfig.customContentConfig.customPostContent;

                if (!customData || !customData.hasOwnProperty("title") || (customData.title === "" && customData.id === "")) {
                    alert(this.message[109]);
                    return Promise.reject(this.message[109]);
                };

                if (customData.title === "") {
                    alert(this.message[114]);
                    return Promise.reject(this.message[114]);
                };

                const contentDataMap = this.checkCustomVariableForDraftContent(customData.contentJson);

                const contentObject = contentDataMap.contentObject;
                const contentJson = contentDataMap.contentJson;

                const queryBody = {
                    title: contentObject.title,
                    content: contentObject.content,
                    categoryId: contentObject.categoryId,
                    draftFlag: false,
                    draftId: "0",
                    originalFlag: false,
                    topics: contentObject.topicList.map(item => item.id),
                    mentionsUserIds: contentObject.mentionsUserIds,
                    imageUrls: contentObject.imageUrls,
                    wordNumber: 0,
                    contentJson: contentJson
                };
                if (contentObject.coverUrl) {
                    queryBody.coverUrl = contentObject.coverUrl;
                    queryBody.coverWidth = contentObject.coverWidth;
                    queryBody.coverHeight = contentObject.coverHeight;
                    queryBody.coverName = "弥弥尔";
                };
                options.body = JSON.stringify(queryBody);
            } else {
                const text = "今天是 " + this.getCurrentDate();
                const content = `<p>${text}</p>`;
                const topic = this.topicList[Math.floor(Math.random() * this.topicList.length)].id;
                const contentJson = JSON.stringify({
                    type: "doc",
                    content: [{
                        attrs: {
                            textAlign: "left"
                        },
                        type: "paragraph",
                        content: [{
                            type: "text",
                            text: content
                        }]
                    }]
                });
                options.body = JSON.stringify({
                    title: this.postTitle,
                    content: content,
                    categoryId: "11",
                    draftFlag: false,
                    draftId: "0",
                    originalFlag: false,
                    topics: [topic],
                    coverUrl: "",
                    coverName: "",
                    mentionsUserIds: [],
                    imageUrls: [],
                    wordNumber: 4,
                    contentJson: contentJson
                });
            };

            const signatureParams = SignatureGenerator.getSignaturedParams({...options, data: JSON.parse(options.body)});

            return new Promise((resolve, reject) => {
                fetch(url, signatureParams)
                    .then(res => res.json())
                    .then(res => {
                        console.log({
                            handle: "发帖任务",
                            post: res.data,
                            state: res.message,
                            data: res.data,
                            response: res
                        });
                        this.delectPostId = res.data;
                        resolve(res.data);
                    })
                    .catch(err => reject(err));
            });
        }

        // 每日任务：评论帖子
        changePostReviewState() {
            let stateArray = [];
            let timeout = 0;
            this.commentList = [];
            const url = this.apiConfig.main + this.apiConfig.post.addReviewPostUrl;

            if (this.postList && Array.isArray(this.postList)) {
                this.postList.map((post, index) => {
                    if (index >= 2) return;
                    const options = {
                        method: 'POST',
                        mode: "cors",
                        headers: {
                            "Authorization": this.bbsToken,
                            'Content-Type': 'application/json',
                            "Client-Type": this.clientType,
                            "_t": new Date().getTime()
                        }
                    };

                    if (this.toolsStateDataConfig.stateConfig.isPostCustomComment) {
                        const isOpenRandomDraft = this.toolsStateDataConfig.stateConfig.isOpenRandomCustomCommentListContent;
                        const cacheList = this.toolsStateDataConfig.customContentConfig.customCommentContent.cacheList;

                        const customData = isOpenRandomDraft
                            ? cacheList[Math.floor(Math.random() * cacheList.length)]
                            : this.toolsStateDataConfig.customContentConfig.customCommentContent;

                        if (!customData || !customData.hasOwnProperty("title") || (customData.title === "" && customData.id === "")) {
                            alert(this.message[109]);
                            return;
                        };

                        const contentObject = JSON.parse(customData.contentJson);

                        options.body = JSON.stringify({
                            content: contentObject.content,
                            gameId: this.gameId,
                            imageUrls: contentObject.imageUrls,
                            mentionsUserIds: contentObject.mentionsUserIds,
                            postId: post.id
                        });
                    } else {
                        const template = "<p>管理员不要水贴哦！<span data-emotion=\"{$id}\"><img src=\"{$src}\" class=\"emotion-image\"></span></p>";
                        const emoji = this.emojiList[Math.floor((Math.random() * this.emojiList.length))];
                        const content = template.replace("{$id}", emoji.id).replace("{$src}", emoji.url);
                        options.body = JSON.stringify({
                            content: content,
                            gameId: this.gameId,
                            imageUrls: [],
                            mentionsUserIds: [],
                            postId: post.id
                        });
                    };
  
                    const signatureParams = SignatureGenerator.getSignaturedParams({...options, data: JSON.parse(options.body)});

                    let promise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            fetch(url, signatureParams)
                                .then(res => res.json())
                                .then(res => {
                                    console.log({
                                        handle: "评论任务",
                                        post: post.id,
                                        state: res.message,
                                        data: res.data,
                                        response: res
                                    });
                                    if (res.message === "SUCCESS" && res.data.id) {
                                        this.commentList.push(res.data.id);
                                        resolve(true);
                                    };
                                })
                                .catch(err => reject(err));
                        }, timeout);
                    });
                    timeout += 500;
                    stateArray.push(promise);
                });
                timeout = null;
            };

            return new Promise((resolve, reject) => {
                Promise.all(stateArray)
                    .then(() => {
                        resolve(true);
                    })
                    .catch(err => reject(err));
            });
        }

        // 删除创建的帖子函数
        deleteMyPagePost(_postId) {
            const url = this.apiConfig.main + this.apiConfig.post.deletePagePostUrl;
            const postId = _postId || this.delectPostId;
            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "Client-Type": this.clientType,
                    "_t": new Date().getTime()
                },
                body: "id=" + postId
            };
            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then(res => res.json())
                    .then(res => {
                        console.log({
                            handle: "删除帖子",
                            post: postId,
                            state: res.message,
                            data: res.data,
                            response: res
                        })
                        resolve(true);
                    })
                    .catch(err => reject(err));
            });
        }

        // 删除评论内容函数
        deleteMyComment(_commentIdList) {
            let stateArray = [];
            let commentUrlList;
            const url = this.apiConfig.main + this.apiConfig.comment.deleteUrl;
            if (_commentIdList && Array.isArray(_commentIdList) && _commentIdList.length > 0) {
                commentUrlList = _commentIdList.map(item => url + item);
            } else {
                commentUrlList = this.commentList ? this.commentList.map(item => url + item) : [];
            };

            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "Client-Type": this.clientType,
                    "_t": new Date().getTime()
                }
            };

            commentUrlList.map(commentUrl => {
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        fetch(commentUrl, options)
                            .then(res => res.json())
                            .then(res => {
                                console.log({
                                    handle: "删除评论",
                                    post: commentUrl.match(/(?<=\/)(\d+)/)[0],
                                    state: res.message,
                                    data: res.data,
                                    response: res
                                });
                                resolve(true);
                            })
                            .catch(err => reject(err));
                    }, 1500);
                });
                stateArray.push(promise);
            });

            return new Promise((resolve, reject) => {
                Promise.all(stateArray)
                    .then(res => resolve(true))
                    .catch(err => reject(err));
            });
        }

        // 撤销帖子点赞状态
        cancelLikeState(params) {
            const {
                _postList,
                isDefaultList,
                rerunParams,
                isRerun,
                _listType
            } = params;

            let stateArray = [];

            const postList = Array.isArray(_postList) && _postList.length > 0
                ? _postList
                : isDefaultList ? this.postList ? this.postList : [] : [];

            if (postList.length === 0 && !rerunParams) return;

            const url = this.apiConfig.main + this.apiConfig.post.cancelLikeStateUrl;

            const options = {
                method: 'POST',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "Client-Type": this.clientType,
                    "_t": new Date().getTime()
                }
            };

            if (rerunParams && typeof rerunParams === "string" && isRerun === true) {
                return new Promise((resolve, reject) => {
                    options.body = "postId=" + rerunParams;
                    fetch(url, options)
                        .then(res => res.json())
                        .then(res => {
                            console.log({
                                handle: "重新撤销点赞",
                                post: rerunParams,
                                state: res.message,
                                data: res.data,
                                response: res
                            });

                            resolve({
                                post: rerunParams,
                                state: res.message,
                                response: res,
                                _listType: _listType
                            });
                        });
                });
            };

            postList.map(post => {
                options.body = "postId=" + post.id;
                let promise = new Promise((resolve, reject) => {
                    fetch(url, options)
                        .then(res => res.json())
                        .then(res => {
                            console.log({
                                handle: "撤销点赞",
                                post: post.id,
                                state: res.message,
                                data: res.data,
                                response: res
                            });
                            if (res && !res.data) {
                                this.changePostLikeState(post.id, _listType);
                            };
                            if (res && res.data && _listType) {
                                const listData = this.recursionQueryDataMap[_listType]["data"];
                                const filterData = listData.filter(map => map.id !== post.id);
                                this.recursionQueryDataMap[_listType]["data"] = filterData;
                            }
                            resolve(true);
                        })
                        .catch(err => reject(err));
                });
                stateArray.push(promise);
            });

            return new Promise((resolve, reject) => {
                Promise.all(stateArray)
                    .then(res => resolve(true))
                    .catch(err => reject(err));
            });
        }

        // 获取草稿箱帖子列表
        getDraftsPost() {
            this.draftPostList = [];
            const url = this.apiConfig.main + this.apiConfig.post.getDraftPostUrl;
            const params = {
                "current": "1",
                "order": "createDate:asc",
                "size": "100",
                "_t": new Date().getTime()
            };
            const options = {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    "Client-Type": this.clientType
                }
            };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), options)
                    .then(res => res.json())
                    .then(res => {
                        if (res && res.data && res.data.records) {
                            this.draftPostList = res.data.records;
                        };
                        resolve(res.data.records);
                    })
                    .catch(err => reject(err));
            });
        }

        // 刷新草稿箱列表
        refreshDraftPostList() {
            this.getDraftsPost().then(result => {
                const $option = $("<option>").attr({
                    value: "0"
                }).text("请选择草稿帖子");

                $(".draft-list-select").children().remove();
                $(".draft-list-select").append($option);

                const localData = this.toolsLocalStorage({
                    handle: "getItem",
                    type: "parse"
                });

                const isHasLocalKey = localData && localData.hasOwnProperty("customContentConfig");

                let customPostContentId = isHasLocalKey
                    ? localData.customContentConfig.customPostContent.id
                    : "";

                let customCommentContentId = isHasLocalKey
                    ? localData.customContentConfig.customCommentContent.id
                    : "";

                result.map(item => {
                    const $option1 = $("<option>").attr({
                        value: item.id
                    }).text(item.id + "-" + item.title);

                    const $option2 = $("<option>").attr({
                        value: item.id
                    }).text(item.id + "-" + item.title);

                    if (customPostContentId !== "" && customPostContentId === item.id) {
                        $option1.attr("selected", "selected");
                    };

                    if (customCommentContentId !== "" && customCommentContentId === item.id) {
                        $option2.attr("selected", "selected");
                    };

                    $("#draft-list-select_posted").append($option1);
                    $("#draft-list-select_comment").append($option2);
                });
            });
        }

        // 查询用户个人空间下所有发送的评论
        getUserSpaceAllComment() {
            const url = this.apiConfig.main + this.apiConfig.comment.userSpaceUrl;
            const params = {
                size: 10000,
                userId: this.userInfo.id,
                _t: new Date().getTime()
            };
            const options = {
                method: 'GET',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    'Content-Type': 'application/json',
                    "Client-Type": this.clientType
                }
            };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), options)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data.size === 0 && res.message === "SUCCESS") {
                            console.log(this.message[112]);
                            console.log("[]");
                            this.userSpaceAllCommentList = [];
                            resolve([]);
                        };
                        if (res.data.size !== 0 && res.message === "SUCCESS") {
                            console.log(this.message[112]);
                            console.log(res.data.list);
                            this.userSpaceAllCommentList = res.data.list;
                            resolve(res.data.list);
                        };
                    })
                    .catch(err => reject(err));
            })
        }

        // 递归查询用户空间下的数据
        recursionQueryData(isFirstPage = true, lastId = 0, listType = 0, handler) {
            if (typeof this.recursionQueryDataMap === "object"
                && !this.recursionQueryDataMap.hasOwnProperty(listType)
                && isFirstPage
            ) {
                this.recursionQueryDataMap[listType] = {};
                this.recursionQueryDataMap[listType].id = listType;
                this.recursionQueryDataMap[listType].state = false;
                this.recursionQueryDataMap[listType].data = [];
                this.recursionQueryDataMap[listType].timer = null;
            };

            if (this.recursionQueryDataMap[listType].state) {
                if (handler === "deleteMyPagePost") {
                    if (!this.recursionQueryDataMap[listType].timer) {
                        this.recursionQueryDataMap[listType].timer = setTimeout(() => {
                            this.recursionQueryDataMap[listType]["data"].map(itemMap => {
                                this.deleteMyPagePost(itemMap.id);
                            });
                            clearTimeout(this.recursionQueryDataMap[listType].timer);
                            this.recursionQueryDataMap[listType].timer = null;
                        }, 3000);
                    };
                    return;
                };
                if (handler === "cancelLikeState") {
                    if (!this.recursionQueryDataMap[listType].timer) {
                        this.recursionQueryDataMap[listType].timer = setTimeout(() => {
                            console.log("执行数据列表：", this.recursionQueryDataMap[listType]["data"])
                            this.cancelLikeState({
                                _postList: this.recursionQueryDataMap[listType]["data"],
                                isDefaultList: false,
                                rerunParams: "",
                                isRerun: false,
                                _listType: listType
                            });
                            clearTimeout(this.recursionQueryDataMap[listType].timer);
                            this.recursionQueryDataMap[listType].timer = null;
                        }, 3000);
                    };
                    return;
                };
                return;
            };

            const url = this.apiConfig.main + this.apiConfig.post.getPostListUrl;

            const params = {
                gameId: this.gameId,
                isFirstPage: isFirstPage,
                lastId: lastId,
                size: 10,
                listType: listType,
                postType: 0,
                userId: this.userInfo.id,
                _t: new Date().getTime()
            };

            const options = {
                method: 'GET',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    'Content-Type': 'application/json',
                    "Client-Type": this.clientType
                }
            };

            fetch(this.convertUrlParams(url, params), options)
                .then(res => res.json())
                .then(res => {
                    console.log(res.data.lastId, res);
                    if (res.data && res.data.list) {
                        res.data.list.forEach(item => {
                            this.recursionQueryDataMap[listType]["data"].push(item);
                        });
                    };

                    if (res.data.lastId === 0 || res.data.lastId === "0") {
                        console.log(this.message[112]);
                        console.log("查询数据列表：", this.recursionQueryDataMap[listType]["data"]);
                        this.recursionQueryDataMap[listType]["state"] = true;
                        this.recursionQueryData(false, 0, listType, handler);
                    };

                    if (res.data.lastId !== 0 || res.data.lastId !== "0") {
                        setTimeout(() => {
                            this.recursionQueryData(false, res.data.lastId, listType, handler);
                        }, 1050);
                    };
                })
                .catch(err => console.log(err));
        }

        // 获取用户设置的收货地址
        getUserAddressList() {
            const url = this.apiConfig.main + this.apiConfig.user.address;
            const params = { _t: new Date().getTime() }

            const options = {
                method: 'GET',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    "Client-Type": this.clientType
                }
            };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), options)
                    .then(res => res.json())
                    .then(res => {
                        if (res && !Array.isArray(res.data) || res.data.length === 0) {
                            this.userAddressInfoMap = null;
                            resolve(res.data);
                            return;
                        };

                        const userDefaultAddress = res.data.find(addressMap => {
                            return addressMap.defaultFlag === true;
                        });

                        if (!userDefaultAddress || userDefaultAddress === undefined) {
                            this.userAddressInfoMap = undefined;
                            resolve(res.data);
                            return;
                        }

                        const {
                            id,
                            name,
                            city,
                            province,
                            district,
                            address,
                            phone
                        } = userDefaultAddress;

                        const addressStr = `[${id}] ${name}-${city}${province}${district}${address}-${phone}`;

                        this.userAddressInfoMap = {
                            id: id,
                            name: name,
                            city: city,
                            province: province,
                            district: district,
                            address: address,
                            phone: phone,
                            name: name,
                            addressStr: addressStr
                        };
                        resolve(res.data);
                    })
                    .catch(err => reject(err));
            });
        }

        // 获取论坛商品列表
        getCommodityList() {
            const url = this.apiConfig.main + this.apiConfig.commodity.url;

            const params = {
                current: 1,
                gameId: 1,
                size: 50,
                _t: new Date().getTime()
            };

            const options = {
                method: 'GET',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    "Client-Type": this.clientType
                }
            };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), options)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data && res.data.records) {
                            resolve(res.data.records);
                        } else {
                            reject(res);
                        };
                    })
                    .catch(err => reject(err));
            });
        }

        // 抢购请求函数
        snapUpQuery(params, timeout) {
            const url = this.apiConfig.main + this.apiConfig.commodity.buy;

            const options = {
                method: 'POST',
                mode: "cors",
                headers: {
                    "Authorization": this.bbsToken,
                    "Client-Type": this.clientType,
                    "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "_t": new Date().getTime()
                },
                body: params
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    fetch(url, options)
                        .then(res => res.json())
                        .then(res => {
                            if (res && res.message === "SUCCESS") {
                                resolve(res.message);
                            } else {
                                reject(res.message);
                            };
                        })
                        .catch(err => reject(err));
                }, timeout)
            });
        }

        // 检查草稿内容中是否有自定义的变量
        checkCustomVariableForDraftContent(contentJson) {
            const contentObject = JSON.parse(contentJson);
            const currentDate = this.getCurrentDate().toString();

            this.setUserInfoCache();

            const regxConfigList = [
                {
                    id: 0,
                    reg: new RegExp(/\$CURRENTDATE\$/g),
                    key: "当前日期xxxx年xx月xx日",
                    value: currentDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1年$2月$3日")
                },
                {
                    id: 1,
                    reg: new RegExp(/\$MYGAMEUID\$/g),
                    key: "我的游戏uid",
                    value: this.userInfoCacheMap.gameUid
                },
                {
                    id: 2,
                    reg: new RegExp(/\$MYGAMELEVEL\$/g),
                    key: "我的游戏等级",
                    value: this.userInfoCacheMap.gameLevel
                },
                {
                    id: 3,
                    reg: new RegExp(/\$MYGAMENICKNAME\$/g),
                    key: "我的游戏昵称",
                    value: this.userInfoCacheMap.gameNickName
                },
                {
                    id: 4,
                    reg: new RegExp(/\$MYGAMEDAYCOUNT\$/g),
                    key: "我的游戏签到天数",
                    value: this.userInfoCacheMap.gameDayCount
                },
                {
                    id: 5,
                    reg: new RegExp(/\$MYFORUMUID\$/g),
                    key: "我的论坛uid",
                    value: this.userInfoCacheMap.bbsId
                },
                {
                    id: 6,
                    reg: new RegExp(/\$MYFORUMCOIN\$/g),
                    key: "我的论坛弥尔币数量",
                    value: this.userInfoCacheMap.bbsCoin
                },
                {
                    id: 7,
                    reg: new RegExp(/\$MYFORUMLEVEL\$/g),
                    key: "我的论坛等级",
                    value: this.userInfoCacheMap.bbsLevel
                },
                {
                    id: 8,
                    reg: new RegExp(/\$MYFORUMNICKNAME\$/g),
                    key: "我的论坛昵称",
                    value: this.userInfoCacheMap.bbsNickName
                }
            ];

            regxConfigList.forEach(regxConfigMap => {
                // title
                if (contentObject.title.match(regxConfigMap.reg)) {
                    contentObject.title = contentObject.title.replaceAll(
                        regxConfigMap.reg,
                        regxConfigMap.value
                    );
                };
                // content
                if (contentObject.content.match(regxConfigMap.reg)) {
                    contentObject.content = contentObject.content.replaceAll(
                        regxConfigMap.reg,
                        regxConfigMap.value
                    );
                };
            });

            return {
                contentObject: contentObject,
                contentJson: JSON.stringify(contentObject)
            };
        }

        // 将 url字符串和 params 对象转换为 fetch get 请求的 url 参数形式
        convertUrlParams(url, params) {
            let paramsArray = [];
            if (!params || typeof params !== "object") return;
            Object.keys(params).forEach(key => {
                paramsArray.push(key + "=" + params[key]);
            });
            return url + "?" + paramsArray.join("&");
        }

        // 转换时间戳函数
        convertDateByTimestamp(timestamp) {
            const date = new Date(timestamp);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            hour = hour < 10 ? "0" + hour : hour;
            minute = minute < 10 ? "0" + minute : minute;
            second = second < 10 ? "0" + second : second;
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }

        // 获取当前日期年月日数字 YYYYMMDD
        getCurrentDate() {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const times = `${year}${month < 10 ? "0" + month : month}${day < 10 ? "0" + day : day}`;
            return Number(times);
        }

        // 检查用户信息配置对象
        checkUserInfoPropertyAndReturn(key1, key2) {
            const localUserInfoMap = this.toolsLocalStorage({
                handle: "getItem",
                key: "userInfo",
                type: "parse"
            });

            this.userInfo = localUserInfoMap;

            if (!this.userInfo
                || this.userInfo === null
                || this.userInfo === undefined
                || typeof this.userInfo !== "object"
            ) {
                console.log("userInfo is not defined");
                return;
            };

            if (typeof this.userInfo === "object"
                && Object.keys(this.userInfo).length === 0
            ) {
                console.log("userInfo is nil object");
                return;
            };

            const isHasKey1 = key1 && this.userInfo.hasOwnProperty(key1) ? true : false;
            const isHasKey2 = isHasKey1 && key2 && this.userInfo[key1].hasOwnProperty(key2) ? true : false;

            return isHasKey1 && !key2 ? this.userInfo[key1] : isHasKey2 ? this.userInfo[key1][key2] : "";
        }

        // 设置用户信息内容
        setUserInfo() {
            const $userInfoUl = $(".ys4fun-tools-userInfo-list");

            this.setUserInfoCache();

            const {
                bbsId,
                bbsNickName,
                bbsLevel,
                bbsCoin,
                bbsUserCreateDate,
                gameServer,
                gameUid,
                gameNickName,
                gameLevel,
                gameUserCreateDate
            } = this.userInfoCacheMap;

            const userAddress = this.userAddressInfoMap
                ? this.userAddressInfoMap.addressStr
                : "";

            const userInfoList = [
                {
                    id: 0,
                    name: "论坛id",
                    value: bbsId
                },
                {
                    id: 1,
                    name: "论坛昵称",
                    value: bbsNickName
                },
                {
                    id: 2,
                    name: "论坛等级",
                    value: bbsLevel
                },
                {
                    id: 3,
                    name: "弥尔币数量",
                    value: bbsCoin
                },
                {
                    id: 4,
                    name: "用户创建日期",
                    value: bbsUserCreateDate
                },
                {
                    id: 5,
                    name: "游戏服务器",
                    value: gameServer
                },
                {
                    id: 6,
                    name: "游戏uid",
                    value: gameUid
                },
                {
                    id: 7,
                    name: "游戏昵称",
                    value: gameNickName
                },
                {
                    id: 8,
                    name: "游戏等级",
                    value: gameLevel
                },
                {
                    id: 9,
                    name: "游戏创建日期",
                    value: gameUserCreateDate
                },
                {
                    id: 10,
                    name: "我的地址",
                    value: userAddress
                }
            ];

            userInfoList.forEach(userInfoMap => {
                $userInfoUl.find(`li[data-index=${userInfoMap.id}] .userInfo-item-box__text`).text(userInfoMap.value);
            });
        }

        // 设置 userInfoCache 数据
        setUserInfoCache() {
            const bbsCreateDateTimestamp = this.checkUserInfoPropertyAndReturn("createDate");
            const gameCreateDateTimestamp = this.checkUserInfoPropertyAndReturn("gameAetherGazerUserVO", "createDate");

            const bbsUserCreateDate = bbsCreateDateTimestamp
                ? this.convertDateByTimestamp(bbsCreateDateTimestamp) + "（服务器时间）"
                : "未获取到论坛用户创建日期";

            const gameUserCreateDate = gameCreateDateTimestamp
                ? this.convertDateByTimestamp(gameCreateDateTimestamp) + "（服务器时间）"
                : "未获取到游戏角色创建日期";

            this.userInfoCacheMap = {
                bbsId: this.checkUserInfoPropertyAndReturn("id"),
                bbsNickName: this.checkUserInfoPropertyAndReturn("nickname"),
                bbsLevel: this.checkUserInfoPropertyAndReturn("gameUserCardVO", "level"),
                bbsCoin: this.checkUserInfoPropertyAndReturn("coin"),
                gameServer: this.checkUserInfoPropertyAndReturn("gameAetherGazerUserVO", "channelName"),
                gameUid: this.checkUserInfoPropertyAndReturn("gameAetherGazerUserVO", "uid"),
                gameNickName: this.checkUserInfoPropertyAndReturn("gameAetherGazerUserVO", "nickName"),
                gameLevel: this.checkUserInfoPropertyAndReturn("gameAetherGazerUserVO", "level"),
                gameDayCount: this.checkUserInfoPropertyAndReturn("gameAetherGazerUserVO", "gameDayCount"),
                bbsUserCreateDate: bbsUserCreateDate,
                gameUserCreateDate: gameUserCreateDate
            };
        }

        // 检查论坛每日任务完成状态
        checkDayTaskState() {
            console.log(this.dayTaskList);

            let stateArray = [];
            const date = this.getCurrentDate();
            const stateConfig = this.toolsStateDataConfig.stateConfig;

            this.toolExecutiveInformation.date = date;

            this.dayTaskList.map(task => {
                switch (task.type) {
                    case 1:
                        // SignIn type=1 count=1 exp=6 coin=60
                        if (stateConfig["isIgnoreCheckState"] || task.percentage !== 100) {
                            if (stateConfig["isRunSignInTask"]) {
                                stateArray.push(this.changeSignInState());
                            };
                        } else {
                            stateArray.push(Promise.resolve(true));
                        };
                        break;
                    case 2:
                        // Like type=2 count=5 exp=10 coin=50
                        if (stateConfig["isIgnoreCheckState"] || task.percentage !== 100) {
                            if (stateConfig["isRunLikeTask"]) {
                                this.changePostLikeState()
                                    .then(res => {
                                        stateArray.push(Promise.resolve(true));
                                        if (this.toolsStateDataConfig.stateConfig.isCancelLike) {
                                            this.cancelLikeState({
                                                _postList: "",
                                                isDefaultList: true,
                                                rerunParams: "",
                                                isRerun: false,
                                                _listType: ""
                                            });
                                        };
                                    })
                                    .catch(err => console.log(err))
                            };
                        } else {
                            stateArray.push(Promise.resolve(true));
                        };
                        break;
                    case 3:
                        // Browse type=3 count=5 exp=10 coin=50
                        if (stateConfig["isIgnoreCheckState"] || task.percentage !== 100) {
                            if (stateConfig["isRunBrowseTask"]) {
                                stateArray.push(this.changePostBrowseState());
                            };
                        } else {
                            stateArray.push(Promise.resolve(true));
                        };
                        break;
                    case 4:
                        // Release type=4 count=1 exp=8 coin=0
                        if (stateConfig["isIgnoreCheckState"] || task.percentage !== 100) {
                            if (stateConfig["isRunPostedTask"]) {
                                this.changePostReleaseState()
                                    .then(res => {
                                        stateArray.push(Promise.resolve(true));
                                        if (stateConfig["isDeletePost"]) {
                                            this.deleteMyPagePost();
                                        };
                                    })
                            };
                            // Share type=12 count=1 exp=0 coin=20
                            if (stateConfig["isRunShareTask"]) {
                                // This task does not in daytask
                                stateArray.push(this.changeShareState());
                            };
                        } else {
                            stateArray.push(Promise.resolve(true));
                        };
                        break;
                    case 5:
                        // Review type=5 count=2 exp=6 coin=0
                        if (stateConfig["isIgnoreCheckState"] || task.percentage !== 100) {
                            if (stateConfig["isRunCommentTask"]) {
                                this.changePostReviewState().then(res => {
                                    stateArray.push(Promise.resolve(true));
                                    if (stateConfig["isDeleteComment"]) {
                                        this.deleteMyComment();
                                    };
                                });
                            };
                        } else {
                            stateArray.push(Promise.resolve(true));
                        };
                        break;
                    default:
                        stateArray.push(Promise.resolve(task));
                        break;
                }
            })

            Promise.all(stateArray).then(res => {
                setTimeout(() => {
                    this.toolExecutiveInformation.state = true;
                    this.saveDataToLocalStorage();
                    alert(this.message[102]);
                }, 2000);
            }).catch(err => {
                this.toolExecutiveInformation.state = false;
                this.saveDataToLocalStorage();
                console.log(err);
            })
        }

        // 获取最新的用户信息数据
        getNewestUserInfoData() {
            const url = this.apiConfig.main + this.apiConfig.user.info;
            const params = {
                userId: this.userInfo.id,
                gameId: this.gameId,
                _t: new Date().getTime()
            };
            const options = {
                method: 'GET',
                mode: "cors",
                headers: {
                    "authorization": this.bbsToken,
                    'Content-Type': 'application/json',
                    "Client-Type": this.clientType
                }
            };

            return new Promise((resolve, reject) => {
                fetch(this.convertUrlParams(url, params), options)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data && res.message === "SUCCESS") {
                            this.toolsLocalStorage({
                                handle: "setItem",
                                key: "userInfo",
                                data: res.data,
                                type: "stringify"
                            });
                            this.setUserInfo();
                        }
                        resolve(res)
                    })
                    .catch(err => reject(err));
            })
        }

        // 初始化函数：获取相关请求数据
        init(isRunGetDayTask = false) {
            const isGetToken = this.getTokenByCookie();
            const isGetNewestUserInfoData = this.getNewestUserInfoData();
            const isGetPagePost = this.getPagePost();
            const isGetEmojiList = this.getEmojiList();
            const isGetTopicList = this.getTopicTag();
            const isGetUserAddressList = this.getUserAddressList();
            return new Promise((resolve, reject) => {
                Promise.all([
                    isGetNewestUserInfoData,
                    isGetToken,
                    isGetPagePost,
                    isGetEmojiList,
                    isGetTopicList,
                    isGetUserAddressList
                ])
                    .then(result => {
                        if (isRunGetDayTask) {
                            this.getDayTask().then(res => {
                                resolve();
                            });
                        } else {
                            resolve();
                        };
                    })
                    .catch(error => reject(error));
            });
        }

        // 工具处理本地存储的函数
        toolsLocalStorage({ handle, key, data, type, uid }) {
            const localFunction = window.localStorage;

            const userId = this.userInfoCacheMap
                ? this.userInfoCacheMap.bbsId
                : this.userInfo ? this.userInfo.id : uid ? uid : "";

            key = key ? key : userId
                ? "Ys4funForumToolsGlobalConfigMap_User_" + userId
                : "Ys4funForumToolsGlobalConfigMap";

            // getItem
            if (handle === "getItem" && key) {
                return type === "parse"
                    ? JSON.parse(localFunction[handle](key))
                    : localFunction[handle](key);
            };
            // setItem
            if (handle === "setItem" && key && data) {
                return type === "stringify"
                    ? localFunction[handle](key, JSON.stringify(data))
                    : localFunction[handle](key, data);
            };
            // removeItem
            if (handle === "removeItem" && key) {
                return localFunction[handle](key);
            };
        }

        // 保存工具全局状态等数据到本地存储中
        saveDataToLocalStorage() {
            const _userInfo = this.toolsLocalStorage({
                handle: "getItem",
                key: "userInfo",
                type: "parse"
            });

            const localData = this.toolsLocalStorage({
                handle: "getItem",
                type: "parse",
                uid: _userInfo
            });

            const nowDate = this.getCurrentDate();

            const executiveInformation = localData
                ? localData.hasOwnProperty("executiveInformation")
                    ? localData.executiveInformation.hasOwnProperty("state")
                        ? localData.executiveInformation
                        : this.toolExecutiveInformation
                    : this.toolExecutiveInformation
                : this.toolExecutiveInformation;

            if (executiveInformation && executiveInformation.hasOwnProperty("date")) {
                if (executiveInformation.date < nowDate) {
                    executiveInformation.date = nowDate;
                };
            } else {
                executiveInformation.date = nowDate;
            };

            const saveData = {
                stateConfig: this.toolsStateDataConfig.stateConfig,
                customContentConfig: this.toolsStateDataConfig.customContentConfig,
                executiveInformation: executiveInformation
            };

            this.toolsLocalStorage({
                handle: "setItem",
                data: saveData,
                type: "stringify"
            });
        }

        // 保存工具面板位置信息到本地存储中
        saveToolPanelPositionToLocalStorage() {
            const localData = this.toolsLocalStorage({
                handle: "getItem",
                type: "parse"
            });

            const saveData = {
                ...localData,
                toolPanelPosition: this.toolPanelPosition
            };

            this.toolsLocalStorage({
                handle: "setItem",
                data: saveData,
                type: "stringify"
            });
        }

        // 添加工具样式
        addStyle() {
            const css = GM_getResourceText("css")
            GM_addStyle(css);
        }

        // 添加工具主面板节点
        addToolsPanel() {
            const localData = this.toolsLocalStorage({
                handle: "getItem",
                type: "parse"
            });
            const position = (localData && localData.hasOwnProperty("toolPanelPosition"))
                ? localData.toolPanelPosition
                : "";
            const toolsPanel = this.createToolsPanel(position);
            const containerPanel = this.createToolsContainerPanel();

            toolsPanel.append(containerPanel);
            $("body").prepend(toolsPanel);

            if (this.clientType === "2") {
                const $container = $(".ys4fun-tools-container");
                if ($container.length > 0) {
                    $(".ys4fun-tools-container").css({
                        "width": "90vw",
                        "height": "90vh"
                    });
                    $(".ys4fun-tools-setting-container-item__title").css({
                        "font-size": "xx-small"
                    });
                };
            };
        }

        // 添加外部 ionicons 图标脚本
        addScript() {
            const scriptElementList = this.createToolsIconScriptTag();
            scriptElementList.forEach($script => {
                $("body").append($script);
            });
        }

        // 脚本入口：执行脚本函数
        executeScript() {
            this.checkClientType();
            const isLogin = this.checkUserLoginState();
            const isCheckLogin = this.toolsStateDataConfig.stateConfig.isGlobalCheckLogin;

            if (!isLogin && isCheckLogin) {
                let timerCount = 0;
                // 这个定时器用来检测用户登录状态的
                let timer = setInterval(() => {
                    timerCount++;

                    const userInfo = this.toolsLocalStorage({
                        handle: "getItem",
                        key: "userInfo",
                        type: "parse"
                    });

                    if ((userInfo === null
                        || typeof userInfo !== 'object'
                        || (typeof userInfo === "object" && Object.keys(userInfo).length === 0))
                        && timerCount <= 100
                    ) {
                        console.log(this.message[103]);
                        if (timerCount === 100) {
                            alert(this.message[104]);
                            clearInterval(timer);
                            timer = null;
                            return;
                        };
                    } else {
                        alert(this.message[105]);
                        clearInterval(timer);
                        timer = null;
                        window.location.reload();
                    };
                }, 1000)
            } else {
                this.init().then(res => {
                    this.addStyle();
                    this.addScript();
                    this.addToolsPanel();
                    this.setUserInfo();
                    this.refreshDraftPostList();
                });

                const __userInfo = this.toolsLocalStorage({
                    handle: "getItem",
                    key: "userInfo",
                    type: "parse"
                });

                const __localData = this.toolsLocalStorage({
                    handle: "getItem",
                    type: "parse",
                    uid: __userInfo.id || ""
                });

                const isClearCache = __localData && __localData.hasOwnProperty("executiveInformation")
                    ? __localData.executiveInformation.hasOwnProperty("toolsVersions")
                        ? __localData.executiveInformation.toolsVersions !== this.toolsVersions
                            ? false
                            : true
                        : false
                    : false;

                if (!isClearCache) {
                    this.toolsLocalStorage({
                        handle: "removeItem"
                    });
                    this.saveDataToLocalStorage();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                };

                if (this.toolsStateDataConfig.stateConfig.isGlobalCheckLogout) {
                    let timeCount = 0;
                    // 这个定时器用来检测用户退出登录的
                    let timer = setInterval(() => {
                        timeCount++;
                        if (timeCount === 1000) {
                            clearInterval(timer);
                            timer = null;
                            timeCount = null;
                            return;
                        };

                        const userInfo = this.toolsLocalStorage({
                            handle: "getItem",
                            key: "userInfo",
                            type: "parse"
                        });

                        if (userInfo === null
                            || typeof userInfo !== 'object'
                            || (typeof userInfo === "object" && Object.keys(userInfo).length === 0)
                        ) {
                            clearInterval(timer);
                            timer = null;
                            console.log(this.message[106]);
                            window.location.reload();
                        };
                    }, 5000);
                };

                if (this.toolsStateDataConfig.stateConfig.isGlobalDayTask) {
                    const _userInfo = this.toolsLocalStorage({
                        handle: "getItem",
                        key: "userInfo",
                        type: "parse"
                    });

                    const localData = this.toolsLocalStorage({
                        handle: "getItem",
                        type: "parse",
                        uid: _userInfo.id || ""
                    });

                    const isHasLocalKey = localData !== null && typeof localData === "object" && Object.keys(localData).length !== 0
                        ? localData.hasOwnProperty("executiveInformation")
                        : "";

                    const toolState = isHasLocalKey ? localData.executiveInformation : "";
                    const date = this.getCurrentDate();

                    const isHasProperty = ["date", "state", "uid"].map(item => {
                        return toolState.hasOwnProperty(item);
                    });

                    if (!toolState
                        || (!isHasProperty[0] || toolState.date < date)
                        || (!isHasProperty[1] || toolState.state === false)
                        || toolState.uid !== _userInfo.id
                    ) {
                        this.init(true).then(res => {
                            this.checkDayTaskState();
                        }).catch(error => {
                            if (error.message === this.error[100]) {
                                alert(`${this.message[107]}\n${error.message}`);
                                return;
                            };
                            if (error.message === this.error[101]) {
                                alert(`${this.message[108]}\n${error.message}`);
                                return;
                            };
                            alert(error.message);
                        });
                    };
                };
            };
        }
    }

    const ys4funForumTools = new Ys4funForumTools();
    ys4funForumTools.executeScript();

})();