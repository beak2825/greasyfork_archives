// ==UserScript==
// @name         Bilibili Evolved 强化辅助 (非 Bilibili Evolved 本体)
// @namespace    Ninkror
// @version      1.3
// @author       Ninkror

// @description  针对 Bilibili Evolved 的辅助脚本，旨在对 Bilibili Evolved 尚未实现的、已实现但不完善的、已经失效的功能进行优化与修复。在动态页对同时使用 Bilibili Evolved 和 “bilibili时间线筛选——分组查看b站动态” 脚本的情况进行了专门优化。

// @match        https://live.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/*

// @icon         https://www.bilibili.com/favicon.ico

// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// @license      GPL

// @require      https://greasyfork.org/scripts/463455-nelementgetter/code/NElementGetter.js?version=1172110
// @downloadURL https://update.greasyfork.org/scripts/463438/Bilibili%20Evolved%20%E5%BC%BA%E5%8C%96%E8%BE%85%E5%8A%A9%20%28%E9%9D%9E%20Bilibili%20Evolved%20%E6%9C%AC%E4%BD%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463438/Bilibili%20Evolved%20%E5%BC%BA%E5%8C%96%E8%BE%85%E5%8A%A9%20%28%E9%9D%9E%20Bilibili%20Evolved%20%E6%9C%AC%E4%BD%93%29.meta.js
// ==/UserScript==

function autoHide() {
    GM_addStyle(`
        @media (max-width: 925px) {
            .fresh-home-content-layout > .fresh-home-content-layout-item-container:nth-child(1),
            .fresh-home-content-layout > .fresh-home-content-layout-item-container:nth-child(5) {
                display: none;
            }
        }
    `);
}
function sidebarAdjust() {
    // GM_addStyle(`
    //     .bili-dyn-live-users__body {
    //         max-height: calc(100vh - 150px) !important;
    //     }
    // `);
    GM_addStyle(`
        #btf-tab-area {
            padding: 0px 0px 0px !important;
        }
    `);
    GM_addStyle(`
        #btf-bwlist-area {
            padding-top: 0px !important;
            padding-bottom: 8px !important;
        }
    `);
    // GM_addStyle(`
    //     .be-live-list-content {
    //         max-height: calc(100vh - 150px) !important;
    //     }
    // `)
    GM_addStyle(`
        aside.right > section.sticky {
            height: 0px; !important;
        }
    `)
    GM_addStyle(`
        .van-collapse-item__wrapper {
            max-height: calc(100vh - 225px) !important;
            overflow-y: scroll;
        }
        .van-collapse-item__wrapper::-webkit-scrollbar {
            display: none;
          }
    `)
    GM_addStyle(`
        .be-live-list {
            max-height: calc(100vh - 100px) !important;
        }
        .be-live-list-content {
            max-height: none !important;
        }
    `)

    var left = document.querySelector('aside.left');
    var right = document.querySelector('aside.right');

    new ElementGetter().get('.feeds-filter-section', document, 10000).then((dynFilter) => {
        left.appendChild(dynFilter);
        new ElementGetter().get('#btf-bwlist-area', document, 10000).then((advSel) => {
            left.appendChild(advSel);
            new ElementGetter().get('.bili-dyn-my-info', document, 10000).then((userInfo) => {
                left.appendChild(userInfo);
                new ElementGetter().get('.be-live-list', document, 10000).then((liveList) => {
                    right.appendChild(liveList);
                });
            });
        });
    });
}
function autoRefresh() {
    setInterval(function () {
        if (document.querySelector('.bili-dyn-list__items').clientHeight == 0) {
            window.scrollTo({ top: document.body.clientHeight });
            window.scrollTo({ top: 0 });
        }
    }, 500);
}
function liveRoomClean() {
    const blockList = [
        '#right-part > div:nth-child(2) > div:nth-child(3)', //顶栏右侧 幻星互动
        '#right-part > div:nth-child(2) > div:nth-child(4)', //顶栏右侧 我要开播

        '.right-ctnr > div:nth-child(3)', //播放器顶栏 第一排 右侧 举报
        '.right-ctnr > div:nth-child(4)', //播放器顶栏 第一排 右侧 分享

        '.web-player-icon-feedback', //播放器 右上角 反馈

        '.room-feed', //UP主动态
        '#link-footer-vm', //底部
    ];
    GM_addStyle(blockList.join(', ') + '{display: none !important}');
}
function showPayUser() {
    const getInfoByRoom = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom';
    const getOnlineGoldRank = 'https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank';
    new ElementGetter().get('.tab-list > .live-skin-normal-text').then((item) => {
        const rid = window.location.pathname.split('/').pop();
        GM_xmlhttpRequest({
            method: 'get',
            url: `${getInfoByRoom}?room_id=${rid}`,
            onload: function (res) {
                if (res.status === 200) {
                    const resJson = JSON.parse(res.response);
                    if (resJson['code'] === 0) {
                        const uid = resJson['data']['room_info']['uid'];
                        setInterval(function () {
                            GM_xmlhttpRequest({
                                method: 'get',
                                url: `${getOnlineGoldRank}?ruid=${uid}&roomId=${rid}&page=1000&pageSize=1000`,
                                onload: function (res) {
                                    if (res.status === 200) {
                                        const resJson = JSON.parse(res.response);
                                        if (resJson['code'] === 0) {
                                            const userNum = resJson['data']['onlineNum'];
                                            item.textContent = '高能用户(' + userNum + ')';
                                        }
                                    }
                                },
                            });
                        }, 2000);
                    }
                }
            },
        });
    });
}
function showShip() {
    const spaceUrl = 'https://api.bilibili.com/x/space/acc/info';
    const roomUrl = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom';
    const uid = window.location.pathname.split('/')[1];
    new ElementGetter().each('.i-live-fo-count.space-fans', document, (item) => {
        GM_xmlhttpRequest({
            method: 'get',
            url: `${spaceUrl}?mid=${uid}`,
            onload: function (res) {
                if (res.status === 200) {
                    const resJson = JSON.parse(res.response);
                    if (resJson['code'] === 0) {
                        const roomid = resJson['data']['live_room']['roomid'];
                        GM_xmlhttpRequest({
                            method: 'get',
                            url: `${roomUrl}?room_id=${roomid}`,
                            onload: function (res) {
                                if (res.status === 200) {
                                    const resJson = JSON.parse(res.response);
                                    if (resJson['code'] === 0) {
                                        const num = resJson['data']['guard_info']['count'];
                                        item.textContent = `${num}🚢`;
                                    }
                                }
                            },
                        });
                    }
                }
            },
        });
    });
}
function videoClean() {
    const blockElement_new = [
        '.video-toolbar-right > .video-tool-more', //视频下方功能区 右侧 更多
    ];
    GM_addStyle(blockElement_new.join(', ') + '{display:none!important}');
}
function showAllTag() {
    setTimeout(function () {
        new ElementGetter().get('.show-more-btn', document).then((btn) => {
            btn.click();
            GM_addStyle('.tag:has(.show-more-btn.unfold){display:none!important}')
        });
    }, 5000);
}
function hideVideoList() {
    new ElementGetter().get('.video-sections-head', document).then((head) => {
        var flag = true;
        var body = document.querySelector('.video-sections-content-list');
        head.onclick = function (e) {
            const classList = [
                'video-sections-head',
                'video-sections-head_first-line',
                'video-sections-head_second-line',
            ]
            if(classList.includes(e.target.className)) {
                body.style = flag ? 'display:none' : '';
                flag = !flag;
            }
        };
    });
}

const href = window.location.href;
const hostName = window.location.hostname;
const pathName = window.location.pathname;

const mainPage = href == 'https://www.bilibili.com/';
const playPage = href.match(/https:\/\/www\.bilibili\.com\/(video)|(list)\//) != null;
const dynPage = hostName == 't.bilibili.com';
const spacePage = hostName == 'space.bilibili.com';
const liveRoom = href.match(/https:\/\/live\.bilibili\.com\/[0-9]+/) != null;

const funcList = [
    {
        name: 'autoHide',
        menu: '页面变窄时隐藏活动和栏目',
        match: mainPage,
        func: autoHide,
    },
    {
        name: 'sidebarAdjust',
        menu: '侧栏调整',
        match: dynPage,
        func: sidebarAdjust,
    },
    {
        name: 'autoRefresh',
        menu: '无显示动态时自动刷新',
        match: dynPage,
        func: autoRefresh,
    },
    {
        name: 'liveRoomClean',
        menu: '页面清理',
        match: liveRoom,
        func: liveRoomClean,
    },
    {
        name: 'showPayUser',
        menu: '显示高能用户数',
        match: liveRoom,
        func: showPayUser,
    },
    {
        name: 'showShip',
        menu: '显示舰长数',
        match: spacePage,
        func: showShip,
    },
    {
        name: 'videoClean',
        menu: '播放页清理',
        match: playPage,
        func: videoClean,
    },
    {
        name: 'showAllTag',
        menu: '展开视频标签',
        match: playPage,
        func: showAllTag,
    },
    {
        name: 'hideVideoList',
        menu: '选集列表展开与收起',
        match: playPage,
        func: hideVideoList,
    },
];

funcList.forEach((item) => {
    if (item.match) {
        const name = item.name;
        const menu = item.menu;
        if (GM_getValue(name) == undefined) {
            GM_setValue(name, true);
        }
        const open = GM_getValue(name);
        GM_registerMenuCommand(`${open ? '✅' : '❌'}${menu}`, function () {
            GM_setValue(name, !open);
            window.location.reload();
        });
        if (open) {
            item.func();
            console.log(`${name} - ${menu} - 已开启`);
        }
    }
});
