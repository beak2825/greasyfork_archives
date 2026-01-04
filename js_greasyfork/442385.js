// ==UserScript==
// @name        斗鱼弹幕小工具
// @namespace   http://tampermonkey.net/
// @version     Beta1.1
// @icon        http://www.douyutv.com/favicon.ico
// @description Base on [H2P: 斗鱼小工具];斗鱼平台抄袭、循环弹幕，关键词回复
// @author      H2P&MR114
// @require     https://greasyfork.org/scripts/411278-h2p-utils/code/H2P:%20utils.js?version=847435
// @require     https://greasyfork.org/scripts/411280-h2p-notify-util/code/H2P:%20notify%20util.js?version=847422
// @match       *://*.douyu.com/0*
// @match       *://*.douyu.com/1*
// @match       *://*.douyu.com/2*
// @match       *://*.douyu.com/3*
// @match       *://*.douyu.com/4*
// @match       *://*.douyu.com/5*
// @match       *://*.douyu.com/6*
// @match       *://*.douyu.com/7*
// @match       *://*.douyu.com/8*
// @match       *://*.douyu.com/9*
// @match       *://*.douyu.com/topic/*
// @match       *://www.douyu.com/directory/myFollow
// @downloadURL https://update.greasyfork.org/scripts/442385/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442385/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(($util, $notifyMgr) => {
    'use strict';

    /**
   * 根据 xpath 查询元素
   * @param {String} xpath
   * @param {Boolean} queryOneElement
   */
    const $H2P = (xpath = 'body', queryOneElement = true) => queryOneElement ? document.querySelector(xpath) : Array.from(document.querySelectorAll(xpath));

    const isDouyu         = location.href.includes('douyu.com');
    const isDouyuTopic    = location.href.startsWith('https://www.douyu.com/topic/');
    const isDouyuFollow   = location.href.startsWith('https://www.douyu.com/directory/myFollow');

    const isBilibili      = location.href.includes('bilibili.com');
    const isBilibiliHome  = location.href === 'https://www.bilibili.com' || location.href === 'https://www.bilibili.com/' || location.href.startsWith('https://www.bilibili.com/?');
    const isBilibiliVideo = location.href.startsWith('https://www.bilibili.com/video/');
    const isBilibiliAct   = location.href.startsWith('https://t.bilibili.com/');
    const isBilibiliRank  = location.href.startsWith('https://www.bilibili.com/ranking?');
    const isBilibiliLive  = location.href.startsWith('https://live.bilibili.com/');

    const isHuya          = location.href.includes('huya.com');
    const isHuyaFollow    = location.href.includes('huya.com/myfollow');








    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                           全局样式
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    let eleStyle = document.createElement('style');
    eleStyle.innerHTML += `
    .h2p-flex-main-start {
      height          : 22px;
      margin          : 0 0 15px 0;
      display         : flex;
      flex-flow       : row wrap;
      justify-content : flex-start;
      align-items     : center;
    }
    .h2p-flex-main-center {
      height          : 22px;
      margin          : 0 0 15px 0;
      display         : flex;
      flex-flow       : row wrap;
      justify-content : center;
      align-items     : center;
    }
    .h2p-flex-main-end {
      height          : 22px;
      margin          : 0 0 15px 0;
      display         : flex;
      flex-flow       : row wrap;
      justify-content : flex-end;
      align-items     : center;
    }
    .h2p-item-100p { width: 100%; }
    .h2p-item-75p { width: 75%; }
    .h2p-item-50p { width: 50%; }
    .h2p-item-33p { width: 33.33%; }
    .h2p-item-25p { width: 25%; }
    `;
    document.head.appendChild(eleStyle);

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                              全局变量
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    let userInfo = {
        nickName  : '',           // 昵称
        isAnchorFan : false,      // 是否拥有主播的粉丝牌
    };

    let roomInfo = {
        id      : '',
        showT   : 0,
        online  : 0,
    }


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                             主播信息获取
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    // 获取 roomInfo.id
    let regNums = /\d+/;
    if (regNums.test($H2P('head > title').textContent)) {
        roomInfo.id = regNums.exec($H2P('head > title').textContent)[0];
    } else {
        roomInfo.id = regNums.exec(location.href) ? regNums.exec(location.href)[0] : location.href.split('/www.huya.com/').pop();
    }

    const LSInfo = 'h2p-DY-config-info';
    let config_info = $util.LS.init(LSInfo, {
        anchorFanUpdatedTime: '',
        anchorFanRooms: {},
        showTs: {},
    });

    if (false) {
        // 获取在线人数
        let urlId = isDouyuTopic ? location.href.split('=').pop() : roomInfo.id;
        fetch(`https://bojianger.com/data/api/common/search.do?keyword=${urlId}`)
            .then(res => res.json())
            .then(res => {
            try {
                if (res.data) {
                    if (res.data.online) { roomInfo.online = Number(res.data.online); }
                    else if (res.data.anchorVo) { roomInfo.online = Number(res.data.anchorVo.audience_count); }
                } else {
                    let res = JSON.parse(JSON.stringify(res));
                    roomInfo.online = Number(res.split('online":')[1].split(',')[0]);
                }
                console.log(`Succeed getting online: ${roomInfo.online}`);
                $notifyMgr.createNotify({
                    msg: `成功获取在线人数: ${roomInfo.online}`,
                    type: $notifyMgr.type.success
                })
            } catch (error) {
                console.log(error);
                console.log('Fail to get online');
                $notifyMgr.createNotify({
                    msg: `获取在线人数失败`,
                    type: $notifyMgr.type.error
                })
            }
        });

        // 获取直播时间
        let showTs = {};
        if (Array.isArray(config_info.showTs)) {
            config_info.showTs = {};
            $util.LS.set(LSInfo, config_info);
        } else { showTs = config_info.showTs || {}; }
        let [showT, getT] = [0, 0];
        if (showTs[roomInfo.id]) {
            showT = $util.timeMS(showTs[roomInfo.id].showT);
            getT = $util.timeMS(showTs[roomInfo.id].getT);
        }
        // 获取时间 < 6h
        if (((Date.now() - getT) / 3600000.0) < 6) {
            roomInfo.showT = showT;
            roomInfo.getT = getT;
            console.log(`Succeed getting anchor showTime: ${new Date(showT).$formatTime()}`);
            $notifyMgr.createNotify({
                msg: `成功获取直播时间: ${new Date(showT).$formatTime()}`,
                type: $notifyMgr.type.success
            });
        } else {
            fetch('https://www.douyu.com/betard/' + roomInfo.id)
                .then(res => res.json())
                .then(res => {
                try {
                    if (res) {
                        if (res.cache_time) {
                            roomInfo.showT = $util.timeMS(res.cache_time);
                        } else {
                            let r = res.split('"cache_time":')[1];
                            let showT = r.substr(0, r.indexOf(','));
                            roomInfo.showT = $util.timeMS(showT);
                        }
                        config_info.showTs[roomInfo.id] = {
                            'showT' : roomInfo.showT,
                            "getT" : Date.now()
                        };
                        console.log(`Succeed getting anchor showTime: ${new Date(roomInfo.showT).$formatTime()}`);
                        $notifyMgr.createNotify({
                            msg: `成功获取直播时间: ${new Date(roomInfo.showT).$formatTime()}`,
                            type: $notifyMgr.type.success
                        });
                        $util.LS.set(LSInfo, config_info);
                    } else { console.log('Fail to get anchor showTime.') }
                } catch (error) {
                    console.log(error);
                    console.log('Fail to get anchor showTime.')
                }
            });
        }

        // 根据 cookie 获取用户昵称
        let cookies = document.cookie.split(/;\s/g);
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let keyVal = cookie.split('=');
            if (keyVal && keyVal.length == 2 && keyVal[0] == 'acf_nickname') {
                userInfo.nickName = keyVal[1];
                break;
            }
        }

        // 自动获取已有粉丝牌的主播
        if (config_info.anchorFanUpdatedTime !== new Date().$formatDate()) {
            new Promise((resolve, reject) => {
                let iframe = document.createElement('iframe');
                iframe.id = 'h2p-fansBadgeList';
                iframe.style = 'display: none;'
                iframe.src = '/member/cp/getFansBadgeList';
                document.body.appendChild(iframe);
                setTimeout(resolve, 250);
            })
                .then(() => {
                let iframe = $H2P('iframe#h2p-fansBadgeList');
                iframe.addEventListener('load', () => {
                    // 获取有粉丝牌的主播房间号
                    config_info.anchorFanRooms = {};
                    let idoc = iframe.contentWindow.document;
                    let ele_anchors = Array.from(idoc.querySelectorAll('table.aui_room_table.fans-badge-list > tbody > tr'));
                    for ( let i = 0; i < ele_anchors.length; i++ ) {
                        let ele = ele_anchors[i];
                        let anchorURL = ele.querySelector('td:nth-child(2)').querySelector('a').getAttribute('href');
                        let anchorName = ele.querySelector('td:nth-child(2)').querySelector('a').textContent;
                        let anchorRoom = ele.getAttribute('data-fans-room');
                        let anchorUp = Number(ele.querySelector('td:nth-child(4)').querySelector('span').textContent);
                        config_info.anchorFanRooms[anchorRoom] = {anchorName, anchorURL, anchorUp};
                    }
                    config_info.anchorFanUpdatedTime = new Date().$formatDate();
                    $util.LS.set(LSInfo, config_info);

                    console.log('有粉丝牌的主播房间号');
                    console.log(config_info.anchorFanRooms);
                    let anchorRoom= location.href.split('/').pop();
                    userInfo.isAnchorFan = anchorRoom in config_info.anchorFanRooms;
                    setTimeout(() => { $H2P('iframe#h2p-fansBadgeList').remove(); }, 2000);
                });
            })
                .catch(error => console.log(error));
        } else { console.log('今日已获取已有粉丝牌的主播'); }

        new Promise((resolve, reject) => {
            // 主播热度、在线人数、直播时长
            let divBar = document.createElement('div');
            divBar.id = 'h2p-div-clear-anchorHot';
            divBar.classList = 'h2p-flex-main-start h2p-h-100p';
            divBar.style = 'padding: 3px 10px 0; margin: 0;';
            // divBar.innerHTML = `
            //   <div class="Title-blockInline h2p-item-33p">
            //     <a id="a-anchorHot" class="Title-anchorHot" title="直播热度">
            //       <i class="Title-anchorHotIcon" style="margin-top: -4px">
            //         <svg style="width: 16px; height: 16px;">
            //           <use xlink:href="#hot_84f8212"></use>
            //         </svg>
            //       </i>
            //       <div class="Title-anchorText" style="margin-left: 2px;">0</div>
            //     </a>
            //   </div>
            //   <div class="Title-blockInline h2p-item-33p">
            //     <div id="div-online" title="真实人数" style="margin-top: -7px">
            //       <div class="Title-anchorFriendWrapper">
            //         <div class="Title-row-span">
            //           <span class="Title-row-icon">
            //             <svg style="width:15px; height:15px">
            //               <use xlink:href="#friend_b0b6380"></use>
            //             </svg>
            //           </span>
            //           <i class="Title-row-text" style="margin-left: 2px;">0</i>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            //   <div class="Title-blockInline h2p-item-33p">
            //     <a id="a-anchorShowT" class="Title-anchorHot" title="直播时长">
            //       <div class="AnchorFriendCard-avatar is-live" style="height: 19px; border: none; margin: 2px 5px 0 -4px;"></div>
            //       <div class="Title-anchorText" style="margin-left: 2px;">0</div>
            //     </a>
            //   </div>
            // `;
            let eleStyle = document.createElement('style');
            eleStyle.innerHTML += `
        .layout-Player-rank { top: 70px; }
        #js-player-barrage { top: 287px; }
      `;

            let setINVL_wait_div_announce = setInterval(() => {
                if ($H2P('div.layout-Player-asideMainTop') && $H2P('div.ShieldTool-content') && $H2P('div.ChatToolBar')) {
                    clearInterval(setINVL_wait_div_announce);
                    setINVL_wait_div_announce = null;
                    setTimeout(() => {
                        $H2P('div.layout-Player-announce').appendChild(divBar);
                        document.body.appendChild(eleStyle);
                        resolve();
                    }, 2000);
                }
            }, 500);
        })
            .then(() => {
            setTO_showAnchorHot();
        })

        function setTO_showAnchorHot () {
            return setTimeout(() => {
                let anchorHot = Number($H2P('a.Title-anchorHot > div.Title-anchorText').textContent) || 0;
                let str_anchorHot = '' + anchorHot;
                if (anchorHot > 9999) { str_anchorHot = parseInt(anchorHot/10000) + 'w'; }
                $H2P('a#a-anchorHot > div.Title-anchorText').textContent = str_anchorHot;

                if (roomInfo.showT) {
                    let showT = Date.now() - roomInfo.showT;
                    let { h, m, s } = $util.HMS(showT);
                    $H2P('a#a-anchorShowT > div.Title-anchorText').textContent = `${h}:${m}:${s}`;
                    // 设置直播时长
                    setInterval(() => {
                        showT += 1000;
                        let { h, m, s } = $util.HMS(showT);
                        $H2P('a#a-anchorShowT > div.Title-anchorText').textContent = `${h}:${m}:${s}`;
                    }, 1000);
                }
                // 直播热度和在线人数
                setInterval(() => {
                    let anchorHot = Number($H2P('a.Title-anchorHot div.Title-anchorText').textContent) || 0;
                    if (anchorHot > 9999) { anchorHot = Number.parseInt(anchorHot / 10000) + 'w'; }
                    if ($H2P('a#a-anchorHot > div.Title-anchorText')) { $H2P('a#a-anchorHot > div.Title-anchorText').textContent = anchorHot; }

                    let online = roomInfo.online;
                    if (online > 9999) { online = Number.parseInt(online / 10000) + 'w'; }
                    $H2P('div#div-online i.Title-row-text').textContent = online;
                }, 5000);
            }, 200);
        }
    }








    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                            🐯和面板初始化
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    const LSScript = 'h2p-DY-config-script';
    let config_script = $util.LS.init(LSScript, {
        icon  : '🐯'
    });

    let viewShow_bar  =  false;
    let viewShow_config  =  false;
    let viewShow_script  =  false;

    new Promise((resolve, reject) => {
        // 创建元素样式
        let eleStyle = document.createElement('style');
        eleStyle.type = 'text/css';
        eleStyle.innerHTML += `
      #h2p-div-sign {
        width         : 18px;
        height        : 18px;
        display       : inline-block;
        vertical-align: middle;
      }
      #h2p-div-sign span {
        font-size     : 18px;
        cursor        : pointer;
      }

      #div-DYScript input, #div-DYScript button, #div-DYScript select {
        outline       : none;
        line-height   : 10px;
      }
      #div-DYScript {
        position      : absolute;
        bottom        : ${isBilibiliLive ? 147 : 1}px;
        width         : calc(100%);
        border        : none;
        margin        : 0 0 0 -1px;
        box-shadow    : #c7c7c7 0 -5px 5px 0;
        display       : flex;
        flex-flow     : row wrap;
        z-index       : 999;
      }
      #div-DYScript .h2p-div-inlinepanel {
        width         : calc(100% - 20px);
        padding       : 10px;
        border-width  : 0 0 1px 0;
        font-family   : WeibeiSC-Bold, STKaiti;
        font-size     : 16px;
        background    : #f5f5f5;
      }

      #div-DYScript .h2p-div-inlinetab {
        width         : calc(100%);
        border-top    : 1px solid #DCDCDC;
        border-radius : 2px;
        font-family   : WeibeiSC-Bold, STKaiti;
        font-size     : 16px;
        background    : #f5f5f5;
        display       : flex;
        flex-flow     : row wrap;
      }
      #div-DYScript .h2p-div-layer {
        position      : relative;
        width         : 100%;
        height        : 24px;
      }
      #div-DYScript .h2p-div-layer-half {
        position      : absolute;
        width         : 50%;
        height        : 24px;
      }
      #div-DYScript .h2p-input-normal {
        height        : 22px;
        padding        : 0px 5px;
        border        : 1px solid #708090;
        border-radius  : 5px;
        font-size      : 13px;
      }
      #div-DYScript .h2p-input-disable {
        background    : #DCDCDC;
        cursor        : default;
      }
      #div-DYScript .h2p-input-able {
        background    : white;
        cursor        : text;
      }
      #div-DYScript .h2p-div-tab {
        display          : flex;
        width            : 50%;
        height          : 25px;
        padding          : 2px 0;
        justify-content  : center;
        align-items      : center;
      }
      #div-DYScript .h2p-div-tab:hover {
        cursor        : pointer;
        background    : #DDDDDD;
      }
      #div-DYScript .h2p-hover-pointer:hover {
        cursor        : pointer;
        background    : #DDDDDD;
      }
      .h2p-bg-close  { background : #00ddbb }
      .h2p-bg-close:hover{ background : #00ccaa }
      .h2p-bg-open  { background : #99aaff }
      .h2p-bg-open:hover  { background : #8899cc }

      div#div-DYScript button {
        font-family: inherit;
      }
    `;
        document.head.appendChild(eleStyle);

        // 弹幕框上的 🐯
        let div_sign = undefined;
        div_sign = document.createElement('div');
        if (isDouyu) {
            div_sign.id = 'h2p-div-sign';
            div_sign.style = 'margin: -8px 0 0 -3px;';
            div_sign.title = '斗鱼脚本';
            div_sign.innerHTML = `<span id="h2p-span-DYScript">${config_script.icon}</span>`;
        }

        // 整个面板 ===============================================================
        let div_DYScript = document.createElement('div');
        div_DYScript.id = 'div-DYScript';
        div_DYScript.style = 'display: none;';

        // 检查弹幕面板挂载点（斗鱼弹幕显示区域）是否加载完成
        // 检查弹幕图标挂载点（斗鱼弹幕输入框）是否加载完成
        let check_mountPoint_barPanel = setInterval(() => {
            if (isDouyu && $H2P('div.layout-Player-asideMainTop') && $H2P('div.ShieldTool-content') && $H2P('div.ChatToolBar')) {
                clearInterval(check_mountPoint_barPanel);
                check_mountPoint_barPanel = null;
                setTimeout(() => {
                    $H2P('div.layout-Player-asideMainTop').appendChild(div_DYScript);
                    $H2P('div.ChatToolBar').appendChild(div_sign);
                    resolve();
                }, 2000);
            } else if (!isDouyu && !isHuya && !isBilibili) {
                clearInterval(check_mountPoint_barPanel);
                check_mountPoint_barPanel = null;
                document.body.appendChild(div_DYScript);
                document.body.appendChild(div_sign);
                resolve();
            }
        }, 1000);
    })
        .then(() => {
        $H2P('span#h2p-span-DYScript').addEventListener('click', () => {
            viewShow_script = !viewShow_script;
            $H2P('div#div-DYScript').style.display = viewShow_script ? '' : 'none';
        });
    })
        .then(() => {
        let div_DYScriptTab = document.createElement('div');
        div_DYScriptTab.id = 'div-DYScriptTab';
        div_DYScriptTab.className = 'h2p-div-inlinetab';
        div_DYScriptTab.style = 'order: 20;'
        div_DYScriptTab.innerHTML = `
      <div id="h2p-div-tab-bar" class="h2p-div-tab" style="background: #DDDDDD;" title="发弹幕">📢</div>
      
    `;
        //<div id="h2p-div-tab-config" class="h2p-div-tab" title="自动化设置">⏲️</div>

        $H2P('div#div-DYScript').appendChild(div_DYScriptTab);
    })
        .then(() => {
        $H2P('div#div-DYScriptTab').addEventListener('click', (event) => {
            const target = event.target;
            viewShow_bar = target.id.endsWith('-bar');
            viewShow_config = target.id.endsWith('-config');
            $H2P('div#h2p-div-bar').style.display = viewShow_bar ? '' : 'none';
            $H2P('div#h2p-div-config').style.display = viewShow_config ? '' : 'none';
            $H2P('div#h2p-div-tab-bar').style.backgroundColor = viewShow_bar ? '#DDDDDD' : '#f5f5f5';
            $H2P('div#h2p-div-tab-config').style.backgroundColor = viewShow_config ? '#DDDDDD' : '#f5f5f5';
        }, false);
    });








    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                            发弹幕
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    const LSChat = 'h2p-DY-config-chat';
    let config_chat = $util.LS.init(LSChat, {
        invlStart : 3,
        invlEnd   : 4,
        isLuck    : false,
        luckTime  : 2,
        isKeyRe   : false,
        keyReBar  : [],
        isCopy    : false,
        copyInvl  : 0,
        isLoop    : false,
        loopBar   : [],
        isSendNow : false,
        isSend    : false,
        sendRooms : [],
    });

    config_chat.isSendNow = config_chat.sendRooms.includes(roomInfo.id);
    let [Chat, INVL_SendBar, INVL_ShowCD] = [undefined, undefined, undefined];

    let invl  = 0;            // 间隔时间
    let luckBar  = '';        // 抽奖弹幕内容
    let luckCD  = 0;          // 弹幕抽奖活动倒计时
    let luckTime = 0;         // 抽奖弹幕发送次数
    let Index_keyRe = 0;      // 关键词回复弹幕列表已经检测的位置
    let keyRes  = [];         // 已经回复的弹幕 ID

    // 初始化自动发弹幕界面  ===============================================================
    new Promise((resolve, reject) => {
        let eleStyle = document.createElement('style');
        eleStyle.type = 'text/css';
        eleStyle.innerHTML += `
      #h2p-div-bar input[type="checkbox"] {
        margin    : 3px;
      }
      #h2p-div-bar .h2p-input-invl {
        width      : 23px;
        margin    : 0 2px;
      }

      #h2p-div-bar .h2p-ta-bar-loopBar {
        width          : calc(100% - 33px);
        height        : 73px;
        padding        : 5px;
        border        : 1px solid #708090;
        border-radius  : 5px;
        font-size      : 13px;
        resize        : none;
        font-family    : inherit;
      }

      #h2p-div-bar .h2p-btn-keyRe {
        width           : 16px;
        height          : 16px;
        padding         : 0;
        margin          : 3px;
        border          : 1px solid rgb(216, 216, 216);
        border-radius   : 50%;
        background-color: white;
        text-align      : center;
      }

      #h2p-div-bar #h2p-btn-bar-send,
      #h2p-div-bar #h2p-btn-bar-sendAll {
        line-height     : 18px;
        font-size       : 15px;
        width           : 95%;
        padding         : 4px 0;
        border          : none;
        border-radius   : 5px;
        cursor          : pointer;
        transition      : all 0.5s
      }

      #h2p-div-bar .h2p-btn-active {
        background: #ffbb77!important;
      }

      #h2p-div-bar input { font-size: 10px!important; }

      .sendingDisabled {}
    `;
        document.head.appendChild(eleStyle);

        let div = document.createElement('div');
        div.id = 'h2p-div-bar';
        div.className = 'h2p-div-inlinepanel';
        div.style = '';

        div.innerHTML += `
      <!-- 发送弹幕的速度 And 倒计时 -->
      <div class="h2p-flex-main-center">
        <div class="h2p-flex-main-start h2p-item-50p">
          <label>间隔</label>
          <input id="h2p-input-bar-invl-start" class="h2p-input-normal h2p-input-invl sendingDisabled" placeholder="≥3" />
          <span>~</span>
          <input id="h2p-input-bar-invl-end" class="h2p-input-normal h2p-input-invl sendingDisabled" />
          <label>秒</label>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <input id="h2p-input-cd" class="h2p-input-normal h2p-input-disable" style="width: 32px;" disabled/>
        </div>
      </div>

      <!-- 是否参加弹幕抽奖 -->
      <div class="h2p-flex-main-center" style="display: ${isDouyu ? '' : 'none'}">
        <div class="h2p-flex-main-start h2p-item-50p">
          <input id="h2p-input-bar-isLuck" type="checkbox" />
          <label>抽奖弹幕</label>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <label>抽奖发送</label>
          <input id="h2p-input-bar-luck-time-now" class="h2p-input-normal h2p-input-invl h2p-input-disable" disabled />
          <span>/</span>
          <input id="h2p-input-bar-luck-time" class="h2p-input-normal h2p-input-invl sendingDisabled" style="margin-right: 0;" placeholder="≥1" value="1" />
        </div>
      </div>

      <!-- 是否使用关键词自动回复 -->
      <div class="h2p-flex-main-center" style="margin: 0 0 8px 0; display: ${isDouyu ? '' : 'none'}">
        <div class="h2p-flex-main-start h2p-item-50p">
          <input id="h2p-input-bar-isKeyRe" type="checkbox" />
          <label>关键词回复</label>
          <button id="h2p-btn-addKeyRe" class="h2p-btn-keyRe h2p-hover-pointer" title="添加关键词">+</button>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <select id="h2p-select-keyRe" style="width: 100%; height: 24px;">
          </select>
        </div>
      </div>

      <div class="h2p-flex-main-center" style="display: ${isDouyu ? '' : 'none'}">
        <div class="h2p-flex-main-start h2p-item-50p">
          <button id="h2p-btn-delKeyRe" class="h2p-btn-keyRe h2p-hover-pointer" title="删除关键词">-</button>
          <input id="h2p-input-key" class="h2p-input-normal" style="width: 70%;" placeholder="关键词" />
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <input id="h2p-input-re" class="h2p-input-normal" style="width: 90%; padding: 0 4.2%;" placeholder="自动回复弹幕" />
        </div>
      </div>

      <!-- 是否发送抄袭弹幕 -->
      <div class="h2p-flex-main-center">
        <div class="h2p-flex-main-start h2p-item-50p">
          <input id="h2p-input-bar-isCopy" type="checkbox" />
          <label>抄袭弹幕</label>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <label>抄袭间隔</label>
          <input id="h2p-input-bar-copy-invl" class="h2p-input-normal" style="margin-left: 5px; width: 48px;" placeholder="0 ~ 200" value="0"/>
        </div>
      </div>

      <!-- 是否发送循环弹幕 -->
      <div class="h2p-flex-main-center" style="height: 85px;">
        <input id="h2p-input-bar-isLoop" type="checkbox" />
        <textarea id="h2p-ta-bar-loopBar" class="h2p-ta-bar-loopBar" placeholder="循环弹幕"></textarea>
      </div>

      <!-- 开启弹幕发送按钮 -->
      <div class="h2p-flex-main-center" style="margin: 0 0 5px 0;">
        <div class="h2p-flex-main-start h2p-item-50p">
          <button id="h2p-btn-bar-send" class="h2p-bg-close" ${isBilibili ? 'disabled' : ''}>${isBilibiliLive ? '暂不可用' : '发送（本房间）'}</button>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <button id="h2p-btn-bar-sendAll" class="h2p-bg-close" ${isBilibili ? 'disabled' : ''}>${isBilibiliLive ? '暂不可用' : '发送（所有）'}</button>
        </div>
      </div>
    `;

        let setINVL_wait_div_DYScript = setInterval(() => {
            if ($H2P('div#div-DYScript')) {
                clearInterval(setINVL_wait_div_DYScript);
                setINVL_wait_div_DYScript = null;
                $H2P('div#div-DYScript').appendChild(div);
                resolve();
            }
        }, 500);
    })
    // 元素绑定监听
        .then(() => {
        let eleBar = $H2P('div#h2p-div-bar');
        eleBar.addEventListener('click', (event) => {
            let target = event.target;
            if (target.id === 'h2p-input-bar-isCopy') {
                config_chat.isCopy = target.checked;
            } else if (target.id === 'h2p-input-bar-isLoop') {
                config_chat.isLoop = target.checked;
            } else if (target.id === 'h2p-input-bar-isKeyRe') {
                config_chat.isKeyRe = target.checked;
            } else if (target.id === 'h2p-input-bar-isLuck') {
                config_chat.isLuck = target.checked;
            }
            $util.LS.set(LSChat, config_chat);
        }, false)

        // 间隔最小值
        let eleInvlStart = $H2P('input#h2p-input-bar-invl-start');
        eleInvlStart.addEventListener('input', () => { eleInvlStart.value = eleInvlStart.value.replace(/[^\d]/g, '').slice(0, 3); });
        eleInvlStart.addEventListener('focusout', () => {
            eleInvlStart.value = Math.max(eleInvlStart.value, 3);
            config_chat.invlStart = eleInvlStart.value;
            $util.LS.set(LSChat, config_chat);
        });

        // 间隔最大值
        let eleInvlEnd = $H2P('input#h2p-input-bar-invl-end');
        eleInvlEnd.addEventListener('input', () => { eleInvlEnd.value = eleInvlEnd.value.replace(/[^\d]/g, '').slice(0, 3); });
        eleInvlEnd.addEventListener('focusout', () => {
            eleInvlEnd.value = Math.max(eleInvlEnd.value, Number(eleInvlStart.value) + 1, 4);
            config_chat.invlEnd = eleInvlEnd.value;
            $util.LS.set(LSChat, config_chat);
        });

        // 抽奖弹幕最大次数
        let eleBarLuckTime = $H2P('input#h2p-input-bar-luck-time');
        eleBarLuckTime.addEventListener('input', () => { eleBarLuckTime.value = eleBarLuckTime.value.replace(/[^\d]/g, '').slice(0, 2); });
        eleBarLuckTime.addEventListener('focusout', () => {
            eleBarCopyInvl.value = Math.max(eleBarCopyInvl.value, 1);
            config_chat.luckTime = Number(eleBarLuckTime.value);
            $util.LS.set(LSChat, config_chat);
        });

        // 添加关键词回复
        let eleAddKeyRe = $H2P('button#h2p-btn-addKeyRe');
        eleAddKeyRe.addEventListener('click', () => {
            config_chat.keyReBar.push({key: 'default', re: 'default'});
            $util.LS.set(LSChat, config_chat);
            $H2P('select#h2p-select-keyRe').options.add(new Option('default', 'default'));
            $H2P('select#h2p-select-keyRe').selectedIndex = config_chat.keyReBar.length - 1;
            $H2P('input#h2p-input-key').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].textContent;
            $H2P('input#h2p-input-re').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].value;
        });

        // 删除关键词回复
        let eleDelKeyRe = $H2P('button#h2p-btn-delKeyRe');
        eleDelKeyRe.addEventListener('click', () => {
            config_chat.keyReBar.splice($H2P('select#h2p-select-keyRe').selectedIndex, 1);
            $util.LS.set(LSChat, config_chat);
            $H2P('select#h2p-select-keyRe').options.remove($H2P('select#h2p-select-keyRe').selectedIndex);
            $H2P('input#h2p-input-key').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].textContent;
            $H2P('input#h2p-input-re').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].value;
        });

        // 选择关键词回复
        let eleSelectKeyRe = $H2P('select#h2p-select-keyRe');
        eleSelectKeyRe.addEventListener('change', () => {
            $H2P('input#h2p-input-key').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].textContent;
            $H2P('input#h2p-input-re').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].value;
        });

        // 修改关键词
        let eleKey = $H2P('input#h2p-input-key');
        eleKey.addEventListener('keyup', () => {
            config_chat.keyReBar[$H2P('select#h2p-select-keyRe').selectedIndex].key = eleKey.value;
            $H2P('select#h2p-select-keyRe').selectedOptions[0].textContent = eleKey.value;
        });
        eleKey.addEventListener('focusout', () => {
            if (!eleKey.value) {
                eleKey.value = 'default';
                config_chat.keyReBar[$H2P('select#h2p-select-keyRe').selectedIndex].key = eleKey.value;
                $H2P('select#h2p-select-keyRe').selectedOptions[0].textContent = eleKey.value;
            }
            $util.LS.set(LSChat, config_chat);
        });

        // 修改回复
        let eleRe = $H2P('input#h2p-input-re');
        eleRe.addEventListener('keyup', () => {
            config_chat.keyReBar[$H2P('select#h2p-select-keyRe').selectedIndex].re = eleRe.value;
            $H2P('select#h2p-select-keyRe').selectedOptions[0].value = eleRe.value;
        });
        eleRe.addEventListener('focusout', () => {
            if (!eleRe.value) {
                eleRe.value = 'default';
                config_chat.keyReBar[$H2P('select#h2p-select-keyRe').selectedIndex].re = eleRe.value;
                $H2P('select#h2p-select-keyRe').selectedOptions[0].value = eleRe.value;
            }
            $util.LS.set(LSChat, config_chat);
        });

        // 抄袭弹幕最大间隔
        let eleBarCopyInvl = $H2P('input#h2p-input-bar-copy-invl');
        eleBarCopyInvl.addEventListener('input', () => { eleBarCopyInvl.value = eleBarCopyInvl.value.replace(/[^\d]/g, '').slice(0, 3); });
        eleBarCopyInvl.addEventListener('focusout', () => {
            eleBarCopyInvl.value = Math.min(eleBarCopyInvl.value, 200);
            config_chat.copyInvl = Number(eleBarCopyInvl.value);
            $util.LS.set(LSChat, config_chat);
        });

        // 循环弹幕
        let eleLoop = $H2P('textarea#h2p-ta-bar-loopBar');
        eleLoop.addEventListener('focusout', () => {
            if (eleLoop.value && eleLoop.value.replace(/\s/g, '')) {
                config_chat.loopBar = eleLoop.value.split('\n');
                $util.LS.set(LSChat, config_chat);
            }
        });

        // 发送按钮
        let eleSend = $H2P('button#h2p-btn-bar-send');
        eleSend.addEventListener('click', () => {
            config_chat.isSendNow = !config_chat.isSendNow;

            $H2P('div#h2p-div-tab-bar').textContent = config_chat.isSendNow ? '🔥' : '📢';
            $H2P('input.sendingDisabled', false).forEach(ele => {
                ele.classList.toggle('h2p-input-disable');
                ele.disabled = !ele.disabled;
            });

            clearTimeout(INVL_SendBar);
            INVL_SendBar = null;
            clearInterval(INVL_ShowCD);
            INVL_ShowCD = null;
            if (config_chat.isSendNow) {
                setINVL_SendBar();
                eleSend.classList.add('h2p-bg-open');
                eleSend.textContent = "发送中（本房间）";
                if (!config_chat.sendRooms.includes(roomInfo.id)) {
                    config_chat.sendRooms.push(roomInfo.id);
                }
            }
            else {
                $H2P('input#h2p-input-cd').value = '';
                $H2P('input#h2p-input-bar-luck-time-now').value = '';
                eleSend.classList.remove('h2p-bg-open');
                eleSend.textContent = "发送（本房间）";

                luckCD = 0;
                luckBar = undefined;
                luckTime = 0;

                let index = config_chat.sendRooms.indexOf(roomInfo.id);
                config_chat.sendRooms = [...config_chat.sendRooms.slice(0, index), ...config_chat.sendRooms.slice(index+1)];
            }
            $util.LS.set(LSChat, config_chat);
        }, false);

        // 发送所有按钮
        let eleSendAll = $H2P('button#h2p-btn-bar-sendAll');
        eleSendAll.addEventListener('click', () => {
            config_chat.isSend = !config_chat.isSend;
            if (config_chat.isSend) {
                eleSendAll.classList.add('h2p-bg-open');
                eleSendAll.textContent = "发送中（所有）";
            }
            else {
                eleSendAll.classList.remove('h2p-bg-open');
                eleSendAll.textContent = "发送（所有）";
            }
            if ((config_chat.isSend && !config_chat.isSendNow) || (!config_chat.isSend && config_chat.isSendNow)) {
                eleSend.click();
            }
            $util.LS.set(LSChat, config_chat);
        }, false);
    })
        .catch(error => console.log(error))
    // 读取配置参数
        .then(() => {
        $H2P('input#h2p-input-bar-isLuck').checked = config_chat.isLuck || false;
        $H2P('input#h2p-input-bar-luck-time').value = config_chat.luckTime || 1;

        $H2P('input#h2p-input-bar-invl-start').value = config_chat.invlStart || '';
        $H2P('input#h2p-input-bar-invl-end').value = config_chat.invlEnd || '';

        $H2P('input#h2p-input-bar-isKeyRe').checked = config_chat.isKeyRe || false;
        if (!config_chat.keyReBar || !Array.isArray(config_chat.keyReBar)) { config_chat.keyReBar = []; }
        for (let {key, re} of config_chat.keyReBar) { $H2P('select#h2p-select-keyRe').options.add(new Option(key, re)); }

        $H2P('input#h2p-input-bar-isCopy').checked = config_chat.isCopy || false;
        $H2P('input#h2p-input-bar-copy-invl').value = config_chat.copyInvl || '',

            $H2P('input#h2p-input-bar-isLoop').checked = config_chat.isLoop || false;
        $H2P('textarea#h2p-ta-bar-loopBar').value = Array.isArray(config_chat.loopBar) ? config_chat.loopBar.join('\n') : '';

        if (config_chat.isSend) {
            config_chat.isSendNow = false;
            config_chat.isSend = false;
            $H2P('button#h2p-btn-bar-sendAll').click();
        } else if (config_chat.isSendNow) {
            config_chat.isSendNow = false;
            $H2P('button#h2p-btn-bar-send').click();
        }
        if (!Chat) { Chat = setBar(); }
    })
        .then(() => {
        if (config_chat.keyReBar && config_chat.keyReBar.length > 0) {
            $H2P('input#h2p-input-key').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].textContent;
            $H2P('input#h2p-input-re').value = $H2P('select#h2p-select-keyRe').selectedOptions[0].value;
        }
    })
        .catch(error => { console.log(error); })

    function getBar () {
        let barrage = undefined;

        // 抽奖弹幕
        if (config_chat.isLuck && $H2P('div.LotteryDrawEnter-desc')) {
            // 计算目前倒计时
            let luckCD_now = Number($H2P('div.LotteryDrawEnter-desc').textContent.split(':').reduce((m, s) => Number(m) * 60 + Number(s)));
            // 新一轮抽奖
            if (luckCD_now > luckCD) {
                luckBar = undefined;
                luckTime = 0;
                // 显示抽奖内容
                $H2P('div.LotteryDrawEnter-enter').click();
                try {
                    // 获取抽奖弹幕条件
                    let barREQM = $H2P('div.ULotteryStart-joinRule').textContent.split('：')[1];
                    const REQMs = ['发弹幕', '发弹幕+关注主播'];
                    // 不是赠送、礼物、福袋、数字、盛典
                    let regex = /[\u8d60\u9001\u793c\u7269\u798f\u888b\d\u76db\u5178]+/g;
                    if (barREQM.search(regex) < 0) {
                        if (REQMs.indexOf(barREQM) > -1 || (userInfo.isAnchorFan && barREQM.includes('成为粉丝'))) {
                            // 一键参与
                            $H2P('div.ULotteryStart-joinBtn').click();
                            // 获取抽奖弹幕内容
                            luckBar = $H2P('div.ULotteryStart-demandDanmu > span:nth-child(1)').textContent;
                            luckBar = luckBar.split(' : ')[1] ? luckBar.split(' : ')[1] : luckBar.split(' : ')[0];
                            if (luckBar.includes('复制')) { luckBar = luckBar.slice(0, -2); }
                            if (luckBar.includes('弹幕：')) { luckBar = luckBar.slice(3); }
                        }
                    } else {
                        console.log('出现：赠送、礼物、福袋、数字、盛典');
                    }
                } catch (error) { console.log(error); }
                finally { $H2P('span.LotteryContainer-close').click(); }
            }

            barrage = luckTime < config_chat.luckTime ? luckBar : undefined;
            if (barrage) {
                if ($H2P('div.ChatSend-button') && $H2P('div.ChatSend-button').classList.contains('is-gray')) {
                    console.log(`发送弹幕冷却中 : ${$H2P('div.ChatSend-button').textContent}`);
                } else {
                    luckTime++;
                    $H2P('input#h2p-input-bar-luck-time-now').value = luckTime;
                    console.log(`抽奖弹幕 : ${barrage}，剩余时间 ${luckCD}`);
                }
            }
            luckCD = Number.isNaN(luckCD_now) ? 0 : luckCD_now;
        }

        // 关键词弹幕回复
        if (!barrage && config_chat.isKeyRe && Array.isArray(config_chat.keyReBar)) {
            let bars = $H2P('ul#js-barrage-list > li', false);
            for (let i = Index_keyRe; i < bars.length && !barrage; i++) {
                Index_keyRe++;
                let ele = bars[i];
                try {
                    let bar_check = ele.querySelector('span[class^="Barrage-content"]').textContent.replace(/\s/g, '');
                    if (ele.querySelector('span[class^="Barrage-nickName"]').title !== userInfo.nickName) {
                        for (let j = 0; j < config_chat.keyReBar.length; j++) {
                            let keyRe = config_chat.keyReBar[j];
                            if (bar_check.includes(keyRe.key)) {
                                if (!keyRes.includes(ele.id)) {
                                    barrage = keyRe.re;
                                    keyRes.push(ele.id);
                                    while (keyRes.length > 200) { keyRes.shift; }
                                    console.log(`关键词弹幕回复 : ${barrage}`);
                                    break;
                                }
                            }
                        }
                    }
                } catch (error) { console.log(error); }
            }
            if (Index_keyRe >= bars.length) { Index_keyRe = 0; }
        }

        // 抄袭弹幕
        if (!barrage && config_chat.isCopy) {

            let elePath =  isDouyu ? 'ul#js-barrage-list > li' :
            isHuya ? 'ul#chat-room__list > li' :
            isBilibiliLive ? 'div#chat-items > div' : '';
            let bars = $H2P(elePath, false);
            let index = 0;
            if (config_chat.copyInvl) {
                if (config_chat.copyInvl > 0 && config_chat.copyInvl < bars.length) { index = bars.length - config_chat.copyInvl; }
                else { index = bars.length - 1; }
            }

            let elePath2 =  isDouyu ? 'span[class^="Barrage-content"]' :
            isHuya ? 'span.msg' :
            isBilibiliLive ? 'span.danmaku-content' : '';
            barrage = bars[index].querySelector(elePath2).textContent.replace(/\s/g, '');
        }

        // 循环弹幕
        if (!barrage && config_chat.isLoop && Array.isArray(config_chat.loopBar)) {
            let index = Math.floor(Math.random() * (config_chat.loopBar.length));
            barrage = config_chat.loopBar[index];
        }

        return barrage ? barrage : '';
    }

    function setINVL_SendBar () {
        let {invlStart = 2, invlEnd = 2} = config_chat;
        let [start, end] = [Number(invlStart), Number(invlEnd)];
        invl = Math.floor(Math.random() * (end - start)) + start;
        setINVL_ShowCD(invl);
        INVL_SendBar = setTimeout(() => {
            let barrage = getBar();
            if (barrage) {
                console.log(`弹幕: ${barrage}`);
                Chat.setMsg(barrage);
                Chat.sendMsg();
            }
            setINVL_SendBar();
        }, invl * 1000);
    }

    function setINVL_ShowCD (invl) {
        new Promise((resolve, reject) => {
            clearInterval(INVL_ShowCD);
            INVL_ShowCD = null;
            resolve(invl);
        }).then((invl)=> {
            let cd = invl + 0.3;
            INVL_ShowCD = setInterval(() => {
                cd = Math.max(Math.floor((cd - 0.1) * 10) / 10.0, 0);
                $H2P('input#h2p-input-cd').value = cd;
            }, 100);
        })
    }

    function setBar () {
        let [eleSetBar, eleSendBar] = [undefined, undefined];
        return {
            setMsg : (msg)=>{
                if (!eleSetBar) {
                    let elePath = isDouyu ? '.ChatSend-txt' :
                    isHuya ? '#pub_msg_input' :
                    isBilibiliLive ? 'textarea.chat-input.border-box' : '';
                    eleSetBar = $H2P(elePath);
                }
                if (eleSetBar && msg) { eleSetBar.value = msg; }
            },
            sendMsg : ()=>{
                if (!eleSendBar) {
                    let elePath = isDouyu ? '.ChatSend-button' :
                    isHuya ? '#msg_send_bt' :
                    isBilibiliLive ? 'div.live-skin-coloration-area > button.bl-button.live-skin-highlight-button-bg > span' : '';
                    eleSendBar = $H2P(elePath);
                }
                if (eleSendBar && eleSetBar.value) {
                    if (isHuya) {
                        eleSendBar.classList.add('enable');
                    } else if (isBilibiliLive) {
                        $H2P('div.live-skin-coloration-area > button.bl-button.live-skin-highlight-button-bg').disabled = false;
                    }
                    eleSendBar.click();
                }
            }
        }
    }








    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                            快捷键设置
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

/*     document.addEventListener('keydown', (e) => {
        // ESC 按键
        if (e.which === 27) {
            if (config_tool.wideMode) $H2P('button#h2p-btn-config-wideMode').click();
            else if (config_tool.fullMode) $H2P('button#h2p-btn-config-fullMode').click();
        }
        // shift a
        if (e.shiftKey && e.which == $util.keyCode.a) {
            if ($H2P('span#h2p-span-DYScript')) {
                if (!viewShow_script) {
                    $H2P('span#h2p-span-DYScript').click();
                    $H2P('div#h2p-div-tab-bar').click();
                } else {
                    if (viewShow_bar) { $H2P('span#h2p-span-DYScript').click(); }
                    else { $H2P('div#h2p-div-tab-bar').click(); }
                }
            }
        }
        // shift s
        else if (e.shiftKey && e.which == $util.keyCode.s) {
            if ($H2P('span#h2p-span-DYScript')) {
                if (!viewShow_script) {
                    $H2P('span#h2p-span-DYScript').click();
                    $H2P('div#h2p-div-tab-config').click();
                } else {
                    if (viewShow_config) { $H2P('span#h2p-span-DYScript').click(); }
                    else { $H2P('div#h2p-div-tab-config').click(); }
                }
            }
        }
/*         // 清空弹幕
        else if (e.shiftKey && e.which == $util.keyCode.e) {
            let elePath = isDouyu ? 'a.Barrage-toolbarClear' : 'p.clearBtn';
            $H2P(elePath).click();
        }
        // 锁定弹幕
        else if (e.shiftKey && e.which == $util.keyCode.w) {
            let elePath = isDouyu ? 'a.Barrage-toolbarLock' : 'p.lockBtn';
            $H2P(elePath).click();
        }
    }); */









    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                            自动化设置
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    // 暂停
    let auto_pausePlay = () => {
        let INVL_checkIconReady = setInterval(() => {
            let elePathIn = isDouyu ? 'div[class="pause-c594e8"]' :
            isHuya ? 'div.player-pause-btn' :
            isBilibiliAct ? 'button.blpui-btn.icon-btn[data-title="暂停"]' : '';
            let elePathOut =isDouyu ? 'div[class="play-8dbf03"]' :
            isHuya ? 'div.player-play-btn' :
            isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="播放"]' : '';
            if ($H2P(elePathOut)) {
                clearInterval(INVL_checkIconReady);
                INVL_checkIconReady = null;
                console.log('启动完毕 : 暂停');
                return;
            }
            if ($H2P(elePathIn)) {
                $H2P(elePathIn).click();
            }
        }, 500);
    }

    // 静音
    let auto_hideSound = () => {
        let INVL_checkIconReady = setInterval(() => {
            let elePathIn =  isDouyu ? 'div[class="volume-8e2726"]' :
            isHuya ? 'div.player-sound-on' :
            isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="静音"]' : '';;
            let elePathOut =isDouyu ? 'div[class="volume-silent-3eb726"]' :
            isHuya ? 'div.player-sound-off' :
            isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="取消静音"]' : '';
            if ($H2P(elePathOut)) {
                clearInterval(INVL_checkIconReady);
                INVL_checkIconReady = null;
                console.log('启动完毕 : 静音');
                return;
            }
            if ($H2P(elePathIn)) {
                $H2P(elePathIn).click();
            }
        }, 500);
    }

    // 禁止弹幕
    let auto_hideBar = () => {
        let INVL_checkIconReady = setInterval(() => {
            let elePathIn = isDouyu ? 'div[class="showdanmu-42b0ac"]' :
            isHuya ? 'div.danmu-show-btn' :
            isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="隐藏弹幕"]' : '';
            let elePathOut =isDouyu ? 'div[class="hidedanmu-5d54e2"]' :
            isHuya ? 'div.danmu-hide-btn' :
            isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="显示弹幕"]' : '';
            if ($H2P(elePathOut)) {
                clearInterval(INVL_checkIconReady);
                INVL_checkIconReady = null;
                console.log('启动完毕 : 禁止弹幕');
                return;
            }
            if ($H2P(elePathIn)) {
                $H2P(elePathIn).click();
            }
        }, 500);
    }

    // 默认画质
    let FT_showDef = true;    // first time 点击默认画质
    let auto_showDef = () => {
        let INVL_checkIconReady = setInterval(() => {
            let elePath = isDouyu ? 'div.tip-e3420a > ul > li' :
            isHuya ? 'div.player-videoline-videotype > ul > li' :
            isBilibiliLive ? 'div.bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-switch-quality-btn div.blpui-btn.text-btn.no-select.html-tip-parent div.blpui-btn.text-btn.no-select' : '';
            let elePathShow = isDouyu ? 'label.textLabel-df8d16' :
            isHuya ? 'span.player-videotype-cur' :
            isBilibiliLive ? 'div.blpui-btn.text-btn.no-select.html-tip-parent span' : '';
            let curShow = $H2P(elePath, false) && $H2P(elePath, false).length > 0 ? (config_tool.show0 ? $H2P(elePath, false).pop().textContent : $H2P(elePath, false).shift().textContent) : '';
            if ($H2P(elePathShow) && $H2P(elePathShow).textContent === curShow) {
                clearInterval(INVL_checkIconReady);
                INVL_checkIconReady = null;
                console.log(`启动完毕 : ${config_tool.show0 ? '最低' : '最高'}画质`);
                return;
            }
            if ($H2P(elePath, false) && $H2P(elePath, false).length > 0) {
                if (isHuya && FT_showDef) {
                    setTimeout(() => {
                        if (config_tool.show0) { $H2P(elePath, false).pop().click(); }
                        else if (config_tool.show9) { $H2P(elePath, false)[0].click(); }
                        FT_showDef = false;
                    }, 1000);
                } else {
                    if (config_tool.show0) { $H2P(elePath, false).pop().click(); }
                    else if (config_tool.show9) { $H2P(elePath, false)[0].click(); }
                }
            }
        }, 500);
    }

    let FT_wideMode = true;
    function wideMode () {
        console.log(`${config_tool.wideMode ? '启动' : '关闭'} : 宽屏模式`);

        let elePathIn = isDouyu ? 'div[class="wfs-2a8e83"]' :
        isHuya ? 'span#player-fullpage-btn[title="剧场模式"]' :
        isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="网页全屏"]' : '';
        let elePathOut =isDouyu ? 'div[class="wfs-exit-180268"]' :
        isHuya ? 'span#player-fullpage-btn[title="退出剧场"]' :
        isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="退出网页全屏"]' : '';
        if (config_tool.wideMode) {
            let start = new Date().getTime();
            let setINVL_waitWideCoin = setInterval(() => {
                if ($H2P(elePathOut)) {
                    clearInterval(setINVL_waitWideCoin);
                    setINVL_waitWideCoin = null;
                    console.log('启动完毕 : 宽屏模式');
                    return;
                }
                if ($H2P(elePathIn)) {
                    if (isBilibiliLive && FT_wideMode) {
                        setTimeout(() => {
                            $H2P(elePathIn).click();
                            FT_wideMode = false;
                        }, 1000);
                    } else {
                        $H2P(elePathIn).click();
                    }
                } else {
                    // 等待最长 5min
                    if ((new Date().getTime() - start) / 1000 > 300) {
                        clearInterval(setINVL_waitWideCoin);
                        setINVL_waitWideCoin = null;
                    }
                }
            }, 500);
        } else {
            if ($H2P(elePathOut)) { $H2P(elePathOut).click(); }
        }
    }

    let FT_fullMode = true;
    function fullMode () {
        console.log(`${config_tool.fullMode ? '启动' : '关闭'} : 网页全屏`);

        let elePathIn = isDouyu ? 'div[class="fs-781153"]' :
        isHuya ? 'span#player-fullscreen-btn[title="全屏"]' :
        isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="全屏模式"]' : '';
        let elePathOut =isDouyu ? 'div[class="fs-exit-b6e6a7"]' :
        isHuya ? 'span#player-fullscreen-btn[title="退出全屏"]' :
        isBilibiliLive ? 'button.blpui-btn.icon-btn[data-title="退出全屏"]' : '';

        if (config_tool.fullMode) {
            let start = new Date().getTime();
            let setINVL_waitFullCoin = setInterval(() => {
                if ($H2P(elePathOut)) {
                    clearInterval(setINVL_waitFullCoin);
                    setINVL_waitFullCoin = null;
                    console.log('启动完毕 : 网页全屏');
                    return;
                }
                if ($H2P(elePathIn)) {
                    if (isBilibiliLive && FT_fullMode) {
                        setTimeout(() => {
                            $H2P(elePathIn).click();
                            FT_fullMode = false;
                        }, 1000);
                    } else {
                        $H2P(elePathIn).click();
                    }
                } else {
                    // 等待最长 5min
                    if ((new Date().getTime() - start) / 1000 > 300) {
                        clearInterval(setINVL_waitFullCoin);
                        setINVL_waitFullCoin = null;
                    }
                }
            }, 500);
        } else {
            if ($H2P(elePathOut)) { $H2P(elePathOut).click(); }
        }
    }

    // 自动领取观看鱼丸
/*     let INVL_autoGetFB = undefined;
    let auto_getFB = () => {
        if (INVL_autoGetFB) { return; }
        let isHuntTreasure = config_tool.findTreasure === new Date().$formatDate();
        if (isDouyu) {
            return
            INVL_autoGetFB = setInterval(() => {
                if (!isHuntTreasure) {
                    console.log('开始寻宝');
                    new Promise((resolve, reject) => {
                        let eleStyle = document.createElement('style');
                        eleStyle.id = `h2p-style-fb`;
                        eleStyle.innerHTML = `.FTP { visibility: hidden; }`;
                        if (!$H2P(`style#h2p-style-fb`)) { document.body.appendChild(eleStyle); }
                        setTimeout(resolve, 500);
                    })
                        .then(() => {
                        // 打开领取鱼丸界面
                        if ($H2P('div.FishpondEntrance-icon') && !$H2P('div.FTP')) {
                            $H2P('div.FishpondEntrance-icon').click();
                            $H2P('div.FTP-handle-btnBottom', false).filter(ele => ele.textContent === '寻宝')[0].click();
                        }
                    })
                        .then(() => {
                        if ($H2P('div.FTP-userInfo > span')) {
                            let count = Number.parseInt($H2P('div.FTP-userInfo > span').textContent.split('\/')[0]);
                            let fishFood = Number.parseInt($H2P('div.FTP-userInfo > span:last-child').textContent.split('：')[1]);
                            if (!isNaN(count) && !isNaN(fishFood)) {
                                if (fishFood < 60) {
                                    isHuntTreasure = true;
                                    $notifyMgr.createNotify({
                                        msg: `鱼粮不足: ${fishFood}，本网页取消寻宝`,
                                        type: $notifyMgr.type.warn
                                    });
                                    console.log(`鱼粮不足: ${fishFood}，本网页取消寻宝`);
                                }
                                else {
                                    if (count === 3) {
                                        isHuntTreasure = true;
                                        config_tool.findTreasure = new Date().$formatDate();
                                        $util.LS.set(LSConfig, config_tool);
                                        $notifyMgr.createNotify({
                                            msg: `寻宝完毕`,
                                            type: $notifyMgr.type.success
                                        });
                                        console.log(`寻宝完毕`);
                                    } else {
                                        console.log(`寻宝第 ${count+1} 次`);
                                        $H2P('div.FTP-turntableStartBtn').click();
                                    }
                                }
                            }
                        }
                    })
                        .catch(error => { console.log(error); })
                        .finally(() => {
                        if ($H2P('span.FTP-close')) { $H2P('span.FTP-close').click(); }
                        $H2P(`style#h2p-style-fb`).remove();
                    })
                } else {
                    // 观看鱼丸元素存在并且有未领取的鱼丸
                    if ($H2P('div.FishpondEntrance-num.is-entrance') && Number($H2P('div.FishpondEntrance-num.is-entrance').textContent) > 0) {
                        for (let i = 0; i < 3; i++) {
                            setTimeout(() => {
                                new Promise((resolve, reject) => {
                                    let eleStyle = document.createElement('style');
                                    eleStyle.id = `h2p-style-fb-${i}`;
                                    eleStyle.innerHTML = `.FTP { visibility: hidden; }`;
                                    if (!$H2P(`style#h2p-style-fb-${i}`)) { document.body.appendChild(eleStyle); }
                                    setTimeout(resolve, 500);
                                })
                                    .then(() => {
                                    // 打开领取鱼丸界面
                                    if ($H2P('div.FishpondEntrance-icon') && !$H2P('div.FTP')) {
                                        $H2P('div.FishpondEntrance-icon').click();
                                    }
                                    // 每日活跃、每周活跃
                                    $H2P('span.FTP-btn', false)[i].click();
                                    $H2P('div.FTP-singleTask-btn.is-finished', false).forEach(ele => ele.click());
                                    // 鱼塘
                                    $H2P('div.FTP-bubble-progressText.is-complete', false).forEach(ele => ele.click());
                                })
                                    .catch(error => { console.log(error); } )
                                    .finally(() => {
                                    if ($H2P('span.FTP-close')) { $H2P('span.FTP-close').click(); }
                                    $H2P(`style#h2p-style-fb-${i}`).remove();
                                })
                            }, 1500 * i);
                        }
                    }
                }
            }, 5000);
        }
    }; */

    // 自动签到

    /*   let auto_signIn = () => {
    if (isHuya) { return; }
    let start = undefined;
    let INVL_checkSignInIconReady = setInterval(() => {
      let elePath = isDouyu ? 'div.RoomLevelDetail-level.RoomLevelDetail-level--no' :
                    isBilibiliLive ? 'div.checkin-btn.t-center.pointer' : '';
      if (isDouyu) {
        if ($H2P('div.Title-followBtnBox') ) {
          if (!start) {
            start = new Date().getTime() / 1000;
          } else {
            if ($H2P('div.Title-followBtnBox.is-followed')) {
              if ($H2P(elePath)) {
                clearInterval(INVL_checkSignInIconReady);
                console.log('启动完毕 : 签到 : 已关注');
                $H2P(elePath).click();
                setTimeout(() => {
                  // 关闭签到弹出的框
                  if ($H2P('div.SSR-D-close')) { $H2P('div.SSR-D-close').click(); }
                }, 200);
              }
            }
            else if (new Date().getTime() / 1000 - start > 100) {
              clearInterval(INVL_checkSignInIconReady);
              console.log('启动完毕 : 签到 : 未关注');
            }
          }
        }
      } else if (isBilibiliLive) {
        if ($H2P(elePath)) {
          clearInterval(INVL_checkSignInIconReady);
          console.log('启动完毕 : 签到');
          $H2P(elePath).click();
        }
      }
    }, 500);
  } */

    // 自动赠送荧光棒

    /*   let auto_anchorUp = () => {
    if (!isDouyu) { return; }

    function donateYGB(roomId){
      let formData = new FormData();
      formData.append("propId", "268");
      formData.append("propCount", 1);
      formData.append("roomId", roomId);
      fetch('https://www.douyu.com/japi/prop/donate/mainsite/v1', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(res => {
        if (res && 'error' in res && res.error === 0) {
          console.log('成功赠送主播 : '+ roomId + ' 一个荧光棒');
          config_info.anchorFanRooms[roomId].anchorUp += 1;
          $util.LS.set(LSInfo, config_info);
        } else {
          console.log('赠送' + roomId + '失败 : ' + res.msg);
        }
      });
    }

    let INVL_anchorUp = setInterval(() => {
      if (config_info.anchorFanUpdatedTime === new Date().$formatDate()) {
        let roomIds = Object.keys(config_info.anchorFanRooms);
        for (let i = 0; i < roomIds.length; i++) {
          let roomId = roomIds[i];
          if (config_info.anchorFanRooms[roomId].anchorUp === 0) { setTimeout(() => { donateYGB(roomId); }, (i+1) * 2000); }
        }
        clearInterval(INVL_anchorUp);
        console.log('启动完毕 : 赠送荧光棒');
      } else {
        console.log('今日已赠送荧光棒');
        clearInterval(INVL_anchorUp);
      }
    }, 1000);
  } */


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //
    //                                                        脚本自动化配置界面
    //
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    const LSConfig = 'h2p-DY-config-tool';
    let config_tool = $util.LS.init(LSConfig, {
        pausePlay  : false,
        hideSound  : false,
        hideBar    : false,
        show0    : false,
        show9    : false,
        wideMode  : false,
        fullMode  : false,
        getFB    : false,
        findTreasure: '',
        signIn    : false,
        anchorUp    : false,
    });

    if (config_tool.pausePlay) {
        console.log('启动 : 暂停播放');
        auto_pausePlay();
    }
    if (config_tool.hideSound) {
        console.log('启动 : 自动静音');
        auto_hideSound();
    }
    if (config_tool.hideBar) {
        console.log('启动 : 自动禁止弹幕');
        auto_hideBar();
    }
    if (config_tool.show0) {
        console.log('启动 : 最低画质');
        auto_showDef();
    }
    if (config_tool.show9) {
        console.log('启动 : 最高画质');
        auto_showDef();
    }
    if (config_tool.wideMode) { wideMode(); }
    if (config_tool.fullMode) { fullMode(); }

    /*  Power by MR114
if (config_tool.getFB) {
    console.log('启动 : 自动领取观看鱼丸');
    auto_getFB();
  }
  if (config_tool.signIn) {
    console.log('启动 : 自动签到');
    auto_signIn();
  }
  if (config_tool.anchorUp) {
    console.log('启动 : 自动赠送荧光棒');
    auto_anchorUp();
  }
  Power by MR114
  */


    new Promise((resolve, reject) => {
        // 创建元素样式  ===============================================================
        let eleStyle = document.createElement('style');
        eleStyle.type = 'text/css';
        eleStyle.innerHTML += `
      #h2p-div-config button { height: 25px; }
      .h2p-btn {
        width      : 100%;
        height      : 100%;
        padding      : 4px 0;
        border      : none;
        border-radius  : 5px;
        margin      : 0;
        font-size    : 13px;
        cursor      : pointer;
      }
      .h2p-top-0    { top: 0!important; }
      .h2p-top-50    { top: 50px!important; }
      .h2p-w-50p    { width: 50%!important; }
      .h2p-w-96p    { width: 96%!important; }
      .h2p-h-100p   { height: 100%!important; }
    `;
        document.head.appendChild(eleStyle);

        // 初始化配置界面  ===============================================================
        let div = document.createElement('div');
        div.id = 'h2p-div-config';
        div.className = 'h2p-div-inlinepanel';
        div.style = 'display: none;';
        div.innerHTML = `
      <div class="h2p-flex-main-start h2p-item-100p">
        <div class="h2p-flex-main-start h2p-item-50p">
          <button class="h2p-btn h2p-w-96p h2p-bg-close" style="color: black;" disabled>关闭状态</button>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <button class="h2p-btn h2p-w-96p h2p-bg-open" style="color: black;" disabled>开启状态</button>
        </div>
      </div>

      <hr style="margin: 6px -9px 12px; border: 1px solid #DCDCDC;">

      <!-- 暂停播放、静音、关闭弹幕 -->
      <div class="h2p-flex-main-start h2p-item-100p">
        <div class="h2p-flex-main-start h2p-item-50p">
          <div class="h2p-flex-main-start h2p-item-50p">
            <button id="h2p-btn-config-pausePlay" class="h2p-btn h2p-w-96p h2p-bg-close">暂停播放</button>
          </div>
          <div class="h2p-flex-main-start h2p-item-50p">
            <button id="h2p-btn-config-hideSound" class="h2p-btn h2p-w-96p h2p-bg-close">静音</button>
          </div>
        </div>
        <div class="h2p-flex-main-end h2p-item-50p">
          <div class="h2p-flex-main-end h2p-item-50p">
            <button id="h2p-btn-config-hideBar" class="h2p-btn h2p-w-96p h2p-bg-close">关闭弹幕</button>
          </div>
          <div class="h2p-flex-main-end h2p-item-50p">
          </div>
        </div>
      </div>

      <div class="h2p-flex-main-start h2p-item-100p">
        <!-- 画质选项 -->
        <div class="h2p-flex-main-start h2p-item-50p">
          <div class="h2p-flex-main-start h2p-item-50p">
            <button id="h2p-btn-config-show0" class="h2p-btn h2p-w-96p h2p-bg-close">最低画质</button>
          </div>
          <div class="h2p-flex-main-start h2p-item-50p">
            <button id="h2p-btn-config-show9" class="h2p-btn h2p-w-96p h2p-bg-close">最高画质</button>
          </div>
        </div>
        <!-- 播放器大小 -->
        <div class="h2p-flex-main-end h2p-item-50p">
          <div class="h2p-flex-main-end h2p-item-50p">
            <button id="h2p-btn-config-wideMode" class="h2p-btn h2p-w-96p h2p-bg-close">宽屏模式</button>
          </div>
          <div class="h2p-flex-main-end h2p-item-50p">
            <button id="h2p-btn-config-fullMode" class="h2p-btn h2p-w-96p h2p-bg-close">网页全屏</button>
          </div>
        </div>
      </div>

      <div class="h2p-flex-main-start h2p-item-100p">
        <div class="h2p-flex-main-start h2p-item-50p">
        </div>

        <div class="h2p-flex-main-end h2p-item-50p" style="display: ${isBilibili ? 'none' : ''}">
          <div class="h2p-flex-main-end h2p-item-50p" style="display: ${isDouyu ? '' : 'none'}">
          </div>
          <div class="h2p-flex-main-end h2p-item-50p">
          </div>
        </div>
      </div>
    `;

        let setINVL_wait_div_DYScript = setInterval(() => {
            if ($H2P('div#div-DYScript')) {
                clearInterval(setINVL_wait_div_DYScript);
                $H2P('div#div-DYScript').appendChild(div);
                setTimeout(resolve, 250);
            }
        }, 500);
    })
        .then(() => {
        let eleConfig = $H2P('div#h2p-div-config');
        eleConfig.addEventListener('click', (event) => {
            let target = event.target;
            if (target.tagName.toLowerCase() !== 'button') { return; }
            target.classList.toggle('h2p-bg-open');
            if (target.id === 'h2p-btn-config-wideMode') {
                config_tool.wideMode = !config_tool.wideMode;
                if (config_tool.fullMode) {
                    config_tool.fullMode = false;
                    $H2P('button#h2p-btn-config-fullMode').classList.remove('h2p-bg-open');
                }
                wideMode();
            } else if (target.id === 'h2p-btn-config-fullMode') {
                config_tool.fullMode = !config_tool.fullMode;
                if (config_tool.wideMode) {
                    config_tool.wideMode = false;
                    $H2P('button#h2p-btn-config-wideMode').classList.remove('h2p-bg-open');
                }
                fullMode();
            } else if (target.id === 'h2p-btn-config-show0') {
                config_tool.show0 = !config_tool.show0;
                config_tool.show9 = false;
                $H2P('button#h2p-btn-config-show9').classList.remove('h2p-bg-open');
                auto_showDef();
            } else if (target.id === 'h2p-btn-config-show9') {
                config_tool.show0 = false;
                $H2P('button#h2p-btn-config-show0').classList.remove('h2p-bg-open');
                config_tool.show9 = !config_tool.show9;
                auto_showDef();
            }
            else if (target.id === 'h2p-btn-config-hideBar') {
                config_tool.hideBar = !config_tool.hideBar;
                auto_hideBar();
            }
            else if (target.id === 'h2p-btn-config-hideSound') {
                config_tool.hideSound = !config_tool.hideSound;
                auto_hideSound();
            }
            else if (target.id === 'h2p-btn-config-getFB') {
                config_tool.getFB = !config_tool.getFB;
                auto_getFB();
            }
            else if (target.id === 'h2p-btn-config-signIn') {
                config_tool.signIn = !config_tool.signIn;
                auto_signIn();
            }
            else if (target.id === 'h2p-btn-config-anchorUp') {
                config_tool.anchorUp = !config_tool.anchorUp;
                auto_anchorUp();
            }
            else if (target.id === 'h2p-btn-config-pausePlay') {
                config_tool.pausePlay = !config_tool.pausePlay;
                auto_pausePlay();
            }
            $util.LS.set(LSConfig, config_tool);
        }, false);
    })
        .then(() => {
        if (config_tool.wideMode) { $H2P('button#h2p-btn-config-wideMode').classList.add('h2p-bg-open'); }
        if (config_tool.fullMode) { $H2P('button#h2p-btn-config-fullMode').classList.add('h2p-bg-open'); }
        if (config_tool.delEle) { $H2P('button#h2p-btn-config-delEle').classList.add('h2p-bg-open'); }
        if (config_tool.show0) { $H2P('button#h2p-btn-config-show0').classList.add('h2p-bg-open'); }
        if (config_tool.show9) { $H2P('button#h2p-btn-config-show9').classList.add('h2p-bg-open'); }
        if (config_tool.hideBar) { $H2P('button#h2p-btn-config-hideBar').classList.add('h2p-bg-open'); }
        if (config_tool.hideSound) { $H2P('button#h2p-btn-config-hideSound').classList.add('h2p-bg-open'); }
        if (config_tool.getFB) { $H2P('button#h2p-btn-config-getFB').classList.add('h2p-bg-open'); }
        if (config_tool.signIn) { $H2P('button#h2p-btn-config-signIn').classList.add('h2p-bg-open'); }
        if (config_tool.anchorUp) { $H2P('button#h2p-btn-config-anchorUp').classList.add('h2p-bg-open'); }
        if (config_tool.pausePlay) { $H2P('button#h2p-btn-config-pausePlay').classList.add('h2p-bg-open'); }
    })
        .catch(error => { console.log(error); })
})($util, $notifyMgr);