// ==UserScript==
// @name        哔哩哔哩视频页功能拓展
// @namespace   https://tampermonkey.net/
// @homepage    https://space.bilibili.com/473239155/dynamic
// @license     Apache-2.0
// @version     0.4.0
// @description 调整B站视频页面的布局展示内容，拓展视频页中的功能
// @author      byhgz
// @match       https://www.bilibili.com/video/*
// @match       https://www.bilibili.com/list/*
// @icon        https://static.hdslb.com/images/favicon.ico
// @require     https://update.greasyfork.org/scripts/517928/gz_ui_css-v1.js
// @require     https://greasyfork.org/scripts/462234-message/code/Message.js?version=1170653
// @require     https://cdn.jsdelivr.net/npm/vue@2
// @require     https://update.greasyfork.org/scripts/516282/Drawer_gz%E9%A1%B5%E9%9D%A2%E4%BE%A7%E8%BE%B9%E6%8A%BD%E5%B1%89%E7%BB%84%E4%BB%B6.js
// @require     https://update.greasyfork.org/scripts/517538/DynamicTabs_gz.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @noframes    
// @downloadURL https://update.greasyfork.org/scripts/507821/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E5%8A%9F%E8%83%BD%E6%8B%93%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/507821/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E5%8A%9F%E8%83%BD%E6%8B%93%E5%B1%95.meta.js
// ==/UserScript==
"use strict";
const Tips = {
    info(text, config) {
        Qmsg.info(text, config);
    },
    infoBottomRight(text) {
        this.info(text, {position: "bottomright"});
    },
    success(text, config) {
        Qmsg.success(text, config);
    },
    successBottomRight(text) {
        this.success(text, {position: "bottomright"});
    },
    error(text, config) {
        Qmsg.error(text, config);
    },
    errorBottomRight(text) {
        this.error(text, {position: "bottomright"});
    }
};
const gmUtil = {
    setData(key, content) {
        GM_setValue(key, content);
    },
    getData(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    },
    delData(key) {
        if (!this.isData(key)) {
            return false;
        }
        GM_deleteValue(key);
        return true;
    },
    isData(key) {
        return this.getData(key) !== undefined;
    },
    addStyle(style) {
        GM_addStyle(style);
    },
    addGMMenu(text, func, shortcutKey = null) {
        return GM_registerMenuCommand(text, func, shortcutKey);
    },
}
const global_BiliBIli_video_page_settings_dataVue = new Vue({
    data() {
        return {
            isDefPlayVideoPage: false,
            isCheckBackLaterPlayVideoPage: false,
        }
    },
    created() {
        this.isDefPlayVideoPage = window.location.href.includes("www.bilibili.com/video/");
        this.isCheckBackLaterPlayVideoPage = window.location.href.includes("www.bilibili.com/list/ml");
    }
});
const drawerGz = new Drawer_gz({
    show: false,
    height: "300px",
    direction: "bottom",
    externalButtonText: "视频页设置",
    externalButtonWidth: "80px",
    externalButtonShow: gmUtil.getData("drawerGzDefShow", true),
    backgroundColor: "#ffffff",
    headerShow: false,
    drawerBorder: "1px solid #00f3ff",
});
drawerGz.setBodyHtml(`<div id="video_page_settings_app"></div>`);
const searchDrawerGz = new Drawer_gz({
    show: false,
    direction: "left",
    width: "auto",
    externalButtonText: "搜索",
    externalButtonWidth: "80px",
    backgroundColor: "#ffffff",
    title:"搜索合集中视频",
    drawerBorder: "1px solid #00f3ff",
    zIndex:1499,
    externalButtonShow: false,
});
searchDrawerGz.setBodyHtml(`<div id="video_page_settings_app_search"></div>`);
const tabsConfig = [
    {id: 'tab1', title: '合集操作', content: '<div id="collection"></div>'},
    {id: 'tab2', title: '评论区操作', content: '<div id="comment-area-comment"></div>'},
    {id: 'tab3', title: '关于和问题反馈', content: '<div id="problem-feedback"></div>'},
];
const options = {
    classes: {
        tabButton: 'my-custom-tab-button',
        tabButtonActive: 'my-custom-tab-button-active',
        tabContent: 'my-custom-tab-content',
        tabContentActive: 'my-custom-tab-content-active'
    },
    backgroundColor: '#eee',
    borderColor: '#ddd',
    textColor: '#333',
    fontWeight: 'bold',
    activeBackgroundColor: '#0056b3',
    activeTextColor: '#fff',
    contentBorderColor: '#bbb',
    contentBackgroundColor: '#ffffff',
};
const dynamicTabsGz = new DynamicTabs_gz('#video_page_settings_app', tabsConfig, options);
new Vue({
    template: `
      <div>
        <div v-if="isDefPlayVideoPage">
          <button gz_type @click="listHighAdaptationBut">视频页合集列表自适应高度</button>
          <button gz_type @click="listHighlyRestoredBut">视频页合集列表高度复原</button>
        </div>
        <div v-if="isCheckBackLaterPlayVideoPage">
          <button gz_type @click="listHighAdaptationCheckBackLaterBut">视频页合集列表自适应高度(稍后再看)</button>
          <button gz_type @click="listHighCheckBackLaterRestoredBut">视频页合集列表高度(稍后再看)</button>
        </div>
        <div>
          <button gz_type @click="openSearchDrawerGzBut">打开合集搜索栏</button>
        </div>
      </div>`,
    el: "#collection",
    data() {
        return {
            isDefPlayVideoPage: false,
            isCheckBackLaterPlayVideoPage: false,
            defVideoListMaxHeight: null,
            videoCheckBackLaterListBodyMaxHeight: null,
            videoCheckBackLaterListMaxHeight: null,
        }
    },
    methods: {
        openSearchDrawerGzBut() {
            searchDrawerGz.show(true);
            drawerGz.show(false);
        },
        listHighAdaptationBut() {
            getDefVideoPlayPageListEl().then(el => {
                if (this.defVideoListMaxHeight === null) {
                    this.defVideoListMaxHeight = el.style.maxHeight;
                }
                el.style.maxHeight = "max-content";
                Tips.successBottomRight("已自适应高度！")
            })
        },
        listHighlyRestoredBut() {
            if (this.defVideoListMaxHeight === null) {
                Tips.errorBottomRight("未自适应高度！无需调整.");
                return;
            }
            getDefVideoPlayPageListEl().then(el => {
                el.style.maxHeight = this.defVideoListMaxHeight;
            })
            Tips.successBottomRight("已复原视频页合集列表高度");
        },
        listHighAdaptationCheckBackLaterBut() {
            getCheckBackLaterVideoListElements().then(({bodyList, listEl, defList}) => {
                if (this.videoCheckBackLaterListBodyMaxHeight === null) {
                    this.videoCheckBackLaterListBodyMaxHeight = bodyList.style.maxHeight;
                    this.videoCheckBackLaterListMaxHeight = listEl.style.maxHeight;
                }
                for (let el of defList) {
                    el.style.maxHeight = "max-content";
                }
            })
        },
        listHighCheckBackLaterRestoredBut() {
            if (this.videoCheckBackLaterListBodyMaxHeight === null) {
                Tips.errorBottomRight("未自适应高度！无需调整.");
                return;
            }
            getCheckBackLaterVideoListElements().then(({bodyList, listEl}) => {
                bodyList.style.maxHeight = this.videoCheckBackLaterListBodyMaxHeight;
                listEl.style.maxHeight = this.videoCheckBackLaterListMaxHeight;
            });
        }
    },
    created() {
        this.isDefPlayVideoPage = global_BiliBIli_video_page_settings_dataVue["isDefPlayVideoPage"];
        this.isCheckBackLaterPlayVideoPage = global_BiliBIli_video_page_settings_dataVue["isCheckBackLaterPlayVideoPage"];
    }
});
const getDefVideoPageCollectionElList = async () => {
    return new Promise(resolve => {
        const i1 = setInterval(() => {
            const elList = document.querySelectorAll(".video-pod__body>.video-pod__list.section>div");
            if (elList.length === 0) return;
            clearInterval(i1);
            const tempList = [];
            for (let el of elList) {
                tempList.push({
                    title: el.querySelector(".title").title.trim(),
                    clickEl: el.querySelector(".single-p>.simple-base-item")
                })
            }
            resolve(tempList)
        }, 500);
    });
}
const getDefVideoPageAnthologyElList = async () => {
    return new Promise(resolve => {
        const i1 = setInterval(() => {
            const elList = document.querySelectorAll(".video-pod__body>.video-pod__list.multip.list>div");
            if (elList.length === 0) return;
            clearInterval(i1);
            const tempList = [];
            for (let el of elList) {
                tempList.push({
                    title: el.querySelector(".title").title.trim(),
                    clickEl: el
                })
            }
            resolve(tempList);
        }, 500);
    })
}
const isDefVideoPageAnthology = (maxIndex = 3) => {
    return new Promise((resolve, reject) => {
        let index = 1;
        const i1 = setInterval(() => {
            if (document.querySelector(".header-top .view-mode") === null) {
                if (index === maxIndex) {
                    clearInterval(i1);
                    reject();
                }
                index++;
                return;
            }
            clearInterval(i1);
            resolve();
        }, 1000);
    })
}
const getCheckBackLaterVideoPageCollectionElList = async () => {
    return new Promise(resolve => {
        const i1 = setInterval(() => {
            const elList = document.querySelectorAll("#playlist-video-action-list>.action-list-inner>div");
            if (elList.length === 0) return;
            clearInterval(i1);
            const tempList = [];
            for (let el of elList) {
                tempList.push({
                    title: el.querySelector(".title").title.trim(),
                    clickEl: el.querySelector(".main")
                })
            }
            resolve(tempList)
        }, 500);
    });
}
new Vue({
    el: "#video_page_settings_app_search",
    template: `
      <div>
        <div>
          <input type="text" placeholder="搜索列表视频" v-model="inputValue" style="width: 80%">
          <button gz_type="info" @click="refreshListBut">刷新</button>
        </div>
        <div>
          <div v-for="item in searchShowList">
            <span>{{ item.title }}</span>
            <button gz_type @click="playVideo(item)">播放</button>
          </div>
        </div>
      </div>`,
    data() {
        return {
            inputValue: '',
            videoPageCollectionElList: [],
            searchShowList: []
        }
    },
    methods: {
        playVideo(item) {
            item.clickEl.click();
        },
        setSearchShowListAndVideoPageCollectionElList(dataList) {
            this.searchShowList.splice(0, this.searchShowList.length);
            this.videoPageCollectionElList.splice(0, this.videoPageCollectionElList.length);
            this.searchShowList.push(...dataList);
            this.videoPageCollectionElList.push(...dataList);
        },
        loadCollectionList() {
            return new Promise(resolve => {
                if (global_BiliBIli_video_page_settings_dataVue["isCheckBackLaterPlayVideoPage"]) {
                    getCheckBackLaterVideoPageCollectionElList().then(list => {
                        this.setSearchShowListAndVideoPageCollectionElList(list);
                        Qmsg.success("已获取到稍后再看视频页合集列表", {position: "bottomright"});
                        resolve();
                    });
                } else {
                    isDefVideoPageAnthology().then(async () => {
                        const newVar = await getDefVideoPageAnthologyElList();
                        this.setSearchShowListAndVideoPageCollectionElList(newVar);
                        Qmsg.success("已获取到视频选集列表", {position: "bottomright"});
                        resolve();
                    }).catch(() => {
                        getDefVideoPageCollectionElList().then(list => {
                            Qmsg.success("已获取到视频合集列表", {position: "bottomright"});
                            this.setSearchShowListAndVideoPageCollectionElList(list);
                            resolve();
                        })
                    });
                }
            });
        },
        refreshListBut() {
            const loading = Qmsg.loading("数据刷新中");
            this.loadCollectionList().finally(loading.close())
        }
    },
    watch: {
        inputValue(newValue) {
            this.searchShowList.splice(0, this.searchShowList.length);
            for (let data of this.videoPageCollectionElList) {
                if (data.title.includes(newValue.trim())) {
                    this.searchShowList.push(data);
                }
            }
        }
    },
    created() {
        this.loadCollectionList();
    }
});
new Vue({
    el: "#comment-area-comment",
    template: `
      <div>
        <button gz_type @click="hideCommentAreaBut">隐藏评论区</button>
        <button gz_type @click="showCommentAreaBut">显示评论区</button>
        <div>
          <input type="checkbox" v-model="isAutoHideCommentArea">加载视频之后自动隐藏评论区
        </div>
      </div>`,
    data() {
        return {
            isAutoHideCommentArea: false,
        }
    },
    methods: {
        hideCommentAreaBut() {
            getElement("#commentapp").then(element => {
                element.setAttribute("data-is-hidden", "true");
                element.style.display = "none";
                Qmsg.success("已隐藏评论区", {position: "bottomright"});
            })
        },
        showCommentAreaBut() {
            getElement("#commentapp").then(element => {
                element.setAttribute("data-is-hidden", "false");
                element.style.display = "";
                Qmsg.success("已显示评论区", {position: "bottomright"});
            })
        }
    },
    watch: {
        isAutoHideCommentArea(val) {
            gmUtil.setData("isAutoHideCommentArea", val);
        }
    },
    created() {
        this.isAutoHideCommentArea = gmUtil.getData("isAutoHideCommentArea", false) === true;
        if (this.isAutoHideCommentArea) {
            setTimeout(() => {
                this.hideCommentAreaBut();
            }, 2000);
        }
    }
});
new Vue({
    el: "#problem-feedback",
    template: `
      <div>
        <div v-for="item in feedbacks" :key="item.title">
          {{ item.title }}
          <button gz_type><a :href="item.href" target="_blank">{{ item.href }}</a></button>
        </div>
        <hr>
        <div>
          <h1>作者其他脚本</h1>
          <div v-for="item in otherScriptSets" :key="item.title" :title="item.desc">
            {{ item.title }}
            <button gz_type><a :href="item.url" target="_blank">{{ item.url }}</a></button>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
    `,
    data() {
        return {
            feedbacks: [
                {
                    title: "gf反馈",
                    href: "https://greasyfork.org/zh-CN/scripts/507821/feedback",
                },
                {
                    title: "q群反馈",
                    href: "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632",
                },
                {
                    title: "作者B站",
                    href: "https://space.bilibili.com/473239155",
                }
            ],
            otherScriptSets: [
                {
                    title: "B站屏蔽增强器",
                    url: "https://greasyfork.org/zh-CN/scripts/461382",
                    desc: "支持动态屏蔽、评论区过滤屏蔽，视频屏蔽（标题、用户、uid等）、蔽根据用户名、uid、视频关键词、言论关键词和视频时长进行屏蔽和精简处理，支持获取b站相关数据并导出为json(用户收藏夹导出，历史记录导出、关注列表导出、粉丝列表导出)(详情看脚本主页描述)"
                },
                {
                    title: "去除b站首页右下角推广广告",
                    url: "https://greasyfork.org/zh-CN/scripts/516566",
                    desc: "移除b站首页右下角按钮广告和对应的横幅广告"
                },
                {
                    title: "b站首页视频列数调整",
                    url: "https://greasyfork.org/zh-CN/scripts/512973",
                    desc: "修改b站首页视频列表的列数，并移除大图"
                },
                {
                    title: "github链接新标签打开",
                    url: "https://greasyfork.org/zh-CN/scripts/489538",
                    desc: "github站内所有的链接都从新的标签页打开，而不从当前页面打开"
                }
            ]
        }
    }
});
gmUtil.addGMMenu("默认隐藏抽屉开关按钮", () => {
    gmUtil.setData("drawerGzDefShow", false);
    alert("已设置，重新加载页面生效");
});
gmUtil.addGMMenu("默认显示抽屉开关按钮", () => {
    gmUtil.setData("drawerGzDefShow", true);
    alert("已设置，重新加载页面生效");
});
gmUtil.addGMMenu("显示或隐藏抽屉栏", () => {
    drawerGz.showDrawer();
});
const getElement = (selector, timeOut = 500) => {
    return new Promise(resolve => {
        const i1 = setInterval(() => {
            const el = document.querySelector(selector);
            if (el === null) return;
            clearInterval(i1);
            resolve(el);
        }, timeOut);
    });
}
const getDefVideoPlayPageListEl = () => {
    return getElement(".video-pod__body");
}
const getCheckBackLaterVideoListElements = async () => {
    const p1 = getElement("#playlist-video-action-list-body");
    const p2 = getElement("#playlist-video-action-list");
    const defList = await Promise.all([p1, p2]);
    [bodyListEl, listEl] = defList;
    return {bodyList: bodyListEl, listEl: listEl, defList: defList}
}
